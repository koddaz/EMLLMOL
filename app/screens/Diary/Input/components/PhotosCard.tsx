import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { Avatar, IconButton, Text } from "react-native-paper";

interface PhotosCardProps {
    cameraHook: {
        photoURIs: string[];
        removePhotoURI: (index: number) => void;
    };
    isSaving: boolean;
}

export function PhotosCard({ cameraHook, isSaving }: PhotosCardProps) {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="camera" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Photos
                </Text>
            </View>
            <View style={styles.content}>
                {cameraHook.photoURIs.length > 0 ? (
                    <ScrollView horizontal style={styles.photoScroll}>
                        {cameraHook.photoURIs.map((uri: string, index: any) => (
                            <View key={index} style={styles.photoItem}>
                                <Avatar.Image size={60} source={{ uri }} />
                                <IconButton
                                    icon="close"
                                    size={16}
                                    onPress={() => cameraHook.removePhotoURI(index)}
                                    style={styles.photoDelete}
                                    iconColor={theme.colors.onErrorContainer}
                                    disabled={isSaving}
                                />
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        No photos added yet
                    </Text>
                )}
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}