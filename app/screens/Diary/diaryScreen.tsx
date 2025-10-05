import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState } from "react";
import { View } from "react-native";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryList } from "./List/diaryList";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { IconButton, Text } from "react-native-paper";
import { useCallback } from "react";

export function DiaryScreen({
  navigation,
  appData,
  dbHook,
  calendarHook,
  cameraHook,
  navBarHook,
}: NavData & HookData & { navBarHook: any }) {

  const { theme, styles } = useAppTheme();
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);
  const currentDate = calendarHook.formatDate(new Date())
  const selectedDate = calendarHook.formatDate(new Date(calendarHook.selectedDate))


  // Refresh entries when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dbHook.retrieveEntries();
    }, [dbHook.retrieveEntries])
  );

  return (

    <View style={styles.background}>


      <View style={styles.background}>
        {calendarHook.showCalendar && (
          <DiaryCalendar
            calendarHook={calendarHook}
            dbHook={dbHook}
          />
        )}
        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.primaryContainer, paddingVertical: 0, paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton style={{ margin: 0, padding: 0 }} size={25} iconColor={theme.colors.onPrimaryContainer} icon='chevron-left' onPress={() => { calendarHook.navigateDate('prev') }} />
          <Text variant="titleMedium" style={{color: theme.colors.onPrimaryContainer}}>{selectedDate}</Text>
          <IconButton
            style={{ margin: 0, padding: 0 }}
            iconColor={theme.colors.onPrimaryContainer}
            size={25}
            icon='chevron-right'
            disabled={selectedDate >= currentDate}
            onPress={() => { calendarHook.navigateDate('next') }}
          />
        </View>
        <View style={{flex: 1, marginTop: 16}}>


          {appData && (
            <DiaryList
              appData={appData}
              toggleEntry={() => { dbHook.toggleEntry() }}
              setSelectedDiaryData={setSelectedDiaryData}
              calendarHook={calendarHook}
              dbHook={dbHook}
              cameraHook={cameraHook}
              navigation={navigation}
            />
          )}
        </View>

      </View>


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


    </View>
  );
}


