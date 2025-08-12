import { AppData } from "@/app/constants/interface/appData";
import { supabase } from "@/db/supabase/supabase";
import { useState } from "react";



export function useDB(appData: AppData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");
  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const retrieveEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', appData.session?.user.id) // Match the database column name exactly
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Failed to retrieve diary entries:', error);
        setError('Failed to retrieve diary entries');
        return;
      }

      console.log('✅ Diary entries retrieved successfully:', data);
      setDiaryEntries(data || []);

    } catch (err) {
      console.error('❌ Failed to retrieve diary entries:', err);
      setError('Failed to retrieve diary entries');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiaryEntry = async (photoURIs: string[] = []) => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous errors

      // Validation
      if (!glucose.trim()) {
        setError('Glucose level is required');
        return;
      }

      if (!carbs.trim()) {
        setError('Carbs amount is required');
        return;
      }

      const entryData = {
        user_id: appData.session?.user.id,
        glucose: parseFloat(glucose),
        carbs: parseFloat(carbs),
        note: note || null,
        activity_level: activity,
        meal_type: foodType,
        created_at: new Date().toISOString(),
        uri_array: photoURIs.length > 0 ? photoURIs : null,
      };

      const { error } = await supabase.from('entries').insert([entryData]);
      if (error) {
        console.error('❌ Failed to save diary entry:', error);
        setError('Failed to save diary entry to database');
        return;
      }

      // Clear form after saving
      setGlucose("");
      setCarbs("");
      setNote("");
      setActivity("none");
      setFoodType("snack");

      // Automatically refetch entries after successful save
      await retrieveEntries();

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

    diaryEntries,

    glucose,
    setGlucose,
    carbs,
    setCarbs,
    note,
    setNote,
    activity,
    setActivity,
    foodType,
    setFoodType,
    foodOptions,
    activityOptions,
  };
}
