import { LoadingScreen } from "@/app/components/loadingScreen";
import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import { Animated, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Avatar, Button, FAB, IconButton, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { DiaryEntry } from "./entry/diaryEntry";
import { useCalendar } from "./hooks/useCalendar";
import { useCamera } from "./hooks/useCamera";
import { useDB } from "./hooks/useDB";
import DiaryCalendar from "./calendar/diaryCalendar";
import { DiaryList } from "./list/diaryList";
import { useAppTheme } from "@/app/constants/UI/theme";


export function DiaryScreen({
  appData,
  showCalendar,
  setSelectedDate,
  selectedDate,
  diaryEntries,
  isLoading,
  refreshEntries,
  currentMonth,
  setCurrentMonth,
  navigateMonth,
  dbHook
}: {
  appData: AppData,
  showCalendar?: boolean,
  setSelectedDate: (date: Date) => void,
  selectedDate: Date,
  diaryEntries: DiaryData[],
  isLoading: boolean,
  refreshEntries: () => Promise<void>
  currentMonth: Date,
  setCurrentMonth: (date: Date) => void,
  navigateMonth: (direction: 'prev' | 'next') => void,
  dbHook: any
}) {
  const { theme, styles } = useAppTheme();

  const [toggleEntry, setToggleEntry] = useState(false);
  const [toggleInput, setToggleInput] = useState(false);
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);

  return (
    <View style={styles.background}>
      {showCalendar && (
        <DiaryCalendar
          diaryEntries={diaryEntries}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          navigateMonth={navigateMonth}
        />
      )}

      {!toggleEntry && (
        <DiaryList
          toggleEntry={setToggleEntry}
          setSelectedDiaryData={setSelectedDiaryData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          diaryEntries={diaryEntries}
          isLoading={isLoading}
          refreshEntries={refreshEntries}
          key={`diary-list-${selectedDate.toDateString()}`}
        />
      )}

      {toggleEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
              appData={appData}
              setToggleEntry={setToggleEntry}
              diaryData={selectedDiaryData}
              refreshEntries={refreshEntries}
            />
          </View>
        </View>
      )}

      {toggleInput && (
        <KeyboardAvoidingView
          style={styles.inputWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <DiaryInput
            appData={appData}
            toggleInput={setToggleInput}
            // refreshEntries={refreshEntries}
            dbHook={dbHook} // Pass the dbHook to DiaryInput
          />
        </KeyboardAvoidingView>
      )}

      <FAB
        icon={toggleInput == true ? "close" : "note-plus"}
        style={styles.fab}
        onPress={() => setToggleInput(!toggleInput)}
      />

    </View>

  );
}

export function DiaryInput({
  appData,
  toggleInput,
  //refreshEntries,
  dbHook
}: {
  appData: AppData,
  toggleInput?: (state: boolean) => void,
  // refreshEntries: () => Promise<void>
  dbHook: any
}) {
  const { theme, styles } = useAppTheme();

  // Add this debug log
  console.log('DiaryInput rendered, toggleInput:', toggleInput);

  // camera related
  const {
    renderCamera,
    cycleFlash,
    getFlashIcon,
    getFlashIconColor,
    capturePhoto,
    photoURIs,
    removePhotoURI,
    clearPhotoURIs,
    savePhotoLocally,
  } = useCamera(appData);



  // toggles and arrays
  const [toggleCamera, setToggleCamera] = useState(false);
  const [toggleNote, setToggleNote] = useState(false);

  // keyboard related
  const glucoseInputRef = useRef<any>(null);
  const carbsInputRef = useRef<any>(null);

    const handleSave = async () => {
    // First, save all photos locally and get permanent URIs
    const permanentURIs: string[] = [];
    for (const tempUri of photoURIs) {
      const permanentUri = await savePhotoLocally(tempUri);
      permanentURIs.push(permanentUri);
    }
    
    // Use dbHook directly
    await dbHook.saveDiaryEntry(permanentURIs);
    
    setToggleCamera(false);
    setToggleNote(false);
    clearPhotoURIs();
    if (toggleInput) {
      toggleInput(false);
    }
  }



  const renderGlucoseCard = () => (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="blood-bag" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Blood Glucose
        </Text>
      </View>
      <TextInput
        ref={glucoseInputRef}
        mode="outlined"
        value={dbHook.glucose}
        onChangeText={dbHook.setGlucose}
        placeholder="Enter glucose level"
        keyboardType="decimal-pad"
        returnKeyType="next"
        onSubmitEditing={() => carbsInputRef.current?.focus()}
        style={styles.input}
        right={<TextInput.Affix text={appData.settings.glucose} />}
        dense
      />
    </Surface>
  );

  const renderCarbsCard = () => (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="food" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Carbohydrates
        </Text>
      </View>
      <TextInput
        ref={carbsInputRef}
        mode="outlined"
        value={dbHook.carbs}
        onChangeText={dbHook.setCarbs}
        placeholder="Enter carbs amount"
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
        style={styles.input}
        right={<TextInput.Affix text="g" />}
        dense
      />
    </Surface>
  );

  const renderQuickSelectors = () => (
    <Surface style={styles.card} elevation={2}>
      <Text variant="titleMedium" style={[styles.cardTitle, { marginBottom: 16 }]}>
        Quick Details
      </Text>

      <View style={styles.selectorRow}>
        <View style={styles.selectorGroup}>
          <Text variant="labelMedium" style={styles.selectorLabel}>
            Meal Type
          </Text>
          <View style={styles.chipContainer}>
            {dbHook.foodOptions.map((option) => (
              <Button
                key={option}
                mode={dbHook.foodType === option ? "contained" : "outlined"}
                onPress={() => dbHook.setFoodType(option)}
                style={[
                  styles.chip,
                  dbHook.foodType === option && { backgroundColor: theme.colors.primary }
                ]}
                labelStyle={{
                  fontSize: 12,
                  color: dbHook.foodType === option ? theme.colors.onPrimary : theme.colors.onSurface
                }}
                compact
              >
                {option}
              </Button>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.selectorRow}>
        <View style={styles.selectorGroup}>
          <Text variant="labelMedium" style={styles.selectorLabel}>
            Activity Level
          </Text>
          <View style={styles.chipContainer}>
            {dbHook.activityOptions.map((option) => (
              <Button
                key={option}
                mode={dbHook.activity === option ? "contained" : "outlined"}
                onPress={() => dbHook.setActivity(option)}
                style={[
                  styles.chip,
                  dbHook.activity === option && { backgroundColor: theme.colors.secondary }
                ]}
                labelStyle={{
                  fontSize: 12,
                  color: dbHook.activity === option ? theme.colors.onSecondary : theme.colors.onSurface
                }}
                compact
              >
                {option}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Surface>
  );

  const renderNotesCard = () => (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="note-text" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Notes
        </Text>
      </View>
      <TextInput
        mode="outlined"
        value={dbHook.note}
        onChangeText={dbHook.setNote}
        placeholder="Add any notes about your meal or how you're feeling..."
        multiline
        numberOfLines={3}
        style={[styles.input, { height: 80 }]}
        textAlignVertical="top"
        dense
      />
    </Surface>
  );

  const renderPhotosCard = () => (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>
          Photos
        </Text>
        <Button
          mode="outlined"
          onPress={() => setToggleCamera(!toggleCamera)}
          style={styles.photoButton}
          compact
        >
          {toggleCamera ? "Close Camera" : "Take Photo"}
        </Button>
      </View>

      {toggleCamera ? (
        <View style={styles.cameraContainer}>
          {renderCamera()}
          <View style={styles.cameraControls}>
            <IconButton
              icon={getFlashIcon()}
              iconColor={getFlashIconColor()}
              size={24}
              onPress={cycleFlash}
              mode="contained"
            />
            <IconButton
              icon="camera"
              size={30}
              onPress={capturePhoto}
              mode="contained"
              style={{ backgroundColor: theme.colors.primary }}
              iconColor={theme.colors.onPrimary}
            />
          </View>
        </View>
      ) : photoURIs.length > 0 ? (
        <ScrollView horizontal style={styles.photoScroll}>
          {photoURIs.map((uri, index) => (
            <View key={index} style={styles.photoItem}>
              <Avatar.Image size={60} source={{ uri }} />
              <IconButton
                icon="close"
                size={16}
                onPress={() => removePhotoURI(index)}
                style={styles.photoDelete}
                iconColor={theme.colors.onErrorContainer}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyPhotos}>
          <MaterialCommunityIcons name="camera-plus" size={32} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            No photos added yet
          </Text>
        </View>
      )}
    </Surface>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <Button
        mode="outlined"
        onPress={() => toggleInput && toggleInput(false)}
        style={styles.cancelButton}
        icon="close"
      >
        Cancel
      </Button>
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        icon="content-save"
        loading={dbHook.isLoading}
        disabled={!dbHook.glucose || !dbHook.carbs}
      >
        Save Entry
      </Button>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.surface,
      minHeight: 400 // Add minimum height for debugging
    }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.content}>
          {renderGlucoseCard()}
          {renderCarbsCard()}
          {renderQuickSelectors()}
          {renderNotesCard()}
          {renderPhotosCard()}

          {dbHook.error && (
            <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                {dbHook.error}
              </Text>
            </Surface>
          )}
        </View>

        {renderActionButtons()}
      </ScrollView>
    </View>
  );
}


