import { CustomTextInput } from '@/app/components/textInput';
import { DiaryData } from '@/app/constants/interface/diaryData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { HookData, NavData } from '@/app/navigation/rootNav';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Icon, IconButton, Text, TextInput } from 'react-native-paper';
import { ImageRow } from '../../Camera/cameraScreen';
import { ButtonPicker } from './components/buttonPicker';
import { GlucosePicker } from './components/decimalPicker';
import { ViewSet } from '@/app/components/UI/ViewSet';
import { useDB } from '@/app/hooks/useDB';



export function InputScreen({
  dbHook, cameraHook, calendarHook, appData, diaryData, navigation
}: HookData & NavData) {

  const { theme, styles } = useAppTheme();
  const screenWidth = Dimensions.get('window').width;

  const {glucose, setGlucose, insulin, setInsulin, carbs, setCarbs, activity, setActivity, foodType, setFoodType} = useDB()


  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryData | null>(null);

  const [tempGlucose, setTempGlucose] = useState(
    appData?.settings.glucose === "mmol" ? 5.6 : 100
  );
  const [tempCarbs, setTempCarbs] = useState("");
  const [tempInsulin, setTempInsulin] = useState("");
  const [tempNote, setTempNote] = useState("");
  const [tempActivity, setTempActivity] = useState("none");
  const [tempMeal, setTempMeal] = useState("snack");

  const mealArray = ["snack", "breakfast", "lunch", "dinner"];
  const activityArray = ["none", "low", "medium", "high"];

  const [currentSection, setCurrentSection] = useState(1)

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

  const getActivityIcon = (activity: string) => {
    switch (activity?.toLowerCase()) {
      case 'none': return <Icon source={'sofa-outline'} size={45} color={theme.colors.onSurfaceVariant} />
      case 'low': return <Icon source={'walk'} size={45} color={theme.colors.customBlue} />
      case 'medium': return <Icon source={'run'} size={45} color={theme.colors.customTeal} />
      case 'high': return <Icon source={'run-fast'} size={45} color={theme.colors.primary} />
    }
  }

  const getActivityColors = (activity: string) => {
    switch (activity?.toLowerCase()) {
      case 'none': return theme.colors.surfaceVariant;
      case 'low': return theme.colors.low;
      case 'medium': return theme.colors.medium;
      case 'high': return theme.colors.high;
      default: return theme.colors.surfaceVariant;

    }
  }

  const renderImage = (img?: string) => {

    if (img) {
      return (
        <View style={{ width: screenWidth }}>
          <Image source={{ uri: img }} style={{ width: screenWidth, height: 250 }} resizeMode="cover" />
        </View>
      )
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 200, backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.outlineVariant }}>
          <Icon source="image-off-outline" size={75} color={theme.colors.onSurface} />
        </View>
      )
    }


  }





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
                  selectedValue={tempGlucose}
                  onValueChange={setTempGlucose}
                  appData={appData!}
                  disabled={isSaving}
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
                    value={tempCarbs}
                    onChangeText={setTempCarbs}
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
                    value={tempInsulin}
                    onChangeText={setTempInsulin}
                    keyboardType='numeric'
                    placeholder="Enter amount of insulin"
                    onSubmitEditing={() => { insulinRef.current?.blur() }}
                    returnKeyType="done"
                    left={<TextInput.Icon icon={"needle"} size={20} />}
                    right={<TextInput.Affix text="units" />}
                  />

                  <ButtonPicker
                    value={tempMeal}
                    setValue={setTempMeal}
                    valueArray={mealArray}
                    iconName="food"
                    label="meal type"
                  />

                  <ButtonPicker
                    value={tempActivity}
                    setValue={setTempActivity}
                    valueArray={activityArray}
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
                    right={<TextInput.Affix text={`${tempNote.length}/150`} />}
                    value={tempNote}
                    onChangeText={setTempNote}



                    placeholder="Add any notes about your meal or how you're feeling..."
                  />


                </View>
              } />
          )}

          {currentSection === 3 && (
            <View>
              <ViewSet
                title={tempMeal}
                icon={getMealIcon(tempMeal)}
                content={
                  <View>
                    {!photoURIs ? (
                      <FlatList
                        data={photoURIs}
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => renderImage(item)}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    ) : (
                      renderImage()
                    )}

                  </View>
                }
              />

              <ViewSet
                title={"Details"}
                icon={"information-outline"}
                content={
                  <View>


                    <View style={{flexDirection: 'row', gap: 8}}>
                      <View style={{ flexDirection: 'row', padding: 8, gap: 8, flex: 2, backgroundColor: theme.colors.primaryContainer, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.customDarkTeal }}>
                        <View style={{gap: 4}}>
                          <Text variant="bodyMedium">Glucose level:</Text>
                          <Text variant="bodyMedium">Units of insulin: </Text>
                          <Text variant="bodyMedium">Carbohydrates: </Text>
                        </View>
                        <View style={{gap: 4}}>
                          <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>{tempGlucose} {appData?.settings.glucose === 'mmol' ? 'mmol/L' : 'mg/Dl'}</Text>
                          <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>{tempInsulin? tempInsulin : "-"}</Text>
                          <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>{tempCarbs? `${tempCarbs} g` : "-"}</Text>
                        </View>
                      </View>
                      <View style={{ padding: 8, backgroundColor: getActivityColors(tempActivity), flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.customDarkTeal }}>
                        <Text variant="labelMedium" style={{ marginBottom: -8 }}>Activity</Text>
                        {getActivityIcon(tempActivity)}
                        <Text variant="labelSmall" style={{ marginTop: -4 }}>{tempActivity}</Text>
                      </View>



                    </View>






                  </View>


                } />

            </View>
          )}


          <View style={styles.surface}>
            <SectionButtons currentSection={currentSection} setCurrentSection={setCurrentSection} />

          </View>
          <View style={styles.container}>



















          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View >

  );
}



export function SectionButtons({ currentSection, setCurrentSection }: { currentSection: number, setCurrentSection: any }) {

  const { theme, styles } = useAppTheme()

  const buttonFunction = (direction: string) => {
    if (direction === 'next') {
      if (currentSection != 3) {
        setCurrentSection(currentSection + 1)
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













