import { SafeAreaView, StyleSheet, View } from "react-native";
import { Icon, MD3Theme, Text } from "react-native-paper";
import { useAppTheme } from "./constants/UI/theme";

export function TestLayout() {
    const { theme, styles } = useAppTheme();

    return (
        <View style={styles.background}>
            <View style={styles.topContainer}>

                <View style={styles.chip}>
                    <Icon source="star" size={24} color={theme.colors.onSecondary} />
                </View>


                <View style={styles.chip}>
                    <Icon source="blood-bag" size={16} color={theme.colors.onPrimary} />
                    <Text variant="bodySmall">5.5 mmol/l</Text>
                </View>
                <View style={styles.chip}>
                    <Icon source="blood-bag" size={16} color={theme.colors.onPrimary} />
                    <Text variant="bodySmall">5.5 mmol/l</Text>
                </View>




            </View>

            <View style={styles.container}>

                <View style={styles.listItem}>
                    <View style={styles.header}>
                        <View style={styles.chip}>
                            <Icon source="star" size={16} color={theme.colors.onPrimary} />
                        </View>
                        <Text variant="labelSmall">18:31</Text>
                    </View>

                    <View style={styles.row}>

                        <View style={[styles.content, { flexDirection: 'row' }]}>
                            <View style={styles.chip}>
                                <Icon source="blood-bag" size={16} color={theme.colors.onPrimary} />
                                <Text variant="bodySmall">5.5 mmol/l</Text>
                            </View>
                            <View style={styles.chip}>
                                <Icon source="food" size={16} color={theme.colors.onPrimary} />
                                <Text variant="bodySmall">60 g</Text>
                            </View>

                        </View>
                    </View>
                    <View style={styles.footer}>
                    </View>
                </View>

                {/* for the settings */}
                <View style={styles.box}>
                    <View style={styles.header}>
                        <Text variant="headlineSmall">Header</Text>
                    </View>
                    <View style={styles.content}>
                        <Text variant="bodyMedium">Content goes here...</Text>
                    </View>
                    <View style={styles.footer}>
                        <Text variant="labelSmall">Footer</Text>
                    </View>
                </View>
            </View>
        </View>



    );
}

export const mainStyle = (theme: MD3Theme) => StyleSheet.create({

    background: {
        flex: 1,
        backgroundColor: theme.colors.background,

    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: 'transparent'
    },

    topContainer: {
        flexDirection: 'row',
        padding: 8,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        borderTopWidth: 0,
        borderWidth: 1,
        backgroundColor: theme.colors.secondaryContainer,
        alignItems: 'center',
        minHeight: 56,
        marginBottom: 16,
    },

    listItem: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
        marginVertical: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    chip: {
        flexDirection: 'row',
        backgroundColor: theme.colors.secondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 4,
        gap: 4,
    },


    box: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
    },

    content: {
        padding: 8,
        backgroundColor: theme.colors.surface,
    },

    header: {
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        padding: 8,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: theme.colors.secondaryContainer,
    },

    footer: {
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        padding: 8,
        flexDirection: 'row',
        backgroundColor: theme.colors.secondaryContainer,
    },

    iconButton: {
        margin: 4,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 8,
        padding: 4,
    }



})