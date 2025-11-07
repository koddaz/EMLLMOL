import { LoadingScreen } from "@/app/components/loadingScreen";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import { Text, Card, Icon } from "react-native-paper";
import { DiaryListItem } from "./diaryListItem";
import { useMemo } from "react";
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

  // Compute current page entries when diary entries or selected date changes
  const currentPageEntries = useMemo(() =>
    dbHook.getEntriesForDate(calendarHook.selectedDate),
    [dbHook.diaryEntries, calendarHook.selectedDate]
  );


  const renderEmptyComponent = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
      <Card mode="elevated" elevation={2} style={{ width: '100%' }}>
        <Card.Title 
          title="No entries yet..."
          left={(props) => <Icon {...props} source="clipboard-plus" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={{
            color: theme.colors.onSurface,
            textAlign: 'justify',
            lineHeight: 20
          }}>
            Start tracking your glucose and meals by tapping the "New" button in the menu
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.background}>

      <View style={styles.container}>
        <FlatList
          data={currentPageEntries}
          keyExtractor={(item) => item.id ? item.id.toString() : "no id"}
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
                calendarHook={calendarHook}
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
          onRefresh={dbHook.retrieveEntries}
        />
      </View>

    </View>
  );
}