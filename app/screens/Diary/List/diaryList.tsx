import { LoadingScreen } from "@/app/components/loadingScreen";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import { Divider, FAB, Text } from "react-native-paper";
import { DiaryListItem } from "./diaryListItem";
import { DiaryTopContainer } from "@/app/components/topContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from 'react-native';
import { AppData } from "@/app/constants/interface/appData";

export function DiaryList(
  { toggleEntry,
    dbHook,
    calendarHook,
    cameraHook,
    setSelectedDiaryData,
    diaryNav,
    appData
  }: {
    toggleEntry: (state: boolean) => void,
    dbHook: any,
    calendarHook: any,
    cameraHook: any,
    setSelectedDiaryData?: (data: DiaryData) => void,
    diaryNav: any
    appData: AppData
  }
) {
  const { theme, styles } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions(); // Get screen width

  // Get all unique dates from entries
  const allDates = useMemo(() => {
    const dates = new Set<string>();
    dbHook.diaryEntries.forEach((entry: DiaryData) => {
      const entryDate = new Date(entry.created_at);
      dates.add(entryDate.toDateString());
    });
    return Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [dbHook.diaryEntries]);

  // Create data structure for horizontal pagination
  const paginatedData = useMemo(() => {
    return allDates.map(dateString => {
      const entriesForDate = dbHook.diaryEntries
        .filter((item: DiaryData) => {
          const itemDate = new Date(item.created_at);
          return itemDate.toDateString() === dateString;
        })
        .sort((a: DiaryData, b: DiaryData) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      return {
        date: dateString,
        entries: entriesForDate
      };
    });
  }, [dbHook.diaryEntries]);

  // Get current page index
  const currentPageIndex = useMemo(() => {
    return Math.max(0, allDates.findIndex(date => date === calendarHook.selectedDate.toDateString()));
  }, [allDates, calendarHook.selectedDate]);

  // Get current page entries for the top container
  const currentPageEntries = useMemo(() => {
    const currentPage = paginatedData.find(page => page.date === calendarHook.selectedDate.toDateString());
    return currentPage ? currentPage.entries : [];
  }, [paginatedData, calendarHook.selectedDate]);

  const handlePageChange = useCallback((event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / layoutMeasurement.width);

    if (pageIndex >= 0 && pageIndex < allDates.length) {
      const newDate = new Date(allDates[pageIndex]);
      calendarHook.setSelectedDate(newDate);
    }
  }, [allDates, calendarHook.setSelectedDate]);

  if (dbHook.isLoading) {
    return <LoadingScreen />;
  }

  const renderEmptyComponent = () => (
    <View style={[styles.container, { justifyContent: 'center', minHeight: 400 }]}>
      <View style={styles.box}>
        {/* Header with primary container background for highlighted sections */}
        <View style={styles.header}>
          <View style={[styles.chip, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons
              name="clipboard-plus"
              size={24}
              color={theme.colors.onPrimary}
            />
          </View>
          <Text variant="titleMedium" style={{
            marginLeft: 8,
            color: theme.colors.onSurface // text on primary container backgrounds
          }}>
            No entries yet
          </Text>
        </View>
        {/* Content with surface background */}
        <View style={styles.content}>
          <Text variant="bodyMedium" style={{
            color: theme.colors.onSurface, // text on white surfaces
            textAlign: 'center',
            lineHeight: 20
          }}>
            Start tracking your glucose and meals by tapping the + button below
          </Text>
        </View>
        <View style={styles.footer}></View>
      </View>
    </View>
  );

  return (
    <View style={styles.background}>
      <DiaryTopContainer
        calendarHook={calendarHook}
        entriesData={{
          totalInsulin: currentPageEntries.reduce((sum: number, entry: any) => sum + (entry.insulin || 0), 0),
          filteredEntries: currentPageEntries,
          totalCarbs: currentPageEntries.reduce((sum: number, entry: any) => sum + (entry.carbs || 0), 0),
          avgGlucose: currentPageEntries.length > 0
            ? (currentPageEntries.reduce((sum: number, entry: any) => sum + (entry.glucose || 0), 0) / currentPageEntries.length).toFixed(1)
            : '0'
        }}
      />
      
      <Divider style={{ marginTop: 2, marginBottom: 8, marginHorizontal: 8 }} />


      <View style={styles.container}>
        <FlatList
          data={currentPageEntries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const itemDate = new Date(item.created_at);
            const diaryData = {
              id: item.id,
              created_at: itemDate,
              glucose: item.glucose,
              carbs: item.carbs,
              insulin: item.insulin,
              meal_type: item.meal_type,
              activity_level: item.activity_level,
              note: item.note || '',
              uri_array: item.uri_array || []
            };
            return (
              <DiaryListItem
                appData={appData}
                diaryData={diaryData}
                onPress={() => {
                  setSelectedDiaryData?.(diaryData);
                  toggleEntry?.(true);
                }}
              />
            );
          }}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            flexGrow: 1
          }}
          style={{ flex: 1 }}
          refreshing={dbHook.isLoading}
          onRefresh={dbHook.refreshEntries}
        />
      </View>
      <FAB
        icon="note-plus"
        onPress={() => {
          diaryNav.navigate('Input');
        }}
        style={{
          position: 'absolute',
          margin: 16,
          right: 12,
          bottom: 16,
          backgroundColor: theme.colors.secondary, // secondary color for FABs
        }}
        color={theme.colors.onSecondary} // white text/icon on secondary background
      />
    </View>
  );
}