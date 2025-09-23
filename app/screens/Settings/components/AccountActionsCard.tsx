import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

interface AccountActionsCardProps {
    authHook: any;
}

export function AccountActionsCard({
    authHook
}: AccountActionsCardProps) {
    const { theme, styles } = useAppTheme();



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

        <View style={styles.box}>
            <View style={styles.header}>
                <View style={styles.chip}>
                    <MaterialCommunityIcons name="cog" size={20} color={theme.colors.onSecondary} />
                </View>
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Account
                </Text>
                
            </View>
            <Divider style={{marginHorizontal: 4}} />
            <View style={styles.content}>




                <View style={styles.chipContainer}>
                    <View style={{ flex: 1, gap: 4 }}>
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

                        <Button
                            mode="contained"
                            onPress={handleRemoveAccount}
                            style={[styles.chip, { backgroundColor: theme.colors.error }]}
                            labelStyle={{ color: theme.colors.onError }}
                            icon="logout"
                            compact
                        >
                            Change Password
                        </Button>

                        <Button
                            mode="contained"
                            onPress={handleRemoveAccount}
                            style={[styles.chip, { backgroundColor: theme.colors.error }]}
                            labelStyle={{ color: theme.colors.onError }}
                            icon="logout"
                            compact
                        >
                            Change E-mail
                        </Button>
                    </View>
                </View>
            </View>
            <View style={[styles.footer, { borderBottomWidth: 0 }]}></View>
        </View>

    );
}