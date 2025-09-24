import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react"; // Add useCallback and useMemo
import { View } from "react-native";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryList } from "./List/diaryList";
import { useNavigation } from "@react-navigation/native";

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

  const diaryNav = useNavigation()
  const { theme, styles } = useAppTheme();
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);

  return (

    <View style={styles.background}>

      {dbHook.showEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
              diaryNav={diaryNav}
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
        diaryNav={diaryNav}
      />

      

    </View>
  );
}


