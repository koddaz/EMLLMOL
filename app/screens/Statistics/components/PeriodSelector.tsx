import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

interface PeriodSelectorProps {
    selectedPeriod: number;
    onPeriodChange: (period: number) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
    const { theme, styles } = useAppTheme();
    
    const periods = [
        { value: 7, label: '7 Days', icon: 'calendar-week' },
        { value: 14, label: '14 Days', icon: 'calendar-range' },
        { value: 30, label: '30 Days', icon: 'calendar-month' }
    ];

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Time Period
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.chipContainer}>
                    {periods.map((period) => (
                        <Button
                            key={period.value}
                            mode={selectedPeriod === period.value ? "contained" : "outlined"}
                            onPress={() => onPeriodChange(period.value)}
                            style={[
                                styles.chip,
                                selectedPeriod === period.value && { backgroundColor: theme.colors.primary }
                            ]}
                            labelStyle={{
                                fontSize: 12,
                                color: selectedPeriod === period.value ? theme.colors.onPrimary : theme.colors.onSurface
                            }}
                            icon={period.icon}
                            compact
                        >
                            {period.label}
                        </Button>
                    ))}
                </View>
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}