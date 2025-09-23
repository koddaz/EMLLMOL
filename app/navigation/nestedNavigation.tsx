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
import { Button, Icon, IconButton } from "react-native-paper";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { View } from "react-native";
import { useAppTheme } from "../constants/UI/theme";
import { NavigationProp } from "@react-navigation/native";

// Define navigation types
export type DiaryStackParamList = {
  Main: undefined;
  Input: undefined;
  Camera: undefined;
};

export type TabParamList = {
  Diary: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>()
const Stack = createNativeStackNavigator<DiaryStackParamList>()

export interface navData {
     appData: AppData
     setAppData: (AppData: any) => void
     dbHook: any,
     calendarHook: any,
     cameraHook: any,
}

export function TabNav(
     { appData, setAppData }: navData
) {

     const { styles } = useAppTheme()

     const dbHook = useDB(appData);
     const calendarHook = useCalendar(appData);
     const cameraHook = useCamera(appData);
     const authHook = useAuth(appData.session, false);

     const nav = useNavigation()

     const Diary = () => (
          <DiaryNav appData={appData} dbHook={dbHook} calendarHook={calendarHook} cameraHook={cameraHook} setAppData={setAppData}
          />

     )
     const Statistics = () => (
          <StatisticsScreen
               tabNav={nav}
               appData={appData}
               calendarHook={calendarHook}
               dbHook={dbHook}
          />
     )
     const Settings = () => (
          <SettingsScreen
               tabNav={nav}
               appData={appData}
               setAppData={setAppData}
               authHook={authHook}
          />
     )

     return (
          <Tab.Navigator>

               <Tab.Screen
                    options={{

                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="book-open-variant" size={size} color={color} />
                         )
                    }}
                    name="Diary"
                    component={
                         Diary
                    } />

               <Tab.Screen
                    options={{
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="chart-line" size={size} color={color} />
                         )
                    }}
                    name="Statistics"
                    component={
                         Statistics
                    } />

               <Tab.Screen
                    options={{
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="cog" size={size} color={color} />
                         )
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
     const diaryNav = useNavigation<NavigationProp<DiaryStackParamList>>()
     const { styles, theme } = useAppTheme()
     const nav = useNavigation()

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
               diaryNav={diaryNav}
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
               cameraHook={cameraHook}
               dbHook={dbHook}
               appData={appData}
               navigation={nav}
          />
     )




     return (
          <Stack.Navigator
               screenOptions={{

               }}>
               <Stack.Screen
                    name="Main"
                    options={{
                         headerShown: false

                    }}
                    component={Main}
               />
               <Stack.Screen
                    name="Input"
                    options={({ navigation }) => ({
                         headerTitle: "New Entry",
                         headerLeft: () => (
                              
                              <Button
                                   mode="text"
                                   onPress={() => navigation.goBack()}
                                   textColor="#E072A4"
                              >
                                   Cancel
                              </Button>
                         ),
                         headerRight: () => (
                              <View style={styles.row}>
                                   <Button
                                        mode="text"
                                        onPress={() => {/* handle save */ }}
                                        textColor="#3D3B8E"
                                   >
                                        Save
                                   </Button>
                                   <IconButton
                                        icon="camera-plus"
                                        iconColor={theme.colors.primary}
                                        onPress={() => navigation.navigate('Camera')}
                                        />
                              </View>
                         )
                    })}
                    component={Input}
               />
               <Stack.Screen
                    name="Camera"
                    options={{ headerShown: false }}
                    component={Camera}
                    
               />
          </Stack.Navigator >
     );

}