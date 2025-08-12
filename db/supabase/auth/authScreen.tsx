import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Linking, ScrollView, View } from "react-native";
import { Button, Card, Surface, Text, TextInput, useTheme } from "react-native-paper";
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

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <MaterialCommunityIcons 
                    name="account-heart" 
                    size={28} 
                    color={theme.colors.primary} 
                />
                <Text variant="headlineMedium" style={{ 
                    color: theme.colors.onSurface, 
                    marginLeft: 12,
                    fontWeight: '600'
                }}>
                    Welcome
                </Text>
            </View>
        </View>
    );

    const renderWelcomeCard = () => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons 
                        name="diabetes" 
                        size={24} 
                        color={theme.colors.primary} 
                    />
                    <Text variant="titleLarge" style={styles.cardTitle}>
                        Diabetes Tracker
                    </Text>
                </View>
                <Text variant="bodyMedium" style={{ 
                    color: theme.colors.onSurfaceVariant,
                    lineHeight: 20
                }}>
                    Track your glucose levels, meals, and health data securely. 
                    Sign in to continue managing your diabetes journey.
                </Text>
            </Card.Content>
        </Card>
    );

    const renderSignIn = () => (
        <SignInScreen
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
        />
    );

    const renderSignUp = () => (
        <SignUpScreen
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
        />
    );

    return (
        <View style={styles.background}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {renderHeader()}
                    {renderWelcomeCard()}

                    {error && (
                        <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}>
                            <View style={[styles.cardHeader, { marginBottom: 0 }]}>
                                <MaterialCommunityIcons 
                                    name="alert-circle" 
                                    size={20} 
                                    color={theme.colors.error} 
                                />
                                <Text style={{ 
                                    color: theme.colors.error, 
                                    marginLeft: 8,
                                    flex: 1 
                                }}>
                                    {error}
                                </Text>
                            </View>
                        </Surface>
                    )}

                    {showConfirmationMessage ? (
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <MaterialCommunityIcons 
                                        name="email-check" 
                                        size={24} 
                                        color={theme.colors.primary} 
                                    />
                                    <Text variant="titleMedium" style={styles.cardTitle}>
                                        Check Your Email
                                    </Text>
                                </View>
                                <Text variant="bodyMedium" style={{ 
                                    color: theme.colors.onSurfaceVariant,
                                    marginBottom: 16,
                                    lineHeight: 20
                                }}>
                                    Please check your email and click the confirmation link to activate your account.
                                </Text>
                                <Button
                                    mode="outlined"
                                    onPress={() => setShowConfirmationMessage(false)}
                                    icon="arrow-left"
                                >
                                    Back to Sign In
                                </Button>
                            </Card.Content>
                        </Card>
                    ) : (
                        <>
                            {isSignIn ? renderSignIn() : renderSignUp()}

                            <View style={styles.actionContainer}>
                                <Button
                                    mode="text"
                                    onPress={() => setIsSignIn(!isSignIn)}
                                    style={styles.cancelButton}
                                    labelStyle={{ color: theme.colors.onSurfaceVariant }}
                                >
                                    {isSignIn ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                                </Button>
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
                                    style={styles.saveButton}
                                    icon={isSignIn ? "login" : "account-plus"}
                                    disabled={!email || !password}
                                >
                                    {isSignIn ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export function SignUpScreen({
    email,
    password,
    setEmail,
    setPassword
}: {
    password: string;
    email: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
}) {
    const theme = useTheme();
    const styles = customStyles(theme);

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons 
                        name="account-plus" 
                        size={24} 
                        color={theme.colors.primary} 
                    />
                    <Text variant="titleMedium" style={styles.cardTitle}>
                        Create Account
                    </Text>
                </View>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { marginBottom: 12 }]}
                    mode="outlined"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    left={<TextInput.Icon icon="email" />}
                    dense
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    left={<TextInput.Icon icon="lock" />}
                    dense
                />

                <Text variant="bodySmall" style={{ 
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 8,
                    lineHeight: 16
                }}>
                    Enter your email and create a secure password. You'll receive a confirmation email to activate your account.
                </Text>
            </Card.Content>
        </Card>
    );
}

export function SignInScreen({
    email,
    password,
    setEmail,
    setPassword
}: {
    password: string;
    email: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
}) {
    const theme = useTheme();
    const styles = customStyles(theme);

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons 
                        name="login" 
                        size={24} 
                        color={theme.colors.primary} 
                    />
                    <Text variant="titleMedium" style={styles.cardTitle}>
                        Sign In
                    </Text>
                </View>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={[styles.input, { marginBottom: 12 }]}
                    mode="outlined"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    left={<TextInput.Icon icon="email" />}
                    dense
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    mode="outlined"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    left={<TextInput.Icon icon="lock" />}
                    dense
                />

                <Text variant="bodySmall" style={{ 
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 8,
                    lineHeight: 16
                }}>
                    Welcome back! Enter your credentials to access your diabetes tracking dashboard.
                </Text>
            </Card.Content>
        </Card>
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

    const removeProfile = async () => {
        try {
            setIsLoading(true);
            if (!session?.user.id) throw new Error('No user on the session!')

            const { error } = await supabase.from('profiles').delete().eq('id', session.user.id)
            if (error) {
                setError(error.message);
                console.error('Error removing profile:', error.message);
                throw error
            }
            console.log('Profile removed successfully');
        } catch (error) {
            console.error('Error removing profile:', error);
            setError('Failed to remove profile. Please try again later.');
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