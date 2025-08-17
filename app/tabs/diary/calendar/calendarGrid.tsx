import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useMemo } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export function CalendarGrid(
    { diaryEntries, calendarHook }: {
        diaryEntries: DiaryData[],
        calendarHook: any
    }
) {
    const { theme, styles } = useAppTheme();

    const entriesMap = useMemo(() => {
        return diaryEntries.reduce((acc, entry) => {
            // Create a proper Date object from the timestamp
            const entryDate = new Date(entry.created_at);

            // Use local date string to avoid timezone issues
            const year = entryDate.getFullYear();
            const month = String(entryDate.getMonth() + 1).padStart(2, '0');
            const day = String(entryDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;

            acc[dateKey] = true;
            return acc;
        }, {} as Record<string, boolean>);
    }, [diaryEntries]);

    const hasEntry = (date: Date) => {
        // Use the same local date formatting
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        return entriesMap[dateKey] || false;
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };


    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weekdayHeaders = weekdays.map(day => (
        <View key={day} style={styles.weekdayHeader}>
            <Text
                variant="labelMedium"
                style={styles.calendarWeekDay}
            >
                {day}
            </Text>
        </View>
    ));

    const daysInMonth = getDaysInMonth(calendarHook.currentMonth);
    const firstDay = getFirstDayOfMonth(calendarHook.currentMonth);
    const days = [];

    const prevMonth = new Date(calendarHook.currentMonth.getFullYear(), calendarHook.currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);

    // Add days from the previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);

        days.push(
            <View key={`prev-${day}`} style={styles.calendarDay}>
                <Button
                    mode="text"
                    onPress={() => {
                        calendarHook.setSelectedDate(date);
                        calendarHook.setCurrentMonth(prevMonth);
                    }}
                    style={styles.calendarDayButton}
                    contentStyle={styles.calendarDayContent}
                    labelStyle={[
                        styles.calendarDayLabel,
                        {
                            color: theme.colors.onSurfaceVariant,
                            opacity: 0.4
                        }
                    ]}
                    compact
                >
                    {day}
                </Button>
            </View>
        );
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(calendarHook.currentMonth.getFullYear(), calendarHook.currentMonth.getMonth(), day);
        const isSelected = calendarHook.selectedDate.toDateString() === date.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();
        const hasDiaryEntry = hasEntry(date);

        days.push(
            <View key={day} style={styles.calendarDay}>

                <Button
                    mode="text"
                    onPress={() => {
                        calendarHook.setSelectedDate(date);
                        calendarHook.toggleCalendar();
                    }}
                    style={[
                        styles.calendarDayButton,
                        isSelected && {
                            backgroundColor: theme.colors.primary,
                            elevation: 2,
                            shadowColor: theme.colors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                        },
                        isToday && !isSelected && {
                            backgroundColor: theme.colors.primaryContainer,
                            borderWidth: 1,
                            borderColor: theme.colors.primary,
                        }
                    ]}
                    contentStyle={[
                        styles.calendarDayContent,
                        isSelected && { backgroundColor: 'transparent' },
                        isToday && !isSelected && { backgroundColor: 'transparent' }
                    ]}
                    labelStyle={[
                        styles.calendarDayLabel,
                        {
                            color: isSelected
                                ? theme.colors.onPrimary
                                : isToday
                                    ? theme.colors.primary
                                    : theme.colors.onSurface,
                            fontWeight: isSelected || isToday ? '600' : '500'
                        }
                    ]}
                    compact
                >
                    {day}
                </Button>
                {hasDiaryEntry && (
                    <View style={{
                        position: 'absolute',
                        bottom: 2,
                        alignSelf: 'center',
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: isSelected ? theme.colors.onPrimary : theme.colors.primary,
                    }} />
                )}
            </View>
        );
    }

    // Add days from next month to complete the grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    const nextMonth = new Date(calendarHook.currentMonth.getFullYear(), calendarHook.currentMonth.getMonth() + 1, 1);

    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);

        days.push(
            <View key={`next-${day}`} style={styles.calendarDay}>
                <Button
                    mode="text"
                    onPress={() => {
                        calendarHook.setSelectedDate(date);
                        calendarHook.setCurrentMonth(nextMonth);
                    }}
                    style={styles.calendarDayButton}
                    contentStyle={styles.calendarDayContent}
                    labelStyle={[
                        styles.calendarDayLabel,
                        {
                            color: theme.colors.onSurfaceVariant,
                            opacity: 0.4
                        }
                    ]}
                    compact
                >
                    {day}
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.calendarContainer}>
            <View style={styles.weekdayRow}>
                {weekdayHeaders}
            </View>
            <View style={styles.calendarGrid}>
                {days}
            </View>
        </View>
    );
}