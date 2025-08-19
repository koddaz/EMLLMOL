import { useMemo, useState } from "react";
import { Appbar } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppData } from "../constants/interface/appData";
import { useAppTheme } from "../constants/UI/theme";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DiaryData } from "../constants/interface/diaryData";
import { useCalendar } from "../hooks/useCalendar";
import { DiaryScreen } from "../screens/Diary/diaryScreen";

import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { View } from "react-native";


const Stack = createNativeStackNavigator();

export function RootNavigation({ appData, setAppData }: { appData: AppData, setAppData: (data: AppData) => void }) {
    const { theme, styles } = useAppTheme();

    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // SINGLE SOURCE OF TRUTH - Only create dbHook here
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);

    const DiaryRoute = () => (
        
        <DiaryScreen
            appData={appData}
            calendarHook={calendarHook}
            dbHook={dbHook}
            cameraHook={cameraHook}
        />

    );

   
    const SettingsRoute = () => (
        <SettingsScreen
            appData={appData}
            editMode={settingsEditMode}
            setEditMode={setSettingsEditMode}
            currentSection={settingsSection}
            setCurrentSection={setSettingsSection}
            setAppData={setAppData}
        />
    );


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
            <Stack.Navigator>
                <Stack.Screen
                    name="Diary"
                    component={DiaryRoute}
                    options={{
                        header: ({ navigation }) => (
                            <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
                                <Appbar.Content title="Diary" />
                                <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
                                    
                            </Appbar.Header>
                        ),
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsRoute}
                    options={{
                        title: getSettingsTitle(),
                        headerStyle: { backgroundColor: theme.colors.primary, },
                        headerTintColor: theme.colors.onPrimary,
                        headerRight: () => (
                            <Appbar.Action icon={getSettingsIcon()} onPress={() => setSettingsEditMode(!settingsEditMode)} />
                        ),
                    }}
                />
            </Stack.Navigator>
        </View>
    );
}