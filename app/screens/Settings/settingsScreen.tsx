import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Snackbar, Text } from "react-native-paper";
import { SettingsHeader } from "./components/SettingsHeader";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";
import { AppSettingsCard } from "./components/AppSettingsCard";
import { AccountActionsCard } from "./components/AccountActionsCard";

export function SettingsScreen({
    appData,
    setAppData,
    editMode,
    setEditMode,
    currentSection,
    setCurrentSection,
    authHook

}: {
    appData: AppData;
    setAppData: (data: AppData) => void;
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
    currentSection: 'profile' | 'preferences' | 'account';
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
    authHook: any;
}) {
    const { theme, styles } = useAppTheme();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    return (
        <View style={styles.background}>
            <SettingsHeader 
                editMode={editMode} 
                setEditMode={setEditMode} 
            />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <ProfileSettingsCard
                    appData={appData}
                    setShowSuccessMessage={setShowSuccessMessage}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    setCurrentSection={setCurrentSection}
                    authHook={authHook}
                />
                <AppSettingsCard

                    appData={appData}
                    setAppData={setAppData}
                    setCurrentSection={setCurrentSection}
                />
                <AccountActionsCard
                    authHook={authHook}
                    appData={appData}
                    setCurrentSection={setCurrentSection}
                />
                
                <View style={styles.container}>
                    <View style={styles.box}>
                        <View style={styles.footer}>
                            <Text variant="bodySmall" style={{
                                color: theme.colors.onSecondaryContainer,
                                textAlign: 'center',
                                flex: 1
                            }}>
                                Version 1.0.0 • Made with ❤️
                            </Text>
                        </View>
                    </View>
                </View>
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


