import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

interface AccountActionsCardProps {
    appData: AppData;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
    authHook: any;
}

export function AccountActionsCard({
    appData,
    setCurrentSection,
    authHook
}: AccountActionsCardProps) {
    const { theme, styles } = useAppTheme();
    

    useEffect(() => {
        setCurrentSection('account');
    }, []);

    const handleSignOut = async () => {
        try {
            await authHook.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleRemoveAccount = async () => {
        try {
            await authHook.removeProfile();
            console.log('Profile removed successfully');
        } catch (error) {
            console.error('Error removing profile:', error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="cog" size={20} color={theme.colors.onSecondaryContainer} />
                    <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                        Account Actions
                    </Text>
                </View>
                <View style={styles.content}>
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
                <View style={styles.footer}></View>
            </View>
        </View>
    );
}