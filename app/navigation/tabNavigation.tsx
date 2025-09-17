import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import { AppData } from "../constants/interface/appData";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { CustomBottomTabBar } from "./components/bottomTabBar";

import { DiaryNavigation } from "./diaryNavigation";
import { TopBar } from "./components/topBar";
import { useAuth } from "../hooks/useAuth";

const tabNav = createBottomTabNavigator();

export function TabNavigation({ appData, setAppData }: { appData: AppData, setAppData: (data: AppData) => void }) {

    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // Create hooks
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);
    const authHook = useAuth(appData.session, false);







    // Get the right button icon based on current tab
    const getRightButtonIcon = useCallback((routeName: string) => {
        switch (routeName) {
            case 'Diary':
                return calendarHook.showCalendar ? "close" : "calendar-month";
            case 'Statistics':
                return "chart-box-outline";
            case 'Settings':
                return "cog-outline";
            default:
                return "calendar-month";
        }
    }, [calendarHook.showCalendar]);

    // Get the right button action based on current tab
    const getRightButtonAction = useCallback((routeName: string) => {
        switch (routeName) {
            case 'Diary':
                return () => {
                    console.log('📅 Calendar button pressed, current state:', calendarHook.showCalendar);
                    calendarHook.toggleCalendar();
                };
            case 'Statistics':
                return () => { }; // No action for statistics
            case 'Settings':
                return () => { }; // No action for settings
            default:
                return () => { };
        }
    }, [calendarHook]);

    // Memoized screen options to prevent re-renders
    const screenOptions = useMemo(() => ({ route }: any) => ({
        header: ({ options }: any) => (
            <TopBar
                showLogo={true}
                options={options}
                rightButton={{
                    icon: getRightButtonIcon(route.name),
                    onPress: getRightButtonAction(route.name),
                }}
            />
        ),
        tabBarIcon: ({ color }: any) => {
            switch (route.name) {
                case 'Diary':
                    return <Icon source="home" color={color} size={20} />;
                case 'Statistics':
                    return <Icon source="chart-line" color={color} size={20} />;
                case 'Settings':
                    return <Icon source="cog" color={color} size={20} />;
                default:
                    return null;
            }
        },
    }), [getRightButtonIcon, getRightButtonAction]);

    // Memoized tab bar to prevent re-renders
    const tabBarComponent = useCallback((props: any) => (
        <CustomBottomTabBar {...props} />
    ), []);





    return (
        <tabNav.Navigator
            initialRouteName="Diary"
            screenOptions={screenOptions}
            tabBar={tabBarComponent}
            >
            
            <tabNav.Screen
                name="Diary"
            >
                {(props) => (
                    <DiaryNavigation
                        {...props}
                        appData={appData}
                        dbHook={dbHook}
                        calendarHook={calendarHook}
                        cameraHook={cameraHook}
                    />

                )}

            </tabNav.Screen>

            <tabNav.Screen
                name="Statistics"
            >
                {(props) => (
                    <StatisticsScreen
                        {...props}
                        appData={appData}
                        calendarHook={calendarHook}
                        dbHook={dbHook}
                    />

                )}

            </tabNav.Screen>

            <tabNav.Screen
                name="Settings"
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
                        authHook={authHook}
                    />

                )}

            </tabNav.Screen>





        </tabNav.Navigator>
    );
}

