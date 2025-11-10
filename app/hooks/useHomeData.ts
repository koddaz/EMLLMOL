import { useMemo } from 'react';
import { DiaryData } from '@/app/constants/interface/diaryData';

export interface HomeData {
  totalCarbsToday: number;
  latestGlucose: {
    value: number;
    timestamp: Date;
  } | null;
  avgGlucoseToday: number;
  todaysMeals: Array<{
    id: string;
    name: string;
    time: string;
    carbs: number;
    glucose: number;
    mealType: string;
  }>;
}

export function useHomeData(diaryEntries: DiaryData[]): HomeData {
  // Get today's date boundaries
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  // Filter entries for today
  const todaysEntries = useMemo(() => {
    return diaryEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= startOfToday && entryDate < endOfToday;
    });
  }, [diaryEntries, startOfToday, endOfToday]);

  // Calculate total carbs for today
  const totalCarbsToday = useMemo(() => {
    return todaysEntries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  }, [todaysEntries]);

  // Get latest glucose reading
  const latestGlucose = useMemo(() => {
    const entriesWithGlucose = todaysEntries.filter(entry => entry.glucose && entry.glucose > 0);
    if (entriesWithGlucose.length === 0) return null;

    // Sort by timestamp descending to get most recent
    const sorted = [...entriesWithGlucose].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      value: sorted[0].glucose,
      timestamp: new Date(sorted[0].created_at)
    };
  }, [todaysEntries]);

  // Calculate average glucose for today
  const avgGlucoseToday = useMemo(() => {
    const entriesWithGlucose = todaysEntries.filter(entry => entry.glucose && entry.glucose > 0);
    if (entriesWithGlucose.length === 0) return 0;

    const sum = entriesWithGlucose.reduce((acc, entry) => acc + entry.glucose, 0);
    return Math.round(sum / entriesWithGlucose.length);
  }, [todaysEntries]);

  // Format today's meals list
  const todaysMeals = useMemo(() => {
    return todaysEntries
      .map(entry => {
        const entryTime = new Date(entry.created_at);
        const hours = entryTime.getHours();
        const minutes = entryTime.getMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Generate meal name from meal type
        const mealNames: { [key: string]: string } = {
          breakfast: 'Breakfast',
          lunch: 'Lunch',
          dinner: 'Dinner',
          snack: 'Snack'
        };
        const mealName = mealNames[entry.meal_type] || 'Meal';

        return {
          id: entry.id || '',
          name: entry.note || mealName,
          time: timeString,
          carbs: entry.carbs || 0,
          glucose: entry.glucose || 0,
          mealType: entry.meal_type
        };
      })
      .sort((a, b) => {
        // Sort by time string (HH:MM format)
        return a.time.localeCompare(b.time);
      });
  }, [todaysEntries]);

  return {
    totalCarbsToday,
    latestGlucose,
    avgGlucoseToday,
    todaysMeals
  };
}
