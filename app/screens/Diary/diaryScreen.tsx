import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useCallback, useState } from "react"; // Add useCallback and useMemo
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { FAB } from "react-native-paper";
import DiaryCalendar from "./Calendar/diaryCalendar";
import { DiaryEntry } from "./Entry/diaryEntry";
import { DiaryInput } from "./Input/diaryInput";
import { DiaryList } from "./List/diaryList";

export function DiaryScreen({
  appData,
  dbHook,
  calendarHook,
  cameraHook,
  diaryState,
  navigation,
}: {
  appData: AppData,
  dbHook: any,
  calendarHook: any,
  cameraHook: any,
  diaryState: any,
  navigation: any
}) {
  const { theme, styles } = useAppTheme();

  const [selectedDiaryData, setSelectedDiaryData] = useState<DiaryData | null>(null);
  const [showEntry, setShowEntry] = useState(false);

  /* const [glucose, setGlucose] = useState("");
  const [carbs, setCarbs] = useState("");
  const [note, setNote] = useState("");
  const [activity, setActivity] = useState("none");
  const [foodType, setFoodType] = useState("snack");
 */





  return (
    <View style={styles.background}>

      {showEntry && selectedDiaryData && (
        <View style={styles.centeredWrapper}>
          <View style={styles.centeredContent}>
            <DiaryEntry
              appData={appData}
              diaryData={selectedDiaryData}
              calendarHook={calendarHook}
              dbHook={dbHook}
            />
          </View>
        </View>
      )}


      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        // overflow: 'hidden',
      }}>
        <DiaryCalendar
          calendarHook={calendarHook}
          dbHook={dbHook}
        />
      </View>


     
      <DiaryList
        toggleEntry={() => { setShowEntry(!showEntry) }}
        setSelectedDiaryData={setSelectedDiaryData}
        calendarHook={calendarHook}
        dbHook={dbHook}
        cameraHook={cameraHook}
      />

      <View style={styles.fabContainer}>
        <View style={styles.fabRow}>
          <FAB
            color={theme.colors.onPrimary}
            icon="note-plus"
            size="medium"
            style={styles.fabSecondary}
            onPress={() => navigation.navigate('Input')}
          />
        </View>
      </View>
      {/* 
      <DiaryFabGrid
        cameraHook={cameraHook}
        calendarHook={calendarHook}
        dbHook={dbHook}
        diaryState={diaryState}
        navigation={navigation}

      />
*/}
    </View>
  );
}


export function DiaryFabGrid(
  { calendarHook,
    cameraHook,
    dbHook,
    diaryState,
    navigation,

  }: {
    calendarHook: any,
    cameraHook: any,
    dbHook: any,
    diaryState: any,
    navigation: any
  }
) {
  const { styles, theme } = useAppTheme();

  

  const renderFAB = () => (
    <>
      {!dbHook.showInput && (
        <View style={styles.fabRow}>
          <FAB
            color={theme.colors.onSecondary}
            icon={calendarHook.showCalendar ? "close" : "calendar"}
            size={"medium"}
            style={styles.fabSecondary}
            onPress={calendarHook.toggleCalendar}
          />
        </View>
      )}

      {/* */}
      {!cameraHook.showCamera && dbHook.showInput && (
        <View style={styles.fabRow}>
          <FAB
            color={theme.colors.onPrimary}
            icon="camera-plus"
            size="medium"
            style={styles.fabSecondary}
            onPress={() => cameraHook.toggleCamera()}
          />
        </View>
      )
      }
      {/* */}
      <View style={styles.fabRow}>
        {!cameraHook.showCamera && dbHook.showInput && (
          <FAB
            color={theme.colors.onPrimary}
            icon="close"
            size="medium"
            style={styles.fabSecondary}
            onPress={() => { navigation.navigate('Diary') }}
          />
        )}

        {!cameraHook.showCamera && (
          <FAB
            color={theme.colors.onPrimary}
            icon={dbHook.showInput ? "floppy" : "note-plus"}
            size="medium"
            style={styles.fab}
            onPress={() => {
              if (dbHook.showInput) {
                //handleSave();
              } else {
                if (calendarHook.showCalendar) {
                  calendarHook.toggleCalendar(false)
                }
                navigation.navigate('Input');
                dbHook.toggleInput();

              }
            }}
          />
        )



        }

      </View>

      {cameraHook.showCamera && (

        <View style={styles.fabActionRow}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <FAB
              color={cameraHook.getFlashIconColor()}
              icon={cameraHook.getFlashIcon()}
              size="medium"
              style={styles.shutterButton}
              onPress={cameraHook.cycleFlash}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>

            <FAB
              color={theme.colors.onPrimary}
              icon={"camera"}
              size="medium"
              style={styles.shutterButton}
              onPress={
                cameraHook.capturePhoto
              }
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <FAB
              color={theme.colors.onPrimary}
              icon={"camera-off"}
              size="medium"
              style={styles.shutterButton}
              onPress={
                cameraHook.toggleCamera
              }
            />
          </View>
        </View>

      )}
    </>
  );




  return (
    <View style={styles.fabContainer}>


      {renderFAB()}


    </View>
  );
}



