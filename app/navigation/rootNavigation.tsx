import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { StatusBar, View } from "react-native";
import { AppData } from "../constants/interface/appData";
import { useAppTheme } from "../constants/UI/theme";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { useNavigation } from "../hooks/useNavigation";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { TopBar } from "./components/topBar";
import { DiaryNavigation } from "./diaryNavigation";

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
    const navHook = useNavigation();



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
                            
                        />
                    )}
                </rootNav.Screen>

                <rootNav.Screen
                    name="Statistics"
                    options={({ navigation }) => ({
                        header: ({ options }) => (
                            <TopBar
                                showLogo={true}
                                options={options}
                                leftButton={{
                                    icon: "chevron-left",
                                    onPress: () => {
                                        navHook.goBack();
                                    },
                                }}
                            />

                        ),

                    })}
                >
                    {(props) => (
                        <StatisticsScreen
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
                            <TopBar
                                showLogo={true}
                                options={options}
                                leftButton={{
                                    icon: "chevron-left",
                                    onPress: () => {
                                        navHook.goBack();
                                    },
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
                            authHook={navHook}
                        />
                    )}
                </rootNav.Screen>
            </rootNav.Navigator>
        </View>
    );
}