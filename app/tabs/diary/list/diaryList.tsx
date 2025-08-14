import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { Surface, Text, useTheme } from "react-native-paper";

import { LoadingScreen } from "@/app/components/loadingScreen";
import { Animated, FlatList, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DiaryListItem } from "./diaryListItem";
import { useCallback, useMemo } from "react";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useSwipeGesture } from "../hooks/useGestures";
import { GestureDetector } from "react-native-gesture-handler";



export function DiaryList(
  { toggleEntry,
    setSelectedDiaryData,
    selectedDate,
    setSelectedDate,
    isLoading,
    diaryEntries,
    refreshEntries
  }: {
    isLoading: boolean,
    diaryEntries: DiaryData[],
    toggleEntry: (state: boolean) => void,
    setSelectedDiaryData?: (data: DiaryData) => void,
    selectedDate: Date,
    refreshEntries: () => Promise<void>,
    setSelectedDate: (date: Date) => void
  }
) {
  const { theme, styles } = useAppTheme();

  const filteredEntries = useMemo(() => diaryEntries.filter(item => {
    const itemDate = new Date(item.created_at);
    return itemDate.toDateString() === selectedDate.toDateString();
  }), [diaryEntries, selectedDate]);

  const handleDateNavigation = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const panGesture = useSwipeGesture(handleDateNavigation);


  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderStats = () => {
    const totalCarbs = filteredEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const avgGlucose = filteredEntries.length > 0
      ? (filteredEntries.reduce((sum, entry) => sum + (entry.glucose || 0), 0) / filteredEntries.length).toFixed(1)
      : '0';

    return (
      <Surface style={[
        styles.card,
        {
          margin: 8,
        }
      ]} elevation={4}>
        <View style={[styles.cardHeader, { marginBottom: 6 }]}>
          <MaterialCommunityIcons name="chart-line" size={16} color={theme.colors.primary} />
          <Text variant="labelLarge" style={[styles.cardTitle, { fontSize: 12 }]}>
            Daily Summary: {selectedDate.toLocaleDateString('en-EU', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={[styles.chipContainer, { gap: 4, flexWrap: 'wrap' }]}>
          <Surface style={[
            styles.chip,
            {
              backgroundColor: theme.colors.primaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              minWidth: 60
            }
          ]}>
            <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, fontSize: 9 }}>
              Entries
            </Text>
            <Text variant="labelMedium" style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: '600',
              fontSize: 11
            }}>
              {filteredEntries.length}
            </Text>
          </Surface>

          <Surface style={[
            styles.chip,
            {
              backgroundColor: theme.colors.secondaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              minWidth: 60
            }
          ]}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, fontSize: 9 }}>
              Carbs
            </Text>
            <Text variant="labelMedium" style={{
              color: theme.colors.onSecondaryContainer,
              fontWeight: '600',
              fontSize: 11
            }}>
              {totalCarbs}g
            </Text>
          </Surface>

          <Surface style={[
            styles.chip,
            {
              backgroundColor: theme.colors.tertiaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              minWidth: 60
            }
          ]}>
            <Text variant="labelSmall" style={{ color: theme.colors.onTertiaryContainer, fontSize: 9 }}>
              Avg BG
            </Text>
            <Text variant="labelMedium" style={{
              color: theme.colors.onTertiaryContainer,
              fontWeight: '600',
              fontSize: 11
            }}>
              {avgGlucose}
            </Text>
          </Surface>
        </View>
      </Surface>
    );
  };

  const renderEmptyState = () => (
    <View style={[styles.content, { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 }]}>
      <Surface style={[styles.card, { alignItems: 'center', marginHorizontal: 32 }]} elevation={2}>
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <MaterialCommunityIcons
            name="clipboard-plus"
            size={64}
            color={theme.colors.onSurfaceVariant}
            style={{ marginBottom: 16 }}
          />
          <Text variant="titleMedium" style={{
            color: theme.colors.onSurface,
            marginBottom: 8,
            textAlign: 'center'
          }}>
            No entries yet
          </Text>
          <Text variant="bodyMedium" style={{
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 20
          }}>
            Start tracking your glucose and meals by tapping the + button below
          </Text>
        </View>
      </Surface>
    </View>
  );

  if (filteredEntries.length === 0) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={styles.background}>
          <View style={styles.container}>
            {renderStats()}
            {renderEmptyState()}
          </View>
        </View>
      </GestureDetector>
    );
  }

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.background}>
        <View style={styles.container}>
          {renderStats()}
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
            refreshing={isLoading}
            onRefresh={refreshEntries}
            extraData={selectedDate.toISOString()}
          />
        </View>
      </View>
      </GestureDetector>
  );
}