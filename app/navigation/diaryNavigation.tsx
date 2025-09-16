import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";

import { Alert, View } from "react-native";
import { InputScreen, InputScreen2 } from "../screens/Diary/Input/inputScreen";

import { useNavigationState } from '@react-navigation/native';
import { useCallback, useState, useMemo, useEffect } from "react";
import { AICameraScreen } from "../ai";
import { useNavigation } from '../hooks/useNavigation';
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { DiaryData } from "../constants/interface/diaryData";

const diaryNav = createNativeStackNavigator();

export function DiaryNavigation({
  appData,
  cameraHook,
  dbHook,
  calendarHook,
}: {
  appData: AppData,
  cameraHook: any,
  dbHook: any,
  calendarHook: any,
}) {
  const { theme, styles } = useAppTheme();
  const { goBack } = useNavigation();


  // Get current route name for FAB
  const navigationState = useNavigationState(state => state);
  const currentRoute = navigationState?.routes?.[navigationState?.index ?? 0];

  const [isSaving, setIsSaving] = useState(false);

  const [diaryData, setDiaryData] = useState<DiaryData>({
    id: '',
    created_at: new Date(),
    glucose: 0,
    carbs: 0,
    insulin: 0,
    meal_type: '',
    activity_level: '',
    note: '',
    uri_array: []
  });



  const handleSave = useCallback(async (editingEntryId?: string) => {
    if (isSaving) return; // Prevent double saves

    try {
      setIsSaving(true);

      // Save photos locally if any
      const permanentURIs = await Promise.all(
        cameraHook.photoURIs.map((tempUri: string) => cameraHook.savePhotoLocally(tempUri))
      );

      const entryData = {
        glucose: dbHook.glucose,
        carbs: dbHook.carbs,
        note: dbHook.note,
        activity: dbHook.activity,
        foodType: dbHook.foodType,
      };

      // Save or update the entry
      if (editingEntryId) {
        console.log('📝 Updating entry:', editingEntryId);
        await dbHook.updateDiaryEntry(editingEntryId, entryData, permanentURIs);
      } else {
        console.log('💾 Creating new entry');
        await dbHook.saveDiaryEntry(entryData, permanentURIs);
      }

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

      dbHook.setGlucose('');
      dbHook.setCarbs('');
      dbHook.setNote('');
      dbHook.setActivity('none');
      dbHook.setFoodType('snack');

      // Navigate back
      goBack();

    } catch (error) {
      console.error('❌ Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [
    cameraHook,
    dbHook,
    isSaving
  ]);

  return (
    <View style={{ flex: 1 }}>
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
            headerShown: false,
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
            headerShown: false,
            animation: 'slide_from_left',
            /* header: ({ options }) => (
               <TopHeader
                showLogo={true}
                options={options}
                leftButton={{
                  icon: "chevron-left",
                  onPress: () => {
                    // Clear form state when going back without saving
                    diaryState.setGlucose('');
                    diaryState.setCarbs('');
                    diaryState.setNote('');
                    diaryState.setActivity('none');
                    diaryState.setFoodType('snack');
                    
                    // Clear camera photos
                    if (cameraHook.showCamera) cameraHook.toggleCamera();
                    cameraHook.clearPhotoURIs();
                    
                    goBack();
                  },
                }}
              /> 
            ),*/
          })}
        >
          {(props) => (
            <InputScreen
              {...props}
              diaryData={diaryData}
              appData={appData}
              calendarHook={calendarHook}
              cameraHook={cameraHook}
              dbHook={dbHook}
              onSave={handleSave}
              route={props.route}
            />
          )}
        </diaryNav.Screen>
      </diaryNav.Navigator>

      {/* <FabContainer
      route={currentRoute}
      handleSave={handleSave}
      diaryState={diaryState}
    /> */}
    </View>
  );
}





// Add this new component at the bottom of the file

