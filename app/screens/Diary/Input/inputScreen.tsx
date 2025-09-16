import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Icon, IconButton, RadioButton, Text, TextInput } from "react-native-paper";
import { ActivitySelector } from "./components/ActivitySelector";

import { PhotosCard } from "./components/PhotosCard";
import { DiaryData } from '@/app/constants/interface/diaryData';
import { CustomTextInput } from "@/app/components/textInput";
import { GlucosePicker } from "./components/decimalPicker";
import { InputTopContainer } from "@/app/components/topContainer";
import { ButtonPicker } from "./components/buttonPicker";

interface inputData {
    appData: AppData
    calendarHook: any
    dbHook: any
    cameraHook: any
    inputHook?: any
    diaryData: DiaryData

    navigation: any
    route: any
    onSave: (data: any) => void
}

export function InputScreen(
    { appData, calendarHook, dbHook, cameraHook, navigation, route, onSave, inputHook, diaryData }: inputData
) {

    const { theme, styles } = useAppTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);

    // Initialize with diaryData values
    const [tempGlucose, setTempGlucose] = useState(
        appData.settings.glucose === "mmol" ? 5.6 : 300
    );
    const [tempCarbs, setTempCarbs] = useState(diaryData.carbs.toString());
    const [tempInsulin, setTempInsulin] = useState(diaryData.insulin.toString());
    const [tempNote, setTempNote] = useState(diaryData.note);
    const [tempActivity, setTempActivity] = useState(diaryData.activity_level || 'none');
    const [tempMeal, setTempMeal] = useState(diaryData.meal_type || 'snack');

    const mealArray = useState(["snack", "breakfast", "lunch", "dinner"])
    const activityArray = useState(["none", "low", "medium", "high"])


    const renderCarbsInput = (value: string, onChangeText: (text: string) => void, disabled?: boolean) => (
        <CustomTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="0"
            keyboardType="numeric"
            leftIcon="bread-slice"
            suffix="g"
            disabled={disabled}
            maxLength={4}
            containerStyle={{ flex: 1 }}
        />
    )
    const renderInsulinInput = (value: string, onChangeText: (text: string) => void, disabled?: boolean) => (
        <CustomTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="0"
            keyboardType="numeric"
            leftIcon="needle"
            suffix="units"
            disabled={disabled}
            maxLength={4}
            containerStyle={{ flex: 1 }}
        />
    )
    const renderNotesInput = (value: string, onChangeText: (text: string) => void, disabled?: boolean) => (
        <CustomTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Add any notes about your meal or how you're feeling..."
            multiline
            numberOfLines={4}
            minHeight={120}
            maxHeight={120}
            leftIcon="note-text"
            disabled={disabled}
            maxLength={500}
        />
    )


    return (
        <View style={styles.background}>
            <InputTopContainer
                editingEntry={editingEntry}
                calendarHook={calendarHook}
            />

            <View style={styles.box}>

                <View style={styles.content}>

                    <GlucosePicker
                        selectedValue={tempGlucose}
                        onValueChange={setTempGlucose}
                        appData={appData} // Reads glucose unit from settings
                        disabled={isSaving}
                        height={72} // 3 items * 36px
                        itemHeight={36}
                    />
                    <View style={[styles.row, { gap: 4 }]}>
                        <CustomTextInput
                            value={tempCarbs}
                            onChangeText={setTempCarbs}
                            placeholder="0"
                            keyboardType="numeric"
                            leftIcon="bread-slice"
                            suffix="g"
                            maxLength={4}
                            containerStyle={{ flex: 1 }}
                        />
                        <CustomTextInput
                            value={tempInsulin}
                            onChangeText={setTempInsulin}
                            placeholder="0"
                            keyboardType="numeric"
                            leftIcon="needle"
                            suffix="units"
                            maxLength={4}
                            containerStyle={{ flex: 1 }}
                        />

                    </View>
                    <CustomTextInput
                        value={tempNote}
                        onChangeText={setTempNote}
                        placeholder="Add any notes about your meal or how you're feeling..."
                        multiline
                        numberOfLines={4}
                        minHeight={120}
                        maxHeight={120}
                        leftIcon="note-text"
                        maxLength={500}
                    />
                    <ButtonPicker value={tempActivity} setValue={setTempActivity} valueArray={activityArray[0]} iconName={"run"} />
                    <ButtonPicker value={tempMeal} setValue={setTempMeal} valueArray={mealArray[0]} iconName={"food"} />

                    <View style={styles.boxPicker}>
                        {diaryData.uri_array.length === 0 ? (
                            <View style={styles.content}>
                                <View style={styles.row}>

                                    <View style={{ paddingHorizontal: 4, width: 44 }}>
                                        <Icon source={"camera"} size={24} />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                            There are no photos in the list...
                                        </Text>
                                    </View>
                                </View>

                            </View>
                        ) : (
                            <View style={styles.content}>

                                <FlatList
                                    data={diaryData.uri_array}
                                    horizontal
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{ flex: 1 / 3, borderWidth: 1, borderColor: theme.colors.outline }}>
                                                <Image source={{ uri: item }} style={{ flex: 1, resizeMode: 'contain' }} />
                                            </View>
                                        );
                                    }}
                                />

                            </View>
                        )}

                    </View>
                    <View style={[styles.row, { justifyContent: 'flex-end' }]}>
                        <IconButton
                            size={40}
                            mode={"outlined"}
                            icon={"floppy"}
                            style={{ borderColor: theme.colors.outlineVariant }}
                            onPress={() => { }}
                        />
                    </View>
                </View>
            </View>

        </View>
    );
}





export const InputScreen2 = React.memo(function InputScreen({
    appData,
    calendarHook,
    dbHook,
    cameraHook,
    navigation,
    route,
    onSave,
}: {
    appData: AppData,
    calendarHook: any,
    dbHook: any,
    cameraHook: any,
    navigation: any,
    route: any,
    onSave: (data: any) => void,
}) {
    const { theme, styles } = useAppTheme();
    const [isSaving, setIsSaving] = useState(false);
    const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);

    // Single state management - no duplication
    const [glucose, setGlucose] = useState('5.5');
    const [carbs, setCarbs] = useState('');
    const [note, setNote] = useState('');
    const [activity, setActivity] = useState('none');
    const [foodType, setFoodType] = useState('snack');

    // Load existing entry if editing
    useEffect(() => {
        const diaryData = route.params?.diaryData as DiaryData;
        if (diaryData) {
            setEditingEntry(diaryData);
            setGlucose(diaryData.glucose?.toString() || '5.5');
            setCarbs(diaryData.carbs?.toString() || '');
            setNote(diaryData.note || '');
            setActivity(diaryData.activity_level || 'none');
            setFoodType(diaryData.meal_type || 'snack');

            if (diaryData.uri_array?.length > 0) {
                cameraHook.setPhotoURIs(diaryData.uri_array);
            }
        }
    }, [route.params]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                glucose,
                carbs,
                note,
                activity,
                foodType,
                photoURIs: cameraHook.photoURIs,
                editingId: editingEntry?.id
            });
            navigation.goBack();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Create simple state objects for components
    const diaryState = {
        glucose,
        setGlucose,
        carbs,
        setCarbs,
        note,
        setNote,
    };

    const mealState = {
        foodType,
        setFoodType
    };

    const activityState = {
        activity,
        setActivity
    };

    return (
        <View style={styles.background}>
            <KeyboardAvoidingView
                style={styles.background}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Header */}
                <View style={styles.topContainer}>
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="note"
                            size={24}
                            color={theme.colors.onSecondary}
                        />
                    </View>
                    <Text variant="titleLarge" style={{ flex: 1, marginLeft: 8 }}>
                        {editingEntry ? 'Edit Entry' : calendarHook.formatTime(new Date())}
                    </Text>
                    <View style={styles.chip}>
                        <MaterialCommunityIcons
                            name="calendar"
                            size={16}
                            color={theme.colors.onSecondary}
                        />
                        <Text variant="bodySmall">
                            {editingEntry
                                ? calendarHook.formatDate(editingEntry.created_at)
                                : calendarHook.formatDate(new Date())}
                        </Text>
                    </View>
                </View>

                {/* Error Display */}
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

                {/* Main Content */}
                <View style={styles.container}>


                    <View style={{ flexDirection: 'row' }}>

                        <ActivitySelector
                            dbHook={dbHook}
                            diaryState={activityState}
                            isSaving={isSaving}
                        />
                    </View>

                    <PhotosCard
                        cameraHook={cameraHook}
                        isSaving={isSaving}
                    />

                    {/* Save Button */}
                    <View style={{ marginTop: 16, marginBottom: 8 }}>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            disabled={isSaving}
                            loading={isSaving}
                            style={{ backgroundColor: theme.colors.primary }}
                            labelStyle={{ color: theme.colors.onPrimary }}
                        >
                            {editingEntry ? 'Update Entry' : 'Save Entry'}
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
});







