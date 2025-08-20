import { supabase } from "@/app/api/supabase/supabase";
import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useCallback, useEffect, useState } from "react";

export function useDB(appData: AppData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryData[]>([]);

  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");

  const [showInput, setShowInput] = useState(false)
  const [showEntry, setShowEntry] = useState(false)

  const toggleInput = () => {
    setShowInput(!showInput);
  };
  const toggleEntry = () => {
    setShowEntry(!showEntry)
  }


  useEffect(() => {
    if (appData?.session?.user?.id) {
      retrieveEntries()
    }
  }, [appData.session?.user?.id]);

  // Wrap retrieveEntries in useCallback to prevent infinite loops
  const retrieveEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', appData.session?.user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Failed to retrieve diary entries:', error);
        setError('Failed to retrieve diary entries');
        return;
      }

      console.log('✅ Diary entries retrieved successfully:', data);

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

      setDiaryEntries(transformedData);

    } catch (err) {
      console.error('❌ Failed to retrieve diary entries:', err);
      setError('Failed to retrieve diary entries');
    } finally {
      setIsLoading(false);
    }
  }, [appData.session?.user.id]);

  const saveDiaryEntry = async (formData: {
    glucose: string;
    carbs: string;
    note: string;
    activity: string;
    foodType: string;
  }, photoURIs: string[] = []) => {
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
        user_id: appData.session?.user.id,
        glucose: parseFloat(formData.glucose),
        carbs: parseFloat(formData.carbs),
        note: formData.note || null,
        activity_level: formData.activity,
        meal_type: formData.foodType,
        created_at: new Date().toISOString(),
        uri_array: photoURIs.length > 0 ? photoURIs : null,
      };

      console.log('💾 Saving diary entry...');
      const { error } = await supabase.from('entries').insert([entryData]);
      if (error) {
        console.error('❌ Failed to save diary entry:', error);
        setError('Failed to save diary entry to database');
        return;
      }

      console.log('✅ Entry saved successfully');
      await retrieveEntries();
      console.log('✅ Entries refreshed successfully');

    } catch (error) {
      console.error('❌ Failed to save diary entry:', error);
      setError('Failed to save diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  const removeEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', appData.session?.user.id);
      if (error) {
        console.error('❌ Failed to delete diary entry:', error);
        setError('Failed to delete diary entry');
        return;
      }
      console.log('✅ Diary entry deleted successfully:', entryId);
      // Automatically refetch entries after deletion
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
