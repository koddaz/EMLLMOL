import { Session } from "@supabase/supabase-js";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { supabase } from "../api/supabase/supabase";

// Global flag to ensure deep link listeners are only set up once
let deepLinkListenersSetup = false;

export function useAuth(session?: Session | null, enableDeepLinkHandling: boolean = false, onAuthStateChange?: (event: string, session: Session | null) => void) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Use custom scheme for both development and production
    const redirectTo = 'com.koddaz.emllmol://auth/callback';

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
        if (!onAuthStateChange) return;

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
            onAuthStateChange(event, session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            console.log('Signing up with redirect URL:', redirectTo);

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

    const removeProfile = async () => {
        try {
            setIsLoading(true);
            if (!session?.user.id) throw new Error('No user on the session!');

            // Delete user entries first - Fixed: use 'user_id' to match database
            const { error: entriesError } = await supabase
                .from('entries')
                .delete()
                .eq('user_id', session.user.id);  // Fixed: Using 'user_id' to match database

            if (entriesError) {
                console.error('Error removing entries:', entriesError.message);
                setError('Failed to remove user entries: ' + entriesError.message);
                throw entriesError;
            }

            const { error: profileError } = await supabase.from('profiles').delete().eq('id', session.user.id);
            if (profileError) {
                setError(profileError.message);
                console.error('Error removing profile:', profileError.message);
                throw profileError;
            }

            console.log('Profile and all associated entries removed successfully');

        } catch (error) {
            console.error('Error removing profile:', error);
            setError('Failed to remove profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        signUp,
        signOut,
        removeProfile,
        error,
        username,
        fullName,
        avatarUrl,
        isLoading,
        setUsername,
        setFullName,
        setAvatarUrl,
        setError,
        getProfile,
        updateProfile
    };
}