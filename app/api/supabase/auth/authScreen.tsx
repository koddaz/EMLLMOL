import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import { Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform } from "react-native";
import { Button, Icon, IconButton, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { supabase } from "../supabase";
import { useAuth } from "@/app/hooks/useAuth";
import { TermsScreen } from "@/app/screens/TermsScreen";
import { InformationScreen } from "@/app/screens/InformationScreen";
import { useAppTheme } from "@/app/constants/UI/theme";
import { ViewSet } from "@/app/components/UI/ViewSet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomTextInput } from "@/app/components/textInput";





export default function AuthScreen() {
    const theme = useTheme();
    const styles = customStyles(theme);
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

    const [showTerms, setShowTerms] = useState(false);
    const [showInformation, setShowInformation] = useState(false);

    const { signIn, signUp, error, setError } = useAuth(null, true); // Enable deep link handling for auth screen

    // Handle successful authentication
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    console.log('User signed in successfully');
                    // Navigation or state update logic here
                } else if (event === 'SIGNED_OUT') {
                    console.log('User signed out');
                    setShowConfirmationMessage(false);
                    setEmail('');
                    setPassword('');
                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    // Show modal screens
    if (showTerms) {
        return <TermsScreen onClose={() => setShowTerms(false)} />;
    }

    if (showInformation) {
        return (
            <View style={[authStyles.container, { backgroundColor: theme.colors.primary }]}>
                <InformationScreen onClose={() => setShowInformation(false)} />
            </View>
        );
    }


    return (
        <View style={styles.background}>
            <View style={{ flex: 1, marginTop: insets.top + 16, backgroundColor: theme.colors.surface }}>
                <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', paddingHorizontal: 16 }}>
                    <Image
                        style={authStyles.logo}
                        source={require('../../../../assets/images/logo-head.gif')}
                        resizeMode="contain"
                    />
                    <Text variant="headlineMedium">emmi-Sense</Text>
                </View>
                <View style={{ flex: 1, padding: 16 }}>
                    {isSignIn ? (
                        <SignInScreen setIsSignIn={setIsSignIn} />
                    ) : (
                        <SignUpScreen setIsSignIn={setIsSignIn} />
                    )}

                </View>

            </View>



            {/* Error Message */}
            {error && (
                <Surface style={[authStyles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                    <MaterialCommunityIcons
                        name="alert-circle"
                        size={20}
                        color={theme.colors.error}
                    />
                    <Text style={[authStyles.errorText, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                </Surface>
            )}


        </View>
    );
}


export function SignUpScreen(
    { setIsSignIn }: { setIsSignIn: any }
) {

    const { styles, theme } = useAppTheme()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Create refs for navigation
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const confirmPasswordRef = useRef<any>(null);

    const { signUp, error, setError } = useAuth()

    const handleSignUp = () => {
        if (password != confirmPassword) {
            setError("Passwords does not match.")
        } else {
            try {
                signUp(email, password)

            } catch (error: any) {
                setError("Error" + error + " occured.")
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
                contentContainerStyle={{ gap: 8, paddingBottom: 150, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                automaticallyAdjustKeyboardInsets={true}
            >
                <View style={{ backgroundColor: theme.colors.surfaceVariant, padding: 12, gap: 8, borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.outline }}>
                    <Text variant='titleLarge'>Welcome to emmi-Sense </Text>
                    <Text variant='titleMedium'>- Your Personal Diabetes Diary</Text>
                    <Text variant='bodyLarge' style={{ textAlign: 'justify' }}>
                        Track your blood glucose, carbs intake, and insulin use all in one place. Monitor patterns, gain insights, and take control of your diabetes management one entry at a time.
                    </Text>

                </View>
                {error && (
                    <View style={{ backgroundColor: theme.colors.error, padding: 12, gap: 8, borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.outline }}>
                        <Text variant={"bodyLarge"} style={{color: theme.colors.onError}}>{error}</Text>
                    </View>
                )}
                <ViewSet
                    title="Sign Up"
                    icon="clipboard-account-outline"
                    content={
                        <View style={{ gap: 8 }}>

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
                                placeholder="Enter your passowrd"
                                secureTextEntry={true}
                                left={<TextInput.Icon icon="lock" />}
                                returnKeyType="next"
                                ref={passwordRef}
                                onSubmitEditing={() => confirmPasswordRef.current.focus()}
                            />

                            <TextInput
                                value={confirmPassword}
                                mode="outlined"
                                onChangeText={setConfirmPassword}
                                label="Confirm Password"
                                error={password != confirmPassword}
                                placeholder="Confirm your password"
                                secureTextEntry={true}
                                left={<TextInput.Icon icon="lock" />}
                                returnKeyType="done"
                                ref={confirmPasswordRef}
                                onSubmitEditing={() => confirmPasswordRef.current?.blur()}
                            />
                            <Button mode="contained" buttonColor={theme.colors.primaryContainer} textColor={theme.colors.onPrimaryContainer} style={{ borderRadius: 8 }} onPress={handleSignUp}>Sign Up</Button>
                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 8 }}>
                            <Button
                                mode="text"
                                onPress={() => {
                                    setIsSignIn(true);
                                    setError(null);
                                }}
                                labelStyle={{ color: theme.colors.onSurfaceVariant }}
                            >
                                Already have an account? Sign In
                            </Button>

                        </View>
                    }
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )

}

export function SignInScreen(
    { setIsSignIn }: { setIsSignIn: any }

) {
    const { styles, theme } = useAppTheme()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // Create refs for navigation
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);


    const { signIn, error, setError } = useAuth()

    const handleSignIn = () => {
        try {
            signIn(email, password)
        } catch (error : any) {
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
                contentContainerStyle={{ gap: 8, paddingBottom: 150, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                automaticallyAdjustKeyboardInsets={true}
            >
                <View style={{ backgroundColor: theme.colors.surfaceVariant, padding: 12, gap: 8, borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.outline }}>
                    <Text variant='titleLarge'>Welcome back! </Text>
                    <Text variant='titleMedium'>- Your Personal Diabetes Diary</Text>
                    <Text variant='bodyLarge' style={{ textAlign: 'justify' }}>
                        Track your blood glucose, carbs intake, and insulin use all in one place. Monitor patterns, gain insights, and take control of your diabetes management one entry at a time.
                    </Text>

                </View>

                {error && (
                    <View style={{ backgroundColor: theme.colors.error, padding: 12, gap: 8, borderRadius: 8, borderWidth: 0.5, borderColor: theme.colors.outline }}>
                        <Text variant={"bodyLarge"} style={{color: theme.colors.onError}}>{error}</Text>
                    </View>
                )}
                <ViewSet
                    title="Sign In"
                    icon="clipboard-account-outline"
                    content={
                        <View style={{ gap: 8 }}>

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
                                placeholder="Enter your passowrd"
                                secureTextEntry={true}
                                left={<TextInput.Icon icon="lock" />}
                                returnKeyType="next"
                                ref={passwordRef}
                                onSubmitEditing={() => passwordRef.current.blur()}
                            />

                            <Button mode="contained" buttonColor={theme.colors.primaryContainer} textColor={theme.colors.onPrimaryContainer} style={{ borderRadius: 8 }} onPress={handleSignIn}>Sign In</Button>

                        </View>
                    }
                    footer={
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 8 }}>
                            <Button
                                mode="text"
                                onPress={() => {
                                    setIsSignIn(false);
                                    setError(null);
                                }}
                                labelStyle={{ color: theme.colors.onSurfaceVariant }}
                            >
                                Don't have an account? Sign Up
                            </Button>

                        </View>
                    }
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginTop: 4,
        gap: 8,
    },
    iconButton: {
        margin: 0,
    },
    logoContainer: {
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 4,
    },
    appSubtitle: {
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 8,
    },
    formContainer: {
        marginHorizontal: 8,
        marginBottom: 8,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    formHeader: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    inputContainer: {
        gap: 8,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    formIcon: {
        alignSelf: 'center',
        marginBottom: 4,
    },
    formTitle: {
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 4,
    },
    formSubtitle: {
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'transparent',
        height: 40,
    },
    actionContainer: {
        gap: 8,

    },

    button: {
        paddingVertical: 2,
        margin: 0,
        borderRadius: 0,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 8,
        padding: 8,
        borderRadius: 8,
    },
    errorText: {
        marginLeft: 4,
        flex: 1,
    },
    confirmationContainer: {
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    confirmationIcon: {
        marginBottom: 8,
    },
    confirmationTitle: {
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 8,
    },
    confirmationText: {
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 8,
        lineHeight: 20,
    },
});




/* 

            {showConfirmationMessage ? (
                <View style={authStyles.confirmationContainer}>
                    <MaterialCommunityIcons
                        name="email-check"
                        size={48}
                        color={theme.colors.onPrimary}
                        style={authStyles.confirmationIcon}
                    />
                    <Text variant="headlineSmall" style={[authStyles.confirmationTitle, { color: theme.colors.onPrimary }]}>
                        Check Your Email
                    </Text>
                    <Text variant="bodyLarge" style={[authStyles.confirmationText, { color: theme.colors.onPrimary }]}>
                        Please check your email and click the confirmation link to activate your account.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => {
                            setShowConfirmationMessage(false);
                            setError(null);
                        }}
                        style={[authStyles.button, { backgroundColor: theme.colors.secondary }]}
                        labelStyle={{ color: theme.colors.onSecondary }}
                        icon="arrow-left"
                    >
                        Back to Sign In
                    </Button>
                </View>
            ) : (
                <>
                   
                    <View style={[authStyles.formContainer, { borderColor: theme.colors.outline }]}>
                        <View style={[authStyles.formHeader, { backgroundColor: theme.colors.secondary }]}>
                            <MaterialCommunityIcons
                                name={isSignIn ? "login" : "account-plus"}
                                size={28}
                                color={theme.colors.onSecondary}
                                style={authStyles.formIcon}
                            />
                            <Text variant="headlineMedium" style={[authStyles.formTitle, { color: theme.colors.onSecondary }]}>
                                {isSignIn ? 'Welcome Back' : 'Create Account'}
                            </Text>
                            <Text variant="bodyMedium" style={[authStyles.formSubtitle, { color: theme.colors.onSecondary }]}>
                                {isSignIn
                                    ? 'Enter your credentials to access your dashboard'
                                    : 'Join us to start tracking your health journey'
                                }
                            </Text>
                        </View>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                label="Email"
                                value={email}
                                outlineColor={theme.colors.onPrimary}
                                activeOutlineColor={theme.colors.onPrimary}
                                textColor={theme.colors.onPrimary}
                                onChangeText={setEmail}
                                style={[authStyles.textInput, { backgroundColor: 'transparent' }]}
                                contentStyle={{ color: theme.colors.onPrimary }}
                                mode="outlined"
                                autoCapitalize="none"
                                autoComplete="email"
                                keyboardType="email-address"
                                left={<TextInput.Icon icon="email" color={theme.colors.onPrimary} />}
                                theme={{
                                    colors: {
                                        onSurfaceVariant: theme.colors.onPrimary,
                                        outline: theme.colors.onPrimary,
                                    }
                                }}
                            />

                            <TextInput
                                label="Password"
                                value={password}
                                outlineColor={theme.colors.onPrimary}
                                activeOutlineColor={theme.colors.onPrimary}
                                textColor={theme.colors.onPrimary}
                                onChangeText={setPassword}
                                style={[authStyles.textInput, { backgroundColor: 'transparent' }]}
                                contentStyle={{ color: theme.colors.onPrimary }}
                                mode="outlined"
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password"
                                left={<TextInput.Icon icon="lock" color={theme.colors.onPrimary} />}
                                theme={{
                                    colors: {
                                        onSurfaceVariant: theme.colors.onPrimary,
                                        outline: theme.colors.onPrimary,
                                    }
                                }}
                            />
                        </View>
                        <View style={[authStyles.actionContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)', }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    mode="text"
                                    onPress={() => {
                                        setIsSignIn(!isSignIn);
                                        setError(null);
                                    }}
                                    style={authStyles.switchButton}
                                    labelStyle={{ color: theme.colors.onPrimary }}
                                >
                                    {isSignIn ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                                </Button>

                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 12 }}>
                                    <IconButton
                                        icon="help-circle-outline"
                                        size={24}
                                        iconColor={theme.colors.onPrimary}
                                        onPress={() => setShowInformation(true)}
                                        style={authStyles.iconButton}
                                    />
                                    <IconButton
                                        icon="file-document-outline"
                                        size={24}
                                        iconColor={theme.colors.onPrimary}
                                        onPress={() => setShowTerms(true)}
                                        style={authStyles.iconButton}
                                    />
                                </View>
                            </View>
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
                                style={[authStyles.button, { backgroundColor: theme.colors.secondary }]}
                                labelStyle={{ color: theme.colors.onSecondary }}
                                icon={isSignIn ? "login" : "account-plus"}
                                disabled={!email || !password}
                            >
                                {isSignIn ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </View>
                    </View>
                </>
            )} */