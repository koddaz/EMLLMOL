import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Divider, IconButton, Text, TextInput } from "react-native-paper";

interface ProfileSettingsCardProps {
    appData: AppData;
    setShowSuccessMessage: (value: boolean) => void;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    authHook: any;
}

export function ProfileSettingsCard({
    appData,
    setShowSuccessMessage,
    editMode,
    setEditMode,
    authHook
}: ProfileSettingsCardProps) {
    const { theme, styles } = useAppTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [username, setUsername] = useState(appData?.profile?.username || '');
    const [fullName, setFullName] = useState(appData?.profile?.fullName || '');
    const [avatarUrl, setAvatarUrl] = useState(appData?.profile?.avatarUrl || '');


    const handleUpdateProfile = async () => {
        if (!username || !fullName) return;

        try {
            setIsLoading(true);
            setError(null);
            await authHook.updateProfile(username, fullName, avatarUrl);
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

    useEffect(() => {
        if (editMode && isLoading) {
            handleUpdateProfile();
        }
    }, [editMode]);

    return (
        <View style={styles.box}>
            {error && (
                <View style={[styles.box, { backgroundColor: theme.colors.errorContainer, borderWidth: 0 }]}>
                    <View style={[styles.content, { backgroundColor: theme.colors.errorContainer }]}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                            {error}
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.header}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                
                <View style={styles.chip}>
                <MaterialCommunityIcons name="account-details" size={20} color={theme.colors.onSecondary} />
                </View>
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Profile
                </Text>
                </View>

                
                <IconButton
                    icon="pencil"
                    size={20}
                    iconColor={theme.colors.onSecondaryContainer}
                    style={{ margin: 0 }}
                    onPress={() => setEditMode(!editMode)}
                />
                
            </View>
            <Divider style={{marginHorizontal: 4}} />
            <View style={styles.content}>
                <TextInput
                    mode="outlined"
                    value={appData?.session?.user.email || ''}
                    label="Email"
                    disabled
                    left={<TextInput.Icon icon="email" />}
                    style={[styles.textInput, { marginBottom: 8 }]}
                    dense
                />
                <TextInput
                    mode="outlined"
                    value={username}
                    onChangeText={setUsername}
                    label="Username"
                    editable={editMode}
                    left={<TextInput.Icon icon="account" />}
                    style={[styles.textInput, { marginBottom: 8 }]}
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


            </View>
            {editMode && (
                <View style={styles.row}>
                    <Button
                        mode="outlined"
                        onPress={() => setEditMode(false)}
                        style={[styles.chip, { flex: 1, marginRight: 4 }]}
                        icon="close"
                        compact
                    >
                        Cancel
                    </Button>
                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        style={[styles.chip, { flex: 2, marginLeft: 4 }]}
                        icon="content-save"
                        loading={isLoading}
                        disabled={!username || !fullName}
                        compact
                    >
                        Save Changes
                    </Button>
                </View>
            )}
        </View>
    );
}