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
import { Icon, IconButton, Text } from "react-native-paper";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { Image, View } from "react-native";
import { useAppTheme } from "../constants/UI/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";

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



function TabTopBar(props: any) {
     const getDisplayName = (routeName: string) => {
          switch (routeName) {
               case 'Diary':
                    return 'Diary';
               case 'Statistics':
                    return 'Statistics';
               case 'Settings':
                    return 'Settings';
               default:
                    return routeName || 'App';
          }
     };

     const routeName = props.route?.name || props.children || 'App';

     return (
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, }}>
               <Image style={{ width: 40, height: 40 }} resizeMode="cover" source={require('./../../assets/images/logo-head.gif')} />
               <Text variant={"titleLarge"}>{getDisplayName(routeName)}</Text>
          </View>
     )
}

function StackTopBar({ appData, dbHook, calendarHook }: navData) {

     const navigation = useNavigation();
     const state = navigation.getState();
     const currentRoute = state?.routes[state.index];
     const routeName = currentRoute?.name || 'Stack Screen';

     const getDisplayName = (routeName: string) => {
          switch (routeName) {
               case 'Main':
                    return 'Diary';
               case 'Input':
                    return 'New Entry';
               case 'Camera':
                    return 'Camera';
               default:
                    return routeName || 'Stack Screen';
          }
     };

     console.log('StackTopBar - Current route:', routeName);
     console.log('StackTopBar - appData:', !!appData);
     console.log('StackTopBar - dbHook:', !!dbHook);
     console.log('StackTopBar - calendarHook:', !!calendarHook);

     return (
          (routeName == 'Main') && (
               <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, }}>
                    <Text variant={"titleLarge"}>
                         {calendarHook.formatDate(calendarHook.selectedDate)}
                         </Text>
               </View>
          )


     )
}

export interface navData {
     stackNav?: NavigationProp<DiaryStackParamList>;
     tabNav?: NavigationProp<TabParamList>;
     appData?: AppData
     setAppData?: (AppData: any) => void
     dbHook?: any,
     calendarHook?: any,
     cameraHook?: any,
     authHook?: any,
}

export function TabNav(
     { appData, setAppData }: navData
) {

     const { styles, theme } = useAppTheme()

     const dbHook = useDB(appData!);
     const calendarHook = useCalendar(appData!);
     const cameraHook = useCamera(appData!);
     const authHook = useAuth(appData?.session, false);


     const Diary = () => (
          <DiaryNav appData={appData} dbHook={dbHook} calendarHook={calendarHook} cameraHook={cameraHook} setAppData={setAppData}
          />

     )
     const Statistics = () => (
          <StatisticsScreen
               appData={appData}
               calendarHook={calendarHook}
               dbHook={dbHook}
          />
     )
     const Settings = () => (
          <SettingsScreen
               appData={appData!}
               setAppData={setAppData!}
               authHook={authHook}
          />
     )

     return (
          <Tab.Navigator
               screenOptions={{
                    headerShown: true,
                    headerTitle: (route) => <TabTopBar {...route} />,
                    headerShadowVisible: false,
                    headerStyle: {
                         elevation: 0,
                         shadowOpacity: 0,
                         shadowOffset: { height: 0, width: 0 },
                         shadowRadius: 0,
                         backgroundColor: theme.colors.surface,
                    },
                    headerTitleContainerStyle: {
                         flex: 1,
                         paddingHorizontal: 8,
                         marginHorizontal: 0,
                    },
                    headerLeftContainerStyle: {
                         margin: 0,
                         padding: 0,
                    },
                    headerRightContainerStyle: {
                         flex: 0,
                         paddingRight: 16,
                    },

               }}
          >

               <Tab.Screen
                    options={{

                         animation: 'shift',
                         headerStyle: {
                              backgroundColor: theme.colors.surface,
                         },
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="book-open-variant" size={size} color={color} />
                         ),
                         headerRight: () => (
                              <IconButton icon={'calendar'} onPress={() => calendarHook.toggleCalendar()} iconColor={theme.colors.primary} />
                         )
                    }}
                    name="Diary"
                    getId={() => "tab-diary"}
                    component={
                         Diary
                    } />

               <Tab.Screen
                    options={({ navigation }) => ({
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="chart-line" size={size} color={color} />
                         ),
                         headerLeft: () => (
                              <IconButton icon={'arrow-left-bold'} onPress={() => navigation.navigate('Diary')} iconColor={theme.colors.primary} />
                         )
                    })}
                    name="Statistics"
                    getId={() => "tab-statistics"}
                    component={
                         Statistics
                    } />

               <Tab.Screen
                    options={({ navigation }) => ({
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="cog" size={size} color={color} />
                         ),
                         headerLeft: () => (
                              <IconButton icon={'arrow-left-bold'} onPress={() => navigation.navigate('Diary')} iconColor={theme.colors.primary} />
                         )
                    })}
                    name="Settings"
                    getId={() => "tab-settings"}
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
     const { styles, theme } = useAppTheme()

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

     return (
          <Stack.Navigator
               screenOptions={{
                    headerShown: true,
                    headerTitle: () => <StackTopBar appData={appData} dbHook={dbHook} calendarHook={calendarHook} />,
                    headerShadowVisible: true,
                    headerStyle: {
                         backgroundColor: theme.colors.surface,
                    }
               }}>
               <Stack.Screen
                    name="Main"
                    getId={() => "diary-main"}
                    options={{
                         headerShown: true
                    }}

               >
                    {(props) => (
                         <DiaryScreen
                              {...props}
                              appData={appData!}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook}
                         />
                    )}
               </Stack.Screen>

               <Stack.Screen
                    name="Input"
                    getId={() => "diary-input"}
                    options={({ navigation }) => ({
                         headerShown: true,
                         headerTitle: () => <StackTopBar appData={appData} dbHook={dbHook} calendarHook={calendarHook} />,
                         headerShadowVisible: true,
                         headerLeft: () => (
                              <IconButton
                                   mode={"outlined"}
                                   icon="close"
                                   iconColor={theme.colors.primary}
                                   onPress={() => navigation.goBack()}
                              />

                         ),
                         headerRight: () => (
                              <View style={{ flexDirection: 'row' }}>

                                   <IconButton
                                        mode={"outlined"}
                                        icon="camera-plus"
                                        iconColor={theme.colors.primary}
                                        onPress={() => navigation.navigate('Camera')}
                                   />
                                   <IconButton
                                        mode={"outlined"}
                                        icon="floppy"
                                        iconColor={theme.colors.primary}
                                        onPress={() => { }}
                                   />
                              </View>
                         )
                    })}

               >
                    {(props) => (
                         <InputScreen
                              {...props}
                              diaryData={emptyDiaryData}
                              appData={appData!}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook}
                              dbHook={dbHook}
                              onSave={dbHook.saveDiaryEntry}
                         />
                    )}
               </Stack.Screen>
               <Stack.Screen
                    name="Camera"
                    getId={() => "diary-camera"}
                    options={{ headerShown: false }}


               >
                    {(props) => (
                         <CameraScreen
                              {...props}
                              cameraHook={cameraHook}
                              dbHook={dbHook}
                              appData={appData!}
                         />
                    )}
               </Stack.Screen>
          </Stack.Navigator >
     );

}