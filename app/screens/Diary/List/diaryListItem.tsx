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
    
      
    // <Surface style={[styles.card, { marginVertical: 6, marginHorizontal: 4 }]} onTouchEnd={onPress}>
    //   {/* Calendar-style header with time and meal - using primaryContainer for selected items/highlighted sections */}
    //   <View style={{
    //     backgroundColor: theme.colors.primaryContainer,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingHorizontal: 16,
    //     paddingVertical: 12,
    //     borderTopLeftRadius: 12,
    //     borderTopRightRadius: 12,
    //   }}>
    //     {/* Large meal icon - using primary for main brand elements */}
    //     <View style={{
    //       backgroundColor: theme.colors.primary,
    //       borderRadius: 20,
    //       width: 40,
    //       height: 40,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       marginRight: 12,
    //     }}>
    //       <MaterialCommunityIcons
    //         name={getMealIcon(diaryData.meal_type || '')}
    //         size={20}
    //         color={theme.colors.onPrimary}
    //       />
    //     </View>
        
    //     {/* Time and meal type - using onPrimaryContainer for text on primary container backgrounds */}
    //     <View style={{ flex: 1 }}>
    //       <Text variant="headlineSmall" style={{
    //         color: theme.colors.onPrimaryContainer,
    //         fontWeight: '700',
    //         letterSpacing: 0.5,
    //       }}>
    //         {formatTime(diaryData.created_at)}
    //       </Text>
    //       <Text variant="bodyMedium" style={{
    //         color: theme.colors.onPrimaryContainer,
    //         textTransform: 'uppercase',
    //         fontWeight: '500',
    //         letterSpacing: 1,
    //         opacity: 0.8,
    //       }}>
    //         {diaryData.meal_type || 'Meal'}
    //       </Text>
    //     </View>
    //   </View>

    //   {/* Calendar diary content - using surface for card surfaces */}
    //   <View style={{
    //     padding: 16,
    //     backgroundColor: theme.colors.surface,
    //   }}>
    //     {/* Main metrics in a grid */}
    //     <View style={{
    //       flexDirection: 'row',
    //       justifyContent: 'space-between',
    //       marginBottom: 12,
    //     }}>
    //       {/* Glucose reading - using secondaryContainer for input field backgrounds/card backgrounds */}
    //       {diaryData.glucose != null && diaryData.glucose > 0 && (
    //         <View style={{
    //           flex: 1,
    //           alignItems: 'center',
    //           backgroundColor: theme.colors.secondaryContainer,
    //           borderRadius: 8,
    //           padding: 8,
    //           marginRight: 4,
    //         }}>
    //           <MaterialCommunityIcons 
    //             name="blood-bag" 
    //             size={20} 
    //             color={theme.colors.onSecondaryContainer} 
    //           />
    //           <Text variant="labelLarge" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             fontWeight: '600',
    //             marginTop: 2,
    //           }}>
    //             {diaryData.glucose ? diaryData.glucose.toString() : '0'}
    //           </Text>
    //           <Text variant="bodySmall" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             opacity: 0.7,
    //           }}>
    //             mg/dL
    //           </Text>
    //         </View>
    //       )}

    //       {/* Carbs - using secondaryContainer for card backgrounds */}
    //       {diaryData.carbs != null && diaryData.carbs >= 0 && (
    //         <View style={{
    //           flex: 1,
    //           alignItems: 'center',
    //           backgroundColor: theme.colors.secondaryContainer,
    //           borderRadius: 8,
    //           padding: 8,
    //           marginHorizontal: 4,
    //         }}>
    //           <MaterialCommunityIcons 
    //             name="food" 
    //             size={20} 
    //             color={theme.colors.onSecondaryContainer} 
    //           />
    //           <Text variant="labelLarge" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             fontWeight: '600',
    //             marginTop: 2,
    //           }}>
    //             {diaryData.carbs ? diaryData.carbs.toString() : '0'}
    //           </Text>
    //           <Text variant="bodySmall" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             opacity: 0.7,
    //           }}>
    //             carbs
    //           </Text>
    //         </View>
    //       )}

    //       {/* Insulin - using secondaryContainer for card backgrounds */}
    //       {diaryData.insulin != null && diaryData.insulin >= 0 && (
    //         <View style={{
    //           flex: 1,
    //           alignItems: 'center',
    //           backgroundColor: theme.colors.secondaryContainer,
    //           borderRadius: 8,
    //           padding: 8,
    //           marginLeft: 4,
    //         }}>
    //           <MaterialCommunityIcons 
    //             name="needle" 
    //             size={20} 
    //             color={theme.colors.onSecondaryContainer} 
    //           />
    //           <Text variant="labelLarge" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             fontWeight: '600',
    //             marginTop: 2,
    //           }}>
    //             {diaryData.insulin ? diaryData.insulin.toString() : '0'}
    //           </Text>
    //           <Text variant="bodySmall" style={{
    //             color: theme.colors.onSecondaryContainer,
    //             opacity: 0.7,
    //           }}>
    //             units
    //           </Text>
    //         </View>
    //       )}
    //     </View>

    //     {/* Additional info row */}
    //     <View style={{
    //       flexDirection: 'row',
    //       justifyContent: 'space-between',
    //       alignItems: 'center',
    //       marginBottom: diaryData.note ? 8 : 0,
    //     }}>
    //       {/* Activity level - using info color for neutral badges */}
    //       {diaryData.activity_level && diaryData.activity_level !== 'none' && (
    //         <View style={{
    //           flexDirection: 'row',
    //           backgroundColor: theme.colors.info,
    //           borderRadius: 8,
    //           borderWidth: 1,
    //           borderColor: theme.colors.outline,
    //           alignItems: 'center',
    //           paddingHorizontal: 8,
    //           paddingVertical: 4,
    //           margin: 2,
    //           gap: 4,
    //         }}>
    //           <MaterialCommunityIcons name="run" size={14} color={theme.colors.onInfo} />
    //           <Text variant="bodySmall" style={{ 
    //             color: theme.colors.onInfo,
    //             textTransform: 'capitalize',
    //             fontWeight: '500',
    //           }}>
    //             {diaryData.activity_level}
    //           </Text>
    //         </View>
    //       )}

    //       {/* Photos indicator - using info color for neutral badges */}
    //       {diaryData.uri_array && diaryData.uri_array.length > 0 && (
    //         <View style={{
    //           flexDirection: 'row',
    //           backgroundColor: theme.colors.info,
    //           borderRadius: 8,
    //           borderWidth: 1,
    //           borderColor: theme.colors.outline,
    //           alignItems: 'center',
    //           paddingHorizontal: 8,
    //           paddingVertical: 4,
    //           margin: 2,
    //           gap: 4,
    //         }}>
    //           <MaterialCommunityIcons name="camera" size={14} color={theme.colors.onInfo} />
    //           <Text variant="bodySmall" style={{ color: theme.colors.onInfo }}>
    //             {diaryData.uri_array && diaryData.uri_array.length ? diaryData.uri_array.length : '0'}
    //           </Text>
    //         </View>
    //       )}
    //     </View>

    //     {/* Note section - using surfaceVariant for subtle backgrounds */}
    //     {diaryData.note && (
    //       <View style={{
    //         backgroundColor: theme.colors.surfaceVariant,
    //         borderRadius: 8,
    //         padding: 8,
    //         borderLeftWidth: 3,
    //         borderLeftColor: theme.colors.primary, // using primary for accent/important elements
    //       }}>
    //         <Text variant="bodySmall" style={{
    //           color: theme.colors.onSurfaceVariant, // text on subtle backgrounds
    //           fontStyle: 'italic',
    //           lineHeight: 16,
    //         }}>
    //           {diaryData.note}
    //         </Text>
    //       </View>
    //     )}
    //   </View>
    // </Surface>
   
  );
}
