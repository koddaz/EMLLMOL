import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { Image, View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";



export function DiaryListItem(
  { diaryData, onPress, appData, calendarHook }: { diaryData: DiaryData, onPress?: () => void, appData: AppData, calendarHook: any }) {
  const { theme, styles } = useAppTheme();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getMealIcon = (mealType?: string) => {

    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'coffee';
      case 'lunch': return 'food';
      case 'dinner': return 'food-variant';
      case 'snack': return 'food-apple';
      default: return 'silverware';
    }

  };

  const getActivityIcon = (activity?: string) => {

    switch (activity?.toLowerCase()) {
      case 'none': return 'sofa';
      case 'low': return 'walk';
      case 'medium': return 'run';
      case 'high': return 'run-fast';
      default: return 'help'; // or some default activity icon

    }
  }

  const getUnit = (unit?: String) => {
    switch (unit?.toLowerCase()) {
      case 'mmol': return 'mmol/l'
      case 'mgdl': return 'mg/Dl'
    }
  }




  return (
    <>
      <Surface
        style={{
          marginHorizontal: 8,
          marginVertical: 4,
          borderRadius: 16,
          overflow: 'hidden'
        }}
        elevation={2}
        onTouchEnd={onPress}
      >
        <View style={{ flexDirection: 'row', padding: 12, gap: 12 }}>
          {/* Meal Icon with gradient-like effect */}
          <View style={{
            backgroundColor: theme.colors.primaryContainer,
            padding: 12,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Icon source={getMealIcon(diaryData.meal_type)} size={24} color={theme.colors.onPrimaryContainer} />
          </View>

          {/* Content Area */}
          <View style={{ flex: 1, gap: 8 }}>
            {/* Header Row - Time & Date */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon source="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {calendarHook.formatTime(diaryData.created_at)}
                </Text>
              </View>

              <View style={{
                backgroundColor: theme.colors.secondaryContainer,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12
              }}>
                <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: '500' }}>
                  {diaryData.meal_type?.charAt(0).toUpperCase() + diaryData.meal_type?.slice(1)}
                </Text>
              </View>
            </View>

            {/* Metrics Row */}
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              {/* Glucose */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon source="diabetes" size={18} color={theme.colors.error} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {diaryData.glucose}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {getUnit(appData.settings.glucose)}
                </Text>
              </View>

              {/* Insulin */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon source="needle" size={18} color={theme.colors.tertiary} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {diaryData.insulin || 0}u
                </Text>
              </View>

              {/* Carbs */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon source="bread-slice-outline" size={18} color={theme.colors.customBlue} />
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {diaryData.carbs || 0}g
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Surface>




    </>

  );
}
