import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

interface StatisticsHeaderProps {
    selectedPeriod: number;
    selectedMealTypes: string[];
}

export function StatisticsHeader({ selectedPeriod, selectedMealTypes }: StatisticsHeaderProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.topContainer}>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.onSecondary} />
            </View>
            <Text variant="titleLarge" style={{ flex: 1, marginLeft: 8 }}>
                Statistics
            </Text>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="calendar-range" size={16} color={theme.colors.onSecondary} />
                <Text variant="bodySmall">{selectedPeriod}d</Text>
            </View>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="food" size={16} color={theme.colors.onSecondary} />
                <Text variant="bodySmall">{selectedMealTypes.length}</Text>
            </View>
        </View>
    );
}