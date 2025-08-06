import { LoadingScreen } from "@/app/components/loadingScreen";
import { AppData } from "@/app/constants/interface/appData";
import { customStyles } from "@/app/constants/UI/styles";
import { useAuth } from "@/db/supabase/auth/authScreen";
import { supabase } from "@/db/supabase/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, SegmentedButtons, Snackbar, Surface, Text, TextInput, useTheme } from "react-native-paper";

export function SettingsScreen({ appData }: { appData: AppData }) {
    const theme = useTheme();
    const styles = customStyles(theme);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    return (
        <View style={styles.background}>
            <ProfileSettings appData={appData} setShowSuccessMessage={setShowSuccessMessage} />
            <AsyncSettings appData={appData} />
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
    setShowSuccessMessage
}: {
    appData: AppData;
    setShowSuccessMessage: (value: boolean) => void;
}) {
    const theme = useTheme();
    const styles = customStyles(theme);
    const [edit, setEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { updateProfile } = useAuth(appData.session);

    const [username, setUsername] = useState(appData?.profile?.username || '');
    const [fullName, setFullName] = useState(appData?.profile?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(appData?.profile?.avatarUrl || '');

    const handleUpdateProfile = async () => {
        if (!username || !fullName) return;

        try {
            setIsLoading(true);
            setError(null);
            await updateProfile(username, fullName, avatarUrl);
            setEdit(false);
            setShowSuccessMessage(true);
            console.log('Profile updated successfully');

        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* ERROR CONTAINER */}
            <Surface style={styles.errorcontainer} elevation={4}>
                {error && (
                    <Text style={{ color: theme.colors.error, marginBottom: 16, textAlign: 'center' }}>
                        {error}
                    </Text>
                )}
            </Surface>

            <Surface style={styles.container} elevation={4}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <MaterialCommunityIcons name="account" size={40} color={theme.colors.primary} />
                        <Text style={theme.fonts.titleLarge}> Profile </Text>
                    </View>
                    <IconButton
                        icon={edit ? "check" : "pencil"}
                        size={24}
                        onPress={() => {
                            if (edit) {
                                handleUpdateProfile();
                            }
                            setEdit(!edit);
                        }}
                        style={{ marginLeft: 'auto' }}
                        disabled={isLoading}
                    />
                </View>




                {/* PROFILE SETTINGS */}
                <View style={[styles.plaincontainer, { paddingHorizontal: 16}]}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        value={appData?.session?.user.email || ''}
                        label="Email"
                        mode="outlined"
                        left={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        style={styles.textInput}
                        editable={edit}
                        onChangeText={setUsername}
                        value={username || ''}
                        label="Username"
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        style={styles.textInput}
                        editable={edit}
                        onChangeText={setFullName}
                        value={fullName || ''}
                        label="Full Name"
                        mode="outlined"
                        left={<TextInput.Icon icon="account-details" />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        loading={isLoading}
                        style={{ marginTop: 16 }}
                    >
                        Update Profile
                    </Button>
                </View>
            </Surface>
        </>
    );
}

export function AsyncSettings({ appData }: { appData: AppData }) {
    const theme = useTheme();
    const styles = customStyles(theme);

    const [weight, setWeight] = useState(appData.settings.weight);
    const [glucose, setGlucose] = useState(appData.settings.glucose);

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

    return (
         <Surface style={styles.container}>
            <View style={styles.row}>
                <MaterialCommunityIcons name="cog" size={40} color={theme.colors.primary} />
                <Text style={theme.fonts.titleLarge}> Settings </Text>
            </View>
            
            <View style={[styles.plaincontainer, { marginTop: 16, paddingHorizontal: 16 }]}>
                {/* Weight Settings Section */}
                <View style={[styles.row, { marginBottom: 8 }]}>
                    <MaterialCommunityIcons name="weight" size={24} color={theme.colors.primary} />
                    <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>Weight Unit</Text>
                </View>
                <SegmentedButtons
                    value={weight}
                    style={{ marginBottom: 16 }}
                    onValueChange={handleWeightChange}
                    buttons={[
                        {
                            value: 'kg',
                            label: 'kg',
                        },
                        {
                            value: 'lbs',
                            label: 'lbs',
                        },
                    ]}
                />

                {/* Glucose Settings Section */}
                <View style={[styles.row, { marginBottom: 8 }]}>
                    <MaterialCommunityIcons name="blood-bag" size={24} color={theme.colors.primary} />
                    <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>Glucose Unit</Text>
                </View>
                <SegmentedButtons
                    value={glucose}
                    onValueChange={handleGlucoseChange}
                    buttons={[
                        {
                            value: 'mmol',
                            label: 'mmol/L',
                        },
                        {
                            value: 'mgdl',
                            label: 'mg/dL',
                        },
                    ]}
                />
            </View>
        </Surface>
    );
}

/* 
Supabase user settings 
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,

Async settings:
    weight unit kg/lbs
    glucose unit mg/dL or mmol/L
    
*/