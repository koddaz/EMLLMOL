import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react"; // Add useCallback and useMemo
import { View } from "react-native";
import { FAB } from "react-native-paper";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryList } from "./List/diaryList";

export function DiaryScreen({
  appData,
  dbHook,
  calendarHook,
  cameraHook,
  navigation,
}: {
  appData: AppData,
  dbHook: any,
  calendarHook: any,
  cameraHook: any,
  navigation: any
}) {
  const { theme, styles } = useAppTheme();

  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);
  // const [showEntry, setShowEntry] = useState(false);

  return (

    <View style={styles.background}>

      {dbHook.showEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
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
        zIndex: 1000,
        // overflow: 'hidden',
      }}>
        <DiaryCalendar
          calendarHook={calendarHook}
          dbHook={dbHook}
        />
      </View>



      <DiaryList
        toggleEntry={() => { dbHook.toggleEntry() }}
        setSelectedDiaryData={setSelectedDiaryData}
        calendarHook={calendarHook}
        dbHook={dbHook}
        cameraHook={cameraHook}
      />

      <View style={styles.fabContainer}>
        <View style={styles.fabRow}>
          
          <FAB
            color={theme.colors.onPrimary}
            icon="note-plus"
            size="medium"
            style={styles.fabSecondary}
            onPress={() => navigation.navigate('Diary', { screen: 'DiaryInput' })}

            />
       
        </View>
      </View>
      {/* 
*/}
    </View>
  );
}


