import { supabase } from "@/app/api/supabase/supabase";
import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useCallback, useState, useMemo } from "react";

export function useDB(appData?: AppData, setAppData?: React.Dispatch<React.SetStateAction<AppData | null>>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use entries from appData instead of separate state
  const diaryEntries = appData?.diaryEntries || [];

  // Get all unique dates from entries
  const allDates = useMemo(() => {
    const dates = new Set<string>();
    diaryEntries.forEach((entry: DiaryData) => {
      const entryDate = new Date(entry.created_at);
      dates.add(entryDate.toDateString());
    });
    return Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [diaryEntries]);

  // Create data structure for horizontal pagination
  const paginatedData = useMemo(() => {
    return allDates.map(dateString => {
      const entriesForDate = diaryEntries
        .filter((item: DiaryData) => {
          const itemDate = new Date(item.created_at);
          return itemDate.toDateString() === dateString;
        })
        .sort((a: DiaryData, b: DiaryData) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      return {
        date: dateString,
        entries: entriesForDate
      };
    });
  }, [diaryEntries, allDates]);

  // Get entries for a specific date
  const getEntriesForDate = useCallback((selectedDate: Date) => {
    const currentPage = paginatedData.find(page => page.date === selectedDate.toDateString());
    return currentPage ? currentPage.entries : [];
  }, [paginatedData]);

  // Calculate summary stats for entries
  const calculateEntriesStats = useCallback((entries: DiaryData[]) => {
    return {
      totalInsulin: entries.reduce((sum: number, entry: DiaryData) => sum + (entry.insulin || 0), 0),
      totalCarbs: entries.reduce((sum: number, entry: DiaryData) => sum + (entry.carbs || 0), 0),
      avgGlucose: entries.length > 0
        ? (entries.reduce((sum: number, entry: DiaryData) => sum + (entry.glucose || 0), 0) / entries.length).toFixed(1)
        : '0',
      filteredEntries: entries
    };
  }, []);

  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const [glucose, setGlucose] = useState(
      appData?.settings.glucose === "mmol" ? 5.6 : 100
    );
  const [carbs, setCarbs] = useState("");
  const [insulin, setInsulin] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");

  const [showInput, setShowInput] = useState(false);
  const [showEntry, setShowEntry] = useState(false);

  const toggleInput = () => {
    setShowInput(!showInput);
  };
  const toggleEntry = () => {
    setShowEntry(!showEntry);
  };

  // Updated retrieveEntries to use correct column name
  const retrieveEntries = useCallback(async () => {
    if (!appData?.session?.user?.id || !setAppData) {
      console.log('No user session or setAppData function available');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📄 Fetching diary entries for user:', appData.session.user.id);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', appData.session.user.id)  // Fixed: Using 'user_id' to match database
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to retrieve diary entries:', error);
        setError('Failed to retrieve diary entries: ' + error.message);
        return;
      }

      console.log('✅ Diary entries retrieved successfully:', data?.length || 0, 'entries');

      // Transform the data to match DiaryData interface
      const transformedData: DiaryData[] = (data || []).map(item => ({
        id: item.id.toString(),
        created_at: new Date(item.created_at),
        glucose: item.glucose || 0,
        carbs: item.carbs || 0,
        insulin: item.insulin || 0,
        meal_type: item.meal_type || '',
        activity_level: item.activity_level || '',
        note: item.note || '',
        uri_array: item.uri_array || []
      }));

      // Update appData with new entries
      setAppData(prev => prev ? {
        ...prev,
        diaryEntries: transformedData,
        isEntriesLoaded: true
      } : null);

      console.log('✅ Updated appData with', transformedData.length, 'entries');

    } catch (err) {
      console.error('❌ Failed to retrieve diary entries:', err);
      setError('Failed to retrieve diary entries');
    } finally {
      setIsLoading(false);
    }
  }, [appData?.session?.user?.id, setAppData]);

  const saveDiaryEntry = async (photoURIs: string[] = []) => {
    if (!appData?.session?.user?.id) {
      setError('No user session available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const entryData = {
        user_id: appData.session.user.id,  // Fixed: Using 'user_id' to match database
        glucose: glucose,
        carbs: carbs,
        insulin: insulin || 0,
        note: note || null,
        activity_level: activity,
        meal_type: foodType,
        created_at: new Date().toISOString(),
        uri_array: photoURIs.length > 0 ? photoURIs : null,
      };

      console.log('💾 Saving diary entry:', entryData);
      const { data, error } = await supabase.from('entries').insert([entryData]).select();

      if (error) {
        console.error('❌ Failed to save diary entry:', error);
        setError('Failed to save diary entry: ' + error.message);
        return;
      }

      console.log('✅ Entry saved successfully:', data);

      // Refresh entries after saving
      await retrieveEntries();
      console.log('✅ Entries refreshed successfully');

      // Clear form
      setGlucose(appData?.settings.glucose === "mmol" ? 5.6 : 100);
      setCarbs("");
      setInsulin("");
      setNote("");
      setActivity("none");
      setFoodType("snack");

    } catch (error) {
      console.error('❌ Failed to save diary entry:', error);
      setError('Failed to save diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDiaryEntry = async (entryId: string, formData: {
    glucose: string;
    carbs: string;
    insulin: string;
    note: string;
    activity: string;
    foodType: string;
  }, photoURIs: string[] = []) => {
    if (!appData?.session?.user?.id) {
      setError('No user session available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validation
      if (!formData.glucose.trim()) {
        setError('Glucose level is required');
        return;
      }

      if (!formData.carbs.trim()) {
        setError('Carbs amount is required');
        return;
      }

      const updateData = {
        glucose: parseFloat(formData.glucose),
        carbs: parseFloat(formData.carbs),
        insulin: parseFloat(formData.insulin) || 0,
        note: formData.note || null,
        activity_level: formData.activity,
        meal_type: formData.foodType,
        uri_array: photoURIs.length > 0 ? photoURIs : null,
      };

      console.log('📝 Updating diary entry:', entryId, updateData);
      const { data, error } = await supabase
        .from('entries')
        .update(updateData)
        .eq('id', entryId)
        .eq('user_id', appData.session.user.id)
        .select();

      if (error) {
        console.error('❌ Failed to update diary entry:', error);
        setError('Failed to update diary entry: ' + error.message);
        return;
      }

      console.log('✅ Entry updated successfully:', data);

      // Refresh entries after updating
      await retrieveEntries();
      console.log('✅ Entries refreshed successfully');

      // Clear form
      setGlucose("");
      setCarbs("");
      setInsulin("");
      setNote("");
      setActivity("none");
      setFoodType("snack");

    } catch (error) {
      console.error('❌ Failed to update diary entry:', error);
      setError('Failed to update diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  const removeEntry = async (entryId: string) => {
    if (!appData?.session?.user?.id) {
      setError('No user session available');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🗑️ Deleting entry:', entryId);
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', appData.session.user.id);  // Fixed: Using 'user_id' to match database

      if (error) {
        console.error('❌ Failed to delete diary entry:', error);
        setError('Failed to delete diary entry: ' + error.message);
        return;
      }

      console.log('✅ Diary entry deleted successfully:', entryId);

      // Refresh entries after deletion
      await retrieveEntries();

    } catch (err) {
      console.error('❌ Failed to delete diary entry:', err);
      setError('Failed to delete diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveDiaryEntry,
    updateDiaryEntry,
    retrieveEntries,
    removeEntry,
    isLoading,
    error,
    setError,
    diaryEntries,
    allDates,
    paginatedData,
    getEntriesForDate,
    calculateEntriesStats,
    foodOptions,
    activityOptions,
    toggleInput,
    toggleEntry,
    showEntry,
    showInput,
    glucose,
    setGlucose,
    carbs,
    setCarbs,
    insulin,
    setInsulin,
    note,
    setNote,
    activity,
    setActivity,
    foodType,
    setFoodType
  }
}