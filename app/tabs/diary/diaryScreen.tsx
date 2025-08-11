import { AppData } from "@/app/constants/interface/appData";
import { customStyles } from "@/app/constants/UI/styles";
import { supabase } from "@/db/supabase/supabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Appbar, Avatar, Button, Card, FAB, IconButton, RadioButton, Surface, Text, TextInput, useTheme } from "react-native-paper";

/* Diary Data:

User related: {
userId: string; // Unique identifier for the user
entryId: string; // Unique identifier for the diary entry
}

Diary entry related: {
photo: string; // URL or local path to the photo
date: string; // ISO date string
mealType: string; // e.g., 'breakfast', 'lunch', 'dinner', 'snack'
foodItems
carbs: number; // Total carbs in grams
glucoseLevel : number; // mg/dL or mmol/L
}

*/

export function DiaryScreen({
  appData }: { appData: AppData }) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const [toggleView, setToggleView] = useState(false);
  const [toggleEntry, setToggleEntry] = useState(true);

  const {
    formatDate,
    selectedDate,
    showCalendar,
    currentMonth,
    navigateMonth,
    navigateDate,
    setShowCalendar
  } = useCalendar();


  return (
    <>
      <Appbar.Header>
        {showCalendar ? (
          <>
            <Appbar.Action
              icon="chevron-left"
              onPress={() => navigateMonth('prev')}
            />
            <Appbar.Content
              title={currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            />
            <Appbar.Action
              icon="chevron-right"
              onPress={() => navigateMonth('next')}
            />
            <Appbar.Action
              icon="close"
              onPress={() => setShowCalendar(false)}
            />
          </>
        ) : (
          <>
            <Appbar.Action
              icon='chevron-left'
              onPress={() => { navigateDate('prev') }}
            />

            <Appbar.Content title={formatDate(selectedDate)} />

            <Appbar.Action
              icon="chevron-right"
              onPress={() => navigateDate('next')}
            />
            <Appbar.Action
              icon="calendar"
              onPress={() => setShowCalendar(!showCalendar)}
            />

          </>
        )}
      </Appbar.Header>

      <View style={styles.background}>
        {showCalendar && (
          <DiaryCalendar
            visible={showCalendar}
            onClose={() => setShowCalendar(false)}
            appData={appData}
          />
        )}

        {toggleEntry == false && toggleView == false ? (
          <DiaryMain appData={appData} />
        ) : toggleView == true && toggleEntry == false ? (
          <DiaryEntry appData={appData} />
        ) : (
          <DiaryInput appData={appData} toggleEntry={setToggleEntry} />
        )}
        <FAB
          icon={toggleEntry == true ? "close" : "note-plus"}
          style={styles.fab}
          onPress={() => setToggleEntry(!toggleEntry)}
        />

      </View>
    </>
  );
}
export function DiaryMain(
  { appData }: { appData: AppData }
) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const { formatDate, formatTime } = useCalendar();



  const mock = [mockData[0], mockData[1], mockData[2], mockData[3], mockData[4]];



  return (
    <View style={styles.background}>

      <FlatList
        data={mock}
        keyExtractor={(item) => item.entryId}
        renderItem={({ item }) => {
          return (
            <View style={styles.row}>

              <Avatar.Text
                size={60}
                label={item.glucoseLevel.toString()}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                labelStyle={{ color: theme.colors.onPrimaryContainer }}
              />

              <Surface style={styles.diaryListItem} elevation={4}>
                <View style={styles.row}>
                  <Text variant="bodyMedium">{formatTime(item.date)}</Text>
                  <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text variant="titleMedium">{item.mealType}</Text>
                    <Text variant="bodySmall">Food Items: {item.foodItems.join(', ')}</Text>
                    <Text variant="bodySmall">Carbs: {item.carbs}g</Text>
                  </View>

                </View>


              </Surface>
            </View>
          );
        }}
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
    renderCalendarGrid
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
        </View>
      </ScrollView>
    </Surface>
  );
}
export function useCalendar() {
  const theme = useTheme();
  const styles = customStyles(theme);

  const onClose = () => {
    setShowCalendar(false);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);

    // Add days from the previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);

      days.push(
        <Surface
          key={`prev-${day}`}
          style={[styles.calendarDay, { opacity: 0.5 }]}
          elevation={0}
        >
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
              setCurrentMonth(prevMonth);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <Surface
          key={day}
          style={[
            styles.calendarDay,
            isSelected && { backgroundColor: theme.colors.primary },
            isToday && !isSelected && { backgroundColor: theme.colors.primaryContainer }
          ]}
          elevation={isSelected ? 2 : 0}
        >
          <Button
            mode={isSelected ? "contained" : "text"}
            onPress={() => {
              setSelectedDate(date);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: isSelected ? theme.colors.onPrimary :
                isToday ? theme.colors.primary : theme.colors.onSurface
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    // Add days from next month to complete the grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day);

      days.push(
        <Surface
          key={`next-${day}`}
          style={[styles.calendarDay, { opacity: 0.5 }]}
          elevation={0}
        >
          <Button
            mode="text"
            onPress={() => {
              setSelectedDate(date);
              setCurrentMonth(nextMonth);
              onClose();
            }}
            style={{ minWidth: 40, height: 40 }}
            contentStyle={{ height: 40 }}
            labelStyle={{
              fontSize: 14,
              color: theme.colors.onSurfaceVariant
            }}
          >
            {day}
          </Button>
        </Surface>
      );
    }

    return days;
  };

  return {
    selectedDate,
    setSelectedDate,
    setShowCalendar,
    setCurrentMonth,
    showCalendar,

    toggleCalendar,

    formatDate,
    formatTime,


    currentMonth,

    getDaysInMonth,
    getFirstDayOfMonth,

    navigateMonth,
    navigateDate,

    renderCalendarGrid
  }
}

// Main entry point for the app
export function DiaryInput(
  {
    appData,
    toggleEntry
  }: {
    appData: AppData,
    toggleEntry?: (state: boolean) => void
  }
) {
  const theme = useTheme();
  const styles = customStyles(theme);
  // camera related
  const {
    renderCamera,
    cycleFlash,
    getFlashIcon,
    getFlashIconColor,
    capturePhoto,
    photoURIs,
    removePhotoURI,
    clearPhotoURIs
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
    retrieveEntries,
    removeEntry,
    isLoading,
    error
  } = useDB(appData);
  // toggles and aarrays
  const [toggleCamera, setToggleCamera] = useState(false);
  const [toggleNote, setToggleNote] = useState(false);
  // keyboard related
  const glucoseInputRef = useRef<any>(null);
  const carbsInputRef = useRef<any>(null);

  const handleSave = async () => {
    await saveDiaryEntry();
    setToggleCamera(false);
    setToggleNote(false);
    clearPhotoURIs();
    if (toggleEntry) {
      toggleEntry(false);
    }
  }
  const renderEdit = () => {
    return (
      <View style={[styles.plaincontainer, { height: 200 }]}>
        <Surface style={[styles.surface, { flex: 1 }]} elevation={4} >

          <TextInput
            label="Notes"
            mode="outlined"
            value={note}
            onChangeText={text => setNote(text)}
            left={<TextInput.Icon icon="note-text" />}
            style={[styles.textInput, { height: 120 }]} // Adjust height for 4 lines
            placeholder="Add any notes about your meal or how you're feeling..."
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top" // Ensures text starts at the top on Android
          />

        </Surface>
      </View>
    );
  };
  const renderRadioButtons = () => {
    return (
      <View style={[styles.plaincontainer, { height: 200 }]}>
        <View style={styles.row}>
          <Surface style={[styles.surface, { flex: 1, marginRight: 4 }]} elevation={4} >
            <RadioButtonGroup
              icon="run"
              title={"Activity"}
              value={activity}
              setValue={setActivity}
              options={activityOptions}
            />
          </Surface>
          <Surface style={[styles.surface, { flex: 1, marginLeft: 4 }]} elevation={4} >
            <RadioButtonGroup
              icon="food"
              title={"Meal"}
              value={foodType}
              setValue={setFoodType}
              options={foodOptions}
            />
          </Surface>
        </View>
      </View>
    );
  }
  const renderTextInput = (affix: string, label: string, icon: any, value: string, setValue: (value: string) => void, ref?: any, onSubmitEditing?: () => void, returnKeyType?: "next" | "done") => {
    return (
      <TextInput
        ref={ref}
        label={label}
        mode="outlined"
        value={value}
        onChangeText={text => setValue(text)}
        left={<TextInput.Icon icon={icon} />}
        right={
          <TextInput.Affix
            text={affix}
            textStyle={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 14
            }}
          />
        }
        style={styles.textInput}
        placeholder={label === "glucose" ? "5.5" : "50"}
        keyboardType={label === "glucose" ? "decimal-pad" : "numeric"}
        returnKeyType={returnKeyType || "next"}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
      />
    );
  }
  const renderMenu = () => {

    return (

      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        {toggleCamera == true ? (
          <>

            <IconButton
              mode={"outlined"}
              icon={getFlashIcon()}
              iconColor={getFlashIconColor()}
              size={40}
              onPress={cycleFlash}
              style={{ alignSelf: 'flex-end' }}
            />
            <IconButton
              mode={"outlined"}
              icon="camera"
              size={40}
              onPress={capturePhoto}
              style={{ alignSelf: 'flex-end' }}
            />

            <IconButton
              mode={"outlined"}
              icon="close"
              size={40}
              onPress={() => setToggleCamera(!toggleCamera)}
              style={{ alignSelf: 'flex-end' }}
            />
          </>
        ) : (
          <>
            <View style={styles.row}>
              <IconButton
                mode={"outlined"}
                icon="pen"
                size={40}
                onPress={() => setToggleNote(!toggleNote)}
                style={{ alignSelf: 'flex-end' }}
              />
              <IconButton
                mode={"outlined"}
                icon="camera"
                size={40}
                onPress={() => setToggleCamera(!toggleCamera)}
                style={{ alignSelf: 'flex-end' }}
              />
            </View>
            <IconButton
              mode={"outlined"}
              icon="content-save"
              size={40}
              onPress={handleSave}
              style={{ alignSelf: 'flex-end' }}
            />

          </>
        )}
      </View>

    );
  }
  const renderPictures = () => {
    if (photoURIs.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            No photos captured yet
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        horizontal
        data={photoURIs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ margin: 4 }}>
            <Avatar.Image
              size={60}
              source={{ uri: item }}
              style={{ backgroundColor: theme.colors.primaryContainer }}
            />
            <IconButton
              icon="close"
              size={20}
              onPress={() => removePhotoURI(index)}
              style={{ position: 'absolute', top: -5, right: -5, backgroundColor: theme.colors.errorContainer }}
              iconColor={theme.colors.onErrorContainer}
            />
          </View>
        )}
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
      />
    );
  }
  return (

    <KeyboardAvoidingView
      style={styles.centeredWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {(toggleCamera || photoURIs.length > 0) && (
        <View style={{ width: '100%' }}>
          <Surface style={[styles.container]} elevation={4}>
            {renderPictures()}
          </Surface>
        </View>

      )}
      <View style={[styles.container]}>
        {toggleCamera == true ? (
          <View style={{ flex: 1 }}>

            {renderCamera()}

          </View>
        ) : (
          <View>
            <Surface style={[styles.surface, { marginBottom: 8 }]} elevation={4}>
              {renderTextInput(
                appData.settings.glucose,
                "glucose",
                "blood-bag",
                glucose,
                setGlucose,
                glucoseInputRef,
                () => carbsInputRef.current?.focus(),
                "next"
              )}
              {renderTextInput(
                "g",
                "carbs",
                "food",
                carbs,
                setCarbs,
                carbsInputRef,
                () => {
                  Keyboard.dismiss();
                  carbsInputRef.current?.blur();
                },
                "done"
              )}
            </Surface>
            {!toggleNote ? (
              renderRadioButtons()
            ) : (
              renderEdit()
            )}
          </View>
        )}

        {renderMenu()}
      </View>
    </KeyboardAvoidingView >

  );
}

export function DiaryEntry({ appData }: { appData: AppData }) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

  return (
    <Card>
      <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
      <Card.Content>
        <Text variant="titleLarge">Card title</Text>
        <Text variant="bodyMedium">Card content</Text>
      </Card.Content>
      <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
}

export function RadioButtonGroup(
  { value, setValue, options, title, icon }: { value: string, setValue: (value: string) => void, options: any[], title?: string, icon?: any }
) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const groupedOptions = [];
  for (let i = 0; i < options.length; i += 2) {
    groupedOptions.push(options.slice(i, i + 2));
  }

  return (

    <View style={{ paddingHorizontal: 8 }}>
      <View style={styles.row}>
        <MaterialCommunityIcons name={icon || "circle"} size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={{ fontSize: 16, fontWeight: '500', marginStart: 5, marginTop: 8, marginBottom: 8 }}>
          {title}
        </Text>
      </View>
      {groupedOptions.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { justifyContent: 'center' }]}>
          {row.map((option) => (
            <View key={option} style={{ alignItems: 'center', flex: 1 }}>
              <RadioButton
                value={option}
                status={value === option ? 'checked' : 'unchecked'}
                onPress={() => setValue(option)}
              />
              <Text style={{ fontSize: 14 }}>{option}</Text>
            </View>
          ))}

          {/* Add empty space if row has only one item */}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View >
  )
}
export function useDB(appData: AppData) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");
  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const { clearPhotoURIs, photoURIs } = useCamera(appData);

  const retrieveEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', appData.session?.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to retrieve diary entries:', error);
        setError('Failed to retrieve diary entries');
        return;
      }

      console.log('✅ Diary entries retrieved successfully:', data);
      setDiaryEntries(data || []);

    } catch (err) {
      console.error('❌ Failed to retrieve diary entries:', err);
      setError('Failed to retrieve diary entries');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiaryEntry = async () => {
    try {

      setIsLoading(true);
      setError(null); // Clear previous errors

      // Validation
      if (!glucose.trim()) {
        setError('Glucose level is required');
        return;
      }

      if (!carbs.trim()) {
        setError('Carbs amount is required');
        return;
      }

      const entryData = {
        userId: appData.session?.user.id,
        glucose: parseFloat(glucose),
        carbs: parseFloat(carbs),
        note: note,
        activity_level: activity,
        meal_type: foodType,
        created_at: new Date().toISOString(),
        uri_array: photoURIs || []
      }

      const { data, error } = await supabase.from('entries').insert([entryData]);
      if (error) {
        console.error('❌ Failed to save diary entry:', error);
        return;
      }

      // Clear form after saving
      setGlucose("");
      setCarbs("");
      setNote("");
      setActivity("none");
      setFoodType("snack");
      clearPhotoURIs();

    } catch (error) {
      console.error('❌ Failed to save diary entry:', error);
      setError('Failed to save diary entry');
    } finally {
      setIsLoading(false);
    }
  }

  const removeEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', appData.session?.user.id);
      if (error) {
        console.error('❌ Failed to delete diary entry:', error);
        setError('Failed to delete diary entry');
        return;
      }
      console.log('✅ Diary entry deleted successfully:', entryId);
      // Optionally, refresh the entries after deletion
      await retrieveEntries();
    } catch (err) {
      console.error('❌ Failed to delete diary entry:', err);
      setError('Failed to delete diary entry');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveDiaryEntry,
    retrieveEntries,
    removeEntry,

    isLoading,
    error,

    diaryEntries,

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
    foodOptions,
    activityOptions,

  };
}

export function useCamera(appData: AppData) {

  const theme = useTheme();

  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState<"on" | "off" | "auto">("off");
  const [zoom, setZoom] = useState(0);
  const [photoURIs, setPhotoURIs] = useState<string[]>([]);


  const renderCamera = () => {
    // Check if permission is still loading
    if (appData.permission === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading camera permissions...</Text>
        </View>
      );
    }

    if (!appData.permission?.granted) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Camera permission not granted</Text>
          <Button
            mode="contained"
            onPress={appData.requestCameraPermission}
          >
            Grant Camera Permission
          </Button>
        </View>
      );
    }

    return (
      <CameraView style={{ flex: 1 }} flash={flash} ref={cameraRef} />
    );
  }

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        console.error("Camera reference is not set");
        return;
      }
      if (photoURIs.length >= 3) {
        console.warn("Maximum of 3 photos reached. Please remove a photo before capturing a new one.");
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
        skipProcessing: false,
      });
      console.log('✅ Photo captured:', photo.uri);

      if (photo && photo.uri) {
        setPhotoURIs(prevURIs => [...prevURIs, photo.uri]);
      }
      return photo;
    } catch (error) {
      console.error('❌ Failed to capture photo:', error);
      return null;
    }
  };

  const removePhotoURI = (indexToRemove: number) => {
    setPhotoURIs(prevURIs => prevURIs.filter((_, index) => index !== indexToRemove));
  };

  const clearPhotoURIs = () => {
    setPhotoURIs([]);
  };

  // Get the icon based on the flash state
  const getFlashIcon = () => {
    switch (flash) {
      case "on":
        return "flash";
      case "off":
        return "flash-off";
      case "auto":
        return "flash-auto";
      default:
        return "flash-off";
    }
  };
  // Get the color for the flash icon based on the flash state
  const getFlashIconColor = () => {
    switch (flash) {
      case "on":
        return theme.colors.primary;
      case "off":
        return theme.colors.onSurfaceVariant;
      case "auto":
        return theme.colors.secondary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };
  // Cycle through flash modes
  const cycleFlash = () => {
    if (flash === "off") {
      setFlash("on");
    } else if (flash === "on") {
      setFlash("auto");
    } else {
      setFlash("off");
    }
  };

  return {
    renderCamera,

    // handle photo capture
    capturePhoto,
    removePhotoURI,
    clearPhotoURIs,
    photoURIs,

    // Functions to toggle flash
    cycleFlash,
    flash,
    getFlashIcon,
    getFlashIconColor
  };

}

const mockData = [
  {
    userId: "user123",
    entryId: "entry001",
    photo: { uri: require('@/assets/images/demoImage.jpg') }, // URI object format
    date: new Date(),
    mealType: "breakfast",
    foodItems: ["eggs", "bacon", "toast"],
    carbs: 25,
    glucoseLevel: 120
  },
  {
    userId: "user123",
    entryId: "entry002",
    photo: "https://example.com/lunch.jpg",
    date: new Date(Date.now() - 86400000), // Yesterday
    mealType: "lunch",
    foodItems: ["chicken", "rice", "vegetables"],
    carbs: 45,
    glucoseLevel: 140
  },
  {
    userId: "user123",
    entryId: "entry003",
    photo: "https://example.com/dinner.jpg",
    date: new Date(Date.now() - 172800000), // 2 days ago
    mealType: "dinner",
    foodItems: ["salmon", "quinoa", "broccoli"],
    carbs: 30,
    glucoseLevel: 110
  },
  {
    userId: "user123",
    entryId: "entry004",
    photo: "https://example.com/snack.jpg",
    date: new Date(Date.now() - 259200000), // 3 days ago
    mealType: "snack",
    foodItems: ["apple", "peanut butter"],
    carbs: 20,
    glucoseLevel: 95
  },
  {
    userId: "user123",
    entryId: "entry005",
    photo: "https://example.com/breakfast2.jpg",
    date: new Date(Date.now() - 345600000), // 4 days ago
    mealType: "breakfast",
    foodItems: ["oatmeal", "berries", "honey"],
    carbs: 35,
    glucoseLevel: 105
  }
];