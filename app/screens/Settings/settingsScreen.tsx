import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollView, View, Alert } from "react-native";
import { Button, Divider, Icon, IconButton, RadioButton, SegmentedButtons, Snackbar, Text, Dialog, Portal, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HookData, NavData } from "@/app/navigation/rootNav";
import { CustomTextInput } from "@/app/components/textInput";
import { ViewSet } from "@/app/components/UI/ViewSet";
import { useFocusEffect } from "@react-navigation/native";






export function useAsync(appData: AppData, setAppData: (data: AppData) => void) {

    const saveSettings = async (key: string, newValue: string) => {
        try {
            // Convert camelCase to lowercase for AsyncStorage keys
            const storageKey = key === 'clockFormat' ? 'clockformat' :
                key === 'dateFormat' ? 'dateformat' : key;
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
                key === 'dateFormat' ? 'dateformat' : key;
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
        changePassword,
        setOldPass,
        setNewPass,
        oldPass,
        newPass,
        confirmPass,
        setConfirmPass,
    } = authHook;

    if (type === "email") return (
        <View>

        </View>

    );

    if (type === "pass") return (
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
            <TextInput
                ref={newPassRef}
                mode="outlined"
                value={newPass}
                onChangeText={(text) => { setNewPass(text) }}
                secureTextEntry
                label="New password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
            <TextInput
                ref={confirmPassRef}
                mode="outlined"
                value={confirmPass}
                onChangeText={(text) => { setConfirmPass(text) }}
                secureTextEntry
                label="Confirm password"
                left={<TextInput.Icon icon="lock" color={theme.colors.onSurface} />}
            />
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, justifyContent: 'flex-end', gap: 8, padding: 16, marginBottom: -8, marginHorizontal: -16 }}>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="close" textColor={theme.colors.onError} buttonColor={theme.colors.error} onPress={() => { setEditSection('none') }}>Cancel</Button>
                <Button style={{ borderRadius: 8 }} mode="contained" icon="floppy" textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={() => { changePassword() }}>Save</Button>
            </View>
        </View>
    )
    return (

        <View>

        </View>

    );
}

export function SettingsScreen({
    appData,
    setAppData,
    authHook,
    navBarHook
}: NavData & HookData & { navBarHook: any }) {
    const { theme, styles } = useAppTheme();
    const [editMode, setEditMode] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [username, setUsername] = useState(appData?.profile?.username || '');
    const [fullName, setFullName] = useState(appData?.profile?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(appData?.profile?.avatarUrl || '');

    const [weight, setWeight] = useState(appData?.settings.weight);
    const [glucose, setGlucose] = useState(appData?.settings.glucose);
    const [clockFormat, setClockFormat] = useState(appData?.settings.clockFormat);
    const [dateFormat, setDateFormat] = useState(appData?.settings.dateFormat);

    const { changeSettings } = useAsync(appData!, setAppData!)

    const [editSection, setEditSection] = useState<'password' | 'email' | 'none'>('none')

    const {
        signOut,
        deleteAccount,
        isLoading,
        success,
        showSuccess,
        setShowSuccess
    } = authHook;

    // Close nav menu when settings screen is focused
    useFocusEffect(
        useCallback(() => {
            navBarHook.setIsMenuVisible(false);
        }, [navBarHook])
    );

    const handleDeleteAccount = async () => {
        setShowDeleteDialog(false);
        const success = await deleteAccount();
        if (!success) {
            Alert.alert(
                'Error',
                'Failed to delete account. Please try again later.',
                [{ text: 'OK' }]
            );
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
        <View style={{ flex: 1, marginTop: 16 }}>

            <ScrollView
                style={styles.background}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >


                {/* ACCOUNT SETTINGS */}
                <ViewSet
                    title="Account"
                    icon="account"
                    headerButton={true}
                    headerButtonIcon={editMode ? "pencil-off" : "pencil"}
                    onPress={() => { setEditMode(!editMode) }}
                    content={
                        <>
                            <View style={{ backgroundColor: theme.colors.surface, paddingVertical: 8 }}>

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


                            </View>
                            {editMode && (
                                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, justifyContent: 'flex-end', gap: 8, padding: 16, marginBottom: -8, marginHorizontal: -16 }}>
                                    <Button style={{ borderRadius: 8 }} mode="contained" icon="close" textColor={theme.colors.onError} buttonColor={theme.colors.error} onPress={() => { setEditMode(false) }}>Cancel</Button>
                                    <Button style={{ borderRadius: 8 }} mode="contained" icon="floppy" textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={() => { }}>Save</Button>
                                </View>
                            )}
                            <View style={{ backgroundColor: theme.colors.surface }}>
                                <View style={{ backgroundColor: theme.colors.surface, gap: 8, marginTop: 8 }}>
                                    <Text variant="labelMedium">Update Account</Text>

                                    <Button
                                        icon="email-alert-outline"
                                        mode="contained"
                                        style={{ borderRadius: 8 }}
                                        buttonColor={theme.colors.primaryContainer}
                                        textColor={theme.colors.onPrimaryContainer}
                                        contentStyle={{ justifyContent: 'flex-start', gap: 40, marginHorizontal: 8 }}
                                        onPress={() => { }}>
                                        Change Email
                                    </Button>
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

                                    <Text variant="labelMedium">Danger Zone</Text>

                                    <Button
                                        icon="account-remove-outline"
                                        mode="contained"
                                        style={{ borderRadius: 8 }}
                                        buttonColor={theme.colors.error}
                                        textColor={theme.colors.onError}
                                        contentStyle={{ justifyContent: 'flex-start', gap: 40, marginHorizontal: 8 }}
                                        onPress={() => setShowDeleteDialog(true)}>
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
                            </View>
                        </>


                    } />

                <ViewSet
                    title="App Settings"
                    icon="cog-outline"
                    content={
                        <View style={{ backgroundColor: theme.colors.surface, padding: 8 }}>
                            {renderRadioButtons('Glucose Unit', 'mmol', 'mgdl', glucose!, 'glucose', setGlucose)}
                            <Divider style={{ marginVertical: 4 }} />
                            {renderRadioButtons('Weight Unit', 'kg', 'lbs', weight!, 'weight', setWeight)}
                            <Divider style={{ marginVertical: 4 }} />
                            {renderRadioButtons('Clock format', '24h', '12h', clockFormat!, 'clockFormat', setClockFormat)}
                            <Divider style={{ marginVertical: 4 }} />
                            {renderRadioButtons('Date format', 'en', 'us', dateFormat!, 'dateFormat', setDateFormat)}
                        </View>
                    } />















            </ScrollView>

            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
                    <Dialog.Icon icon="alert-circle" color={theme.colors.error} size={48} />
                    <Dialog.Title style={{ textAlign: 'center' }}>Delete Account?</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                            This action cannot be undone. All your data including diary entries and profile information will be permanently deleted.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16 }}>
                        <Button
                            onPress={() => setShowDeleteDialog(false)}
                            textColor={theme.colors.onSurface}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={handleDeleteAccount}
                            buttonColor={theme.colors.error}
                            textColor={theme.colors.onError}
                            mode="contained"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Delete Forever
                        </Button>
                    </Dialog.Actions>
                </Dialog>

            </Portal>
            <Portal>
                <Dialog visible={showSuccess} onDismiss={() => setShowSuccess(false)}>
                    <Dialog.Icon icon="check-circle" color={theme.colors.success} size={48} />
                    <Dialog.Title style={{ textAlign: 'center' }}>Success!</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
                            {success}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: 'center', paddingHorizontal: 16 }}>
                        <Button
                            onPress={() => {
                                setShowSuccess(false)
                            }}
                            buttonColor={theme.colors.success}
                            textColor={theme.colors.onSuccess}
                            mode="contained"
                        >
                            Ok!
                        </Button>
                    </Dialog.Actions>

                </Dialog>
            </Portal>


        </View>
    );
}


