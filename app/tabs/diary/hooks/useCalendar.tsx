import { customStyles } from "@/app/constants/UI/styles";
import { useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Surface, Text, useTheme } from "react-native-paper";

export function useCalendar() {
  const theme = useTheme();
  const styles = customStyles(theme);

  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(internalSelectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setInternalSelectedDate(newDate);
  }

  const renderCalendarNavigation = () => {
  return (
    <View style={styles.calendarNavigationContainer}>
      <IconButton
        iconColor={theme.colors.primary}
        size={28}
        icon="chevron-left"
        mode="contained-tonal"
        onPress={() => navigateMonth('prev')}
        style={{
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 12,
        }}
      />
      <View style={{ 
        flex: 1, 
        alignItems: 'center',
        paddingVertical: 8
      }}>
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
        iconColor={theme.colors.primary}
        size={28}
        icon="chevron-right"
        mode="contained-tonal"
        onPress={() => navigateMonth('next')}
        style={{
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

  const renderCalendarGrid = (externalSelectedDate?: Date, externalSetSelectedDate?: (date: Date) => void) => {
    const selectedDate = externalSelectedDate || internalSelectedDate;
    const setSelectedDate = externalSetSelectedDate || setInternalSelectedDate;

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
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
              setSelectedDate(date);
              setCurrentMonth(prevMonth);
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
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <View key={day} style={styles.calendarDay}>
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
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
        </View>
      );
    }

    // Add days from next month to complete the grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);

      days.push(
        <View key={`next-${day}`} style={styles.calendarDay}>
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
              setCurrentMonth(nextMonth);
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
  };

  return {
    selectedDate: internalSelectedDate,
    setSelectedDate: setInternalSelectedDate,
    setShowCalendar,
    setCurrentMonth,
    showCalendar,

    toggleCalendar,

    formatDate,
    formatTime,


    currentMonth,

    getDaysInMonth,
    getFirstDayOfMonth,

    navigateMonth,
    navigateDate,

    renderCalendarGrid,
    renderCalendarNavigation
  }
}