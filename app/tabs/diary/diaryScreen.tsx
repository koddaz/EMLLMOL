import { LoadingScreen } from "@/app/components/loadingScreen";
import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Appbar, Avatar, Button, FAB, IconButton, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { DiaryEntry } from "./entry/diaryEntry";
import { useCalendar } from "./hooks/useCalendar";
import { useCamera } from "./hooks/useCamera";
import { useDB } from "./hooks/useDB";


export function DiaryScreen({
  appData,
  showCalendar, 
  setShowCalendar, 
  selectedDate,
  diaryEntries,
  isLoading,
  refreshEntries
}: { 
  appData: AppData, 
  showCalendar?: boolean, 
  setShowCalendar?: (state: boolean) => void, 
  selectedDate: Date,
  diaryEntries: DiaryData[],
  isLoading: boolean,
  refreshEntries: () => Promise<void>
}) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const [toggleEntry, setToggleEntry] = useState(false);
  const [toggleInput, setToggleInput] = useState(false);
  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);

  // Remove the useDB hook from here since data is now passed as props
  // const { isLoading, diaryEntries, retrieveEntries } = useDB(appData);

  // Add debug logging for date changes
  console.log('🗓️ DiaryScreen selectedDate:', selectedDate.toDateString());

  return (
    <View style={styles.background}>
      <View style={styles.background}>
        {showCalendar && (
          <DiaryCalendar
            visible={showCalendar}
            onClose={() => setShowCalendar && setShowCalendar(false)}
            appData={appData}
          />
        )}

        {!toggleEntry && (
          <DiaryList
            appData={appData}
            toggleEntry={setToggleEntry}
            setSelectedDiaryData={setSelectedDiaryData}
            selectedDate={selectedDate}
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
              refreshEntries={refreshEntries}
            />
          </KeyboardAvoidingView>
        )}

        <FAB
          icon={toggleInput == true ? "close" : "note-plus"}
          style={styles.fab}
          onPress={() => setToggleInput(!toggleInput)}
        />

      </View>
    </View>
  );
}

export function DiaryListItem(
  { diaryData, onPress }: { diaryData: DiaryData, onPress?: () => void }) {
  const theme = useTheme();
  const styles = customStyles(theme);
  const { formatTime } = useCalendar();

  const getMealIcon = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'coffee';
      case 'lunch': return 'food';
      case 'dinner': return 'food-variant';
      case 'snack': return 'food-apple';
      default: return 'silverware';
    }
  };

  return (
    <View style={styles.diaryListRow}>
      <Surface style={styles.diaryListItem} elevation={2}>
        <View style={[styles.itemContent, { opacity: onPress ? 1 : 1 }]} onTouchEnd={onPress}>
          {/* Left side - Time and meal info */}
          <View style={styles.leftContent}>
            <Text variant="labelMedium" style={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 12
            }}>
              {formatTime(diaryData.created_at)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <MaterialCommunityIcons
                name={getMealIcon(diaryData.meal_type || '')}
                size={14}
                color={theme.colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text variant="bodyMedium" style={{
                color: theme.colors.onSurface,
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {diaryData.meal_type || 'Meal'}
              </Text>
              <Text variant="bodySmall" style={{
                color: theme.colors.onSurfaceVariant,
                marginLeft: 8
              }}>
                {diaryData.carbs || 0}g carbs
              </Text>
            </View>
          </View>

          {/* Right side - Glucose level */}
          <View style={styles.glucoseBadge}>
            <Text variant="labelSmall" style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: 'bold'
            }}>
              {diaryData.glucose || '0'}
            </Text>
          </View>
        </View>
      </Surface>
    </View>
  );
}

export function DiaryList(
  { appData, toggleEntry, setSelectedDiaryData, selectedDate, isLoading, diaryEntries, refreshEntries }: {
    isLoading: boolean,
    diaryEntries: DiaryData[],
    appData: AppData,
    toggleEntry?: (state: boolean) => void,
    setSelectedDiaryData?: (data: DiaryData) => void,
    selectedDate: Date,
    refreshEntries: () => Promise<void>
  }
) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const filteredEntries = diaryEntries.filter(item => {
    const itemDate = new Date(item.created_at);
    const selectedDateObj = new Date(selectedDate);

    const itemDateString = itemDate.getFullYear() + '-' +
      String(itemDate.getMonth() + 1).padStart(2, '0') + '-' +
      String(itemDate.getDate()).padStart(2, '0');

    const selectedDateString = selectedDateObj.getFullYear() + '-' +
      String(selectedDateObj.getMonth() + 1).padStart(2, '0') + '-' +
      String(selectedDateObj.getDate()).padStart(2, '0');

    return itemDateString === selectedDateString;
  });

  // Add debug logging to see what's happening
  console.log('📅 Selected date:', selectedDate.toDateString());
  console.log('📊 Total entries:', diaryEntries.length);
  console.log('🔍 Filtered entries:', filteredEntries.length);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (filteredEntries.length === 0) {
    return (
      <View style={[styles.background, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          No entries for {selectedDate.toLocaleDateString()}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Add your first entry by tapping the + button
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <Text variant="titleLarge" style={{ margin: 16, color: theme.colors.onSurface }}>{selectedDate.toLocaleDateString()}</Text>
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const itemDate = new Date(item.created_at);
          const diaryData = {
            id: item.id,
            created_at: itemDate,
            glucose: item.glucose,
            carbs: item.carbs,
            insulin: item.insulin,
            meal_type: item.meal_type,
            activity_level: item.activity_level,
            note: item.note || '',
            uri_array: item.uri_array || []
          };

          return (
            <DiaryListItem
              diaryData={diaryData}
              onPress={() => {
                setSelectedDiaryData && setSelectedDiaryData(diaryData);
                toggleEntry && toggleEntry(true);
              }}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        // Add pull-to-refresh functionality
        refreshing={isLoading}
        onRefresh={refreshEntries}
        extraData={selectedDate.toISOString()}
      />
    </View>
  );

}
export function DiaryCalendar(
  { visible,
    onClose,
    appData,
  }: {
    visible: boolean,
    onClose: () => void,
    appData: AppData,

  }
) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const {
    renderCalendarGrid,
    renderCalendarNavigation
  } = useCalendar();

  return (
    <Surface
      style={[styles.calendarSheet, {
        position: 'absolute',
        top: 0, // Adjusted to match the smaller app bar height
        left: 0,
        right: 0,

        zIndex: 1000,
      }]}
      elevation={4}
    >
      <ScrollView>
        <View style={styles.calendarWeekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.calendarWeekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {renderCalendarGrid()}
          {renderCalendarNavigation()}
        </View>
      </ScrollView>
    </Surface>
  );
}
// Main entry point for the app
export function DiaryInput({
  appData,
  toggleInput,
  refreshEntries
}: {
  appData: AppData,
  toggleInput?: (state: boolean) => void,
  refreshEntries: () => Promise<void>
}) {
  const theme = useTheme();
  const styles = customStyles(theme);

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

  // supabase related
  const {
    glucose,
    setGlucose,
    carbs,
    setCarbs,
    note,
    setNote,
    activity,
    setActivity,
    foodType,
    setFoodType,
    activityOptions,
    foodOptions,
    saveDiaryEntry,
    isLoading,
    error
  } = useDB(appData);

  // toggles and arrays
  const [toggleCamera, setToggleCamera] = useState(false);
  const [toggleNote, setToggleNote] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    // Then save diary entry with permanent URIs
    await saveDiaryEntry(permanentURIs);    
    // Refresh the entries after saving
    await refreshEntries();

    setToggleCamera(false);
    setToggleNote(false);
    clearPhotoURIs();
    if (toggleInput) {
      toggleInput(false);
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons name="plus-circle" size={24} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, marginLeft: 12 }}>
          New Entry
        </Text>
      </View>
      <IconButton
        icon="close"
        size={24}
        onPress={() => toggleInput && toggleInput(false)}
        style={styles.closeButton}
      />
    </View>
  );

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
        value={glucose}
        onChangeText={setGlucose}
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
        value={carbs}
        onChangeText={setCarbs}
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
            {foodOptions.map((option) => (
              <Button
                key={option}
                mode={foodType === option ? "contained" : "outlined"}
                onPress={() => setFoodType(option)}
                style={[
                  styles.chip,
                  foodType === option && { backgroundColor: theme.colors.primary }
                ]}
                labelStyle={{
                  fontSize: 12,
                  color: foodType === option ? theme.colors.onPrimary : theme.colors.onSurface
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
            {activityOptions.map((option) => (
              <Button
                key={option}
                mode={activity === option ? "contained" : "outlined"}
                onPress={() => setActivity(option)}
                style={[
                  styles.chip,
                  activity === option && { backgroundColor: theme.colors.secondary }
                ]}
                labelStyle={{
                  fontSize: 12,
                  color: activity === option ? theme.colors.onSecondary : theme.colors.onSurface
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
        value={note}
        onChangeText={setNote}
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
        loading={isLoading}
        disabled={!glucose || !carbs}
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
        {renderHeader()}

        <View style={styles.content}>
          {renderGlucoseCard()}
          {renderCarbsCard()}
          {renderQuickSelectors()}
          {renderNotesCard()}
          {renderPhotosCard()}

          {error && (
            <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                {error}
              </Text>
            </Surface>
          )}
        </View>

        {renderActionButtons()}
      </ScrollView>
    </View>
  );
}



