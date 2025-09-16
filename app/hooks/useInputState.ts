import { useCallback, useRef } from "react";
import { DiaryData } from "../constants/interface/diaryData";


export function useInputState(initialData: DiaryData) {
    const inputRefs = useRef({
        glucose: initialData.glucose.toString(),
        carbs: initialData.carbs.toString(),
        insulin: initialData.insulin.toString(),
        meal_type: initialData.meal_type,
        activity_level: initialData.activity_level,
        note: initialData.note
    });

    const updateInput = useCallback((field: keyof typeof inputRefs.current, value: string) => {
        inputRefs.current[field] = value;
    }, []);

    const getInputValues = useCallback(() => inputRefs.current, []);

    const resetInputs = useCallback((newData: DiaryData) => {
        inputRefs.current = {
            glucose: newData.glucose.toString(),
            carbs: newData.carbs.toString(),
            insulin: newData.insulin.toString(),
            meal_type: newData.meal_type,
            activity_level: newData.activity_level,
            note: newData.note
        };
    }, []);

    return {
        updateInput,
        getInputValues,
        resetInputs,
        initialValues: inputRefs.current
    };
}
