import { useState } from "react";
import { IconButton } from "react-native-paper";
import { AppData } from "../constants/interface/appData";
import { useAppTheme } from "../constants/UI/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from '@react-navigation/elements';
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { DiaryNavigation, CustomHeader } from "./diaryNav";
import { StatusBar, View } from "react-native";
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
                initialRouteName="Diary"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    headerStyle: {
                        backgroundColor: theme.colors.primary,

                    },
                    headerTintColor: theme.colors.onPrimary,
                }}
            >
                <rootNav.Screen
                    name="Diary"
                    options={{ 
                        headerShown: false,
                        
                    }}
                >
                    {(props) => (
                        <DiaryNavigation
                            {...props}
                            appData={appData}
                            calendarHook={calendarHook}
                            dbHook={dbHook}
                            cameraHook={cameraHook}
                            rootNavigation={props.navigation}
                        />
                    )}
                </rootNav.Screen>

                <rootNav.Screen
                    name="Statistics"
                    options={({navigation}) => ({ 
                        header: ({ options }) => (
                            <CustomHeader
                                options={options}
                                title='Statistics'
                                leftButton={{
                                    icon: "arrow-left",
                                    onPress: () => navigation.goBack(),
                                }}
                            />
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
                        header: ({ options }) => (
                            <CustomHeader
                                options={options}
                                title={getSettingsTitle()}
                                leftButton={{
                                    icon: "arrow-left",
                                    onPress: () => navigation.goBack(),
                                }}
                                rightButton={{
                                    icon: getSettingsIcon(),
                                    onPress: () => setSettingsEditMode(!settingsEditMode),
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