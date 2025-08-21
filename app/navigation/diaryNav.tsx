import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { IconButton } from "react-native-paper";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { DiaryInput } from "../screens/Diary/Input/diaryInput";
import { View } from "react-native";

const diaryNav = createNativeStackNavigator();


export function DiaryNavigation(
  { appData, cameraHook, dbHook, calendarHook }: {
    appData: AppData,
    cameraHook: any,
    dbHook: any,
    calendarHook: any,

  }
) {

  const { theme, styles } = useAppTheme();

  const navigation = useNavigation();

  const diaryState = {
    glucose: dbHook.glucose,
    setGlucose: dbHook.setGlucose,
    carbs: dbHook.carbs,
    setCarbs: dbHook.setCarbs,
    note: dbHook.note, setNote: dbHook.setNote,
    activity: dbHook.activity, setActivity: dbHook.setActivity,
    foodType: dbHook.foodType, setFoodType: dbHook.setFoodType,
    foodOptions: dbHook.foodOptions,
    activityOptions: dbHook.activityOptions
  };


  return (
    <diaryNav.Navigator

      initialRouteName={'MainDiary'}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary, },
        headerBackButtonMenuEnabled: false,
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'fade_from_bottom',
      }}
    >
      <diaryNav.Screen
        name="MainDiary"
        options={{

          headerLeft: () => null,
          headerRight: () => (
            <IconButton
              iconColor={theme.colors.onSecondary}
              size={28}
              icon="cog"
              mode="contained-tonal"
              onPress={() => navigation.navigate('Settings', { screen: 'Settings' })}
              style={{
                backgroundColor: theme.colors.secondary,
                borderRadius: 12,
              }}
            />
          ),


        }}
      >{(props) => (
        <DiaryScreen {...props}
          appData={appData}
          dbHook={dbHook}
          calendarHook={calendarHook}
          cameraHook={cameraHook}
          navigation={navigation}
        />
      )}
      </diaryNav.Screen>

      <diaryNav.Screen
        name="DiaryCamera"
        options={{
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          contentStyle: { backgroundColor: 'transparent' },
          headerTintColor: theme.colors.onPrimary,
          headerTitle: '',
          headerLeft: () => (
            <IconButton
              iconColor={theme.colors.onSecondary}
              size={28}
              icon="close"
              mode="contained-tonal"
              onPress={() => {
                navigation.goBack()
                console.log('Camera closed');
              }}
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
              icon={cameraHook.getFlashIcon()}
              mode="contained-tonal"
              onPress={() => {
                cameraHook.cycleFlash();
                console.log('Flash cycled');
              }}
              style={{
                backgroundColor: theme.colors.secondary,
                borderRadius: 12,
                zIndex: 1000,
              }}
            />

          ),
        }}
      >{(props) => (
        <CameraScreen {...props}
          appData={appData}
          dbHook={dbHook}
          cameraHook={cameraHook}
        />
      )
        }
      </diaryNav.Screen>

      <diaryNav.Screen
        name="DiaryInput"
        options={{
          headerLeft: () => (
            <View style={styles.row}>
              <IconButton
                iconColor={theme.colors.onSecondary}
                size={28}
                icon="chevron-left"
                mode="contained-tonal"
                onPress={() => navigation.navigate('Diary', { screen: 'MainDiary' })}
                style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 12,
                }}
              />
            </View>
          ),
        }}
      >
        {(props) => <DiaryInput {...props}
          navigation={navigation}
          appData={appData}
          calendarHook={calendarHook}
          cameraHook={cameraHook}
          dbHook={dbHook}
          diaryState={diaryState}
        />}
      </diaryNav.Screen>

    </diaryNav.Navigator>
  );

}