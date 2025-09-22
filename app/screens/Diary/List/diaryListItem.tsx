import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { Image, View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";



export function DiaryListItem(
  { diaryData, onPress, appData }: { diaryData: DiaryData, onPress?: () => void, appData: AppData }) {
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

    <Surface style={[styles.box, { marginBottom: 8, borderRadius: 8 }]} elevation={1} onTouchEnd={onPress}>

      <View style={[styles.header, { borderTopEndRadius: 8, borderTopStartRadius: 8 }]}>
        <Text variant={"labelLarge"} style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
          {formatTime(diaryData.created_at)}
        </Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
          <Icon source={getMealIcon(diaryData.meal_type || '')} size={20} color={theme.colors.onPrimaryContainer} />
        </View>
        <Text variant={"labelSmall"} style={{ color: theme.colors.onPrimaryContainer }}>
          {diaryData.meal_type}
        </Text>

      </View>



      <View style={[styles.content, { borderBottomEndRadius: 8, borderBottomStartRadius: 8, maxHeight: 90, minHeight: 75 }]}>
        <View style={[styles.row, { gap: 4 }]}>


          <View style={{ height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1,
                borderColor: theme.colors.outlineVariant }}>
            {diaryData.uri_array && diaryData.uri_array.length > 0 ? (
              <Image
                source={{ uri: diaryData.uri_array.at(0) }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  //marginTop: 8
                }}
                resizeMode="contain"
              />
            ) : (
                <Icon source="image-off" size={34} color={theme.colors.onSurfaceVariant} />
            )}
          </View>
          <View style={{ flex: 2 }}>
            <View style={[
              { flex: 1 },
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: theme.colors.outlineVariant,

              }
            ]}>
              <Text
                variant={"bodySmall"}
                style={{
                  color: diaryData.note ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                  textAlign: 'justify',
                  textAlignVertical: 'top',
                  lineHeight: 18,
                  flex: 1,
                }}
              >
                {diaryData.note || "No notes added..."}
              </Text>
            </View>
          </View>
          <View style={styles.chip}>
            <View>
              <View style={styles.row}>
                <Icon source={"blood-bag"} size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant={"labelSmall"} style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                  {diaryData.glucose} {getUnit(appData.settings.glucose)}
                </Text>
              </View>
              <View style={styles.row}>
                <Icon source={"needle"} size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant={"labelSmall"} style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                  {diaryData.insulin}
                </Text>
              </View>
              <View style={styles.row}>
                <Icon source={getActivityIcon(diaryData.activity_level || '')} size={20} color={theme.colors.onPrimaryContainer} />
                <Text variant={"labelSmall"} style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                  {diaryData.activity_level}
                </Text>
              </View>
            </View>

          </View>

        </View>

      </View>
    </Surface>




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
