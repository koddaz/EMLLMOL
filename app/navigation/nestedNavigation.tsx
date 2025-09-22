import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { AppData } from "../constants/interface/appData";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { useDB } from "../hooks/useDB";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useAuth } from "../hooks/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { Icon } from "react-native-paper";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { InputScreen } from "../screens/Diary/Input/inputScreen";

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export interface navData {
     appData: AppData
     setAppData: (AppData: any) => void
     dbHook: any,
     calendarHook: any,
     cameraHook: any,
}

export function TabNav(
     { appData, setAppData, }: navData
) {

     const dbHook = useDB(appData);
     const calendarHook = useCalendar(appData);
     const cameraHook = useCamera(appData);
     const authHook = useAuth(appData.session, false);

     const tabNav = useNavigation()

     const Diary = () => (
          <DiaryNav appData={appData} dbHook={dbHook} calendarHook={calendarHook} cameraHook={cameraHook} setAppData={setAppData}
          />

     )
     const Statistics = () => (
          <StatisticsScreen
               tabNav={tabNav}
               appData={appData}
               calendarHook={calendarHook}
               dbHook={dbHook}
          />
     )
     const Settings = () => (
          <SettingsScreen
               tabNav={tabNav}
               appData={appData}
               setAppData={setAppData}
               authHook={authHook}
          />
     )

     return (
          <Tab.Navigator>

               <Tab.Screen
                    options={{
                         animation: 'shift'
                    }}
                    name="Diary"
                    component={
                         Diary
                    } />

               <Tab.Screen

                    options={{
                         animation: 'shift',

                    }}
                    name="Statistics"
                    component={
                         Statistics
                    } />


               <Tab.Screen
                    options={{
                         animation: 'shift'
                    }}
                    name="Settings"
                    component={
                         Settings
                    }

               />

          </Tab.Navigator>
     );
}



export function DiaryNav(
     { appData, dbHook, calendarHook, cameraHook }: navData
) {
     const diaryNav = useNavigation()

     const emptyDiaryData: DiaryData = {
          id: '',
          created_at: new Date(),
          glucose: 0,
          carbs: 0,
          insulin: 0,
          meal_type: 'snack',
          activity_level: 'none',
          note: '',
          uri_array: []
     };

     const Main = () => (
          <DiaryScreen
               appData={appData}
               dbHook={dbHook}
               calendarHook={calendarHook}
               cameraHook={cameraHook}
          />
     )

     const Input = () => (
          <InputScreen
               navigation={diaryNav}
               diaryData={emptyDiaryData}
               appData={appData}
               calendarHook={calendarHook}
               cameraHook={cameraHook}
               dbHook={dbHook}
               onSave={dbHook.saveDiaryEntry}
               route={""}
          />
     )

     const Camera = () => (
          <CameraScreen
               diaryNav={diaryNav}
               cameraHook={cameraHook}
               dbHook={dbHook}
               appData={appData}
          />
     )




     return (
          <Stack.Navigator
               screenOptions={{
                    headerShown: false
               }}>
               <Stack.Screen
                    name="Main"
                    component={Main}
                    />
                    <Stack.Screen
                    name="Input"
                    component={Input}
                    />
                    <Stack.Screen
                    name="Camera"
                    component={Camera}
                    />
           </Stack.Navigator >
     );

}