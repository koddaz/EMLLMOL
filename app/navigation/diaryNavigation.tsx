import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppTheme } from "../constants/UI/theme";
import { AppData } from "../constants/interface/appData";
import { Alert, View } from "react-native";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { useCallback, useState } from "react";
import { AICameraScreen } from "../ai";
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
  const { theme } = useAppTheme();
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
        <diaryNav.Screen 
          name="MainDiary"
          options={{ headerShown: false }}
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
          options={{
            headerShown: false,
            animation: 'none',
          }}
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
          options={{
            headerShown: false,
            animation: 'slide_from_left',
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
        </diaryNav.Screen>
      </diaryNav.Navigator>
    </View>
  );
}