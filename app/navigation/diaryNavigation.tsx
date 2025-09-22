import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";
import { Alert, View } from "react-native";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { useCallback, useState, useEffect } from "react";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { useDB } from "../hooks/useDB";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useAuth } from "../hooks/useAuth";
import { BottomNavigation, Icon } from "react-native-paper";
import { TopBar } from "./components/topBar";

const diaryNav = createNativeStackNavigator();

export function DiaryNavigation({
  appData,
  setAppData
}: {
  appData: AppData,
  setAppData: (data: AppData) => void
}) {
  const { theme } = useAppTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [currentNavigation, setCurrentNavigation] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState('Diary');

  const dbHook = useDB(appData);
  const calendarHook = useCalendar(appData);
  const cameraHook = useCamera(appData);
  const authHook = useAuth(appData.session, false);

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

  // Get the right button icon based on current screen
  const getRightButtonIcon = useCallback((routeName: string) => {
    switch (routeName) {
      case 'Diary':
        return calendarHook.showCalendar ? "close" : "calendar-month";
      case 'Statistics':
        return "chart-box-outline";
      case 'Settings':
        return "cog-outline";
      case 'DiaryInput':
        return "check";
      case 'DiaryCamera':
        return null; // No button for camera
      default:
        return "calendar-month";
    }
  }, [calendarHook.showCalendar]);

  // Get the right button action based on current screen
  const getRightButtonAction = useCallback((routeName: string, navigation: any) => {
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
      case 'DiaryInput':
        return () => {
          // This should trigger the save function
          console.log('Save button pressed');
        };
      case 'DiaryCamera':
        return () => { }; // No action for camera
      default:
        return () => { };
    }
  }, [calendarHook]);



  // Bottom navigation overlay component
  const BottomNavigationOverlay = useCallback(() => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
      { key: 'statistics', title: 'Statistics', focusedIcon: 'chart-line', unfocusedIcon: 'chart-line-variant' },
      { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
    ]);

    const handleIndexChange = useCallback((newIndex: number) => {
      setIndex(newIndex);
      if (!currentNavigation) return;

      switch (newIndex) {
        case 0:
          currentNavigation.navigate('Diary');
          break;
        case 1:
          currentNavigation.navigate('Statistics');
          break;
        case 2:
          currentNavigation.navigate('Settings');
          break;
      }
    }, [currentNavigation]);

    return (
      <BottomNavigation.Bar
          navigationState={{ index, routes }}
          safeAreaInsets={{ bottom: 0 }}
          onTabPress={({ route }) => {
            const routeIndex = routes.findIndex(r => r.key === route.key);
            handleIndexChange(routeIndex);
          }}
          renderIcon={({ route, focused, color }) => {
            const routeData = routes.find(r => r.key === route.key);
            const iconName = focused ? routeData?.focusedIcon : routeData?.unfocusedIcon || routeData?.focusedIcon;
            return iconName ? <Icon source={iconName} size={20} color={color} /> : null;
          }}
          getLabelText={({ route }) => {
            const routeData = routes.find(r => r.key === route.key);
            return routeData?.title || '';
          }}
          style={{
            backgroundColor: theme.colors.surface,
            elevation: 8,
          }}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.onSurface}
          labeled={false}
          shifting={false}
        />
    );
  }, [theme]);

  // Screen wrapper components to handle navigation and route tracking
  const DiaryScreenWrapper = (props: any) => {
    useEffect(() => {
      setCurrentNavigation(props.navigation);
      setCurrentRoute('Diary');
    }, [props.navigation]);

    return (
      <DiaryScreen
        {...props}
        appData={appData}
        dbHook={dbHook}
        calendarHook={calendarHook}
        cameraHook={cameraHook}
      />
    );
  };

  const CameraScreenWrapper = (props: any) => {
    useEffect(() => {
      setCurrentNavigation(props.navigation);
      setCurrentRoute('DiaryCamera');
    }, [props.navigation]);

    return (
      <CameraScreen
        {...props}
        cameraHook={cameraHook}
        dbHook={dbHook}
        appData={appData}
      />
    );
  };

  const InputScreenWrapper = (props: any) => {
    useEffect(() => {
      setCurrentNavigation(props.navigation);
      setCurrentRoute('DiaryInput');
    }, [props.navigation]);

    return (
      <InputScreen
        {...props}
        diaryData={emptyDiaryData}
        appData={appData}
        calendarHook={calendarHook}
        cameraHook={cameraHook}
        dbHook={dbHook}
        onSave={handleSave}
      />
    );
  };

  const StatisticsScreenWrapper = (props: any) => {
    useEffect(() => {
      setCurrentNavigation(props.navigation);
      setCurrentRoute('Statistics');
    }, [props.navigation]);

    return (
      <StatisticsScreen
        {...props}
        navigation={props.navigation}
        appData={appData}
        calendarHook={calendarHook}
        dbHook={dbHook}
      />
    );
  };

  const SettingsScreenWrapper = (props: any) => {
    useEffect(() => {
      setCurrentNavigation(props.navigation);
      setCurrentRoute('Settings');
    }, [props.navigation]);

    return (
      <SettingsScreen
        {...props}
        appData={appData}
        setAppData={setAppData}
        authHook={authHook}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Static TopBar - stays in place during navigation */}
      {currentRoute !== 'DiaryCamera' && (
        <TopBar
          showLogo={currentRoute === 'Diary'}
          options={{}}
          rightButton={getRightButtonIcon(currentRoute) ? {
            icon: getRightButtonIcon(currentRoute),
            onPress: getRightButtonAction(currentRoute, currentNavigation),
          } : undefined}
          leftButton={currentRoute !== 'Diary' && currentRoute !== 'Statistics' && currentRoute !== 'Settings' ? {
            icon: "arrow-left",
            onPress: () => currentNavigation?.goBack(),
          } : undefined}
        />
      )}

      <diaryNav.Navigator
        initialRouteName="Diary"
        screenOptions={{
          animation: 'fade_from_bottom',
          headerShown: false, // No header since we have static TopBar
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <diaryNav.Screen
          name="Diary"
          component={DiaryScreenWrapper}
        />

        <diaryNav.Screen
          name="DiaryCamera"
          component={CameraScreenWrapper}
          options={{
            animation: 'none',
            presentation: 'fullScreenModal',
          }}
        />

        <diaryNav.Screen
          name="DiaryInput"
          component={InputScreenWrapper}
          options={{
            animation: 'slide_from_left',
          }}
        />

        <diaryNav.Screen
          name="Statistics"
          component={StatisticsScreenWrapper}
          options={{
            animation: "slide_from_left"
          }}
        />

        <diaryNav.Screen
          name="Settings"
          component={SettingsScreenWrapper}
          options={{
            animation: "slide_from_left"
          }}
        />
      </diaryNav.Navigator>

      {/* Bottom Navigation - Always Visible */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <BottomNavigationOverlay />
      </View>
    </View>
  );
}