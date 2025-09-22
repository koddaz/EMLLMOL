import React, { useState, useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Icon, IconButton, Text } from 'react-native-paper';
import { AppData } from '@/app/constants/interface/appData';
import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { CustomTextInput } from '@/app/components/textInput';
import { GlucosePicker } from './components/decimalPicker';
import { ButtonPicker } from './components/buttonPicker';
import { InputTopContainer } from '@/app/components/topContainer';

interface InputScreenProps {
  appData: AppData;
  calendarHook: any;
  dbHook: any;
  cameraHook: any;
  navigation: any;
  route: any;
  onSave: (editingId?: string, formData?: {
    glucose: string;
    carbs: string;
    insulin: string;
    note: string;
    activity: string;
    foodType: string;
  }) => Promise<void>;
  diaryData: DiaryData;
}

export function InputScreen({
  appData,
  calendarHook,
  dbHook,
  cameraHook,
  navigation,
  route,
  onSave,
  diaryData
}: InputScreenProps) {
  const { theme, styles } = useAppTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);

  // Initialize form state from route params or defaults
  const [tempGlucose, setTempGlucose] = useState(
    appData.settings.glucose === "mmol" ? 5.6 : 100
  );
  const [tempCarbs, setTempCarbs] = useState("0");
  const [tempInsulin, setTempInsulin] = useState("0");
  const [tempNote, setTempNote] = useState("");
  const [tempActivity, setTempActivity] = useState("none");
  const [tempMeal, setTempMeal] = useState("snack");

  const mealArray = ["snack", "breakfast", "lunch", "dinner"];
  const activityArray = ["none", "low", "medium", "high"];

  // Load editing entry if provided
  useEffect(() => {
    const editingData = route.params?.editingEntry as DiaryData;
    if (!editingData) {
      return;
    }
    setEditingEntry(editingData);
    setTempGlucose(editingData.glucose || (appData.settings.glucose === "mmol" ? 5.6 : 100));
    setTempCarbs(editingData.carbs?.toString() || "0");
    setTempInsulin(editingData.insulin?.toString() || "0");
    setTempNote(editingData.note || "");
    setTempActivity(editingData.activity_level || "none");
    setTempMeal(editingData.meal_type || "snack");
  }, [route.params?.editingEntry, appData.settings.glucose]);

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Prepare form data
      const formData = {
        glucose: tempGlucose.toString(),
        carbs: tempCarbs,
        insulin: tempInsulin,
        note: tempNote,
        activity: tempActivity,
        foodType: tempMeal,
      };


      // Update dbHook state with form values (for other components that might need it)
      dbHook.setGlucose(formData.glucose);
      dbHook.setCarbs(formData.carbs);
      dbHook.setInsulin(formData.insulin);
      dbHook.setNote(formData.note);
      dbHook.setActivity(formData.activity);
      dbHook.setFoodType(formData.foodType);

      // Call the save function with editing ID and form data
      await onSave(editingEntry?.id, formData);

      // Navigate back after successful save with a small delay
      console.log('🔸 Save successful, navigating back');
      setTimeout(() => {
        console.log('🔸 Attempting navigation.goBack()');
        if (navigation.canGoBack()) {
          navigation.goBack();
          console.log('🔸 navigation.goBack() called');
        } else {
          console.log('🔸 Cannot go back, trying navigate to MainDiary');
          navigation.navigate('MainDiary');
        }
      }, 100);

    } catch (error) {
      console.error('Save failed:', error);
      // Still navigate back even on error
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainDiary');
        }
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  const photoURIs = cameraHook.photoURIs || diaryData.uri_array || [];

  return (
    <View style={styles.background}>
      <InputTopContainer
        navCamera={() => navigation.navigate("DiaryCamera")}
        editingEntry={editingEntry}
        calendarHook={calendarHook}
      />
      <View style={styles.container}>


        <GlucosePicker
          selectedValue={tempGlucose}
          onValueChange={setTempGlucose}
          appData={appData}
          disabled={isSaving}
          height={72}
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </View>



        <View style={[styles.row, { gap: 8, alignItems: 'stretch', flex: 1 }]}>
          <View style={{ flex: 1 }}>
            <CustomTextInput
              value={tempNote}
              onChangeText={setTempNote}
              placeholder="Add any notes about your meal or how you're feeling..."
              multiline
              numberOfLines={10}
              leftIcon="note-text"
              maxLength={150}
              disabled={isSaving}
              containerStyle={{ flex: 1 }} 
              inputStyle={{ flex: 1 }} 
            />
          </View>

          <View style={{ flex: 1 }}>
            <ButtonPicker
              value={tempActivity}
              setValue={setTempActivity}
              valueArray={activityArray}
              iconName="run"
            />

            <ButtonPicker
              value={tempMeal}
              setValue={setTempMeal}
              valueArray={mealArray}
              iconName="food"
            />
          </View>


        </View>
    
        <View style={styles.boxPicker}>
          {photoURIs.length === 0 ? (
            <View style={styles.content}>
              <View style={styles.row}>
                <View style={{ paddingHorizontal: 4, width: 44 }}>
                  <Icon source="camera" size={24} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    No photos added yet...
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <FlatList
                data={photoURIs}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{
                    flex: 1,
                    marginRight: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.outline
                  }}>
                    <Image
                      source={{ uri: item }}
                      style={{ flex: 1, resizeMode: 'cover' }}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Photos Section */}
        

        {/* Save Button */}
        <View style={[styles.row, { justifyContent: 'flex-end', padding: 20 }]}>
          <IconButton
            size={40}
            mode="outlined"
            icon="floppy"
            style={{ borderColor: theme.colors.outlineVariant }}
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>
      </View>


    </View>

  );
}













