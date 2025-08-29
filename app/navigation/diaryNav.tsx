import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { IconButton } from "react-native-paper";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { View } from "react-native";
import { AICameraScreen } from "../screens/Camera/aiCameraScreen";

const diaryNav = createNativeStackNavigator();

export function DiaryNavigation({
  appData,
  cameraHook,
  dbHook,
  calendarHook,
  navigation: rootNavigation // Get root navigation from props
}: {
  appData: AppData,
  cameraHook: any,
  dbHook: any,
  calendarHook: any,
  navigation?: any, // Make optional since it comes from the navigator
}) {
  const { theme, styles } = useAppTheme();

  // Create diary state object
  const diaryState = {
    glucose: dbHook.glucose,
    setGlucose: dbHook.setGlucose,
    carbs: dbHook.carbs,
    setCarbs: dbHook.setCarbs,
    note: dbHook.note,
    setNote: dbHook.setNote,
    activity: dbHook.activity,
    setActivity: dbHook.setActivity,
    foodType: dbHook.foodType,
    setFoodType: dbHook.setFoodType,
    foodOptions: dbHook.foodOptions,
    activityOptions: dbHook.activityOptions
  };

  return (
    <diaryNav.Navigator
      initialRouteName="MainDiary"
      screenOptions={{
        animation: 'fade_from_bottom',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerBackButtonMenuEnabled: false,
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: theme.colors.background },

      }}
    >
      <diaryNav.Screen
        name="MainDiary"
        options={({ navigation: diaryNavigation }) => ({
          headerLeft: () => null,
          headerRight: () => (
            <View style={styles.row}>
              <IconButton
                iconColor={theme.colors.onSecondary}
                size={28}
                icon={calendarHook.showCalendar ? "close" : "calendar-month"}
                mode="contained-tonal"
                onPress={() => {
                  calendarHook.toggleCalendar();
                }}
                style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 12,
                }}
              />
              <IconButton
                iconColor={theme.colors.onSecondary}
                size={28}
                icon={"chart-line"}
                mode="contained-tonal"
                onPress={() => {
                  rootNavigation.navigate('Statistics');
                }}
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
                onPress={() => {
                  // Navigate to Settings in the root navigator
                  if (rootNavigation) {
                    rootNavigation.navigate('Settings');
                  } else {
                    // Fallback: get parent navigator
                    const parentNav = diaryNavigation.getParent();
                    if (parentNav) {
                      parentNav.navigate('Settings');
                    }
                  }
                }}
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
          <DiaryScreen
            {...props}
            appData={appData}
            dbHook={dbHook}
            calendarHook={calendarHook}
            cameraHook={cameraHook}
          />
        )}
      </diaryNav.Screen>


      <diaryNav.Screen
        name="DiaryCamera"
        options={({ navigation: diaryNavigation }) => ({
          headerShown: false,
          animation: 'none',
          headerStyle: { backgroundColor: theme.colors.primary },
        })}
      >
        {(props) => (
          <AICameraScreen
            {...props}
            cameraHook={cameraHook}
            dbHook={dbHook}
            appData={appData}
          />

        )}
      </diaryNav.Screen>

      <diaryNav.Screen
        name="DiaryInput"
        options={({ navigation }) => ({
          animation: 'slide_from_left',
          headerLeft: () => (
            <IconButton
              iconColor={theme.colors.onSecondary}
              size={28}
              icon="chevron-left"
              mode="contained-tonal"
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: theme.colors.secondary,
                borderRadius: 12,
              }}
            />

          ),
        })}
      >
        {(props) => (
          <InputScreen
            {...props}
            appData={appData}
            calendarHook={calendarHook}
            cameraHook={cameraHook}
            dbHook={dbHook}
            diaryState={diaryState}
          />
        )}
      </diaryNav.Screen>
    </diaryNav.Navigator>
  );
}

