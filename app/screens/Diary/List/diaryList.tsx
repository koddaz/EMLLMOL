import { LoadingScreen } from "@/app/components/loadingScreen";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { FAB, Surface, Text } from "react-native-paper";
import { useSwipeGesture } from "../../../hooks/useGestures";
import { DiaryListItem } from "./diaryListItem";
import { SafeAreaView } from "react-native-safe-area-context";


// In this file I need to add a FAB button to add new entries
// The button should open the inputscreen
// I also need to design the flatlist items to show the data in a nice way.
// I imagin it to look like a calendar based diary. 
// We should base the design on the style.ts file and the theme.ts file.
// The list should be scrollable and show the most recent entries at the top.
// If there are no entries, we should show a message saying "No entries yet. Start tracking your glucose and meals by tapping the + button below".
// If there are no entries the list should be scrollable anyway. I don't want to use my useGestures hook here. 

export function DiaryList(
  { toggleEntry,
    dbHook,
    calendarHook,
    cameraHook,
    setSelectedDiaryData,
    navigation
  }: {
    toggleEntry: (state: boolean) => void,
    dbHook: any,
    calendarHook: any,
    cameraHook: any,
    setSelectedDiaryData?: (data: DiaryData) => void,
    navigation: any
  }
) {
  const { theme, styles } = useAppTheme();

  const filteredEntries = useMemo(() => {
    return dbHook.diaryEntries
      .filter((item: DiaryData) => {
        const itemDate = new Date(item.created_at);
        return itemDate.toDateString() === calendarHook.selectedDate.toDateString();
      })
      .sort((a: DiaryData, b: DiaryData) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [dbHook.diaryEntries, calendarHook.selectedDate]);

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
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        margin: 8, 
        padding: 8, 
        backgroundColor: theme.colors.surface, // card surfaces
        elevation: 4 
      }}>

        {/* Daily summary text - using onSurface for text on white surfaces */}
        <Text variant="labelLarge" style={{ 
          flex: 1, 
          marginLeft: 8,
          color: theme.colors.onSurface
        }}>
          Daily Summary:
          {"\n"}
          {calendarHook.selectedDate.toLocaleDateString('en-EU', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>

        {/* Entries count chip - using primaryContainer for info badges */}
        <View style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="note-multiple" size={16} color={theme.colors.onPrimaryContainer} />
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>{filteredEntries.length}</Text>
        </View>

        {/* Carbs chip - using primaryContainer for info badges */}
        <View style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="food" size={16} color={theme.colors.onPrimaryContainer} />
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>{totalCarbs}g</Text>
        </View>

        {/* Glucose chip - using primaryContainer for info badges */}
        <View style={[styles.chip, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.onPrimaryContainer} />
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>{avgGlucose}</Text>
        </View>

      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={[styles.container, {justifyContent: 'center', minHeight: 400}]}>
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
            color: theme.colors.onPrimaryContainer // text on primary container backgrounds
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
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={dbHook.isLoading}
            onRefresh={dbHook.refreshEntries}
            extraData={calendarHook.selectedDate.toISOString()}
          />
        </View>
        <FAB
          icon="plus"
          onPress={() => {
            navigation.navigate('DiaryInput');
          }}
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.secondary, // secondary color for FABs
          }}
          color={theme.colors.onSecondary} // white text/icon on secondary background
        />
      </View>
      

    </GestureDetector>
  );
}