import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDB } from "../hooks/useDB";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useAuth } from "../hooks/useAuth";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Appbar, BottomNavigation, Icon, IconButton, Text } from "react-native-paper";
import { Image, View } from "react-native";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useAppTheme } from "../constants/UI/theme";
import { useMemo } from "react";
import { CameraScreen } from "../screens/Camera/cameraScreen";

const root = createBottomTabNavigator()
const stack = createNativeStackNavigator()
const logo = require('../../assets/images/logo-head.gif')

export interface NavData {
     appData: AppData,
     setAppData?: (AppData: any) => void
     currentScreen?: string,
     diaryData?: DiaryData,
     navigation?: any
}
export interface HookData {
     dbHook?: any,
     calendarHook?: any,
     authHook?: any,
     cameraHook?: any,
}

export function RootNavigation({
     appData, setAppData, currentScreen
}: NavData) {
     const dbHook = useDB(appData!);
     const calendarHook = useCalendar(appData!);
     const cameraHook = useCamera(appData!);
     const authHook = useAuth(appData?.session, false);
     const { styles, theme } = useAppTheme()
     const navigation = useNavigation()


     const titleContainer = useMemo(() => (title: string) => {
          switch (title) {
               case 'main': return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                         <Image source={logo} resizeMethod="scale" style={{ width: 50, height: 50 }} />
                         <Text variant="labelSmall" style={{ textAlign: 'auto' }}>emmiSense</Text>
                    </View>
               );
               case 'settings': return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                         <Icon source={"cog"} size={50} />
                         <Text variant="labelSmall">Settings</Text>
                    </View>

               );
               case 'stats': return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                         <Icon source={"chart-bar"} size={50} />
                         <Text variant="labelSmall">Statistics</Text>
                    </View>

               );
               case 'input': return (

                    <View style={[styles.boxPicker, { position: "relative" }]}>

                         <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, paddingHorizontal: 16 }}>
                              <Text variant="titleLarge">
                                   {calendarHook.formatTime(new Date())}
                              </Text>
                              <Text variant="titleLarge" style={{
                                   color: theme.colors.outline
                              }}>||</Text>
                              <Text variant="titleLarge">
                                   {calendarHook.formatDate(new Date())}
                              </Text>
                         </View>
                         <Text
                              variant="bodySmall"
                              style={{
                                   position: 'absolute',
                                   top: -8,
                                   left: 8,
                                   backgroundColor: theme.colors.primaryContainer,
                                   paddingHorizontal: 4,
                                   borderRadius: 4,
                                   borderColor: theme.colors.outline,
                                   borderWidth: 0.5,
                                   color: theme.colors.onPrimary,
                                   fontSize: 12,
                                   fontWeight: '400',
                                   zIndex: 1
                              }}
                         >
                              new entry
                         </Text>
                    </View>
               )
          }
     }, [])


     const MainTopBar = () => (

          <Appbar.Header mode={"center-aligned"} style={{ marginVertical: 8, paddingHorizontal: 16 }}>
               {(currentScreen === 'main') && (
                    <Appbar.Action icon={calendarHook.showCalendar ? "calendar-remove-outline" : "calendar"} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { calendarHook.toggleCalendar() }} />
               )}
               {(currentScreen != 'main') && (
                    <Appbar.BackAction style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.goBack() }} />
               )}
               <Appbar.Content title={titleContainer(currentScreen!)} />
               {(currentScreen === 'main') && (
                    <Appbar.Action icon={'note-plus'} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('input') }} />
               )}
               {(currentScreen === 'input') && (
                    <Appbar.Action icon={'camera-outline'} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('camera') }} />
               )}


          </Appbar.Header>


     )



     return (
          <root.Navigator
               initialRouteName="diary"
               screenOptions={{
                    headerShown: currentScreen != 'camera' ? true : false,
                    header: () => MainTopBar(),
               }}
               tabBar={({ navigation, state, descriptors, insets }) => (
                    (currentScreen != 'camera') && (
                         <BottomNavigation.Bar
                              navigationState={state}
                              safeAreaInsets={insets}

                              onTabPress={({ route, preventDefault }) => {
                                   const event = navigation.emit({
                                        type: 'tabPress',
                                        target: route.key,
                                        canPreventDefault: true,
                                   });

                                   if (event.defaultPrevented) {
                                        preventDefault();
                                   } else {
                                        navigation.dispatch({
                                             ...CommonActions.navigate(route.name, route.params),
                                             target: state.key,
                                        });
                                   }
                              }}
                              renderIcon={({ route, focused, color }) =>
                                   descriptors[route.key].options.tabBarIcon?.({
                                        focused,
                                        color,
                                        size: 24,
                                   }) || null
                              }
                              getLabelText={({ route }) => {
                                   const { options } = descriptors[route.key];
                                   const label =
                                        typeof options.tabBarLabel === 'string'
                                             ? options.tabBarLabel
                                             : typeof options.title === 'string'
                                                  ? options.title
                                                  : route.name;

                                   return label;
                              }}
                         />
                    )


               )}>


               <root.Screen
                    name="diary"
                    options={{
                         tabBarIcon: () => <Icon source={"book-open-variant"} size={20} />,
                    }}
               >
                    {(props) => (
                         <StackNavigation
                              {...props}
                              appData={appData}
                              setAppData={setAppData}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook}
                         />
                    )}
               </root.Screen>

               <root.Screen
                    name="settings"
                    options={{
                         tabBarIcon: () => <Icon source={"cog-outline"} size={20} />,
                         headerBackButtonDisplayMode: 'minimal',
                    }} >
                    {(props) => (
                         <SettingsScreen
                              {...props}
                              appData={appData}
                              setAppData={setAppData}
                              dbHook={dbHook}
                              authHook={authHook}
                         />
                    )}
               </root.Screen>

               <root.Screen
                    name="stats"
                    options={{
                         tabBarIcon: () => <Icon source={"chart-bar"} size={20} />,
                    }} >
                    {(props) => (
                         <StatisticsScreen
                              {...props}
                              appData={appData}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                         />
                    )}
               </root.Screen>
          </root.Navigator >
     )
}

export function StackNavigation(
     { appData, setAppData, dbHook, calendarHook, cameraHook, navigation }: HookData & NavData

) {


     return (

          <stack.Navigator
               screenOptions={{
                    headerShown: false,
               }}
          >
               <stack.Screen
                    name={"main"}>
                    {(navigation) => (
                         <DiaryScreen
                              {...navigation}
                              appData={appData}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook}
                         />
                    )}
               </stack.Screen>

               <stack.Screen name={"input"}>
                    {(navigation) => (
                         <InputScreen
                              {...navigation}
                              appData={appData}
                              dbHook={dbHook}
                              calendarHook={calendarHook}
                              cameraHook={cameraHook} />
                    )}
               </stack.Screen>

               <stack.Screen
                    name={'camera'}>
                    {(navigation) => (
                         <CameraScreen
                              {...navigation}
                              cameraHook={cameraHook}
                              dbHook={dbHook}
                              appData={appData}
                         />
                    )}
               </stack.Screen>
          </stack.Navigator>

     );

}