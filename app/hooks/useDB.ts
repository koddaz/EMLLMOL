import { supabase } from "@/app/api/supabase/supabase";
import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useCallback, useState } from "react";

export function useDB(appData?: AppData, setAppData?: React.Dispatch<React.SetStateAction<AppData | null>>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use entries from appData instead of separate state
  const diaryEntries = appData?.diaryEntries || [];

  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
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

  const saveDiaryEntry = async (formData: {
    glucose: string;
    carbs: string;
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

      const entryData = {
        user_id: appData.session.user.id,  // Fixed: Using 'user_id' to match database
        glucose: parseFloat(formData.glucose),
        carbs: parseFloat(formData.carbs),
        insulin: 0, // Default value, adjust as needed
        note: formData.note || null,
        activity_level: formData.activity,
        meal_type: formData.foodType,
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
      setGlucose("");
      setCarbs("");
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
    retrieveEntries,
    removeEntry,
    isLoading,
    error,
    setError,
    diaryEntries,
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
    note,
    setNote,
    activity,
    setActivity,
    foodType,
    setFoodType
  };
}