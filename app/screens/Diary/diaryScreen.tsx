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
import { IconButton, Text } from "react-native-paper";

export function DiaryScreen({
  navigation,
  appData,
  dbHook,
  calendarHook,
  cameraHook,
}: NavData & HookData) {

  const { theme, styles } = useAppTheme();
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);
  const currentDate = calendarHook.formatDate(new Date())
  const selectedDate = calendarHook.formatDate(new Date(calendarHook.selectedDate))

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
        flex: 0,
      }}>


        {calendarHook.showCalendar && (
          <DiaryCalendar
            calendarHook={calendarHook}
            dbHook={dbHook}
          />
        )}


        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surface, paddingVertical: 0, paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton style={{margin: 0, padding: 0}} size={25} iconColor={theme.colors.onSurface} icon='chevron-left' onPress={() => { calendarHook.navigateDate('prev') }} />
          <Text variant="titleMedium">{selectedDate}</Text>
          <IconButton
            style={{margin: 0, padding: 0}}
            iconColor={theme.colors.onSurface}
            size={25}
            icon='chevron-right'
            disabled={selectedDate >= currentDate}
            onPress={() => { calendarHook.navigateDate('next') }}
          />
        </View>
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


