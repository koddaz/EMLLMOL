import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

export function DiaryListItem(
  { diaryData, onPress }: { diaryData: DiaryData, onPress?: () => void }) {
  const { theme, styles } = useAppTheme();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'coffee';
      case 'lunch': return 'food';
      case 'dinner': return 'food-variant';
      case 'snack': return 'food-apple';
      default: return 'silverware';
    }
  };

  return (
    <View style={styles.diaryListRow}>
      <Surface style={styles.diaryListItem} elevation={2}>
        <View style={[styles.itemContent, { opacity: onPress ? 1 : 1 }]} onTouchEnd={onPress}>
          {/* Left side - Time and meal info */}
          <View style={styles.leftContent}>
            <Text variant="labelMedium" style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 12
            }}>
              {formatTime(diaryData.created_at)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <MaterialCommunityIcons
                name={getMealIcon(diaryData.meal_type || '')}
                size={14}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text variant="bodyMedium" style={{
                color: theme.colors.onSurface,
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {diaryData.meal_type || 'Meal'}
              </Text>
              <Text variant="bodySmall" style={{
                color: theme.colors.onSurfaceVariant,
                marginLeft: 8
              }}>
                {diaryData.carbs || 0}g carbs
              </Text>
            </View>
          </View>

          {/* Right side - Glucose level */}
          <View style={styles.glucoseBadge}>
            <Text variant="labelSmall" style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: 'bold'
            }}>
              {diaryData.glucose || '0'}
            </Text>
          </View>
        </View>
      </Surface>
    </View>
  );
}