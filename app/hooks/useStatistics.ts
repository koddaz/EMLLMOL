import { useState, useCallback, useMemo } from "react";
import { DiaryData } from "@/app/constants/interface/diaryData";

export function useStatistics(diaryEntries?: DiaryData[]) {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [selectedMealTypes, setSelectedMealTypes] = useState(['breakfast', 'lunch', 'dinner', 'snack']);
  const [currentSection, setCurrentSection] = useState<'summary' | 'carbs' | 'glucose'>('summary');

  // Meal type colors
  const mealColors = {
    breakfast: '#ff9500', // Orange
    lunch: '#34c759',     // Green
    dinner: '#007aff',    // Blue
    snack: '#ff3b30'      // Red
  };

  // Generate date array
  const generateDateArray = useCallback((days: number) => {
    const array: Date[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      array.push(date);
    }
    return array;
  }, []);

  // Process glucose data by meal type
  const processGlucoseData = useCallback((entries: DiaryData[], days: number) => {
    const daysArray = generateDateArray(days);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

    mealTypes.forEach(mealType => {
      const dataByDate: { [key: string]: number[] } = {};

      entries.forEach((entry) => {
        if (entry.glucose && entry.glucose > 0 && entry.meal_type === mealType) {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          if (!dataByDate[date]) dataByDate[date] = [];
          dataByDate[date].push(entry.glucose);
        }
      });

      result[mealType] = daysArray.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0];
        const values = dataByDate[dateStr] || [];
        const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        return { x: i, y: avg, date: dateStr };
      });
    });

    return result;
  }, [generateDateArray]);

  // Process carbs data by meal type
  const processCarbsData = useCallback((entries: DiaryData[], days: number) => {
    const daysArray = generateDateArray(days);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

    mealTypes.forEach(mealType => {
      const dataByDate: { [key: string]: number } = {};

      entries.forEach((entry) => {
        if (entry.carbs && entry.carbs > 0 && entry.meal_type === mealType) {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          dataByDate[date] = (dataByDate[date] || 0) + entry.carbs;
        }
      });

      result[mealType] = daysArray.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0];
        return { x: i, y: dataByDate[dateStr] || 0, date: dateStr };
      });
    });

    return result;
  }, [generateDateArray]);

  // Process entries data by meal type
  const processEntriesData = useCallback((entries: DiaryData[], days: number) => {
    const daysArray = generateDateArray(days);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

    mealTypes.forEach(mealType => {
      const countByDate: { [key: string]: number } = {};

      entries.forEach((entry) => {
        if (entry.meal_type === mealType) {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          countByDate[date] = (countByDate[date] || 0) + 1;
        }
      });

      result[mealType] = daysArray.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0];
        return { x: i, y: countByDate[dateStr] || 0, date: dateStr };
      });
    });

    return result;
  }, [generateDateArray]);

  // Calculate median glucose for the current period
  const medianGlucose = useMemo(() => {
    if (!diaryEntries || diaryEntries.length === 0) return 0;

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - selectedPeriod);

    const glucoseValues = diaryEntries
      .filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entry.glucose &&
               entry.glucose > 0 &&
               entryDate >= startDate &&
               entryDate <= endDate;
      })
      .map(entry => entry.glucose)
      .sort((a, b) => a - b);

    if (glucoseValues.length === 0) return 0;

    const mid = Math.floor(glucoseValues.length / 2);
    return glucoseValues.length % 2 !== 0
      ? glucoseValues[mid]
      : (glucoseValues[mid - 1] + glucoseValues[mid]) / 2;
  }, [diaryEntries, selectedPeriod]);

  // Process glucose data for chart (combined all meals)
  const processGlucoseChartData = useCallback((entries: DiaryData[], days: number) => {
    if (days === 1) {
      // Hourly view for today
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Create 24 hour slots
      const hourlyData: { [hour: number]: number[] } = {};

      entries.forEach((entry) => {
        const entryDate = new Date(entry.created_at);
        if (entry.glucose && entry.glucose > 0 &&
            entryDate >= startOfDay && entryDate < endOfDay) {
          const hour = entryDate.getHours();
          if (!hourlyData[hour]) hourlyData[hour] = [];
          hourlyData[hour].push(entry.glucose);
        }
      });

      // Generate data for each hour
      return Array.from({ length: 24 }, (_, hour) => {
        const values = hourlyData[hour] || [];
        const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        return {
          x: hour,
          y: avg,
          date: `${hour}:00`,
          hasData: values.length > 0
        };
      });
    } else {
      // Daily view for multiple days
      const daysArray = generateDateArray(days);
      const dataByDate: { [key: string]: number[] } = {};

      entries.forEach((entry) => {
        if (entry.glucose && entry.glucose > 0) {
          const date = new Date(entry.created_at).toISOString().split('T')[0];
          if (!dataByDate[date]) dataByDate[date] = [];
          dataByDate[date].push(entry.glucose);
        }
      });

      return daysArray.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0];
        const values = dataByDate[dateStr] || [];
        const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
        return { x: i, y: avg, date: dateStr, hasData: values.length > 0 };
      });
    }
  }, [generateDateArray]);

  // Memoized processed data
  const glucoseDataByMeal = useMemo(() =>
    processGlucoseData(diaryEntries || [], selectedPeriod),
    [diaryEntries, selectedPeriod, processGlucoseData]
  );

  const glucoseChartData = useMemo(() =>
    processGlucoseChartData(diaryEntries || [], selectedPeriod),
    [diaryEntries, selectedPeriod, processGlucoseChartData]
  );

  const carbsDataByMeal = useMemo(() =>
    processCarbsData(diaryEntries || [], selectedPeriod),
    [diaryEntries, selectedPeriod, processCarbsData]
  );

  const entriesDataByMeal = useMemo(() =>
    processEntriesData(diaryEntries || [], selectedPeriod),
    [diaryEntries, selectedPeriod, processEntriesData]
  );

  // Summary statistics calculations
  const summaryStats = useMemo(() => {
    if (!diaryEntries || diaryEntries.length === 0) {
      return {
        totalMeals: 0,
        totalCarbs: 0,
        totalInsulin: 0,
        carbsByMeal: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
        insulinByMeal: { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
      };
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - selectedPeriod);

    const filteredEntries = diaryEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startDate && entryDate <= endDate;
    });

    const totalMeals = filteredEntries.length;
    const totalCarbs = filteredEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
    const totalInsulin = filteredEntries.reduce((sum, entry) => sum + (entry.insulin || 0), 0);

    const carbsByMeal = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
    const insulinByMeal = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };

    filteredEntries.forEach(entry => {
      const mealType = entry.meal_type as keyof typeof carbsByMeal;
      if (mealType && carbsByMeal.hasOwnProperty(mealType)) {
        carbsByMeal[mealType] += entry.carbs || 0;
        insulinByMeal[mealType] += entry.insulin || 0;
      }
    });

    return {
      totalMeals,
      totalCarbs,
      totalInsulin,
      carbsByMeal,
      insulinByMeal
    };
  }, [diaryEntries, selectedPeriod]);

  return {
    // State
    selectedPeriod,
    setSelectedPeriod,
    selectedMealTypes,
    setSelectedMealTypes,
    currentSection,
    setCurrentSection,

    // Constants
    mealColors,

    // Calculated values
    medianGlucose,
    summaryStats,

    // Processed data
    glucoseDataByMeal,
    glucoseChartData,
    carbsDataByMeal,
    entriesDataByMeal,

    // Utility functions
    generateDateArray,
    processGlucoseData,
    processCarbsData,
    processEntriesData,
    processGlucoseChartData,


  };
}