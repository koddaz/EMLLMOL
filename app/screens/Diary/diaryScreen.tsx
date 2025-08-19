import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useCallback, useState } from "react"; // Add useCallback and useMemo
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { FAB } from "react-native-paper";
import { useSharedValue } from 'react-native-reanimated';
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryInput } from "./Input/diaryInput";
import { DiaryList } from "./List/diaryList";

export function DiaryScreen({
  appData,
  dbHook,
  calendarHook,
  cameraHook,
}: {
  appData: AppData,
  dbHook: any,
  calendarHook: any,
  cameraHook: any,
}) {
  const { theme, styles } = useAppTheme();

  const [toggleEntry, setToggleEntry] = useState(false);
  const [toggleInput, setToggleInput] = useState(false);
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");

  // Stabilize the toggle function to prevent re-renders
  const handleToggleInput = useCallback((state: boolean) => {
    console.log('🔄 Toggling input to:', state);
    setToggleInput(state);
    // Clear form when closing
    if (!state) {
      setGlucose("");
      setCarbs("");
      setNote("");
      setActivity("none");
      setFoodType("snack");
    }
  }, []);

  const diaryState = {
    glucose, setGlucose,
    carbs, setCarbs,
    note, setNote,
    activity, setActivity,
    foodType, setFoodType,
    foodOptions: dbHook.foodOptions,
    activityOptions: dbHook.activityOptions
  };



  return (
    <View style={styles.background}>
      {toggleEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
              appData={appData}
              setToggleEntry={setToggleEntry}
              diaryData={selectedDiaryData}
              calendarHook={calendarHook}
              dbHook={dbHook}
            />
          </View>
        </View>
      )}
     

        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          // overflow: 'hidden',
        }}>
          <DiaryCalendar
            calendarHook={calendarHook}
            dbHook={dbHook}
            toggleEntry={toggleEntry}
            toggleInput={toggleInput}
          />
        </View>
     



      {toggleInput && (
        <KeyboardAvoidingView
          style={styles.inputWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <DiaryInput
            appData={appData}
            toggleInput={handleToggleInput}
            calendarHook={calendarHook}
            cameraHook={cameraHook}
            dbHook={dbHook}
            diaryState={diaryState}
          />
        </KeyboardAvoidingView>
      )}

      <DiaryList
        toggleEntry={setToggleEntry}
        setSelectedDiaryData={setSelectedDiaryData}
        calendarHook={calendarHook}
        dbHook={dbHook}
        cameraHook={cameraHook}
      />
      <FAB
        icon={toggleInput ? "close" : "note-plus"}
        style={styles.fab}
        onPress={() => handleToggleInput(!toggleInput)}
      />
    </View>
  );
}




