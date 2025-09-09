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

const Tab = createBottomTabNavigator();

export function TabNavigation({ appData, setAppData }: { appData: AppData, setAppData: (data: AppData) => void }) {

    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // Create hooks
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);
    const authHook = useAuth(appData.session, false);
   

    // Memoized component functions to prevent re-renders
    const Diary = useCallback(() => (
        <DiaryNavigation
            appData={appData}
            dbHook={dbHook}
            calendarHook={calendarHook}
            cameraHook={cameraHook}
        />
    ), [appData, dbHook, calendarHook, cameraHook]);

    const Settings = useCallback(() => (
        <SettingsScreen
            appData={appData}
            editMode={settingsEditMode}
            setEditMode={setSettingsEditMode}
            currentSection={settingsSection}
            setCurrentSection={setSettingsSection}
            setAppData={setAppData}
            authHook={authHook}
        />
    ), [appData, settingsEditMode, settingsSection, setAppData, authHook]);

    const Statistics = useCallback((props: any) => (
        <StatisticsScreen
            {...props}
            appData={appData}
            calendarHook={calendarHook}
            dbHook={dbHook}
        />
    ), [appData, calendarHook, dbHook]);

    // Get the right button icon based on current tab
    const getRightButtonIcon = useCallback((routeName: string) => {
        switch (routeName) {
            case 'Home':
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
            case 'Home':
                return () => calendarHook.toggleCalendar();
            case 'Statistics':
                return () => {}; // No action for statistics
            case 'Settings':
                return () => {}; // No action for settings
            default:
                return () => {};
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
    }), [getRightButtonIcon, getRightButtonAction]);

    // Memoized tab bar to prevent re-renders
    const tabBarComponent = useCallback((props: any) => (
        <CustomBottomTabBar {...props} />
    ), []);

    // Memoized screen options for each tab
    const homeOptions = useMemo(() => ({
        tabBarIcon: ({ color }: any) => (
            <Icon source="home" color={color} size={26} />
        ),
    }), []);

    const statisticsOptions = useMemo(() => ({
        tabBarIcon: ({ color }: any) => (
            <Icon source="chart-line" color={color} size={26} />
        ),
    }), []);

    const settingsOptions = useMemo(() => ({
        tabBarIcon: ({ color }: any) => (
            <Icon source="cog" color={color} size={26} />
        ),
    }), []);

    return (
        <Tab.Navigator
            screenOptions={screenOptions}
            tabBar={tabBarComponent}>
            <Tab.Screen
                name="Home"
                component={Diary}
                options={homeOptions}
            />
            <Tab.Screen
                name="Statistics"
                component={Statistics}
                options={statisticsOptions}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={settingsOptions}
            />
        </Tab.Navigator>
    );
}

