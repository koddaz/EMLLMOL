import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, SegmentedButtons, Snackbar, Text } from "react-native-paper";
import { ProfileSettingsCard } from "./components/ProfileSettingsCard";
import { AppSettingsCard } from "./components/AppSettingsCard";
import { AccountActionsCard } from "./components/AccountActionsCard";
import { SettingsTopContainer } from "@/app/components/topContainer";



export function Card() {

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>

        </View>
    );
}


export function SettingsScreen({
    appData,
    setAppData,
    authHook
}: {
    appData: AppData;
    setAppData: (data: AppData) => void;
    authHook: any;
}) {
    const { theme, styles } = useAppTheme();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentSection, setCurrentSection] = useState<'profile' | 'preferences' | 'account'>('profile');


    return (
        <View style={styles.background}>
            <SettingsTopContainer
                content={
                    <SegmentedButtons
                        value={currentSection}
                        onValueChange={setCurrentSection}
                        density="small"
                        buttons={[
                            {
                                value: 'profile',
                                label: 'Profile',
                                icon: "account",
                                checkedColor: theme.colors.secondary,
                                uncheckedColor: theme.colors.primary,
                                style: { borderRadius: 0, borderBottomWidth: 0, borderLeftWidth: 0 }
                            },
                            {
                                value: 'preferences',
                                label: 'Settings',
                                icon: "cog",
                                checkedColor: theme.colors.secondary,
                                uncheckedColor: theme.colors.primary,
                                style: { borderRadius: 0, borderBottomWidth: 0, borderRightWidth: 0 }
                            },

                        ]}
                    />
                }
            //editMode={false} 
            // setEditMode={setEditMode} 
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
                            appData={appData}
                        />
                    </>

                ) : (
                    <AppSettingsCard

                        appData={appData}
                        setAppData={setAppData}
                        setCurrentSection={setCurrentSection}
                    />
                )}




                <View style={[styles.box, { borderTopWidth: 0 }]}>
                    <View style={styles.footer}>
                        <Text variant="bodySmall" style={{
                            color: theme.colors.onSecondaryContainer,
                            textAlign: 'right',
                            flex: 1
                        }}>
                            Version 1.0.0 • Made with ❤️
                        </Text>
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


