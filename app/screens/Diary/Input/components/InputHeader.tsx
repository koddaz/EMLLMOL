import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface InputHeaderProps {
    editingEntry: DiaryData | null;
    calendarHook: any;
}

export function InputHeader({ editingEntry, calendarHook }: InputHeaderProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.topContainer}>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="note" size={24} color={theme.colors.onSecondary} />
            </View>
            <Text variant="titleLarge" style={{ flex: 1, marginLeft: 8 }}>
                {editingEntry ? 'Edit Entry' : calendarHook.formatTime(new Date())}
            </Text>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.onSecondary} />
                <Text variant="bodySmall">
                    {editingEntry ? calendarHook.formatDate(editingEntry.created_at) : calendarHook.formatDate(new Date())}
                </Text>
            </View>
        </View>
    );
}