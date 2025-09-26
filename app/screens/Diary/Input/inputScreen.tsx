import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Icon, IconButton, Text } from 'react-native-paper';
import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { CustomTextInput } from '@/app/components/textInput';
import { GlucosePicker } from './components/decimalPicker';
import { ButtonPicker } from './components/buttonPicker';
import { ImageRow } from '../../Camera/cameraScreen';
import { HookData, NavData } from '@/app/navigation/rootNav';



export function InputScreen({
  dbHook, cameraHook, calendarHook, appData, diaryData, navigation
}: HookData & NavData) {

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


      // Navigate back after successful save with a small delay
      console.log('🔸 Save successful, navigating back');
      setTimeout(() => {
        console.log('🔸 Attempting navigation.goBack()');
        if (navigation.canGoBack()) {
          navigation.goBack();
          console.log('🔸 navigation.goBack() called');
        } else {
          console.log('🔸 Cannot go back, trying navigate to MainDiary');
          navigation.navigate('Main');
        }
      }, 100);

    } catch (error) {
      console.error('Save failed:', error);
      // Still navigate back even on error
      setTimeout(() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('Main');
        }
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  const photoURIs = cameraHook.photoURIs || diaryData?.uri_array || [];

  return (
    <View style={styles.background}>

      <KeyboardAvoidingView
        style={styles.background}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={{ flex: 1, marginTop: 0 }}
          contentContainerStyle={{ paddingBottom: 20, marginTop: 0 }}
          showsVerticalScrollIndicator={false}
        >
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
                label={"carbs (g)"}
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
                label={"insulin"}
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

            <CustomTextInput
              label={"note"}
              value={tempNote}
              onChangeText={setTempNote}
              placeholder="Add any notes about your meal or how you're feeling..."
              multiline
              numberOfLines={5}
              leftIcon="note-text"
              maxLength={150}
              maxHeight={100}
              minHeight={100}
              disabled={isSaving}
              containerStyle={{ flex: 1 }}
              inputStyle={{ flex: 1 }}
            />


            <ButtonPicker
              value={tempActivity}
              setValue={setTempActivity}
              valueArray={activityArray}
              iconName="run"
              label="activity level"
            />
            <ButtonPicker
              value={tempMeal}
              setValue={setTempMeal}
              valueArray={mealArray}
              iconName="food"
              label="meal type"
            />
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
                <ImageRow cameraHook={cameraHook} />
              )}
            </View>





          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>

  );
}

export function TextInput() {

  const {theme, styles} = useAppTheme()
  return (

    <View style={styles.container}>
      
    </View>
  )
}













