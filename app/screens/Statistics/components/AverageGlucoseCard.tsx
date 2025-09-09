import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface AverageGlucoseCardProps {
    filteredEntries: DiaryData[];
    selectedMealTypes: string[];
    glucoseUnit: string;
}

export function AverageGlucoseCard({ filteredEntries, selectedMealTypes, glucoseUnit }: AverageGlucoseCardProps) {
    const { theme, styles } = useAppTheme();

    // Calculate overall average glucose
    const overallAverage = filteredEntries.length > 0
        ? (filteredEntries.reduce((sum, entry) => sum + (entry.glucose || 0), 0) / filteredEntries.length).toFixed(1)
        : '0.0';

    // Calculate averages by meal type
    const calculateMealTypeAverage = (mealType: string) => {
        const mealEntries = filteredEntries.filter(entry => entry.meal_type === mealType);
        if (mealEntries.length === 0) return '0.0';
        return (mealEntries.reduce((sum, entry) => sum + (entry.glucose || 0), 0) / mealEntries.length).toFixed(1);
    };

    const getMealTypeIcon = (mealType: string) => {
        const icons = {
            'breakfast': 'coffee',
            'lunch': 'food',
            'dinner': 'food-variant',
            'snack': 'food-apple'
        };
        return icons[mealType as keyof typeof icons] || 'silverware';
    };

    const getMealTypeColor = (mealType: string) => {
        const colors = {
            'breakfast': theme.colors.primary,
            'lunch': theme.colors.secondary,
            'dinner': theme.colors.tertiary,
            'snack': theme.colors.error
        };
        return colors[mealType as keyof typeof colors] || theme.colors.primary;
    };

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="blood-bag" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Average Glucose Levels
                </Text>
            </View>
            <View style={styles.content}>
                {/* Overall Average */}
                <View style={[styles.row, { marginBottom: 12, justifyContent: 'center' }]}>
                    <View style={[styles.chip, { 
                        backgroundColor: theme.colors.primaryContainer,
                        paddingHorizontal: 16,
                        paddingVertical: 8
                    }]}>
                        <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.onPrimaryContainer} />
                        <View style={{ marginLeft: 8 }}>
                            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                                Overall Average
                            </Text>
                            <Text variant="headlineSmall" style={{ 
                                color: theme.colors.onPrimaryContainer,
                                fontWeight: 'bold' 
                            }}>
                                {overallAverage} {glucoseUnit}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Meal Type Averages */}
                <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 8 }]}>
                    By Meal Type
                </Text>
                <View style={styles.row}>
                    {selectedMealTypes.map((mealType) => {
                        const average = calculateMealTypeAverage(mealType);
                        const entryCount = filteredEntries.filter(entry => entry.meal_type === mealType).length;
                        
                        return (
                            <View key={mealType} style={[styles.chip, {
                                backgroundColor: `${getMealTypeColor(mealType)}20`,
                                borderColor: getMealTypeColor(mealType),
                                flex: 1,
                                marginHorizontal: 2,
                                alignItems: 'center'
                            }]}>
                                <MaterialCommunityIcons 
                                    name={getMealTypeIcon(mealType) as any} 
                                    size={16} 
                                    color={getMealTypeColor(mealType)} 
                                />
                                <Text variant="bodySmall" style={{ 
                                    color: getMealTypeColor(mealType),
                                    textTransform: 'capitalize',
                                    fontSize: 10
                                }}>
                                    {mealType}
                                </Text>
                                <Text variant="labelMedium" style={{ 
                                    color: getMealTypeColor(mealType),
                                    fontWeight: 'bold'
                                }}>
                                    {average}
                                </Text>
                                <Text variant="bodySmall" style={{ 
                                    color: theme.colors.onSurfaceVariant,
                                    fontSize: 9
                                }}>
                                    ({entryCount} entries)
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}