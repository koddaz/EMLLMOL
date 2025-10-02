import { AppData } from "@/app/constants/interface/appData";
import { useState, useMemo, useCallback } from "react";

export function useCalendar(appData: AppData | null) {
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
    const dateFormat = appData?.settings?.dateFormat || 'en';
    if (dateFormat === 'en') {
      return date.toISOString().split('T')[0];
    } else if (dateFormat === 'us') {
      const isoString = date.toISOString().split('T')[0];
      const [year, month, day] = isoString.split('-');
      return `${month}-${day}-${year}`;
    }
  }, [appData?.settings?.dateFormat]);

  const formatTime = useCallback((date: Date) => {
    const clockFormat = appData?.settings?.clockFormat || '24h';
    if (clockFormat === '12h') {
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
  }, [appData?.settings?.clockFormat]);

  const getDaysInMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    const thisMonth = new Date();

    // Reset to the first day BEFORE changing month to avoid date overflow
    newMonth.setDate(1);

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