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
    <View style={styles.listItem} onTouchEnd={onPress}>
      <View style={styles.header}>
        <View style={styles.chip}>
          <MaterialCommunityIcons
            name={getMealIcon(diaryData.meal_type || '')}
            size={16}
            color={theme.colors.onSecondary}
          />
        </View>
        <Text variant="labelSmall" style={{ flex: 1, marginLeft: 8 }}>
          {formatTime(diaryData.created_at)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.content, { flexDirection: 'row' }]}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">{diaryData.glucose || '0'}</Text>
          </View>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="food" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">{diaryData.carbs || 0}g</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ 
          color: theme.colors.onSecondaryContainer,
          textTransform: 'capitalize'
        }}>
          {diaryData.meal_type || 'Meal'}
        </Text>
      </View>
    </View>
  );
}