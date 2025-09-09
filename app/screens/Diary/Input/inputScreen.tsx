import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Text } from "react-native-paper";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { DataEntryCard } from "./components/DataEntryCard";
import { MealSelector } from "./components/MealSelector";
import { ActivitySelector } from "./components/ActivitySelector";
import { PhotosCard } from "./components/PhotosCard";
import { InputHeader } from "./components/InputHeader";

export function InputScreen({
    appData,
    calendarHook,
    dbHook,
    cameraHook,
    diaryState,
    navigation,
    isSaving,
    route,
}: {
    appData: AppData,
    calendarHook: any,
    dbHook: any,
    cameraHook: any,
    navigation: any,
    route: any,
    diaryState: {
        glucose: string,
        setGlucose: (value: string) => void,
        carbs: string,
        setCarbs: (value: string) => void,
        note: string,
        setNote: (value: string) => void,
        activity: string,
        setActivity: (value: string) => void,
        foodType: string,
        setFoodType: (value: string) => void
    },
    isSaving: boolean,
}) {
    const { theme, styles } = useAppTheme();
    const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);

    console.log('📄 DiaryInput rendered');

    // Check if we're editing an existing entry
    useEffect(() => {
        const diaryData = route.params?.diaryData as DiaryData;
        if (diaryData) {
            console.log('📝 Editing entry:', diaryData.id);
            setEditingEntry(diaryData);

            // Populate form with existing data
            diaryState.setGlucose(diaryData.glucose?.toString() || '');
            diaryState.setCarbs(diaryData.carbs?.toString() || '');
            diaryState.setNote(diaryData.note || '');
            diaryState.setActivity(diaryData.activity_level || 'none');
            diaryState.setFoodType(diaryData.meal_type || 'snack');

            // Set camera URIs if available
            if (diaryData.uri_array && diaryData.uri_array.length > 0) {
                cameraHook.setPhotoURIs(diaryData.uri_array);
            }
        }
    }, [route.params]);




    return (
        <View style={styles.background}>
            <KeyboardAvoidingView
                style={styles.background}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <InputHeader 
                    editingEntry={editingEntry} 
                    calendarHook={calendarHook} 
                />
                {dbHook.error && (
                    <View style={styles.container}>
                        <View style={[styles.box, { backgroundColor: theme.colors.errorContainer }]}>
                            <View style={styles.content}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                                    {dbHook.error}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                <View style={styles.container}>
                    <DataEntryCard 
                        appData={appData} 
                        diaryState={diaryState} 
                        isSaving={isSaving} 
                    />
                    <MealSelector 
                        dbHook={dbHook} 
                        diaryState={{ foodType: diaryState.foodType, setFoodType: diaryState.setFoodType }} 
                        isSaving={isSaving} 
                    />
                    <ActivitySelector 
                        dbHook={dbHook} 
                        diaryState={{ activity: diaryState.activity, setActivity: diaryState.setActivity }} 
                        isSaving={isSaving} 
                    />
                    <PhotosCard 
                        cameraHook={cameraHook} 
                        isSaving={isSaving} 
                    />
                </View>

            </KeyboardAvoidingView>
        </View>
    );
}



