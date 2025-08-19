import { customStyles } from "@/app/constants/UI/styles";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useMemo } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export function CalendarNavigation(
    { currentMonth, navigateMonth }: {
        currentMonth: Date;
        navigateMonth: (direction: 'prev' | 'next') => void;
    }
) {
    const { theme, styles } = useAppTheme();
    const thisMonth = new Date();
    const disabled = currentMonth.getFullYear() > thisMonth.getFullYear() ||
        (currentMonth.getFullYear() === thisMonth.getFullYear() &&
            currentMonth.getMonth() >= thisMonth.getMonth());


    return (
        <View style={styles.calendarNavigationContainer}>
            <IconButton
                iconColor={theme.colors.onSecondary}
                size={28}
                icon="chevron-left"
                mode="contained-tonal"
                onPress={() => navigateMonth('prev')}
                style={{
                    backgroundColor: theme.colors.secondary,
                    borderRadius: 12,
                }}
            />
            <View style={[styles.plaincontainer, {flex: 1, alignItems: 'center'}]}>
                <Text variant="titleLarge" style={{
                    color: theme.colors.onSurface,
                    fontWeight: '600',
                    letterSpacing: 0.25
                }}>
                    {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>
            </View>
            <IconButton
                iconColor={disabled ? theme.colors.onSurfaceDisabled : theme.colors.secondary}
                size={28}
                icon="chevron-right"
                mode="contained-tonal"
                onPress={() => navigateMonth('next')}
                disabled={disabled}
                style={{
                    backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.onSecondary,
                    borderRadius: 12,
                }}
            />
        </View>
    );
}