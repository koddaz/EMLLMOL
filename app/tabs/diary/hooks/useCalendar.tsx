import { customStyles } from "@/app/constants/UI/styles";
import { useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Surface, Text, useTheme } from "react-native-paper";

export function useCalendar() {
  const theme = useTheme();
  const styles = customStyles(theme);

  const onClose = () => {
    setShowCalendar(false);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

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
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  }

  const renderCalendarNavigation = () => {
    return (
      <View style={[styles.row, { justifyContent: 'space-between', width: '100%' }]}>
        <IconButton
          iconColor={theme.colors.primary}
          size={24}
          icon="chevron-left"
          mode="outlined"
          onPress={() => navigateMonth('prev')}
          style={{ borderColor: theme.colors.primary, borderWidth: 2 }}
        />
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
        </Text>
        <IconButton
          iconColor={theme.colors.primary}
          size={24}
          icon="chevron-right"
          mode="outlined"
          onPress={() => navigateMonth('next')}
          style={{ borderColor: theme.colors.primary, borderWidth: 2 }}
        />
      </View>
    );
  };

  const renderCalendarGrid = () => {
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
        <Surface
          key={`prev-${day}`}
          style={[styles.calendarDay, { opacity: 0.5 }]}
          elevation={0}
        >
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
              setCurrentMonth(prevMonth);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <Surface
          key={day}
          style={[
            styles.calendarDay,
            isSelected && { backgroundColor: theme.colors.primary },
            isToday && !isSelected && { backgroundColor: theme.colors.primaryContainer }
          ]}
          elevation={isSelected ? 2 : 0}
        >
          <Button
            mode={isSelected ? "contained" : "text"}
            onPress={() => {
              setSelectedDate(date);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: isSelected ? theme.colors.onPrimary :
                isToday ? theme.colors.primary : theme.colors.onSurface
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    // Add days from next month to complete the grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);

      days.push(
        <Surface
          key={`next-${day}`}
          style={[styles.calendarDay, { opacity: 0.5 }]}
          elevation={0}
        >
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
              setCurrentMonth(nextMonth);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    return days;
  };

  return {
    selectedDate,
    setSelectedDate,
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