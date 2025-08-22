import { useState } from "react";
import { Icon, IconButton } from "react-native-paper";
import { AppData } from "../constants/interface/appData";
import { useAppTheme } from "../constants/UI/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { DiaryNavigation } from "./diaryNav";
import { SafeAreaView, StatusBar, View } from "react-native";
import StatNav from "../screens/Statistics/statNav";

export const rootNav = createNativeStackNavigator();


export function RootNavigation({
    appData,
    setAppData
}: {
    appData: AppData,
    setAppData: (data: AppData) => void
}) {
    const { theme, styles } = useAppTheme();

    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // SINGLE SOURCE OF TRUTH - Only create hooks here
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);

    // Settings helper functions
    const getSettingsTitle = () => {
        switch (settingsSection) {
            case 'profile': return 'Profile';
            case 'preferences': return 'Preferences';
            case 'account': return 'Account';
            default: return 'Settings';
        }
    };

    const getSettingsIcon = () => {
        switch (settingsSection) {
            case 'profile': return 'account-circle';
            case 'preferences': return 'tune';
            case 'account': return 'account-cog';
            default: return 'cog';
        }
    };

    return (
        <View style={styles.background}>
            <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
            <rootNav.Navigator
                initialRouteName="Statistics"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    
                }}
            >
                <rootNav.Screen
                    name="Diary"
                    options={{ 
                        headerShown: true,
                        
                    }}
                >
                    {(props) => (
                        <DiaryNavigation
                            {...props}
                            appData={appData}
                            calendarHook={calendarHook}
                            dbHook={dbHook}
                            cameraHook={cameraHook}
                        />
                    )}
                </rootNav.Screen>

                <rootNav.Screen
                    name="Statistics"
                    options={({navigation}) => ({ 
                        headerShown: true,
                        title: 'Statistics',
                        headerStyle: { backgroundColor: theme.colors.primary },
                        headerLeft: () => (
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon="arrow-left"
                                mode="contained-tonal"
                                onPress={() => navigation.goBack()}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                        ),
                        headerRight: () => (
                            <View style={styles.row}>
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon="cog"
                                mode="contained-tonal"
                                onPress={() => navigation.navigate('Settings')}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon="cog"
                                mode="contained-tonal"
                                onPress={() => navigation.navigate('Diary')}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                            </View>
                            
                        ),
                    })}
                >
                    {(props) => (
                        <StatNav
                            {...props}
                            appData={appData}
                            calendarHook={calendarHook}
                            dbHook={dbHook}
                            
                        />
                    )}
                </rootNav.Screen>

                <rootNav.Screen
                    name="Settings"
                    options={({ navigation }) => ({
                        headerShown: true,
                        title: getSettingsTitle(),
                        headerStyle: { backgroundColor: theme.colors.primary },
                        headerTintColor: theme.colors.onPrimary,
                        headerTitleStyle: { fontWeight: 'bold' },
                        headerLeft: () => (
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon="arrow-left"
                                mode="contained-tonal"
                                onPress={() => navigation.goBack()}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                        ),
                        headerRight: () => (
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon={getSettingsIcon()}
                                mode="contained-tonal"
                                onPress={() => setSettingsEditMode(!settingsEditMode)}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                        ),
                    })}
                >
                    {(props) => (
                        <SettingsScreen
                            {...props}
                            appData={appData}
                            editMode={settingsEditMode}
                            setEditMode={setSettingsEditMode}
                            currentSection={settingsSection}
                            setCurrentSection={setSettingsSection}
                            setAppData={setAppData}
                        />
                    )}
                </rootNav.Screen>
            </rootNav.Navigator>
        </View>
    );
}