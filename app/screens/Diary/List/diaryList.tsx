import { LoadingScreen } from "@/app/components/loadingScreen";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Surface, Text } from "react-native-paper";
import { useSwipeGesture } from "../../../hooks/useGestures";
import { DiaryListItem } from "./diaryListItem";
import { SafeAreaView } from "react-native-safe-area-context";




export function DiaryList(
  { toggleEntry,
    dbHook,
    calendarHook,
    cameraHook,
    setSelectedDiaryData
  }: {
    toggleEntry: (state: boolean) => void,
    dbHook: any,
    calendarHook: any,
    cameraHook: any,
    setSelectedDiaryData?: (data: DiaryData) => void
  }
) {
  const { theme, styles } = useAppTheme();

  const filteredEntries = useMemo(() => dbHook.diaryEntries.filter((item: DiaryData) => {
    const itemDate = new Date(item.created_at);
    return itemDate.toDateString() === calendarHook.selectedDate.toDateString();
  }), [dbHook.diaryEntries, calendarHook.selectedDate]);

  const handleDateNavigation = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(calendarHook.selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    calendarHook.setSelectedDate(newDate);
  }, [calendarHook.selectedDate, calendarHook.setSelectedDate]);

  const panGesture = useSwipeGesture(handleDateNavigation);

  if (dbHook.isLoading) {
    return <LoadingScreen />;
  }

  const renderStats = () => {
    const totalCarbs = filteredEntries.reduce((sum: number, entry: any) => sum + (entry.carbs || 0), 0);
    const avgGlucose = filteredEntries.length > 0
      ? (filteredEntries.reduce((sum: number, entry: any) => sum + (entry.glucose || 0), 0) / filteredEntries.length).toFixed(1)
      : '0';

    return (
      <View style={styles.topContainer}>

        <View style={styles.chip}>
          <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.onSecondary} />
        </View>
        
        <Text variant="labelLarge" style={{ flex: 1, marginLeft: 8 }}>
          Daily Summary: {calendarHook.selectedDate.toLocaleDateString('en-EU', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>

          <View style={styles.chip}>
            <MaterialCommunityIcons name="note-multiple" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">{filteredEntries.length}</Text>
          </View>

          <View style={styles.chip}>
            <MaterialCommunityIcons name="food" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">{totalCarbs}g</Text>
          </View>

          <View style={styles.chip}>
            <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">{avgGlucose}</Text>
          </View>
      

      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="clipboard-plus"
            size={24}
            color={theme.colors.onSecondaryContainer}
          />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            No entries yet
          </Text>
        </View>
        <View style={styles.content}>
          <Text variant="bodyMedium" style={{
            color: theme.colors.onSurfaceVariant,
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

  if (filteredEntries.length === 0) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.background}>
          {renderStats()}
          {renderEmptyState()}
        </View>
      </GestureDetector>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.background}>
        {renderStats()}
        <View style={styles.container}>
          <FlatList
            data={filteredEntries}
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
                  diaryData={diaryData}
                  onPress={() => {
                    setSelectedDiaryData && setSelectedDiaryData(diaryData);
                    toggleEntry && toggleEntry(true);
                  }}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={dbHook.isLoading}
            onRefresh={dbHook.refreshEntries}
            extraData={calendarHook.selectedDate.toISOString()}
          />
        </View>
      </View>

    </GestureDetector>
  );
}