import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform } from "react-native";
import { Button, Icon, IconButton, Surface, Text, TextInput, useTheme, Card } from "react-native-paper";
import { supabase } from "../supabase";
import { useAuth } from "@/app/hooks/useAuth";
import { TermsScreen } from "@/app/screens/TermsScreen";
import { InformationScreen } from "@/app/screens/InformationScreen";
import { useAppTheme } from "@/app/constants/UI/theme";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomTextInput } from "@/app/components/textInput";

export default function AuthScreen() {
    const theme = useTheme();
    const styles = customStyles(theme);
    const insets = useSafeAreaInsets();

    const [isSignIn, setIsSignIn] = useState(true);
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

    const [showTerms, setShowTerms] = useState(false);
    const [showInformation, setShowInformation] = useState(false);

    // Single useAuth instance for the entire auth screen
    const authHook = useAuth(null, false); // Deep link handling is done in index.tsx
    const { error, emailConfirmed } = authHook;

    // Show modal screens
    if (showTerms) {
        return <TermsScreen onClose={() => setShowTerms(false)} />;
    }

    if (showInformation) {
        return <InformationScreen onClose={() => setShowInformation(false)} />;
    }

    if (showConfirmationMessage) {
        return (
            <ConfirmScreen setShowConfirmationMessage={setShowConfirmationMessage} authHook={authHook} />
        )
    }

    return (
        <View style={{ flex: 1, marginTop: insets.top, backgroundColor: theme.colors.background }}>
            {/* Modern Header */}
            <Surface style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 }} elevation={0}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineLarge" style={{
                            color: theme.colors.onBackground,
                            fontWeight: '700',
                            marginBottom: 4,
                        }}>
                            emmi-Sense
                        </Text>
                        <Text variant="bodyLarge" style={{
                            color: theme.colors.onSurfaceVariant,
                        }}>
                            Your Personal Diabetes Diary
                        </Text>
                    </View>
                    <Surface style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: theme.colors.primaryContainer,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 2
                    }}>
                        <Icon source="heart-pulse" size={32} color={theme.colors.primary} />
                    </Surface>
                </View>
            </Surface>

            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                {isSignIn ? (
                    <SignInScreen setIsSignIn={setIsSignIn} authHook={authHook} />
                ) : (
                    <SignUpScreen setIsSignIn={setIsSignIn} setShowConfirmationMessage={setShowConfirmationMessage} authHook={authHook} />
                )}
            </View>

            {/* Error Message */}
            {error && (
                <View style={{
                    margin: 16,
                    backgroundColor: theme.colors.errorContainer,
                    padding: 16,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <Icon source="alert-circle" size={24} color={theme.colors.error} />
                    <Text style={{ color: theme.colors.error, flex: 1 }}>
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
}

export function SignUpScreen(
    { setIsSignIn, setShowConfirmationMessage, authHook }: { setIsSignIn: any, setShowConfirmationMessage: any, authHook: any }
) {
    const { styles, theme } = useAppTheme()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Create refs for navigation
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const confirmPasswordRef = useRef<any>(null);

    const { signUp, error, setError, isLoading } = authHook

    const handleSignUp = () => {
        if (password != confirmPassword) {
            setError("Passwords do not match.")
        } else {
            try {
                signUp(email, password)
                setShowConfirmationMessage(true)
            } catch (error: any) {
                setError(`Error ${error} occurred.`)
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 150}
            enabled={true}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 16, paddingBottom: 32, paddingTop: 8 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Welcome Section */}
                <View style={{ marginBottom: 8 }}>
                    <Text variant='headlineMedium' style={{ fontWeight: '700', color: theme.colors.onBackground, marginBottom: 4 }}>
                        Create Account
                    </Text>
                    <Text variant='bodyLarge' style={{ color: theme.colors.onSurfaceVariant }}>
                        Track your blood glucose, carbs, and insulin all in one place
                    </Text>
                </View>

                {/* Form Card */}
                <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                    <Card.Content style={{ gap: 16, paddingVertical: 20 }}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email" />}
                            returnKeyType="next"
                            ref={emailRef}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        <TextInput
                            value={password}
                            mode="outlined"
                            onChangeText={setPassword}
                            label="Password"
                            placeholder="At least 6 characters"
                            secureTextEntry={!showPassword}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                            returnKeyType="next"
                            ref={passwordRef}
                            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        />
                        <TextInput
                            value={confirmPassword}
                            mode="outlined"
                            onChangeText={setConfirmPassword}
                            label="Confirm Password"
                            error={password !== confirmPassword && confirmPassword.length > 0}
                            placeholder="Confirm your password"
                            secureTextEntry={!showConfirmPassword}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                            returnKeyType="done"
                            ref={confirmPasswordRef}
                            onSubmitEditing={handleSignUp}
                        />

                        <Button
                            mode="contained"
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.onPrimary}
                            style={{ borderRadius: 8, marginTop: 8 }}
                            onPress={handleSignUp}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign Up
                        </Button>
                    </Card.Content>
                </Card>

                {/* Switch to Sign In */}
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                    <Button
                        mode="text"
                        onPress={() => {
                            setIsSignIn(true);
                            setError(null);
                        }}
                        textColor={theme.colors.primary}
                    >
                        Already have an account? Sign In
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export function SignInScreen(
    { setIsSignIn, authHook }: { setIsSignIn: any, authHook: any }
) {
    const { styles, theme } = useAppTheme()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Create refs for navigation
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);

    const { signIn, error, setError, isLoading } = authHook

    const handleSignIn = () => {
        try {
            signIn(email, password)
        } catch (error: any) {
            setError(error)
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 150}
            enabled={true}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 16, paddingBottom: 32, paddingTop: 8 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Welcome Section */}
                <View style={{ marginBottom: 8 }}>
                    <Text variant='headlineMedium' style={{ fontWeight: '700', color: theme.colors.onBackground, marginBottom: 4 }}>
                        Welcome Back
                    </Text>
                    <Text variant='bodyLarge' style={{ color: theme.colors.onSurfaceVariant }}>
                        Sign in to continue tracking your diabetes management
                    </Text>
                </View>

                {/* Form Card */}
                <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                    <Card.Content style={{ gap: 16, paddingVertical: 20 }}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email" />}
                            returnKeyType="next"
                            ref={emailRef}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        <TextInput
                            value={password}
                            mode="outlined"
                            onChangeText={setPassword}
                            label="Password"
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                            returnKeyType="done"
                            ref={passwordRef}
                            onSubmitEditing={handleSignIn}
                        />

                        <Button
                            mode="contained"
                            buttonColor={theme.colors.primary}
                            textColor={theme.colors.onPrimary}
                            style={{ borderRadius: 8, marginTop: 8 }}
                            onPress={handleSignIn}
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Sign In
                        </Button>
                    </Card.Content>
                </Card>

                {/* Switch to Sign Up */}
                <View style={{ alignItems: 'center', marginTop: 8 }}>
                    <Button
                        mode="text"
                        onPress={() => {
                            setIsSignIn(false);
                            setError(null);
                        }}
                        textColor={theme.colors.primary}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export function ConfirmScreen(
    { setShowConfirmationMessage, authHook }: { setShowConfirmationMessage: any, authHook: any }
) {
    const { theme, styles } = useAppTheme()
    const [isResending, setIsResending] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        try {
            // Call the resend confirmation from authHook
            await authHook.resendConfirmation();
            // Show success message or keep modal open
        } catch (error) {
            console.error('Failed to resend confirmation:', error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View style={[styles.background, { flex: 1, padding: 24, justifyContent: 'center' }]}>
            <View style={{ gap: 24 }}>
                <Card mode="elevated" elevation={3} style={{ borderRadius: 16 }}>
                    <Card.Content style={{ gap: 16, paddingVertical: 32 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: theme.colors.primaryContainer,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Icon source="email-check" size={48} color={theme.colors.primary} />
                            </View>
                            <Text variant="headlineMedium" style={{ fontWeight: '700', color: theme.colors.onSurface, marginBottom: 8 }}>
                                Check Your Email
                            </Text>
                        </View>

                        <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                            We've sent you an email with a confirmation link.
                        </Text>
                        <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                            Please check your email and click the link to start using the app.
                        </Text>
                    </Card.Content>
                </Card>

                <View style={{ gap: 12 }}>
                    <Button
                        icon="email"
                        mode="contained"
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                        style={{ borderRadius: 8 }}
                        onPress={handleResend}
                        loading={isResending}
                        disabled={isResending}
                    >
                        Resend Confirmation
                    </Button>
                    <Button
                        icon="chevron-left"
                        mode="outlined"
                        style={{ borderRadius: 8 }}
                        onPress={() => setShowConfirmationMessage(false)}
                    >
                        Back
                    </Button>
                </View>
            </View>
        </View>
    );
}
