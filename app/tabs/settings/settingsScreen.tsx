import { AppData } from "@/app/constants/interface/appData";
import { customStyles } from "@/app/constants/UI/styles";
import { useAuth } from "@/db/supabase/auth/authScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, SegmentedButtons, Snackbar, Surface, Text, TextInput, useTheme } from "react-native-paper";

export function SettingsScreen({ 
    appData, 
    editMode, 
    setEditMode, 
    currentSection, 
    setCurrentSection 
}: { 
    appData: AppData;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    currentSection: 'profile' | 'preferences' | 'account';
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
}) {
    const theme = useTheme();
    const styles = customStyles(theme);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Auto-scroll to sections based on currentSection
    useEffect(() => {
        // You can implement auto-scrolling here if needed
        console.log('Current section:', currentSection);
    }, [currentSection]);

    return (
        <View style={styles.background}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ProfileSettings 
                    appData={appData} 
                    setShowSuccessMessage={setShowSuccessMessage}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setCurrentSection={setCurrentSection}
                />
                <AppSettings 
                    appData={appData} 
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
    const theme = useTheme();
    const styles = customStyles(theme);
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
                style={[styles.input, { marginBottom: 12 }]}
                dense
            />

            <TextInput
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                label="Username"
                editable={editMode}
                left={<TextInput.Icon icon="account" />}
                style={[styles.input, { marginBottom: 12 }]}
                dense
            />

            <TextInput
                mode="outlined"
                value={fullName}
                onChangeText={setFullName}
                label="Full Name"
                editable={editMode}
                left={<TextInput.Icon icon="account-details" />}
                style={styles.input}
                dense
            />
        </Surface>
    );

    return (
        <View style={styles.content}>
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
    setCurrentSection 
}: { 
    appData: AppData;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
}) {
    const theme = useTheme();
    const styles = customStyles(theme);

    const [weight, setWeight] = useState(appData.settings.weight);
    const [glucose, setGlucose] = useState(appData.settings.glucose);

    // Set current section when this component comes into view
    useEffect(() => {
        setCurrentSection('preferences');
    }, []);

    const saveSetting = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(`Saved ${key}: ${value}`);
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    };

    const handleWeightChange = (newWeight: string) => {
        setWeight(newWeight);
        saveSetting('weight', newWeight);
    };

    const handleGlucoseChange = (newGlucose: string) => {
        setGlucose(newGlucose);
        saveSetting('glucose', newGlucose);
    };

    const renderUnitsCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="scale-balance" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Measurement Units
                </Text>
            </View>

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Weight Unit
                    </Text>
                    <SegmentedButtons
                        value={weight}
                        style={{ marginBottom: 16 }}
                        onValueChange={handleWeightChange}
                        buttons={[
                            {
                                value: 'kg',
                                label: 'Kilograms',
                                icon: 'weight-kilogram'
                            },
                            {
                                value: 'lbs',
                                label: 'Pounds',
                                icon: 'weight-pound'
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Glucose Unit
                    </Text>
                    <SegmentedButtons
                        value={glucose}
                        onValueChange={handleGlucoseChange}
                        buttons={[
                            {
                                value: 'mmol',
                                label: 'mmol/L',
                                icon: 'test-tube'
                            },
                            {
                                value: 'mgdl',
                                label: 'mg/dL',
                                icon: 'test-tube'
                            },
                        ]}
                    />
                </View>
            </View>
        </Surface>
    );

    return (
        <View style={styles.content}>
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
    const theme = useTheme();
    const styles = customStyles(theme);
    const { signOut } = useAuth(appData.session);

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

    const renderActionsCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="cog" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Account Actions
                </Text>
            </View>

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
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
            </View>

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
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
                    </View>
                </View>
            </View>
        </Surface>
    );

    return (
        <View style={styles.content}>
            {renderActionsCard()}
        </View>
    );
}

