import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useCallback, useMemo } from "react";
import { Alert, View } from "react-native";
import { Icon } from "react-native-paper";
import { AppData } from "../constants/interface/appData";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { CustomBottomTabBar } from "./components/bottomTabBar";
import { TopBar } from "./components/topBar";
import { useAuth } from "../hooks/useAuth";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { DiaryData } from "../constants/interface/diaryData";

const tabNav = createBottomTabNavigator();

export function TabNavigation({ appData, setAppData }: { appData: AppData, setAppData: (data: AppData) => void }) {

    const [isSaving, setIsSaving] = useState(false);

    // Empty diary data for new entries
    const emptyDiaryData: DiaryData = {
        id: '',
        created_at: new Date(),
        glucose: 0,
        carbs: 0,
        insulin: 0,
        meal_type: 'snack',
        activity_level: 'none',
        note: '',
        uri_array: []
    };

    // Create hooks
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);
    const authHook = useAuth(appData.session, false);


    const handleSave = useCallback(async (editingEntryId?: string, providedFormData?: {
        glucose: string;
        carbs: string;
        insulin: string;
        note: string;
        activity: string;
        foodType: string;
    }) => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            // Use provided form data or fallback to dbHook state
            const formData = providedFormData || {
                glucose: dbHook.glucose,
                carbs: dbHook.carbs,
                insulin: dbHook.insulin || '0',
                note: dbHook.note || '',
                activity: dbHook.activity || 'none',
                foodType: dbHook.foodType || 'snack',
            };

            // Validate required fields
            const glucose = formData.glucose?.trim();
            const carbs = formData.carbs?.trim();

            if (!glucose || glucose === '' || parseFloat(glucose) <= 0) {
                Alert.alert('Validation Error', 'Please enter a valid glucose level');
                return;
            }

            if (!carbs || carbs === '' || parseFloat(carbs) < 0) {
                Alert.alert('Validation Error', 'Please enter carbs amount');
                return;
            }

            // Save photos locally if any
            const permanentURIs = cameraHook.photoURIs?.length > 0
                ? await Promise.all(
                    cameraHook.photoURIs.map((tempUri: string) =>
                        cameraHook.savePhotoLocally(tempUri)
                    )
                )
                : [];

            // Save or update entry
            if (editingEntryId) {
                console.log('📝 Updating entry:', editingEntryId);
                await dbHook.updateDiaryEntry(editingEntryId, formData, permanentURIs);
            } else {
                console.log('💾 Creating new entry');
                await dbHook.saveDiaryEntry(formData, permanentURIs);
            }

            // Clean up
            await cleanup();

        } catch (error) {
            console.error('❌ Error saving entry:', error);
            Alert.alert('Error', 'Failed to save entry. Please try again.');
        } finally {
            setIsSaving(false);
            // Navigation will be handled by InputScreen wrapper component
        }
    }, [isSaving, dbHook, cameraHook,]);

    const cleanup = useCallback(async () => {
        // Clear camera state
        if (cameraHook.showCamera) {
            cameraHook.toggleCamera();
        }
        cameraHook.clearPhotoURIs();

        // Clear form state (dbHook already clears this in saveDiaryEntry/updateDiaryEntry)
        // No need to manually clear since the hook handles it
    }, [cameraHook]);




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

    // Simple screen options without callbacks
    const screenOptions = {
        headerShown: false, // Let individual screens handle their own headers
        tabBarIcon: ({ color, route }: any) => {
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
    };

    // Memoized tab bar to prevent re-renders
    const tabBarComponent = useCallback((props: any) => {
        // Get the current route state to check if we're on camera screen
        const routeState = props.navigation.getState();
        const currentRoute = routeState.routes[routeState.index];

        // If we're in Diary tab, check if we're on DiaryCamera screen
        if (currentRoute.name === 'Diary' && currentRoute.state) {
            const diaryRoute = currentRoute.state.routes[currentRoute.state.index];
            if (diaryRoute.name === 'DiaryCamera') {
                return null; // Hide tab bar for camera screen
            }
        }

        return <CustomBottomTabBar {...props} />;
    }, []);





    return (
        <tabNav.Navigator
            initialRouteName="Diary"
            screenOptions={{
              
            }}
            
            tabBar={tabBarComponent}
        >

           

            <tabNav.Screen
                name="Diary"
            >
                {(props) => (
                    <DiaryScreen
                        {...props}
                        appData={appData}
                        dbHook={dbHook}
                        calendarHook={calendarHook}
                        cameraHook={cameraHook}
                    />
                )}
            </tabNav.Screen>

            <tabNav.Screen
                name="DiaryInput"
                options={{
                    tabBarButton: () => null,
                }}
            >
                {(props) => (
                    <InputScreen
                        {...props}
                        diaryData={emptyDiaryData}
                        appData={appData}
                        calendarHook={calendarHook}
                        cameraHook={cameraHook}
                        dbHook={dbHook}
                        onSave={handleSave}
                    />
                )}
            </tabNav.Screen>
            <tabNav.Screen
                name="DiaryCamera"
                options={{
                    tabBarButton: () => null,
                }}
            >
                {(props) => (
                    <CameraScreen
                        {...props}
                        cameraHook={cameraHook}
                        dbHook={dbHook}
                        appData={appData}
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
                options={{
                    animation: "fade"
                }}
            >
                {(props) => (
                    <SettingsScreen
                        {...props}
                        appData={appData}
                        setAppData={setAppData}
                        authHook={authHook}
                    />

                )}

            </tabNav.Screen>





        </tabNav.Navigator>
    );
}

