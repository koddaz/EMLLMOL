import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useCallback, useMemo, useState } from "react"; // Add useCallback and useMemo
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { FAB } from "react-native-paper";
import DiaryCalendar from "./calendar/diaryCalendar";
import { DiaryEntry } from "./list/diaryEntry";
import { DiaryList } from "./list/diaryList";
import { DiaryInput } from "./input/diaryInput";


export function DiaryScreen({
  appData,
  dbHook,
  calendarHook
}: {
  appData: AppData,
  dbHook: any,
  calendarHook: any
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
      {calendarHook.showCalendar && (
        <DiaryCalendar
          calendarHook={calendarHook}
          dbHook={dbHook}
        />
      )}

      {!toggleEntry && (
        <DiaryList
          toggleEntry={setToggleEntry}
          setSelectedDiaryData={setSelectedDiaryData}
          calendarHook={calendarHook}
          dbHook={dbHook}
        />
      )}

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
            dbHook={dbHook}
            diaryState={diaryState}
          />
        </KeyboardAvoidingView>
      )}

      <FAB
        icon={toggleInput ? "close" : "note-plus"}
        style={styles.fab}
        onPress={() => handleToggleInput(!toggleInput)}
      />
    </View>
  );
}




