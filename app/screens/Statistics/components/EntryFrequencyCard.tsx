import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface EntryFrequencyCardProps {
    filteredEntries: DiaryData[];
    selectedPeriod: number;
    selectedMealTypes: string[];
}

export function EntryFrequencyCard({ filteredEntries, selectedPeriod, selectedMealTypes }: EntryFrequencyCardProps) {
    const { theme, styles } = useAppTheme();

    // Calculate unique dates
    const uniqueDates = [...new Set(filteredEntries.map(entry => 
        new Date(entry.created_at).toDateString()
    ))];
    
    // Calculate entries per day
    const entriesPerDay = uniqueDates.length > 0 
        ? (filteredEntries.length / uniqueDates.length).toFixed(1)
        : '0.0';

    // Calculate completion rate (days with entries vs total days in period)
    const completionRate = selectedPeriod > 0 
        ? ((uniqueDates.length / selectedPeriod) * 100).toFixed(1)
        : '0.0';

    // Most active day
    const dayFrequency: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
        const dayName = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'long' });
        dayFrequency[dayName] = (dayFrequency[dayName] || 0) + 1;
    });
    
    const mostActiveDay = Object.entries(dayFrequency).reduce((max, [day, count]) => 
        count > max.count ? { day, count } : max, 
        { day: 'None', count: 0 }
    );

    // Meal type breakdown
    const mealTypeBreakdown = selectedMealTypes.map(mealType => {
        const count = filteredEntries.filter(entry => entry.meal_type === mealType).length;
        const percentage = filteredEntries.length > 0 ? ((count / filteredEntries.length) * 100).toFixed(0) : '0';
        return { mealType, count, percentage };
    });

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Entry Frequency
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.primaryContainer,
                        flex: 1,
                        marginRight: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="counter" size={16} color={theme.colors.onPrimaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                            Total Entries
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onPrimaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {filteredEntries.length}
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.secondaryContainer,
                        flex: 1,
                        marginHorizontal: 2,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="calendar-check" size={16} color={theme.colors.onSecondaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
                            Active Days
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onSecondaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {uniqueDates.length}
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.tertiaryContainer,
                        flex: 1,
                        marginLeft: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="trending-up" size={16} color={theme.colors.onTertiaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onTertiaryContainer }}>
                            Per Day
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onTertiaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {entriesPerDay}
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 12 }}>
                    <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 4 }]}>
                        Activity Overview
                    </Text>
                    <View style={styles.row}>
                        <View style={[styles.chip, {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                            borderWidth: 1,
                            flex: 1,
                            marginRight: 4,
                            alignItems: 'center'
                        }]}>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Completion Rate
                            </Text>
                            <Text variant="labelMedium" style={{ 
                                color: theme.colors.onSurface,
                                fontWeight: 'bold' 
                            }}>
                                {completionRate}%
                            </Text>
                        </View>

                        <View style={[styles.chip, {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                            borderWidth: 1,
                            flex: 1,
                            marginLeft: 4,
                            alignItems: 'center'
                        }]}>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Most Active Day
                            </Text>
                            <Text variant="labelMedium" style={{ 
                                color: theme.colors.onSurface,
                                fontWeight: 'bold' 
                            }}>
                                {mostActiveDay.day}
                            </Text>
                        </View>
                    </View>
                </View>

                {mealTypeBreakdown.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                        <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 4 }]}>
                            Meal Type Distribution
                        </Text>
                        <View style={styles.row}>
                            {mealTypeBreakdown.map(({ mealType, count, percentage }) => (
                                <View key={mealType} style={[styles.chip, {
                                    backgroundColor: theme.colors.surfaceVariant,
                                    flex: 1,
                                    marginHorizontal: 1,
                                    alignItems: 'center'
                                }]}>
                                    <Text variant="bodySmall" style={{ 
                                        color: theme.colors.onSurfaceVariant,
                                        textTransform: 'capitalize',
                                        fontSize: 10
                                    }}>
                                        {mealType}
                                    </Text>
                                    <Text variant="labelMedium" style={{ 
                                        color: theme.colors.onSurfaceVariant,
                                        fontWeight: 'bold' 
                                    }}>
                                        {count}
                                    </Text>
                                    <Text variant="bodySmall" style={{ 
                                        color: theme.colors.onSurfaceVariant,
                                        fontSize: 9
                                    }}>
                                        ({percentage}%)
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}