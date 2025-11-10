import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Surface, Text } from "react-native-paper";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryList } from "./List/diaryList";

import { useHomeData } from "@/app/hooks/useHomeData";

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

  // Get stats for selected date
  const selectedDateEntries = dbHook.diaryEntries.filter((entry: DiaryData) => {
    const entryDate = calendarHook.formatDate(new Date(entry.created_at));
    return entryDate === selectedDate;
  });
  const homeData = useHomeData(selectedDateEntries);


  // Refresh entries when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dbHook.retrieveEntries();
    }, [dbHook.retrieveEntries])
  );

  const localStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingHorizontal: 16,
    },
    calendarContainer: {
      marginBottom: 16,
    },
    dateBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    listContainer: {
      flex: 1,
      marginTop: 8,
    },
  });

  return (
    <View style={localStyles.container}>
      {/* Title Section */}
      <Surface style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 }} elevation={0}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineMedium" style={{
              color: theme.colors.onBackground,
              fontWeight: '700',
              marginBottom: 2,
            }}>
              History
            </Text>
            <Text variant="bodyLarge" style={{
              color: theme.colors.onSurfaceVariant,
            }}>
              Track your daily meals and glucose
            </Text>
          </View>
          <Surface style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primaryContainer, justifyContent: 'center', alignItems: 'center', elevation: 2 }} elevation={2}>
            <IconButton
              icon={calendarHook.showCalendar ? "calendar-remove-outline" : "calendar"}
              size={28}
              iconColor={theme.colors.primary}
              onPress={() => { calendarHook.toggleCalendar() }}
              style={{ margin: 0 }}
            />
          </Surface>
        </View>
      </Surface>

      <View style={localStyles.contentContainer}>
        {calendarHook.showCalendar && (
          <View style={localStyles.calendarContainer}>
            <DiaryCalendar
              calendarHook={calendarHook}
              dbHook={dbHook}
            />
          </View>
        )}
        <Surface 
          elevation={2}
          style={{ 
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <View style={localStyles.dateBar}>
            <IconButton 
              size={25} 
              iconColor={theme.colors.onPrimaryContainer} 
              icon='chevron-left' 
              onPress={() => { calendarHook.navigateDate('prev') }} 
            />
            <Text 
              variant="titleMedium" 
              style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}
            >
              {selectedDate}
            </Text>
            <IconButton
              size={25}
              iconColor={theme.colors.onPrimaryContainer}
              icon='chevron-right'
              disabled={selectedDate >= currentDate}
              onPress={() => { calendarHook.navigateDate('next') }}
            />
          </View>
        </Surface>

      </View>
      <View style={localStyles.listContainer}>
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


