import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

interface SettingsHeaderProps {
    editMode: boolean;
    setEditMode: (mode: boolean) => void;
}

export function SettingsHeader({ editMode, setEditMode }: SettingsHeaderProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.topContainer}>
            <View style={styles.chip}>
                <MaterialCommunityIcons name="cog" size={24} color={theme.colors.onSecondary} />
            </View>
            <Text variant="titleLarge" style={{ flex: 1, marginLeft: 8 }}>
                Settings
            </Text>
            <IconButton
                icon="information"
                size={20}
                iconColor={theme.colors.onSecondaryContainer}
                style={{ margin: 0 }}
                onPress={() => console.log('Info pressed')}
            />
            <IconButton
                icon="pencil"
                size={20}
                iconColor={theme.colors.onSecondaryContainer}
                style={{ margin: 0 }}
                onPress={() => setEditMode(!editMode)}
            />
            <IconButton
                icon="shield-account"
                size={20}
                iconColor={theme.colors.onSecondaryContainer}
                style={{ margin: 0 }}
                onPress={() => console.log('Privacy pressed')}
            />
        </View>
    );
}