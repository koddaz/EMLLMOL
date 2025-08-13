import { useState } from "react";

export function useCalendar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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