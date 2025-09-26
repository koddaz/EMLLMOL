import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react"; // Add useCallback and useMemo
import { View } from "react-native";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryList } from "./List/diaryList";
import { useNavigation } from "@react-navigation/native";
import { HookData, NavData } from "@/app/navigation/rootNav";

export function DiaryScreen({
  navigation,
  appData,
  dbHook,
  calendarHook,
  cameraHook,
}: NavData & HookData) {

  const { theme, styles } = useAppTheme();
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);

  return (

    <View style={styles.background}>

      {dbHook.showEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
              navigation={navigation}
              appData={appData}
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
        zIndex: 5,
        // overflow: 'hidden',
      }}>
        <DiaryCalendar
          calendarHook={calendarHook}
          dbHook={dbHook}
        />
      </View>



      <DiaryList
        appData={appData}
        toggleEntry={() => { dbHook.toggleEntry() }}
        setSelectedDiaryData={setSelectedDiaryData}
        calendarHook={calendarHook}
        dbHook={dbHook}
        cameraHook={cameraHook}
        navigation={navigation}
      />

      

    </View>
  );
}


