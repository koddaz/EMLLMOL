import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useAuth } from "@/app/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, SegmentedButtons, Snackbar, Surface, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function SettingsScreen({
    appData,
    setAppData,
    editMode,
    setEditMode,
    currentSection,
    setCurrentSection,
    
}: {
    appData: AppData;
    setAppData: (data: AppData) => void;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    currentSection: 'profile' | 'preferences' | 'account';
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
    
}) {
    const { theme, styles } = useAppTheme();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    return (
        <View style={styles.background}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content} // unified padding/gap
                showsVerticalScrollIndicator={false}
            >
                <ProfileSettings
                    appData={appData}
                    setShowSuccessMessage={setShowSuccessMessage}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setCurrentSection={setCurrentSection}
                />
                <AppSettings
                    appData={appData}
                    setAppData={setAppData}
                    setCurrentSection={setCurrentSection}
                />
                <AccountActions
                    appData={appData}
                    setCurrentSection={setCurrentSection}
                />
            </ScrollView>

            <Snackbar
                visible={showSuccessMessage}
                onDismiss={() => setShowSuccessMessage(false)}
                duration={3000}
                style={{ backgroundColor: theme.colors.primary }}
            >
                Profile updated successfully!
            </Snackbar>
        </View>
    );
}

export function ProfileSettings({
    appData,
    setShowSuccessMessage,
    editMode,
    setEditMode,
    setCurrentSection
}: {
    appData: AppData;
    setShowSuccessMessage: (value: boolean) => void;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
}) {
    const { theme, styles } = useAppTheme();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { updateProfile } = useAuth(appData.session);

    const [username, setUsername] = useState(appData?.profile?.username || '');
    const [fullName, setFullName] = useState(appData?.profile?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(appData?.profile?.avatarUrl || '');

    // Set current section when this component comes into view
    useEffect(() => {
        setCurrentSection('profile');
    }, []);

    const handleUpdateProfile = async () => {
        if (!username || !fullName) return;

        try {
            setIsLoading(true);
            setError(null);
            await updateProfile(username, fullName, avatarUrl);
            setEditMode(false);
            setShowSuccessMessage(true);
            console.log('Profile updated successfully');

        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Watch for edit mode changes from AppBar
    useEffect(() => {
        if (editMode && isLoading) {
            handleUpdateProfile();
        }
    }, [editMode]);

    const renderProfileCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="account-details" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Personal Information
                </Text>
            </View>
            <TextInput
                mode="outlined"
                value={appData?.session?.user.email || ''}
                label="Email"
                disabled
                left={<TextInput.Icon icon="email" />}
                style={styles.textInput}
                dense
            />
            <TextInput
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                label="Username"
                editable={editMode}
                left={<TextInput.Icon icon="account" />}
                style={styles.textInput}
                dense
            />
            <TextInput
                mode="outlined"
                value={fullName}
                onChangeText={setFullName}
                label="Full Name"
                editable={editMode}
                left={<TextInput.Icon icon="account-details" />}
                style={styles.textInput}
                dense
            />
        </Surface>
    );

    return (
        <View style={styles.section}>
            {error && (
                <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                        {error}
                    </Text>
                </Surface>
            )}
            {renderProfileCard()}
            {editMode && (
                <View style={styles.actionContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => setEditMode(false)}
                        style={styles.cancelButton}
                        icon="close"
                    >
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        style={styles.saveButton}
                        icon="content-save"
                        loading={isLoading}
                        disabled={!username || !fullName}
                    >
                        Save Changes
                    </Button>
                </View>
            )}
        </View>
    );
}



export function AppSettings({
    appData,
    setCurrentSection,
    setAppData
}: {
    appData: AppData;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
    setAppData: (data: AppData) => void;
}) {
    const { theme, styles } = useAppTheme();

    const [weight, setWeight] = useState(appData.settings.weight);
    const [glucose, setGlucose] = useState(appData.settings.glucose);
    const [clockFormat, setClockFormat] = useState(appData.settings.clockFormat);
    const [dateFormat, setDateFormat] = useState(appData.settings.dateFormat);

    // Set current section when this component comes into view
    useEffect(() => {
        setCurrentSection('preferences');
    }, []);

    const saveAndLoadSetting = async (
        key: string,
        newValue: string,
        setValue: (v: string) => void
    ) => {
        try {
            await AsyncStorage.setItem(key, newValue);
            console.log(`Saved ${key}: ${newValue}`);
            // Immediately load the value back from AsyncStorage
            const loaded = await AsyncStorage.getItem(key);
            setValue(loaded !== null ? loaded : newValue);
            console.log(`Loaded ${key}: ${loaded}`);
        } catch (error) {
            console.error(`Error saving/loading ${key}:`, error);
        }
    };

    const handleSettingChange = (
        key: keyof AppData["settings"],
        setValue: (v: string) => void
    ) => (newValue: string) => {
        setValue(newValue);
        saveAndLoadSetting(key, newValue, setValue);
        setAppData({
            ...appData,
            settings: {
                ...appData.settings,
                [key]: newValue,
            },
        });
    };

    const handleWeightChange = (newWeight: string) => {
        setWeight(newWeight);
        saveAndLoadSetting('weight', newWeight, setWeight);
    };

    const handleGlucoseChange = (newGlucose: string) => {
        setGlucose(newGlucose);
        saveAndLoadSetting('glucose', newGlucose, setGlucose);
    };

    const handleClockformatChange = (newClockFormat: string) => {
        setClockFormat(newClockFormat);
        saveAndLoadSetting('clockformat', newClockFormat, setClockFormat);
    };

    const handleDateformatChange = (newDateformat: string) => {
        setDateFormat(newDateformat);
        saveAndLoadSetting('dateformat', newDateformat, setDateFormat);
    };

    const renderUnitsCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="scale-balance" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Measurement Units
                </Text>
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Weight Unit
                </Text>
                <SegmentedButtons
                    value={weight}
                    style={{ marginBottom: 16 }}
                    onValueChange={handleSettingChange('weight', setWeight)}
                    buttons={[
                        { value: 'kg', label: 'Kilograms', icon: 'weight-kilogram' },
                        { value: 'lbs', label: 'Pounds', icon: 'weight-pound' },
                    ]}
                />
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Glucose Unit
                </Text>
                <SegmentedButtons
                    value={glucose}
                    onValueChange={handleSettingChange('glucose', setGlucose)}
                    buttons={[
                        { value: 'mmol', label: 'mmol/L', icon: 'test-tube' },
                        { value: 'mgdl', label: 'mg/dL', icon: 'test-tube' },
                    ]}
                />
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Clock Format
                </Text>
                <SegmentedButtons
                    value={clockFormat}
                    onValueChange={handleSettingChange('clockFormat', setClockFormat)}
                    buttons={[
                        { value: '12h', label: '12-hour', icon: 'clock' },
                        { value: '24h', label: '24-hour', icon: 'clock' },
                    ]}
                />
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Date Format
                </Text>
                <SegmentedButtons
                    value={dateFormat}
                    onValueChange={handleSettingChange('dateFormat', setDateFormat)}
                    buttons={[
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', icon: 'calendar' },
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', icon: 'calendar' },
                    ]}
                />
            </View>
        </Surface>
    );

    return (
        <View style={styles.section}>
            {renderUnitsCard()}
        </View>
    );
}

export function AccountActions({
    appData,
    setCurrentSection
}: {
    appData: AppData;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
}) {
    const { theme, styles } = useAppTheme();

    const { signOut, removeProfile } = useAuth(appData.session);

    // Set current section when this component comes into view
    useEffect(() => {
        setCurrentSection('account');
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleRemoveAccount = async () => {
        try {
            await removeProfile();
            console.log('Profile removed successfully');
        } catch (error) {
            console.error('Error removing profile:', error);
        }

    }

    const renderActionsCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="cog" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Account Actions
                </Text>
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Data Management
                </Text>
                <View style={styles.chipContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => console.log('Export data')}
                        style={styles.chip}
                        icon="download"
                        compact
                    >
                        Export Data
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => console.log('Privacy policy')}
                        style={styles.chip}
                        icon="shield-account"
                        compact
                    >
                        Privacy Policy
                    </Button>
                </View>
            </View>
            <View style={styles.section}>
                <Text variant="labelMedium" style={[styles.selectorLabel, { color: theme.colors.error }]}>
                    Danger Zone
                </Text>
                <View style={styles.chipContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSignOut}
                        style={[styles.chip, { backgroundColor: theme.colors.error }]}
                        labelStyle={{ color: theme.colors.onError }}
                        icon="logout"
                        compact
                    >
                        Sign Out
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleRemoveAccount}
                        style={[styles.chip, { backgroundColor: theme.colors.error }]}
                        labelStyle={{ color: theme.colors.onError }}
                        icon="logout"
                        compact
                    >
                        Delete Account
                    </Button>
                </View>
            </View>
        </Surface>
    );

    return (
        <View style={styles.section}>
            {renderActionsCard()}
        </View>
    );
}

