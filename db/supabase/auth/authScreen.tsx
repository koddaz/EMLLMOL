import { customStyles } from "@/app/constants/UI/styles";
import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { supabase } from "../supabase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Session } from "@supabase/supabase-js";
import { AppData } from "@/app/constants/interface/appData";



export default function AuthScreen() {

    const theme = useTheme();
    const styles = customStyles(theme);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

    const { signIn, signUp, error } = useAuth();

    const renderSignIn = () => {
        return (

            <SignInScreen
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
            />

        );
    }

    const renderSignUp = () => {
        return (

            <SignUpScreen
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
            />

        );
    }

    return (
        <View style={styles.background}>
            {error && (
                <View style={styles.container}>
                    <Text style={{ color: theme.colors.error, textAlign: 'center' }}>
                        {error}
                    </Text>
                </View>
            )}

            {showConfirmationMessage ? (
                <View style={styles.container}>
                    <Text style={styles.message}>
                        Please check your email and click the confirmation link to activate your account.
                    </Text>
                    <Button
                        mode="outlined"
                        onPress={() => setShowConfirmationMessage(false)}
                        style={{ marginTop: 16 }}
                    >
                        Back to Sign In
                    </Button>
                </View>
            ) : (
                <>
                    {isSignIn ? renderSignIn() : renderSignUp()}

                    <View style={styles.container}>
                        <Text onPress={() => setIsSignIn(!isSignIn)} style={styles.message}>
                            {isSignIn ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                        </Text>
                    </View>
                    <View style={styles.container}>
                        <Button
                            mode="contained"
                            onPress={async () => {
                                setIsLoading(true);
                                if (isSignIn) {
                                    await signIn(email, password);
                                } else {
                                    await signUp(email, password);
                                    setShowConfirmationMessage(true);
                                }
                                setIsLoading(false);
                            }}
                            loading={isLoading}
                        >
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </View>
                </>
            )}
        </View>
    )


}

export function SignUpScreen(
    { email, password, setEmail, setPassword }: { password: string, email: string, setEmail: (value: string) => void, setPassword: (value: string) => void }
) {

    const theme = useTheme();
    const styles = customStyles(theme);

    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                mode="outlined"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
                mode="outlined"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
            />
            <Text style={styles.message}>
                Please enter your email and password to sign up.
            </Text>
        </View>
    );
}

export function SignInScreen(
    { email, password, setEmail, setPassword }: { password: string, email: string, setEmail: (value: string) => void, setPassword: (value: string) => void }
) {

    const theme = useTheme();
    const styles = customStyles(theme);

    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.textInput}
                mode="outlined"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.textInput}
                mode="outlined"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
            />
            <Text style={styles.message}>
                Please enter your email and password to sign in.
            </Text>


        </View>
    );
}

export function useAuth(session?: Session | null) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
        setError(null); // Reset error after sign in attempt
    };

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'com.koddaz.emllmol://auth/callback', // Use a specific path
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
            if (!session?.user.id) throw new Error('No user on the session!')

            const updates = {
                id: session?.user.id,
                username,
                full_name,
                avatar_url,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)
            if (error) {
                setError(error.message);
                console.error('Error updating profile:', error.message);
                throw error
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        }
        finally {
            setIsLoading(false);
        }
    }

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
                .single()
            if (error && status !== 406) {
                throw error
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
    }






    return {
        signIn,
        signUp,
        signOut,
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