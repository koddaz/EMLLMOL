import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

interface MealTypeFilterProps {
    selectedMealTypes: string[];
    onMealTypeToggle: (mealType: string) => void;
}

export function MealTypeFilter({ selectedMealTypes, onMealTypeToggle }: MealTypeFilterProps) {
    const { theme, styles } = useAppTheme();
    
    const mealTypes = [
        { value: 'breakfast', label: 'Breakfast', icon: 'coffee' },
        { value: 'lunch', label: 'Lunch', icon: 'food' },
        { value: 'dinner', label: 'Dinner', icon: 'food-variant' },
        { value: 'snack', label: 'Snack', icon: 'food-apple' }
    ];

    const getMealTypeColor = (mealType: string) => {
        const colors = {
            'breakfast': theme.colors.primary,
            'lunch': theme.colors.secondary,
            'dinner': theme.colors.tertiary,
            'snack': theme.colors.error
        };
        return colors[mealType as keyof typeof colors] || theme.colors.primary;
    };

    const getMealTypeOnColor = (mealType: string) => {
        const colors = {
            'breakfast': theme.colors.onPrimary,
            'lunch': theme.colors.onSecondary,
            'dinner': theme.colors.onTertiary,
            'snack': theme.colors.onError
        };
        return colors[mealType as keyof typeof colors] || theme.colors.onPrimary;
    };

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="food-fork-drink" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Meal Types
                </Text>
                <View style={{ marginLeft: 'auto' }}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
                        {selectedMealTypes.length}/4 selected
                    </Text>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.chipContainer}>
                    {mealTypes.map((mealType) => {
                        const isSelected = selectedMealTypes.includes(mealType.value);
                        return (
                            <Button
                                key={mealType.value}
                                mode={isSelected ? "contained" : "outlined"}
                                onPress={() => onMealTypeToggle(mealType.value)}
                                style={[
                                    styles.chip,
                                    isSelected && { backgroundColor: getMealTypeColor(mealType.value) }
                                ]}
                                labelStyle={{
                                    fontSize: 12,
                                    color: isSelected ? getMealTypeOnColor(mealType.value) : theme.colors.onSurface
                                }}
                                icon={mealType.icon}
                                compact
                            >
                                {mealType.label}
                            </Button>
                        );
                    })}
                </View>
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}