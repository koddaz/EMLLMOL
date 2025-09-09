import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface GlucoseRangeCardProps {
    filteredEntries: DiaryData[];
    glucoseUnit: string;
}

export function GlucoseRangeCard({ filteredEntries, glucoseUnit }: GlucoseRangeCardProps) {
    const { theme, styles } = useAppTheme();

    const glucoseValues = filteredEntries.map(entry => entry.glucose || 0).filter(val => val > 0);
    
    if (glucoseValues.length === 0) {
        return (
            <View style={styles.box}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="chart-areaspline" size={20} color={theme.colors.onSecondaryContainer} />
                    <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                        Glucose Range
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text variant="bodyMedium" style={{ 
                        color: theme.colors.onSurfaceVariant,
                        textAlign: 'center',
                        paddingVertical: 16
                    }}>
                        No glucose data available for the selected period
                    </Text>
                </View>
                <View style={styles.footer}></View>
            </View>
        );
    }

    const minGlucose = Math.min(...glucoseValues);
    const maxGlucose = Math.max(...glucoseValues);
    const range = maxGlucose - minGlucose;
    
    // Define glucose ranges (assuming mmol/L, adjust for mg/dL)
    const isMMOL = glucoseUnit.toLowerCase().includes('mmol');
    const ranges = isMMOL ? {
        low: { min: 0, max: 4.0, label: 'Low', color: theme.colors.error },
        normal: { min: 4.0, max: 7.0, label: 'Normal', color: theme.colors.primary },
        high: { min: 7.0, max: 10.0, label: 'Elevated', color: theme.colors.tertiary },
        veryHigh: { min: 10.0, max: Infinity, label: 'High', color: theme.colors.error }
    } : {
        low: { min: 0, max: 72, label: 'Low', color: theme.colors.error },
        normal: { min: 72, max: 126, label: 'Normal', color: theme.colors.primary },
        high: { min: 126, max: 180, label: 'Elevated', color: theme.colors.tertiary },
        veryHigh: { min: 180, max: Infinity, label: 'High', color: theme.colors.error }
    };

    // Categorize readings
    const categorizedReadings = Object.entries(ranges).reduce((acc, [key, range]) => {
        const count = glucoseValues.filter(val => val >= range.min && val < range.max).length;
        const percentage = glucoseValues.length > 0 ? ((count / glucoseValues.length) * 100).toFixed(1) : '0';
        acc[key] = { ...range, count, percentage };
        return acc;
    }, {} as any);

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="chart-areaspline" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Glucose Range Analysis
                </Text>
            </View>
            <View style={styles.content}>
                {/* Min/Max/Range */}
                <View style={styles.row}>
                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.errorContainer,
                        flex: 1,
                        marginRight: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="arrow-down" size={16} color={theme.colors.onErrorContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer }}>
                            Minimum
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onErrorContainer,
                            fontWeight: 'bold' 
                        }}>
                            {minGlucose.toFixed(1)} {glucoseUnit}
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.primaryContainer,
                        flex: 1,
                        marginHorizontal: 2,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="arrow-up" size={16} color={theme.colors.onPrimaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
                            Maximum
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onPrimaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {maxGlucose.toFixed(1)} {glucoseUnit}
                        </Text>
                    </View>

                    <View style={[styles.chip, {
                        backgroundColor: theme.colors.secondaryContainer,
                        flex: 1,
                        marginLeft: 4,
                        alignItems: 'center'
                    }]}>
                        <MaterialCommunityIcons name="arrow-left-right" size={16} color={theme.colors.onSecondaryContainer} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
                            Range
                        </Text>
                        <Text variant="labelLarge" style={{ 
                            color: theme.colors.onSecondaryContainer,
                            fontWeight: 'bold' 
                        }}>
                            {range.toFixed(1)} {glucoseUnit}
                        </Text>
                    </View>
                </View>

                {/* Range Distribution */}
                <View style={{ marginTop: 12 }}>
                    <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 8 }]}>
                        Range Distribution
                    </Text>
                    {Object.entries(categorizedReadings).map(([key, data]: [string, any]) => {
                        if (data.count === 0) return null;
                        
                        return (
                            <View key={key} style={[styles.chip, {
                                backgroundColor: `${data.color}20`,
                                borderColor: data.color,
                                borderWidth: 1,
                                marginVertical: 2,
                                justifyContent: 'space-between'
                            }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text variant="labelMedium" style={{ 
                                        color: data.color,
                                        fontWeight: 'bold',
                                        minWidth: 60
                                    }}>
                                        {data.label}
                                    </Text>
                                    <Text variant="bodySmall" style={{ 
                                        color: theme.colors.onSurfaceVariant,
                                        marginLeft: 8
                                    }}>
                                        {data.count} readings ({data.percentage}%)
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}