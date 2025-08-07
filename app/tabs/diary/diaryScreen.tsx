import { AppData } from "@/app/constants/interface/appData";
import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { FAB, IconButton, RadioButton, Surface, Text, TextInput, useTheme } from "react-native-paper";

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

export function DiaryScreen({ appData }: { appData: AppData }) {
  const theme = useTheme();
  const styles = customStyles(theme);

  const [camera, setCamera] = useState(false);
  const [toggleEntry, setToggleEntry] = useState(true);

  return (
    <View style={styles.background}>
      {toggleEntry == true ? (
        <DiaryInput appData={appData} />
      ) : (
        <DiaryMain appData={appData} />
      )}
      <FAB
        icon={toggleEntry == true ? "close" : "note-plus"}
        style={styles.fab}
        onPress={() => setToggleEntry(!toggleEntry)}
      />

    </View>
  );
}



export function DiaryMain(
  { appData }: { appData: AppData }
) {
  const theme = useTheme();
  const styles = customStyles(theme);




  return (
    <>



      <Text style={styles.text}>Main</Text>





    </>
  );

}

export function DiaryCamera() {
  const theme = useTheme();
  const styles = customStyles(theme);


  return (
    <>

      <CameraView style={styles.camera} />

    </>
  )
}

export function DiaryCalendar() {
  const theme = useTheme();
  const styles = customStyles(theme);

  return (
    <View style={styles.background}>
      <Text style={styles.text}>Diary Calendar</Text>
      {/* Calendar component can be added here */}
    </View>
  );
}

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

  const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");

  // State for camera toggle
  const [toggleCamera, setToggleCamera] = useState(false);

  // State for note entry
  const [toggleNote, setToggleNote] = useState(false);
  const [note, setNote] = useState("");

  // Radio button states
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");
  const foodOptions = ["snack", "breakfast", "lunch", "dinner"];
  const activityOptions = ["none", "low", "medium", "high"];

  const renderEdit = () => {
    return (
      <View style={[styles.plaincontainer, { minHeight: 200 }]}>
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
      </View>
    );
  };

  const renderRadioButtons = () => {
    return (
      <View style={[styles.plaincontainer, { minHeight: 200 }]}>
        <View style={styles.row}>
          <Surface style={{ flex: 1, backgroundColor: theme.colors.primaryContainer, padding: 16, borderRadius: 8 }} elevation={4} >
            <RadioButtonGroup
              icon="run"
              title={"Activity"}
              value={activity}
              setValue={setActivity}
              options={activityOptions}
            />
          </Surface>
          <Surface style={{ flex: 1, backgroundColor: theme.colors.primaryContainer, padding: 16, borderRadius: 8 }} elevation={4} >
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

  const renderTextInput = (affix: string, label: string, icon: any, value: string, setValue: (value: string) => void) => {
    return (
      <TextInput
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
        placeholder="5.5"
        keyboardType="numeric"
      />
    );
  }


  // This is a component for individual diary entries
  return (

    <View style={styles.centeredWrapper}>

      {toggleCamera == true ? (
        <View style={styles.container}>
        <DiaryCamera />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Diary Entry</Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => toggleEntry && toggleEntry(false)}
            />
          </View>
          {renderTextInput(appData.settings.glucose, "glucose", "blood-bag", glucose, setGlucose)}
          {renderTextInput("g", "carbs", "food", carbs, setCarbs)}
          {!toggleNote ? (
            renderRadioButtons()
          ) : (
            renderEdit()
          )
          }
        </View>
      )}


      <View style={styles.container}>
        <View style={[styles.row, { justifyContent: 'flex-start' }]}>
          <IconButton
            icon="note-text"
            size={24}
            onPress={() => setToggleNote(!toggleNote)}
            style={{ alignSelf: 'flex-end' }}
          />
          <IconButton
            icon="camera"
            size={24}
            onPress={() => setToggleCamera(!toggleCamera)}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
      </View>


    </View >

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

export function useDB() {
  // This function can be used to interact with the database
  // For example, fetching or updating diary entries
  return {
    fetchEntries: async () => {
      // Logic to fetch diary entries from the database
    },
    addEntry: async (entry: any) => {
      // Logic to add a new diary entry to the database
    },
  };
}
