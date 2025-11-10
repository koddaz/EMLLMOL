import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollView, View, Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button, Divider, Icon, IconButton, RadioButton, SegmentedButtons, Snackbar, Text, Dialog, Portal, TextInput, Card, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HookData, NavData } from "@/app/navigation/rootNav";
import { CustomTextInput } from "@/app/components/textInput";
import { useFocusEffect } from "@react-navigation/native";






export function useAsync(appData: AppData, setAppData: (data: AppData) => void) {

    const saveSettings = async (key: string, newValue: string) => {
        try {
            // Convert camelCase to lowercase for AsyncStorage keys
            const storageKey = key === 'clockFormat' ? 'clockformat' :
                key === 'dateFormat' ? 'dateformat' :
                key === 'themeMode' ? 'themeMode' : key;
            await AsyncStorage.setItem(storageKey, newValue);
            console.log(`Saved ${storageKey}: ${newValue}`);
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    };

    const loadSettings = async (key: string, setValue: (v: string) => void) => {
        try {
            // Convert camelCase to lowercase for AsyncStorage keys
            const storageKey = key === 'clockFormat' ? 'clockformat' :
                key === 'dateFormat' ? 'dateformat' :
                key === 'themeMode' ? 'themeMode' : key;
            const loaded = await AsyncStorage.getItem(storageKey);
            const value = loaded !== null ? loaded : "";
            setValue(value);
            console.log(`Loaded ${storageKey}: ${value}`);
            return value;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return "";
        }
    };

    const changeSettings = (
        key: keyof AppData["settings"],
        setValue: (v: string) => void
    ) => async (newValue: string) => {
        setValue(newValue);
        await saveSettings(key, newValue);
        setAppData({
            ...appData,
            settings: {
                ...appData.settings,
                [key]: newValue,
            },
        });
    };

    return {
        saveSettings,
        loadSettings,
        changeSettings
    };
}

export function AuthUpdate(
    { type, authHook, setEditSection }: HookData & { type?: string, setEditSection: any }
) {

    const { theme, styles } = useAppTheme()

    const oldPassRef = useRef<any>(null);
    const newPassRef = useRef<any>(null);
    const confirmPassRef = useRef<any>(null)

    const {
        error,
        setError,
        changePassword,
        changeEmail,
        setOldPass,
        setNewPass,
        oldPass,
        newPass,
        confirmPass,
        setConfirmPass,
        email,
        setEmail
    } = authHook;

    if (type === "email") return (
        <View>
            {error && (
                <View style={{
                    minHeight: 50,
                    backgroundColor: theme.colors.errorContainer,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    justifyContent: 'center'
                }}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                        {error}
                    </Text>
                </View>
            )}
            <TextInput
                returnKeyType="done"
                mode="outlined"
                value={email}
                onChangeText={(text) => { setEmail(text) }}
                keyboardType="email-address"
                autoCapitalize="none"
                label="New email address"
                left={<TextInput.Icon icon="email-outline" color={theme.colors.onSurface} />}
            />
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, justifyContent: 'flex-end', gap: 8, padding: 16, marginBottom: -8, marginHorizontal: -16 }}>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="close" textColor={theme.colors.onError} buttonColor={theme.colors.error} onPress={() => { setEditSection('none') }}>Cancel</Button>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="floppy" textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={async () => {
                    const result = await changeEmail(email);
                    if (result?.success) {
                        setEditSection('none');
                    }
                }}>Save</Button>
            </View>
        </View>

    );

    if (type === "pass") return (
        <View>
            {error && (
                <View style={{
                    minHeight: 50,
                    backgroundColor: theme.colors.errorContainer,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    justifyContent: 'center'
                }}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                        {error}
                    </Text>
                </View>
            )}
            <TextInput
                ref={oldPassRef}
                onSubmitEditing={() => newPassRef.current?.focus()}
                returnKeyType="next"
                mode="outlined"
                value={oldPass}
                onChangeText={(text) => { setOldPass(text) }}
                secureTextEntry
                label="Current password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
            <TextInput
                ref={newPassRef}
                onSubmitEditing={() => confirmPassRef.current?.focus()}
                returnKeyType="next"
                mode="outlined"
                value={newPass}
                onChangeText={(text) => { setNewPass(text) }}
                secureTextEntry
                label="New password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
            <TextInput
                ref={confirmPassRef}
                onSubmitEditing={() => confirmPassRef.current?.blur()}
                returnKeyType="done"
                mode="outlined"
                value={confirmPass}
                onChangeText={(text) => { setConfirmPass(text) }}
                secureTextEntry
                label="Confirm password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, justifyContent: 'flex-end', gap: 8, padding: 16, marginBottom: -8, marginHorizontal: -16 }}>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="close" textColor={theme.colors.onError} buttonColor={theme.colors.error} onPress={() => { setEditSection('none') }}>Cancel</Button>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="floppy" textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={async () => {
                    const result = await changePassword();
                    if (result?.success) {
                        setEditSection('none');
                    }
                }}>Save</Button>
            </View>
        </View>
    );

    return (
        <View>
            <TextInput
                ref={oldPassRef}
                mode="outlined"
                value={oldPass}
                onChangeText={(text) => { setOldPass(text) }}
                secureTextEntry
                label="Current password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
        </View>
    );
}

export function SettingsScreen({
    appData,
    setAppData,
    authHook,
}: NavData & HookData) {
    const { theme, styles } = useAppTheme();
    const [editMode, setEditMode] = useState(false);

    const [username, setUsername] = useState(appData?.profile?.username || '');
    const [fullName, setFullName] = useState(appData?.profile?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(appData?.profile?.avatarUrl || '');

    const [weight, setWeight] = useState(appData?.settings.weight);
    const [glucose, setGlucose] = useState(appData?.settings.glucose);
    const [clockFormat, setClockFormat] = useState(appData?.settings.clockFormat);
    const [dateFormat, setDateFormat] = useState(appData?.settings.dateFormat);
    const [themeMode, setThemeMode] = useState(appData?.settings.themeMode || 'light');

    const { changeSettings } = useAsync(appData!, setAppData!)

    const [editSection, setEditSection] = useState<'password' | 'email' | 'none'>('none')
    // Local state for settings section - show all sections by default
    const [settingsSection, setSettingsSection] = useState<'all' | 'app' | 'profile'>('all');

    // Unified notification state
    const [notification, setNotification] = useState<{
        visible: boolean;
        type: 'success' | 'error' | 'delete';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        visible: false,
        type: 'success',
        title: '',
        message: ''
    });

    const {
        signOut,
        deleteAccount,
        isLoading,
        success,
        showSuccess,
        setShowSuccess,
        error
    } = authHook;

    // Helper functions for notifications
    const showNotification = (type: 'success' | 'error' | 'delete', title: string, message: string, onConfirm?: () => void) => {
        setNotification({
            visible: true,
            type,
            title,
            message,
            onConfirm
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, visible: false }));
    };

    // Watch for auth success/error changes
    useEffect(() => {
        if (showSuccess && success) {
            showNotification('success', 'Success!', success);
            setShowSuccess(false);
        }
        // Never show password/email errors in portal - only in inline display
    }, [showSuccess, success, setShowSuccess]);

    const handleDeleteAccount = async () => {
        hideNotification();
        const success = await deleteAccount();
        if (!success) {
            showNotification('error', 'Error', 'Failed to delete account. Please try again later.');
        }
    };




    const renderRadioButtons = (title: string, firstValue: string, secondValue: string, currentValue: string, settingKey: keyof AppData["settings"], setValue: (value: string) => void) => {

        return (
            <View style={[styles.row, { marginBottom: 4 }]}>
                <View style={{ alignItems: 'flex-start', flex: 2 }}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        {title}
                    </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ paddingHorizontal: 4, alignItems: 'center' }}>
                        <RadioButton
                            value={firstValue}
                            status={currentValue === firstValue ? 'checked' : 'unchecked'}
                            onPress={() => changeSettings(settingKey, setValue)(firstValue)}
                        />
                        <Text variant="labelSmall">{firstValue}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 4, alignItems: 'center' }}>
                        <RadioButton
                            value={secondValue}
                            status={currentValue === secondValue ? 'checked' : 'unchecked'}
                            onPress={() => changeSettings(settingKey, setValue)(secondValue)}
                        />
                        <Text variant="labelSmall">{secondValue}</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 150}
            enabled={true}>

            <ScrollView
                style={styles.background}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Title Section */}
                <Surface style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 }} elevation={0}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ flex: 1 }}>
                            <Text variant="headlineMedium" style={{
                                color: theme.colors.onBackground,
                                fontWeight: '700',
                                marginBottom: 2,
                            }}>
                                Settings
                            </Text>
                            <Text variant="bodyLarge" style={{
                                color: theme.colors.onSurfaceVariant,
                            }}>
                                Customize your app preferences
                            </Text>
                        </View>
                        <Surface style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primaryContainer, justifyContent: 'center', alignItems: 'center', elevation: 2 }} elevation={2}>
                            <Icon source="cog" size={28} color={theme.colors.primary} />
                        </Surface>
                    </View>
                </Surface>

                <View style={{ paddingHorizontal: 16, gap: 16, paddingTop: 16 }}>
                    {/* ACCOUNT SETTINGS */}
                    {(settingsSection === 'profile' || settingsSection === 'all') && (
                        <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                            <Card.Title 
                                title="Account"
                                left={(props) => <Icon {...props} source="account" size={24} color={theme.colors.primary} />}
                                right={(props) => (
                                    <IconButton
                                        {...props}
                                        icon={editMode ? "pencil-off" : "pencil"}
                                        size={24}
                                        iconColor={theme.colors.primary}
                                        onPress={() => { setEditMode(!editMode) }}
                                    />
                                )}
                            />
                            <Card.Content style={{ paddingVertical: 8, gap: 8 }}>
                                <CustomTextInput
                                    mode="outlined"
                                    value={appData?.session?.user.email || ''}
                                    onChangeText={() => { }}
                                    label="Email"
                                    disabled={true}
                                    leftIcon={"email"}
                                    dense
                                />
                                <CustomTextInput
                                    mode="outlined"
                                    value={username}
                                    onChangeText={setUsername}
                                    label="Username"
                                    disabled={!editMode}
                                    leftIcon={"account"}
                                    dense
                                />
                                <CustomTextInput
                                    mode="outlined"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    label="Full Name"
                                    disabled={!editMode}
                                    leftIcon={"account-details"}
                                    dense
                                />
                                {editMode && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                                        <Button style={{ borderRadius: 8 }} mode="contained" icon="close" textColor={theme.colors.onError} buttonColor={theme.colors.error} onPress={() => { setEditMode(false) }}>Cancel</Button>
                                        <Button style={{ borderRadius: 8 }} mode="contained" icon="floppy" textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={() => { }}>Save</Button>
                                    </View>
                                )}
                                <View style={{ gap: 8, marginTop: 8 }}>
                                    <Text variant="labelMedium">Update Account</Text>
                                    <Button
                                        icon="lock-reset"
                                        mode="contained"
                                        style={{ borderRadius: 8 }}
                                        buttonColor={theme.colors.primaryContainer}
                                        textColor={theme.colors.onPrimaryContainer}
                                        contentStyle={{ justifyContent: 'flex-start', gap: 40, marginHorizontal: 8 }}
                                        onPress={() => {
                                            setEditSection('password')
                                        }}>
                                        Change Password
                                    </Button>
                                    {editSection === 'password' && (
                                        <AuthUpdate authHook={authHook} type={"pass"} setEditSection={setEditSection} />
                                    )}
                                    <Text variant="labelMedium" style={{ marginTop: 8 }}>Danger Zone</Text>
                                    <Button
                                        icon="account-remove-outline"
                                        mode="contained"
                                        style={{ borderRadius: 8 }}
                                        buttonColor={theme.colors.error}
                                        textColor={theme.colors.onError}
                                        contentStyle={{ justifyContent: 'flex-start', gap: 40, marginHorizontal: 8 }}
                                        onPress={() => showNotification(
                                            'delete',
                                            'Delete Account?',
                                            'This action cannot be undone. All your data including diary entries and profile information will be permanently deleted.',
                                            handleDeleteAccount
                                        )}>
                                        Delete Account
                                    </Button>
                                    <Button
                                        icon="logout"
                                        mode="contained"
                                        style={{ borderRadius: 8 }}
                                        buttonColor={theme.colors.warning}
                                        textColor={theme.colors.onWarning}
                                        contentStyle={{ justifyContent: 'flex-start', gap: 40, marginHorizontal: 8 }}
                                        onPress={signOut}>
                                        Sign Out
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {(settingsSection === 'app' || settingsSection === 'all') && (
                        <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                            <Card.Title 
                                title="App Settings"
                                left={(props) => <Icon {...props} source="cog-outline" size={24} color={theme.colors.primary} />}
                            />
                            <Card.Content style={{ padding: 8 }}>
                                {renderRadioButtons('Theme Mode', 'light', 'dark', themeMode!, 'themeMode', setThemeMode)}
                                <Divider style={{ marginVertical: 4 }} />
                                {renderRadioButtons('Glucose Unit', 'mmol', 'mgdl', glucose!, 'glucose', setGlucose)}
                                <Divider style={{ marginVertical: 4 }} />
                                {renderRadioButtons('Weight Unit', 'kg', 'lbs', weight!, 'weight', setWeight)}
                                <Divider style={{ marginVertical: 4 }} />
                                {renderRadioButtons('Clock format', '24h', '12h', clockFormat!, 'clockFormat', setClockFormat)}
                                <Divider style={{ marginVertical: 4 }} />
                                {renderRadioButtons('Date format', 'en', 'us', dateFormat!, 'dateFormat', setDateFormat)}
                            </Card.Content>
                        </Card>
                    )}
                </View>
















            </ScrollView>

            <Portal>
                <Dialog visible={notification.visible} onDismiss={hideNotification}>
                    <Dialog.Icon
                        icon={
                            notification.type === 'success' ? 'check-circle' :
                                notification.type === 'error' ? 'alert-circle' :
                                    'alert-circle'
                        }
                        color={
                            notification.type === 'success' ? theme.colors.success :
                                notification.type === 'error' ? theme.colors.error :
                                    theme.colors.error
                        }
                        size={48}
                    />
                    <Dialog.Title style={{ textAlign: 'center' }}>
                        {notification.title}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                            {notification.message}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions style={{
                        justifyContent: notification.type === 'delete' ? 'space-between' : 'center',
                        paddingHorizontal: 16
                    }}>
                        {notification.type === 'delete' && (
                            <Button
                                onPress={hideNotification}
                                textColor={theme.colors.onSurface}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            onPress={() => {
                                if (notification.onConfirm) {
                                    notification.onConfirm();
                                } else {
                                    hideNotification();
                                }
                            }}
                            buttonColor={
                                notification.type === 'success' ? theme.colors.success :
                                    notification.type === 'error' ? theme.colors.primary :
                                        theme.colors.error
                            }
                            textColor={
                                notification.type === 'success' ? theme.colors.onSuccess :
                                    notification.type === 'error' ? theme.colors.onPrimary :
                                        theme.colors.onError
                            }
                            mode="contained"
                            loading={notification.type === 'delete' && isLoading}
                            disabled={notification.type === 'delete' && isLoading}
                        >
                            {notification.type === 'delete' ? 'Delete Forever' : 'OK'}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


        </KeyboardAvoidingView>
    );
}


