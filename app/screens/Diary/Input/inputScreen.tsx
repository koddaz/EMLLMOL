import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { HookData, NavData } from '@/app/navigation/rootNav';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, View, StyleSheet } from 'react-native';
import { Button, Icon, IconButton, Text, TextInput, Card, Surface, Modal, Portal } from 'react-native-paper';
import { CameraScreen, ImageRow } from '../../Camera/cameraScreen';
import { ButtonPicker } from './components/buttonPicker';
import { GlucosePicker } from './components/decimalPicker';
import { DiaryEntryContent } from '../Entry/diaryEntry';

export function InputScreen({
  dbHook, cameraHook, calendarHook, appData, diaryData, navigation
}: HookData & NavData) {

  const { theme, styles } = useAppTheme();

  const { showCamera, toggleCamera } = cameraHook

  const {
    // Input Data
    glucose, setGlucose,
    insulin, setInsulin,
    carbs, setCarbs,
    activity, setActivity,
    foodType, setFoodType,
    note, setNote,
    foodOptions, activityOptions,

    // Boolean
    isLoading,

    // Strings
    error, setError,

    // Functions
    saveDiaryEntry

  } = dbHook

  const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);
  const [mealDescription, setMealDescription] = useState('');
  const [showGlucoseModal, setShowGlucoseModal] = useState(false);

  const onSave = async () => {
    try {
      await saveDiaryEntry(photoURIs)
      // Navigate calendar to today's date so user can see the new entry
      calendarHook.setSelectedDate(new Date())
      navigation.goBack()
    } catch (error) {
      setError(error)
    }
  }

  const photoURIs = cameraHook.photoURIs || diaryData?.uri_array || [];
  const carbsRef = useRef<any>(null);
  const insulinRef = useRef<any>(null);

  const getMealIcon = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'coffee';
      case 'lunch': return 'food';
      case 'dinner': return 'food-variant';
      case 'snack': return 'food-apple';
      default: return 'silverware';
    }
  };

  // Calculate calories (approximate: 1g carb = 4 kcal)
  const calculateCalories = () => {
    const carbsNum = parseFloat(carbs) || 0;
    return Math.round(carbsNum * 4);
  };

  if (showCamera) {
    return (
      <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}>
        <CameraScreen appData={appData} cameraHook={cameraHook} navigation={navigation} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Surface style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 }} elevation={0}>
          <Text variant="headlineMedium" style={{
            color: theme.colors.onBackground,
            fontWeight: '700',
            marginBottom: 4,
          }}>
            Add Meal
          </Text>
          <Text variant="bodyMedium" style={{
            color: theme.colors.onSurfaceVariant,
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </Text>
        </Surface>

        {/* Visual Preview Section with Camera */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' }}>
          <View style={{ position: 'relative' }}>
            <Surface style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: theme.colors.secondaryContainer,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
            }}>
              {photoURIs.length > 0 ? (
                <Image source={{ uri: photoURIs[0] }} style={{ width: 160, height: 160, borderRadius: 80 }} />
              ) : (
                <Icon source="food" size={64} color={theme.colors.secondary} />
              )}
            </Surface>
            <IconButton
              icon="camera"
              mode="contained"
              size={24}
              iconColor={theme.colors.onPrimary}
              containerColor={theme.colors.primary}
              style={{ position: 'absolute', bottom: 0, right: 0 }}
              onPress={toggleCamera}
            />
          </View>
        </View>

        {/* Metrics Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingVertical: 8 }}
        >
          {/* Glucose Metric */}
          <Surface style={{
            width: 100,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            elevation: 2,
            alignItems: 'center',
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.colors.primaryContainer,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {glucose || '0'}
              </Text>
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {appData?.settings.glucose === 'mmol' ? 'mmol/L' : 'mg/dL'}
            </Text>
          </Surface>

          {/* Carbs Metric */}
          <Surface style={{
            width: 100,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            elevation: 2,
            alignItems: 'center',
          }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
              {carbs || '0'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>g</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Carbs</Text>
          </Surface>

          {/* Insulin Metric */}
          <Surface style={{
            width: 100,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            elevation: 2,
            alignItems: 'center',
          }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
              {insulin || '0'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Insulin</Text>
          </Surface>

          {/* Calories Metric */}
          <Surface style={{
            width: 100,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            elevation: 2,
            alignItems: 'center',
          }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
              {calculateCalories()}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>kcal</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Calories</Text>
          </Surface>
        </ScrollView>

        {/* Input Fields Section */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, gap: 16 }}>
          {/* Glucose Input - Tap to open modal */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Blood Glucose
            </Text>
            <Surface
              style={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onTouchEnd={() => setShowGlucoseModal(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Icon source="diabetes" size={24} color={theme.colors.primary} />
                <View>
                  <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                    {glucose || '0'}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {appData?.settings.glucose === 'mmol' ? 'mmol/L' : 'mg/dL'}
                  </Text>
                </View>
              </View>
              <Icon source="chevron-down" size={24} color={theme.colors.onSurfaceVariant} />
            </Surface>
          </View>

          {/* Carbs Input */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Carbohydrates
            </Text>
            <TextInput
              ref={carbsRef}
              mode="outlined"
              maxLength={4}
              value={carbs}
              onChangeText={setCarbs}
              keyboardType='numeric'
              placeholder="Enter carbs"
              onSubmitEditing={() => { insulinRef.current?.focus() }}
              returnKeyType="next"
              left={<TextInput.Icon icon={"bread-slice"} size={20} />}
              right={<TextInput.Affix text="g" />}
            />
          </View>

          {/* Insulin Input */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Insulin Dosage
            </Text>
            <TextInput
              ref={insulinRef}
              mode="outlined"
              maxLength={4}
              value={insulin}
              onChangeText={setInsulin}
              keyboardType='numeric'
              placeholder="Enter insulin"
              onSubmitEditing={() => { insulinRef.current?.blur() }}
              returnKeyType="done"
              left={<TextInput.Icon icon={"needle"} size={20} />}
              right={<TextInput.Affix text="units" />}
            />
          </View>

          {/* Meal Description */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Meal Description
            </Text>
            <TextInput
              mode="outlined"
              value={mealDescription}
              onChangeText={setMealDescription}
              placeholder="Describe your meal..."
              maxLength={100}
            />
          </View>

          {/* Meal Type */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Meal Type
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {foodOptions.map((option) => (
                <Button
                  key={option}
                  mode={foodType === option ? "contained" : "outlined"}
                  onPress={() => setFoodType(option)}
                  style={{ flex: 1, borderRadius: 8 }}
                  buttonColor={foodType === option ? theme.colors.secondary : 'transparent'}
                  textColor={foodType === option ? theme.colors.onSecondary : theme.colors.onSurface}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </View>
          </View>

          {/* Activity Level */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Activity Level
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {activityOptions.map((option) => (
                <Button
                  key={option}
                  mode={activity === option ? "contained" : "outlined"}
                  onPress={() => setActivity(option)}
                  style={{ flex: 1, borderRadius: 8 }}
                  buttonColor={activity === option ? theme.colors.secondary : 'transparent'}
                  textColor={activity === option ? theme.colors.onSecondary : theme.colors.onSurface}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View>
            <Text variant="labelMedium" style={{ marginBottom: 8, color: theme.colors.onSurfaceVariant }}>
              Notes (Optional)
            </Text>
            <TextInput
              multiline
              maxLength={150}
              mode="outlined"
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              right={<TextInput.Affix text={`${note.length}/150`} />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      <Surface style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: theme.colors.background,
        elevation: 8,
      }}>
        <Button
          mode="contained"
          onPress={onSave}
          loading={isLoading}
          disabled={isLoading}
          style={{ borderRadius: 12, paddingVertical: 4 }}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Save
        </Button>
      </Surface>

      {/* Glucose Picker Modal */}
      <Portal>
        <Modal
          visible={showGlucoseModal}
          onDismiss={() => setShowGlucoseModal(false)}
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            margin: 20,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                Select Glucose Level
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowGlucoseModal(false)}
              />
            </View>

            <GlucosePicker
              selectedValue={glucose}
              onValueChange={setGlucose}
              appData={appData!}
              height={240}
              itemHeight={48}
              dbHook={dbHook}
            />

            <Button
              mode="contained"
              onPress={() => setShowGlucoseModal(false)}
              style={{ borderRadius: 8 }}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              Done
            </Button>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}
