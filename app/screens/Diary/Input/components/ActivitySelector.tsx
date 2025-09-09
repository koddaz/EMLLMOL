import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

interface ActivitySelectorProps {
    dbHook: any;
    diaryState: {
        activity: string;
        setActivity: (value: string) => void;
    };
    isSaving: boolean;
}

export function ActivitySelector({ dbHook, diaryState, isSaving }: ActivitySelectorProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="run-fast" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Activity
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.chipContainer}>
                    {dbHook.activityOptions.map((option: any) => (
                        <Button
                            key={option}
                            mode={diaryState.activity === option ? "contained" : "outlined"}
                            onPress={() => diaryState.setActivity(option)}
                            style={[
                                styles.chip,
                                diaryState.activity === option && { backgroundColor: theme.colors.secondary }
                            ]}
                            labelStyle={{
                                fontSize: 12,
                                color: diaryState.activity === option ? theme.colors.onSecondary : theme.colors.onSurface
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