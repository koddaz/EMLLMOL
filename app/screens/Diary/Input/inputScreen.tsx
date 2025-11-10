import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { HookData, NavData } from '@/app/navigation/rootNav';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, View, StyleSheet } from 'react-native';
import { Button, Icon, IconButton, Text, TextInput, Card, Surface, Modal, Portal } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ButtonPicker } from './components/buttonPicker';
import { GlucosePicker } from './components/decimalPicker';
import { DiaryEntryContent } from '../Entry/diaryEntry';

function InputPhotoScroll({ photoURIs, onAddPhoto }: { photoURIs: string[], onAddPhoto: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const { theme, styles } = useAppTheme();

  // Prepare data: if no images, show placeholder with camera button
  const images = photoURIs.length === 0
    ? [{ uri: null, isPlaceholder: true }]
    : photoURIs.map(uri => ({ uri, isPlaceholder: false }));

  const renderImageItem = ({ item, index }: { item: { uri: string | null, isPlaceholder: boolean }, index: number }) => {
    if (item.isPlaceholder) {
      return (
        <View style={{ height: 200, borderWidth: 1, borderRadius: 8, width: containerWidth, justifyContent: 'center', alignItems: 'center', borderColor: theme.colors.outline, backgroundColor: theme.colors.surfaceVariant }}>
          <IconButton
            icon="camera"
            mode="contained"
            size={48}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            onPress={onAddPhoto}
          />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            Add photos
          </Text>
        </View>
      );
    }

    return (
      <View style={{ width: containerWidth, borderWidth: 1, borderRadius: 8, overflow: 'hidden', borderColor: theme.colors.outline, position: 'relative' }}>
        <Image
          source={{ uri: item.uri || undefined }}
          style={{ height: 200, width: containerWidth }}
          resizeMode="cover"
        />
        {/* Camera button overlay */}
        <IconButton
          icon="camera-plus"
          mode="contained"
          size={24}
          iconColor={theme.colors.onPrimary}
          containerColor={theme.colors.primary}
          style={{ position: 'absolute', bottom: 8, right: 8 }}
          onPress={onAddPhoto}
        />
      </View>
    );
  };

  return (
    <View
      style={{ height: 200, position: 'relative', marginHorizontal: 16, marginVertical: 16 }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      {containerWidth > 0 && (
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
            setCurrentImageIndex(index);
          }}
        />
      )}

      {/* Only show indicators if there are real images */}
      {images.length > 1 && !images[0].isPlaceholder && (
        <>
          {/* Image indicator dots */}
          <View style={[styles.imageOverlay, {
            bottom: 8,
            left: 8,
            flexDirection: 'row'
          }]}>
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: index === currentImageIndex ? theme.colors.onPrimary : 'rgba(255, 255, 255, 0.6)',
                  marginHorizontal: 2,
                }}
              />
            ))}
          </View>

          {/* Image counter */}
          <View style={[styles.imageOverlay, {
            top: 8,
            right: 8,
          }]}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export function InputScreen({
  dbHook, cameraHook, calendarHook, appData, diaryData, navigation
}: HookData & NavData) {

  const { theme, styles } = useAppTheme();

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
        <Surface style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }} elevation={0}>
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

        {/* Photo Gallery Section */}
        <InputPhotoScroll
          photoURIs={photoURIs}
          onAddPhoto={() => navigation?.navigate('camera')}
        />

        {/* Metrics Row */}
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16}}
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
        </View>

        {/* Input Fields Section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}>
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
                    {glucose || (appData?.settings.glucose === 'mmol' ? '5.6' : '100')}
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
              {foodOptions.map((option : any) => (
                <Button
                  key={option}
                  mode={foodType === option ? "contained" : "outlined"}
                  onPress={() => setFoodType(option)}
                  style={{ flex: 1, borderRadius: 8 }}
                  contentStyle={{ paddingVertical: 2 }}
                  labelStyle={{ fontSize: 12 }}
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
              {activityOptions.map((option : any) => (
                <Button
                  key={option}
                  mode={activity === option ? "contained" : "outlined"}
                  onPress={() => setActivity(option)}
                  style={{ flex: 1, borderRadius: 8 }}
                  contentStyle={{ paddingVertical: 2 }}
                  labelStyle={{ fontSize: 12 }}
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
