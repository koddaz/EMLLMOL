import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

interface MealSelectorProps {
    dbHook: any;
    diaryState: {
        foodType: string;
        setFoodType: (value: string) => void;
    };
    isSaving: boolean;
}

export function MealSelector({ dbHook, diaryState, isSaving }: MealSelectorProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="food-fork-drink" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Meal
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.chipContainer}>
                    {dbHook.foodOptions.map((option: any) => (
                        <Button
                            key={option}
                            mode={diaryState.foodType === option ? "contained" : "outlined"}
                            onPress={() => diaryState.setFoodType(option)}
                            style={[
                                styles.chip,
                                diaryState.foodType === option && { backgroundColor: theme.colors.primary }
                            ]}
                            labelStyle={{
                                fontSize: 12,
                                color: diaryState.foodType === option ? theme.colors.onPrimary : theme.colors.onSurface
                            }}
                            compact
                            disabled={isSaving}
                        >
                            {option}
                        </Button>
                    ))}
                </View>
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}