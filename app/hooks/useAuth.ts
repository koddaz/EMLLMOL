import { Session } from "@supabase/supabase-js";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { useEffect, useState, useCallback } from "react";
import { Linking, AppState } from "react-native";
import { supabase } from "../api/supabase/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from "../constants/interface/appData";

// Global flag to ensure deep link listeners are only set up once
let deepLinkListenersSetup = false;

// Setup Supabase auto-refresh based on app state
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export function useAuth(
    session?: Session | null,
    enableDeepLinkHandling: boolean = false,
    setAppData?: (data: AppData) => void
) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    // User information
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [email, setEmail] = useState("")



    // Update password:
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    // Confirmation
    const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);

    // Use custom scheme for both development and production
    const redirectTo = 'com.koddaz.emllmol://auth/callback';

    // Load settings from AsyncStorage
    const loadSettings = async () => {
        const [savedWeight, savedGlucose, savedClockFormat, savedDateFormat, savedThemeMode] = await Promise.all([
            AsyncStorage.getItem('weight'),
            AsyncStorage.getItem('glucose'),
            AsyncStorage.getItem('clockformat'),
            AsyncStorage.getItem('dateformat'),
            AsyncStorage.getItem('themeMode')
        ]);

        return {
            weight: savedWeight || 'kg',
            glucose: savedGlucose || 'mmol',
            clockFormat: savedClockFormat || '24h',
            dateFormat: savedDateFormat || 'en',
            themeMode: (savedThemeMode as 'light' | 'dark') || 'light'
        };
    };

    // Main initialization function
    const initializeApp = useCallback(async (): Promise<AppData | null> => {
        console.log('🚀 Initializing app...');
        setIsLoading(true);
        setError(null);

        try {
            // Get session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('Session error:', sessionError);
                setError(sessionError.message);
                return null;
            }

            // Load settings (always needed)
            const settings = await loadSettings();
            console.log('✅ Settings loaded:', settings);

            // Return initial app data
            const initialData: AppData = {
                session: session || null,
                profile: null,
                settings,
                diaryEntries: [],
                isEntriesLoaded: false
            };

            console.log('✅ App initialized successfully');
            return initialData;

        } catch (error) {
            console.error('❌ Initialization error:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle auth state changes
    const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
        if (event === 'SIGNED_OUT') {
            // Clear user data but keep settings
            const settings = await loadSettings();
            if (setAppData) {
                setAppData({
                    session: null,
                    profile: null,
                    settings,
                    diaryEntries: [],
                    isEntriesLoaded: false
                });
            }
        } else if (event === 'SIGNED_IN' && session?.user?.id) {
            // Update session directly without calling initializeApp to avoid loops
            const settings = await loadSettings();
            if (setAppData) {
                console.log('✅ User signed in:', session.user.email);
                setAppData({
                    session: session,
                    profile: null,
                    settings,
                    diaryEntries: [],
                    isEntriesLoaded: false
                });
            }
        }
    }, [setAppData]);

    // Handle deep link authentication - only set up when explicitly enabled
    useEffect(() => {
        if (!enableDeepLinkHandling || deepLinkListenersSetup) {
            return;
        }

        deepLinkListenersSetup = true;
        let isProcessing = false;

        const handleDeepLink = async (url: string) => {
            // Prevent multiple simultaneous processing
            if (isProcessing) {
                console.log('Already processing a deep link, skipping...');
                return;
            }

            console.log('Deep link received:', url);

            // Check for auth callback in various formats
            if (url.includes('auth/callback') || url.includes('#access_token') || url.includes('?access_token')) {
                console.log('Auth callback detected');
                isProcessing = true;

                try {
                    const session = await createSessionFromUrl(url);
                    if (session) {
                        console.log('Session created from deep link:', session.user?.email);
                    } else {
                        console.log('No session created');
                    }
                } catch (error) {
                    console.error('Error creating session from URL:', error);
                    // Don't set error state here since it might not be the right hook instance
                } finally {
                    isProcessing = false;
                }
            } else {
                console.log('URL does not contain auth callback');
            }
        };

        console.log('Setting up deep link listeners');

        // Listen for URL changes using Expo Linking
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('URL event received:', url);
            handleDeepLink(url);
        });

        // Handle initial URL only once when component mounts
        let initialURLProcessed = false;
        Linking.getInitialURL().then((url) => {
            if (url && !initialURLProcessed) {
                console.log('Initial URL found:', url);
                initialURLProcessed = true;
                handleDeepLink(url);
            } else if (!url) {
                console.log('No initial URL');
            }
        });

        return () => {
            console.log('Cleaning up deep link listeners');
            subscription?.remove();
            isProcessing = false;
            deepLinkListenersSetup = false;
        };
    }, []);

    // Auth state change listener - only set up once
    useEffect(() => {
        if (!enableDeepLinkHandling) return; // Only setup in index.tsx

        let lastEvent = '';
        let lastSessionId = '';

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentSessionId = session?.user?.id || 'no-session';

            // Prevent duplicate events for the same session
            if (event === lastEvent && currentSessionId === lastSessionId) {
                return;
            }

            lastEvent = event;
            lastSessionId = currentSessionId;

            console.log('🔄 Auth state changed:', event);
            await handleAuthStateChange(event, session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [enableDeepLinkHandling, handleAuthStateChange]);

    const createSessionFromUrl = async (url: string) => {
        try {
            // Handle different URL formats
            let params;

            if (url.includes('#')) {
                // Handle fragment-based URLs (common with Supabase)
                const fragment = url.split('#')[1];
                params = QueryParams.getQueryParams(`?${fragment}`).params;
            } else {
                // Handle query parameter URLs
                params = QueryParams.getQueryParams(url).params;
            }

            const { access_token, refresh_token, error: urlError, error_description } = params;

            if (urlError) {
                throw new Error(error_description || urlError);
            }

            if (!access_token) {
                console.log('No access token found in URL');
                return;
            }

            const { data, error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (error) throw error;
            return data.session;
        } catch (error) {
            console.error('Error in createSessionFromUrl:', error);
            throw error;
        }
    };

    const checkInputError = (password: string): boolean => {
        if (password.length < 6) {
            setError("Password needs to be longer than 6 characters.");
            return false;
        } 
        
        if (!/[^a-zA-Z0-9 ]/.test(password)) {
            setError("Password must include at least one special character.");
            return false;
        }
        
        setError("");
        return true;
    }

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            // Validate password first
            if (!checkInputError(password)) {
                return; // Stop here if validation fails
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: redirectTo,
                }
            });

            if (error) {
                console.error('Error signing up:', error.message);
                setError(error.message);
            } else {
                console.log('Sign up successful:', data);
            }
        } catch (error) {
            console.error('Unexpected error during sign up:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);
            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                console.error('Error signing in:', error.message);
                setError(error.message);
            } else {
                console.log('Sign in successful');
            }
        } catch (error) {
            console.error('Unexpected error during sign in:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error.message);
                setError(error.message);
            } else {
                console.log('Sign out successful');
            }
        } catch (error) {
            console.error('Unexpected error during sign out:', error);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (
        username: string,
        full_name: string,
        avatar_url: string) => {

        try {
            setIsLoading(true);
            if (!session?.user.id) throw new Error('No user on the session!');

            const updates = {
                id: session?.user.id,
                username,
                full_name,
                avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) {
                setError(error.message);
                console.error('Error updating profile:', error.message);
                throw error;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const getProfile = async () => {
        try {
            setIsLoading(true);
            if (!session?.user.id) {
                throw new Error('User ID is required to fetch profile');
            }
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, full_name, avatar_url`)
                .eq('id', session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                setUsername(data.username);
                setFullName(data.full_name);
                setAvatarUrl(data.avatar_url);

                // Update appData with profile information
                if (setAppData) {
                    setAppData((prev: AppData | null) => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            profile: {
                                username: data.username || '',
                                fullName: data.full_name || '',
                                avatarUrl: data.avatar_url || ''
                            }
                        };
                    });
                }
            } else {
                console.warn('No profile data found for user:', session?.user.id);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to fetch profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async () => {
        try {
            setIsLoading(true);
            if (!session?.user.id) throw new Error('No user on the session!');

            console.log('Starting account deletion process...');

            // Step 1: Delete user entries
            const { error: entriesError } = await supabase
                .from('entries')
                .delete()
                .eq('user_id', session.user.id);

            if (entriesError) {
                console.error('Error removing entries:', entriesError.message);
                setError('Failed to remove user entries: ' + entriesError.message);
                throw entriesError;
            }
            console.log('✅ Entries deleted');

            // Step 2: Delete profile
            const { error: profileError } = await supabase
                .from('profiles')
                .delete()
                .eq('id', session.user.id);

            if (profileError) {
                console.error('Error removing profile:', profileError.message);
                setError('Failed to remove profile: ' + profileError.message);
                throw profileError;
            }
            console.log('✅ Profile deleted');

            // Step 3: Delete auth user account
            const { error: deleteUserError } = await supabase.rpc('delete_user');

            if (deleteUserError) {
                console.error('Error deleting user account:', deleteUserError.message);
                setError('Failed to delete user account: ' + deleteUserError.message);
                throw deleteUserError;
            }
            console.log('✅ User account deleted');

            // Step 4: Sign out (this will trigger auth state change and clear local data)
            await signOut();

            console.log('✅ Account deletion completed successfully');
            return true;

        } catch (error) {
            console.error('Error deleting account:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete account. Please try again later.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRecovery = async (email: string) => {
        try {
            setError(null)
            setIsLoading(true)

            if (!email || !email.includes('@')) {
                setError('Please enter a valid email address');
                return;
            }


            let { data, error } = await supabase.auth.resetPasswordForEmail(email)

            if (error) {
                console.error('Error resetting password:', error.message);
                setError(error.message);
                return false;
            }

            console.log("Sent recovery link to: ", email + data)
        } catch (error) {
            console.error('Unexpected error during password change:', error);
            setError('An unexpected error occurred. Please try again later.');
            return false;
        } finally {
            setIsLoading(false)
        }
    }

    const changePassword = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!session?.user?.email) {
                setError('No user email found');
                return { success: false };
            }

            if (newPass !== confirmPass) {
                setError('Passwords do not match');
                return { success: false };
            }

            // Validate new password
            if (!checkInputError(newPass)) {
                return { success: false }; // Stop here if validation fails
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: session.user.email,
                password: oldPass
            });

            if (signInError) {
                setError("Current password is incorrect");
                return { success: false };
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPass
            });

            if (updateError) { 
                setError(`Password update failed: ${updateError.message}`);
                return { success: false };
            }
            
            setSuccess("Password updated successfully");
            setShowSuccess(true);
            return { success: true };
        } catch (error) {
            console.error("Password change error: ", error);
            setError('An unexpected error occurred. Please try again later.');
            return { success: false, error };
        } finally {
            setIsLoading(false);
            setOldPass("");
            setNewPass("");
            setConfirmPass("");
        }
    }

    const changeEmail = async (newEmail: string) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!newEmail || !newEmail.includes('@')) {
                setError('Please enter a valid email address');
                return { success: false };
            }

            console.log('Changing email to:', newEmail);

            const { data, error } = await supabase.auth.updateUser({
                email: newEmail
            });

            if (error) {
                console.error('Error changing email:', error.message);
                setError(error.message);
                return { success: false };
            }

            console.log('Email change initiated successfully. Check both old and new email for confirmation.');
            setSuccess("Email updated successfully");
            setShowSuccess(true);
            return { success: true };

        } catch (error) {
            console.error('Unexpected error during email change:', error);
            setError('An unexpected error occurred. Please try again later.');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const checkConfirmationEmail = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const isConfirmed = !!session.user.email_confirmed_at;
                setEmailConfirmed(isConfirmed);
                return isConfirmed;
            }
            return false;
        } catch (error) {
            console.error('Error checking email confirmation:', error);
            return false;
        }
    };

    return {
        error,
        isLoading,
        setError,
        success,
        setSuccess,
        showSuccess,
        setShowSuccess,

        // Start up
        loadSettings,
        initializeApp,

        // Edit values
        changePassword,
        changeEmail,
        email,
        setEmail,

        setConfirmPass,
        confirmPass,
        setOldPass,
        oldPass,
        setNewPass,
        newPass,

        // Profile -> Values
        setUsername,
        setFullName,
        setAvatarUrl,
        username,
        fullName,
        avatarUrl,
        // Profile -> Functions
        signIn,
        signUp,
        signOut,
        deleteAccount,
        getProfile,
        updateProfile,

        // Confirmation -> Email
        emailConfirmed,
        setEmailConfirmed,
        checkConfirmationEmail
    };
}