import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Divider, SegmentedButtons, Snackbar, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";
import { AppSettingsCard } from "./components/AppSettingsCard";
import { AccountActionsCard } from "./components/AccountActionsCard";
import { SettingsTopContainer } from "@/app/components/topContainer";






export function SettingsScreen({
    appData,
    setAppData,
    authHook,
    tabNav
}: {
    appData: AppData
    setAppData: (data: AppData) => void
    authHook: any
    tabNav: any
}) {
    const { theme, styles } = useAppTheme();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSection, setCurrentSectionState] = useState<'profile' | 'settings'>('profile')
    


    const saveAndLoadSetting = async (
        key: string,
        newValue: string,
        setValue: (v: string) => void
    ) => {
        try {
            await AsyncStorage.setItem(key, newValue);
            console.log(`Saved ${key}: ${newValue}`);
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

    return (
        <View style={styles.background}>
            
            <SegmentedButtons
                        value={currentSection}
                        onValueChange={setCurrentSectionState}
                        density="small"
                        buttons={[
                            {
                                value: 'profile',
                                label: 'Profile',
                                icon: "account",
                                checkedColor: theme.colors.onSurfaceDisabled,
                                uncheckedColor: theme.colors.primary,
                                style: { 
                                    borderTopWidth: 0,
                                    borderRadius: 0, 
                                    borderBottomWidth: 0, 
                                    borderLeftWidth: 0,
                                    backgroundColor: currentSection === 'profile' ? theme.colors.surfaceDisabled : theme.colors.surface,
                                    elevation: currentSection === 'profile' ? 0 : 4
                                }
                            },
                            {
                                value: 'settings',
                                label: 'Settings',
                                icon: "cog",
                                checkedColor: theme.colors.onSurfaceDisabled,
                                uncheckedColor: theme.colors.primary,
                                style: {
                                    borderTopWidth: 0,
                                    borderRadius: 0, 
                                    borderBottomWidth: 0, 
                                    borderRightWidth: 0,
                                    backgroundColor: currentSection === 'settings' ? theme.colors.surfaceDisabled : theme.colors.surface,
                                    elevation: currentSection === 'settings' ? 0 : 4
                                }
                            },

                        ]}
                    />
            <Divider style={{ marginTop: 2, marginBottom: 8, marginHorizontal: 8 }} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >



                {currentSection === 'profile' ? (
                    <>
                        <ProfileSettingsCard
                            appData={appData}
                            setShowSuccessMessage={setShowSuccessMessage}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            authHook={authHook}
                        />
                        <AccountActionsCard
                            authHook={authHook}
                          
                        />
                    </>

                ) : (
                    <AppSettingsCard
                        appData={appData}
                        handleSettingChange={handleSettingChange}
                    />
                )}





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


