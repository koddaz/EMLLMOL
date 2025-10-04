import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { HookData, NavData } from '@/app/navigation/rootNav';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Icon, IconButton, Text, TextInput } from 'react-native-paper';
import { ImageRow } from '../../Camera/cameraScreen';
import { ButtonPicker } from './components/buttonPicker';
import { GlucosePicker } from './components/decimalPicker';
import { ViewSet } from '@/app/components/UI/ViewSet';
import { DiaryEntryContent } from '../Entry/diaryEntry';





export function InputScreen({
  dbHook, cameraHook, calendarHook, appData, diaryData, navigation
}: HookData & NavData) {

  const { theme, styles } = useAppTheme();
  const screenWidth = Dimensions.get('window').width;

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

  const [currentSection, setCurrentSection] = useState(1)

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


  // Create preview diary data from current form state
  const previewData: DiaryData = {
    id: '',
    created_at: new Date(),
    glucose: parseFloat(glucose.toString()) || 0,
    carbs: parseFloat(carbs) || 0,
    insulin: parseFloat(insulin) || 0,
    meal_type: foodType,
    activity_level: activity,
    note: note,
    uri_array: photoURIs
  };



  return (
    <View style={styles.background}>

      <KeyboardAvoidingView
        style={styles.background}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}

      >
        {currentSection === 1 && (
          <ViewSet
            headerBgColor={theme.colors.primary}
            headerTextColor={theme.colors.onPrimary}
            title="Glucose"
            icon={"diabetes"}
            content={
              <View>
                <GlucosePicker
                  selectedValue={glucose}
                  onValueChange={setGlucose}
                  appData={appData!}
                  height={72}
                  itemHeight={36}
                />
              </View>
            } />
        )}



        <ScrollView
          style={{ flex: 1, marginTop: 0 }}
          contentContainerStyle={{ paddingBottom: 20, marginTop: 0 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {currentSection === 1 && (

            <ViewSet
              title="Meal Info"
              icon="food"
              content={
                <View >
                  <TextInput
                    ref={carbsRef}
                    label="carbs (g)"
                    mode="outlined"
                    maxLength={4}
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType='numeric'
                    placeholder="Enter amount of carbs"
                    onSubmitEditing={() => { insulinRef.current?.focus() }}
                    returnKeyType="next"
                    left={<TextInput.Icon icon={"bread-slice"} size={20} />}
                    right={<TextInput.Affix text="g" />}
                  />
                  <TextInput

                    ref={insulinRef}
                    label="insulin (u)"
                    mode="outlined"
                    maxLength={4}
                    value={insulin}
                    onChangeText={setInsulin}
                    keyboardType='numeric'
                    placeholder="Enter amount of insulin"
                    onSubmitEditing={() => { insulinRef.current?.blur() }}
                    returnKeyType="done"
                    left={<TextInput.Icon icon={"needle"} size={20} />}
                    right={<TextInput.Affix text="units" />}
                  />

                  <ButtonPicker
                    value={foodType}
                    setValue={setFoodType}
                    valueArray={foodOptions}
                    iconName="food"
                    label="meal type"
                  />

                  <ButtonPicker
                    value={activity}
                    setValue={setActivity}
                    valueArray={activityOptions}
                    iconName="run"
                    label="activity level"
                  />

                </View>
              } />
          )}

          {currentSection === 2 && (
            <ViewSet
              title="Extra"
              icon="plus-circle-outline"
              content={
                <View>
                  <View style={{ flexDirection: 'row', marginBottom: 6, gap: 8, alignItems: 'center', }}>
                    <View style={[styles.boxPicker, { flex: 1 }]}>
                      <View style={styles.row}>
                        <View style={{ paddingHorizontal: 4, width: 44 }}>
                          <Icon source="camera" size={24} />
                        </View>


                        <View style={{ flex: 1 }}>
                          {photoURIs.length === 0 ? (
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                              No photos added yet...
                            </Text>) : (
                            <ImageRow cameraHook={cameraHook} />
                          )}
                        </View>



                      </View>
                    </View>
                    <IconButton style={styles.iconButton} iconColor={theme.colors.onPrimary} icon="camera-plus-outline" onPress={() => { navigation.navigate('diary', { screen: 'camera' }) }} />
                  </View>

                  <TextInput
                    multiline={true}
                    maxLength={150}
                    mode="outlined"
                    numberOfLines={5}
                    contentStyle={{
                      paddingTop: 12,
                      paddingBottom: 8,
                      paddingHorizontal: 8,
                    }}
                    style={{
                      maxHeight: 100,
                      minHeight: 100,
                      flex: 1
                    }}
                    left={<TextInput.Icon icon={'note'} size={20} />}
                    right={<TextInput.Affix text={`${note.length}/150`} />}
                    value={note}
                    onChangeText={setNote}



                    placeholder="Add any notes about your meal or how you're feeling..."
                  />


                </View>
              } />
          )}

          {currentSection === 3 && (
            <ViewSet
              title={foodType.charAt(0).toUpperCase() + foodType.slice(1)}
              icon={getMealIcon(foodType)}
              content={
                <DiaryEntryContent
                  diaryData={previewData}
                  appData={appData}
                  calendarHook={calendarHook}
                />
              }
            />
          )}


          <View style={styles.surface}>
            <SectionButtons currentSection={currentSection} setCurrentSection={setCurrentSection} onSave={onSave} />

          </View>
          <View style={styles.container}>



















          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View >

  );
}



export function SectionButtons({ currentSection, setCurrentSection, onSave }: { currentSection: number, setCurrentSection: any, onSave: any }) {

  const { theme, styles } = useAppTheme()


  const buttonFunction = (direction: string) => {
    if (direction === 'next') {
      if (currentSection != 3) {
        setCurrentSection(currentSection + 1)
      } else if (currentSection === 3) {
        onSave()
      }

    } else {
      if (currentSection != 0) {
        setCurrentSection(currentSection - 1)
      }
    }
  }

  const buttonText = () => {
    switch (currentSection) {
      case 1: return 'next'
      case 2: return 'preview'
      case 3: return 'save'
    }
  }

  const buttonIcon = () => {
    switch (currentSection) {
      case 1: return 'chevron-right'
      case 2: return 'note-search-outline'
      case 3: return 'content-save-outline'
    }
  }


  return (


    <View style={{ flexDirection: 'row', justifyContent: currentSection === 1 ? 'flex-end' : 'space-between' }}>
      {currentSection != 1 && (
        <Button
          mode="contained"
          style={{ borderRadius: 8 }}
          textColor={theme.colors.onErrorContainer}
          buttonColor={theme.colors.errorContainer}
          icon="chevron-left"
          onPress={() => buttonFunction('back')}>
          Back
        </Button>
      )}

      <Button
        contentStyle={{ flexDirection: 'row-reverse' }}
        mode="contained"
        style={{ borderRadius: 8 }}
        textColor={theme.colors.onPrimaryContainer}
        buttonColor={theme.colors.primaryContainer}
        icon={buttonIcon()}
        onPress={() => buttonFunction('next')}>
        {buttonText()}

      </Button>

    </View>



  )
}













