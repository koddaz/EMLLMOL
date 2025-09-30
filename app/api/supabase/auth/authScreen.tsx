import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { supabase } from "../supabase";
import { useAuth } from "@/app/hooks/useAuth";
import { TermsScreen } from "@/app/screens/TermsScreen";
import { InformationScreen } from "@/app/screens/InformationScreen";
import { useAppTheme } from "@/app/constants/UI/theme";
import { ViewSet } from "@/app/components/UI/ViewSet";



const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
    const theme = useTheme();
    const styles = customStyles(theme);

    const hej = true

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

    // if (hej === true) return (
    //     <SignUpScreen />
    // );
    
    return (
        <View style={[authStyles.container, { backgroundColor: theme.colors.primary }]}>




            <View style={authStyles.logoContainer}>
                <Image
                    style={authStyles.logo}
                    source={require('../../../../assets/images/logo.png')}
                    resizeMode="contain"
                />
                <Text variant="bodyLarge" style={[authStyles.appSubtitle, { color: theme.colors.onPrimary }]}>
                    Track your health journey with precision
                </Text>
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

            {/* Email Confirmation Message */}
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
                    {/* Auth Form with Actions */}
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
            )}
        </View>
    );
}


export function SignUpScreen() {

    const {styles} = useAppTheme()

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ViewSet
                title="Sign Up"
                icon="sign"
                content={
                    <View>

                    </View>
                }
            />

        </KeyboardAvoidingView>
    )

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
        width: width * 0.75,
        height: width * 0.75,
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
    switchButton: {
        marginBottom: 4,
        marginHorizontal: 8,
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




