import { LoadingScreen } from "@/app/components/loadingScreen";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { DiaryListItem } from "./diaryListItem";

import { AppData } from "@/app/constants/interface/appData";

export function DiaryList(
  { toggleEntry,
    dbHook,
    calendarHook,
    setSelectedDiaryData,
    appData
  }: {
    toggleEntry: (state: boolean) => void,
    dbHook: any,
    calendarHook: any,
    cameraHook: any,
    setSelectedDiaryData?: (data: DiaryData) => void,
    navigation: any
    appData: AppData
  }
) {
  const { theme, styles } = useAppTheme();

  // Get current page entries using dbHook functions
  const currentPageEntries = dbHook.getEntriesForDate(calendarHook.selectedDate);

  // Calculate stats using dbHook function
  const entriesStats = dbHook.calculateEntriesStats(currentPageEntries);


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
      
    </View>
  );
}