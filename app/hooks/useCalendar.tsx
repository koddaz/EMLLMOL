import { AppData } from "@/app/constants/interface/appData";
import { useState, useMemo, useCallback } from "react";

export function useCalendar(appData: AppData) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());


  const toggleCalendar = useCallback((value?: boolean) => {
    if (typeof value === "boolean") {
      setShowCalendar(value);
    } else {
      setShowCalendar((prev) => !prev);
    }
  }, []);

  const formatDate = useCallback((date: Date) => {
    if (appData.settings.dateFormat === 'DD/MM/YYYY') {
      return date.toISOString().split('T')[0];
    } else if (appData.settings.dateFormat === 'MM/DD/YYYY') {
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',

      });
    }
  }, [appData.settings.dateFormat]);

  const formatTime = useCallback((date: Date) => {
    if (appData.settings.clockFormat === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  }, [appData.settings.clockFormat]);

  const getDaysInMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    const thisMonth = new Date();

    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);

      if (newMonth.getFullYear() > thisMonth.getFullYear() ||
        (newMonth.getFullYear() === thisMonth.getFullYear()
          && newMonth.getMonth() > thisMonth.getMonth())) {
        newMonth.setFullYear(thisMonth.getFullYear(), thisMonth.getMonth());
      }
    }
    newMonth.setDate(1); // Reset to the first day of the month
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    setShowCalendar,
    setCurrentMonth,
    showCalendar,
    currentMonth,
    toggleCalendar,
    formatDate,
    formatTime,
    getDaysInMonth,
    getFirstDayOfMonth,
    navigateMonth,
    navigateDate,
  }
}