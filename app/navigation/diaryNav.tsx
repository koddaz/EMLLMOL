import { Header } from '@react-navigation/elements';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";

import { Alert, Image, View } from "react-native";
import { IconButton } from "react-native-paper";
import { InputScreen } from "../screens/Diary/Input/inputScreen";

import { useCallback, useState } from "react";
import { AICameraScreen } from "../ai";
import { FabContainer } from "../components/fabGroup";
import { DiaryScreen } from "../screens/Diary/diaryScreen";

const diaryNav = createNativeStackNavigator();

export function DiaryNavigation({
  appData,
  cameraHook,
  dbHook,
  calendarHook,
  rootNavigation,
  // Get root navigation from props
}: {
  appData: AppData,
  cameraHook: any,
  dbHook: any,
  calendarHook: any,
  rootNavigation: any, // Make optional since it comes from the navigator
}) {
  const { theme, styles } = useAppTheme();
  const currentRoute = diaryNav.Screen.name;

  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = useCallback(async () => {
    if (isSaving) return; // Prevent double saves

    try {
      setIsSaving(true);

      // Save photos locally if any
      const permanentURIs = await Promise.all(
        cameraHook.photoURIs.map((tempUri: string) => cameraHook.savePhotoLocally(tempUri))
      );

      const entryData = {
        glucose: diaryState.glucose,
        carbs: diaryState.carbs,
        note: diaryState.note,
        activity: diaryState.activity,
        foodType: diaryState.foodType,
      };

      // Save the entry
      await dbHook.saveDiaryEntry(entryData, permanentURIs);

      // Wait a moment for the save to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Retrieve updated entries
      if (dbHook.retrieveEntries) {
        console.log('📔 Refreshing entries after save...');
        await dbHook.retrieveEntries();
      }

      // Clear states
      if (cameraHook.showCamera) cameraHook.toggleCamera();
      cameraHook.clearPhotoURIs();

      diaryState.setGlucose('');
      diaryState.setCarbs('');
      diaryState.setNote('');
      diaryState.setActivity('none');
      diaryState.setFoodType('snack');

      // Navigate back
      rootNavigation.goBack();

    } catch (error) {
      console.error('❌ Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    cameraHook,
    dbHook,
    diaryState,
    rootNavigation,
    isSaving
  ]);

  // Create diary state object


  return (
    <diaryNav.Navigator
      initialRouteName="MainDiary"
      screenOptions={{
        animation: 'fade_from_bottom',
        headerBackButtonMenuEnabled: false,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* Wrap all screen components with fragments to include FAB */}
      <diaryNav.Screen name="MainDiary"
        options={({ navigation: diaryNavigation, route }) => ({
          header: ({ options }) => (
            <CustomHeader
              options={options}
              showLogo={true}
              rightButton={{
                icon: calendarHook.showCalendar ? "close" : "calendar-month",
                onPress: () => calendarHook.toggleCalendar(),
              }}
            />
          ),
        })}
      >
        {(props) => (
          <>
            <DiaryScreen
              {...props}
              appData={appData}
              dbHook={dbHook}
              calendarHook={calendarHook}
              cameraHook={cameraHook}
              rootNavigation={rootNavigation}
            />
            <FabContainer
              route={props.route}
              rootNavigation={rootNavigation}
              handleSave={handleSave}
            />
          </>
        )}
      </diaryNav.Screen>

      <diaryNav.Screen name="DiaryCamera"
        options={({ navigation: diaryNavigation }) => ({
          headerShown: false,
          animation: 'none',
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

      <diaryNav.Screen name="DiaryInput"
        options={({ navigation, route }) => ({
          animation: 'slide_from_left',
          header: ({ options }) => (
            <CustomHeader
              showLogo={true}
              options={options}
              leftButton={{
                icon: "chevron-left",
                onPress: () => navigation.goBack(),
              }}
            />
          ),
        })}
      >
        {(props) => (
          <>
            <InputScreen
              {...props}
              appData={appData}
              calendarHook={calendarHook}
              cameraHook={cameraHook}
              dbHook={dbHook}
              diaryState={diaryState}
              isSaving={isSaving}
            />
            <FabContainer
              route={props.route}
              rootNavigation={rootNavigation}
              handleSave={handleSave}
            />
          </>
        )}
      </diaryNav.Screen>
    </diaryNav.Navigator>

  );
}

interface CustomHeaderProps {
  options: any;
  title?: string;
  showLogo?: boolean;
  leftButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
}

export function CustomHeader({
  options,
  title = '',
  showLogo = false,
  leftButton,
  rightButton
}: CustomHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View>
      <Header
        {...options}
        title={title}
        headerStyle={{
          backgroundColor: theme.colors.primary,

        }}
        headerTitleStyle={{
          fontWeight: 'bold',
          color: theme.colors.onPrimary
        }}
        headerLeft={leftButton ? () => (
          <IconButton
            iconColor={theme.colors.onSecondary}
            size={24}
            icon={leftButton.icon}
            mode="contained-tonal"
            onPress={leftButton.onPress}
            style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 12,
              margin: 0,
              marginLeft: 8,
              position: 'absolute',
              bottom: 4,
              left: 0,
            }}
          />
        ) : () => null}
        headerRight={rightButton ? () => (
          <IconButton
            iconColor={theme.colors.onSecondary}
            size={24}
            icon={rightButton.icon}
            mode="contained-tonal"
            onPress={rightButton.onPress}
            style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 12,
              margin: 0,
              marginRight: 8,
              position: 'absolute',
              bottom: 4,
              right: 0,
            }}
          />
        ) : () => null}
      />
      {/* Logo extending below header */}
      {showLogo && (
        <View style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -30 }, { translateY: -20 }],
          zIndex: 10,
        }}>
          <Image
            source={require('../../assets/images/logo-head.gif')}
            style={{
              width: 60,
              height: 60,
              resizeMode: 'contain',
            }}
          />
        </View>
      )}
    </View>
  );
}

// Add this new component at the bottom of the file

