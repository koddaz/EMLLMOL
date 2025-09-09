import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface CarbsAnalysisCardProps {
    filteredEntries: DiaryData[];
    selectedMealTypes: string[];
}

export function CarbsAnalysisCard({ filteredEntries, selectedMealTypes }: CarbsAnalysisCardProps) {
    const { theme, styles } = useAppTheme();

    // Calculate total carbs
    const totalCarbs = filteredEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    
    // Calculate average carbs per entry
    const averageCarbs = filteredEntries.length > 0 
        ? (totalCarbs / filteredEntries.length).toFixed(1)
        : '0.0';

    // Calculate daily average (assuming period covers multiple days)
    const uniqueDates = [...new Set(filteredEntries.map(entry => 
        new Date(entry.created_at).toDateString()
    ))];
    const dailyAverageCarbs = uniqueDates.length > 0 
        ? (totalCarbs / uniqueDates.length).toFixed(1)
        : '0.0';

    // Find highest carb meal
    const highestCarbEntry = filteredEntries.reduce((max, entry) => 
        (entry.carbs || 0) > (max.carbs || 0) ? entry : max, 
        filteredEntries[0] || { carbs: 0, meal_type: 'none' }
    );

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="food" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Carbohydrate Analysis
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.secondaryContainer,
                        flex: 1,
                        marginRight: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="sigma" size={16} color={theme.colors.onSecondaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
                            Total Carbs
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onSecondaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {totalCarbs}g
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.tertiaryContainer,
                        flex: 1,
                        marginHorizontal: 2,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="calculator" size={16} color={theme.colors.onTertiaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer }}>
                            Avg Per Entry
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onTertiaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {averageCarbs}g
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.primaryContainer,
                        flex: 1,
                        marginLeft: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="calendar-today" size={16} color={theme.colors.onPrimaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                            Daily Avg
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onPrimaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {dailyAverageCarbs}g
                        </Text>
                    </View>
                </View>

                {highestCarbEntry.carbs && highestCarbEntry.carbs > 0 && (
                    <View style={{ marginTop: 12 }}>
                        <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 4 }]}>
                            Highest Carb Meal
                        </Text>
                        <View style={[styles.chip, {
                            backgroundColor: theme.colors.errorContainer,
                            alignItems: 'center',
                            paddingVertical: 8
                        }]}>
                            <MaterialCommunityIcons name="trending-up" size={16} color={theme.colors.onErrorContainer} />
                            <Text variant="bodyMedium" style={{ 
                                color: theme.colors.onErrorContainer,
                                textTransform: 'capitalize',
                                marginHorizontal: 4
                            }}>
                                {highestCarbEntry.meal_type} - {highestCarbEntry.carbs}g
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}