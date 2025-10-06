import { customStyles } from "@/app/constants/UI/styles";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useMemo } from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

export function CalendarNavigation(
    { calendarHook }: {
        calendarHook: any
    }
) {
    const { theme, styles } = useAppTheme();
    const thisMonth = new Date();
    const disabled = calendarHook.currentMonth.getFullYear() > thisMonth.getFullYear() ||
        (calendarHook.currentMonth.getFullYear() === thisMonth.getFullYear() &&
            calendarHook.currentMonth.getMonth() >= thisMonth.getMonth());


    return (
        <View style={styles.calendarNavigationContainer}>
            <IconButton
                iconColor={theme.colors.onPrimaryContainer}
                size={25}
                icon="calendar-today"
                mode="contained-tonal"
                onPress={() => {
                    calendarHook.setSelectedDate(new Date())
                    calendarHook.toggleCalendar()
                }}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                    
                }}
            />
            <IconButton
                iconColor={theme.colors.onPrimaryContainer}
                size={25}
                icon="chevron-left"
                mode="contained-tonal"
                onPress={() => calendarHook.navigateMonth('prev')}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                }}
            />
            <View style={[styles.container, { flex: 1, alignItems: 'center' }]}>
                <Text variant="titleMedium" style={{
                    color: theme.colors.onPrimaryContainer,
                    fontWeight: '600',
                    letterSpacing: 0.25
                }}>
                    {calendarHook.currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>
            </View>
            <IconButton
                iconColor={disabled ? theme.colors.onSurfaceDisabled : theme.colors.onPrimaryContainer}
                size={25}
                icon="chevron-right"
                mode="contained"
                onPress={() => calendarHook.navigateMonth('next')}
                disabled={disabled}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                }}
            />
        </View>
    );
}