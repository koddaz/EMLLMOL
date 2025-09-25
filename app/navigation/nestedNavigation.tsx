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
import { Image, View, Text as RNText } from "react-native";
import { useAppTheme } from "../constants/UI/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { use, useState, memo } from "react";

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



function TabTopBar({ appData, dbHook, calendarHook }: navData) {

     const { theme, styles } = useAppTheme()

     // Separate navigation hooks for clarity
     const navigation = useNavigation<any>();

     const tabState = navigation.getState();
     const currentRoute = tabState?.routes[tabState.index];
     const routeName = currentRoute?.name || 'Stack Screen';

     

     // Get the nested stack route when on Diary tab
     const stackRoute = (routeName === 'Diary' && currentRoute?.state && currentRoute.state.index !== undefined)
          ? currentRoute.state.routes[currentRoute.state.index]?.name
          : null;


     if (routeName === 'Statistics') {
          return (
               <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 2, paddingHorizontal: 4, backgroundColor: theme.colors.surface }]}>
                    <View style={{ flex: 1 }}>

                         <IconButton icon={'arrow-left'} onPress={() => navigation.goBack()} />

                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                         <Image style={{ width: 50, height: 50 }} resizeMode="cover" source={require('./../../assets/images/logo-head.gif')} />
                         <Text variant={"titleSmall"} style={{ backgroundColor: 'transparent' }}>
                              emmiSense
                         </Text>

                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>

                    </View>
               </View>
          );
     }

     if (routeName === 'Diary' && stackRoute === 'Camera') {
          return (

               <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', marginTop: 2, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: theme.colors.surface }]}>

                    <IconButton icon={"close"} onPress={() => { }} style={styles.iconButton} />


                    <IconButton icon={"flash"} onPress={() => { }} style={styles.iconButton} />


               </View>
          );
     }

     if (routeName === 'Diary' ||routeName === 'Settings') {
          return (
               <View style={[styles.row, { justifyContent: 'center', alignItems: 'center', marginTop: 2, paddingHorizontal: 4, backgroundColor: theme.colors.surface }]}>
                    <View style={{ flex: 1 }}>
                         {stackRoute === 'Input' && (
                              <IconButton icon={'close'} onPress={() => {
                                   console.log('Navigating back to Main from Input');
                                   console.log('DiaryEntries count:', appData?.diaryEntries?.length || 0);
                                   console.log('AppData exists:', !!appData);
                                   console.log('Can go back:', navigation.canGoBack());

                                   // Force reset to Main screen to avoid navigation state issues
                                   navigation.reset({
                                        index: 0,
                                        routes: [
                                             {
                                                  name: 'Diary',
                                                  state: {
                                                       routes: [{ name: 'Main' }],
                                                       index: 0,
                                                  },
                                             },
                                        ],
                                   });
                              }} />
                         )}
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                         <Image style={{ width: 50, height: 50 }} resizeMode="cover" source={require('./../../assets/images/logo-head.gif')} />
                         <Text variant={"titleSmall"} style={{ backgroundColor: 'transparent' }}>
                              emmiSense
                         </Text>

                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                         <IconButton icon={'calendar'} onPress={() => calendarHook.toggleCalendar()} iconColor={theme.colors.primary} />
                    </View>
               </View>

          );
     }




}

const StackTopBar = memo(function StackTopBar({ appData, dbHook, calendarHook }: navData) {

     const navigation = useNavigation<NavigationProp<DiaryStackParamList>>();
     const state = navigation.getState();
     const currentRoute = state?.routes[state.index];
     const routeName = currentRoute?.name || 'Stack Screen';

     // Only log when route actually changes
     const [prevRoute, setPrevRoute] = useState<string>('');
     if (routeName !== prevRoute) {
          console.log('StackTopBar - Route changed:', prevRoute, '→', routeName);
          setPrevRoute(routeName);
     }

     const { styles, theme } = useAppTheme()

     const entriesForSelectedDate = dbHook?.getEntriesForDate(calendarHook.selectedDate) || [];
     const entriesStats = dbHook?.calculateEntriesStats(entriesForSelectedDate) || { totalCarbs: 0, filteredEntries: [], totalInsulin: 0 };

     if (routeName === 'Main') {
          return (
               <View style={{ backgroundColor: theme.colors.surface, elevation: 4, paddingVertical: 4, paddingHorizontal: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <IconButton icon={'arrow-left'} size={20} onPress={() => { calendarHook.navigateDate('prev') }} />
                         <View style={{ flex: 1 }}>
                              <Text variant={"titleSmall"} style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
                                   {calendarHook.formatDate(calendarHook.selectedDate)}
                              </Text>
                         </View>
                         <IconButton disabled={new Date().toDateString() === calendarHook.selectedDate.toDateString()} icon={'arrow-right'} size={20} onPress={() => { calendarHook.navigateDate('next') }} />
                    </View>
                    <View style={styles.row}>

                         <View style={[styles.chip, { flex: 1 }]}>
                              <Icon source={"food"} size={14} color={theme.colors.onPrimary} />
                              <Text variant="labelLarge" style={{ color: theme.colors.onPrimary }}>{entriesStats.totalCarbs} g</Text>
                         </View>
                         <View style={[styles.chip, { flex: 1 }]}>
                              <Icon source={"needle"} size={14} color={theme.colors.onPrimary} />
                              <Text variant="labelLarge" style={{ color: theme.colors.onPrimary }}>{entriesStats.totalInsulin} units</Text>
                         </View>
                         <View style={[styles.chip, { flex: 1 }]}>
                              <Icon source={"blood-bag"} size={14} color={theme.colors.onPrimary} />
                              <Text variant="labelLarge" style={{ color: theme.colors.onPrimary }}>{entriesStats.avgGlucose} {appData?.settings.glucose}</Text>
                         </View>

                    </View>

               </View>
          );
     }

     if (routeName === 'Input') {
          return (
               <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surface, elevation: 4, paddingHorizontal: 8, }}>
                    <View style={[styles.row, { flex: 1, gap: 8 }]}>


                         <Icon source={"note-plus"} size={25} />
                         <Text variant={"titleMedium"}>New Entry</Text>

                         <View style={[styles.row, { flex: 1, justifyContent: 'flex-end', alignContent: 'flex-end' }]}>
                              <IconButton icon={"camera"} onPress={() => { navigation.navigate('Camera') }} />
                              <IconButton icon={"floppy"} onPress={() => { dbHook.saveDiaryEntry() }} />
                         </View>
                    </View>

               </View>
          );
     }

});

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


     return (
          <Tab.Navigator
               screenOptions={{
                    header: () => <TabTopBar appData={appData} dbHook={dbHook} calendarHook={calendarHook} />,
                    headerShown: true,
                    headerShadowVisible: false,
                    
               }}
          >

               <Tab.Screen
                    options={(props) => ({
                         animation: 'shift',
                         
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="book-open-variant" size={size} color={color} />
                         ),
                    })}
                    name="Diary"
                    getId={() => "tab-diary"}
               >
                    {(props) => (
                         <DiaryNav
                              {...props}
                              appData={appData}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook}
                              setAppData={setAppData}
                         />
                    )}
               </Tab.Screen>

               <Tab.Screen
                    options={({ navigation }) => ({
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="chart-line" size={size} color={color} />
                         ),
                    })}
                    name="Statistics"
                    getId={() => "tab-statistics"}
               >
                    {(props) => (
                         <StatisticsScreen
                              {...props}
                              appData={appData}
                              calendarHook={calendarHook}
                              dbHook={dbHook}
                         />
                    )}
               </Tab.Screen>

               <Tab.Screen
                    options={({ navigation }) => ({
                         animation: 'shift',
                         tabBarIcon: ({ color, size }) => (
                              <Icon source="cog" size={size} color={color} />
                         ),
                    })}
                    name="Settings"
                    getId={() => "tab-settings"}
               >
                    {(props) => (
                         <SettingsScreen
                              {...props}
                              appData={appData!}
                              setAppData={setAppData!}
                              authHook={authHook}
                         />
                    )}
               </Tab.Screen>

          </Tab.Navigator>
     );
}

export function DiaryNav(
     { appData, dbHook, calendarHook, cameraHook }: navData
) {

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
               screenOptions={
                    {
                         headerShown: true,
                         header: () => <StackTopBar appData={appData} dbHook={dbHook} calendarHook={calendarHook} />,
                         statusBarHidden: true,
                    }}>
               <Stack.Screen
                    name="Main"
                    getId={() => "diary-main"}
                    options={{
                         headerShown: true,
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
                         header: () => <StackTopBar appData={appData} dbHook={dbHook} calendarHook={calendarHook} />,
                         headerShown: true,
                         headerShadowVisible: true,
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