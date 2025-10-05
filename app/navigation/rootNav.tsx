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
import { Appbar, Icon, Text } from "react-native-paper";
import { Image, Pressable, View, Animated } from "react-native";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../constants/UI/theme";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { useStatistics } from "../hooks/useStatistics";
import AuthScreen from "../api/supabase/auth/authScreen";
import { LoadingScreen } from "../components/loadingScreen";
import { BottomNavBar, useNavBar } from "./components/bottomNavBar";

const root = createBottomTabNavigator()
const stack = createNativeStackNavigator()
const logo = require('../../assets/images/logo-head.gif')

export interface NavData {
     appData: AppData | null,
     setAppData?: (AppData: any) => void
     currentScreen?: string,
     diaryData?: DiaryData,
     navigation?: any,
     insets?: any,
}
export interface HookData {
     dbHook?: any,
     calendarHook?: any,
     authHook?: any,
     cameraHook?: any,
     statsHook?: any,
}

export function RootNavigation({
     appData, setAppData, currentScreen, authHook
}: NavData & { authHook: any }) {
     const { styles, theme } = useAppTheme()

     // Always call hooks unconditionally (Rules of Hooks)
     const dbHook = useDB(appData || undefined, setAppData);
     const calendarHook = useCalendar(appData);
     const cameraHook = useCamera(appData);
     const navBarHook = useNavBar();
     const statsHook = useStatistics(dbHook.diaryEntries || []);
     const navigation = useNavigation() as any

     const titleContainer = useMemo(() => (title: string) => {
          switch (title) {
               case 'main': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Image source={logo} resizeMethod="scale" style={{ width: 50, height: 50 }} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>emmiSense</Text>
                    </View>
               );
               case 'settings': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"cog"} size={50} color={theme.colors.onPrimary} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>Settings</Text>
                    </View>

               );
               case 'stats': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"chart-bar"} size={50} color={theme.colors.onPrimary} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>Statistics</Text>
                    </View>

               );
               case 'input': return (

                    <View style={[styles.boxPicker, { position: "relative" }]}>

                         <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, paddingHorizontal: 16 }}>
                              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                                   {calendarHook.formatTime(new Date())}
                              </Text>
                              <Text variant="titleLarge" style={{
                                   color: theme.colors.outline
                              }}>||</Text>
                              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
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
                                   color: theme.colors.onPrimaryContainer,
                                   fontSize: 12,
                                   fontWeight: 'bold',
                                   zIndex: 1
                              }}
                         >
                              new entry
                         </Text>
                    </View>
               )
          }
     }, [calendarHook, styles.boxPicker, theme.colors])

     const MainTopBar = useCallback(() => (

          <Appbar.Header mode={"small"} style={{paddingHorizontal: 16, backgroundColor: theme.colors.primary }}>
               {(currentScreen === 'main') && (

                    <Appbar.Action icon={calendarHook.showCalendar ? "calendar-remove-outline" : "calendar"} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { calendarHook.toggleCalendar() }} />

               )}
               {(currentScreen != 'main') && (

                    <Appbar.BackAction style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.goBack() }} />
               )}
               <Appbar.Content title={titleContainer(currentScreen!)} />
               {(currentScreen === 'main' || currentScreen === 'stats') && (
                    <Appbar.Action icon={'cog-outline'} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('settings') }} />
               )}



          </Appbar.Header>


     ), [currentScreen, calendarHook, navigation, styles.iconButton, theme.colors, titleContainer])

     // Handle loading state - show loading screen while appData is empty
     if (!appData || Object.keys(appData).length === 0) {
          return (
               <View style={styles.background}>
                    <LoadingScreen />
               </View>
          )
     }

     // Determine if user is signed in
     const isSignedIn = !!appData.session?.user;

     return (
          <root.Navigator
               initialRouteName={isSignedIn ? "diary" : "auth"}
               
               screenOptions={{
                    headerShown: currentScreen != 'camera' ? true : false,
                    header: () => MainTopBar(),
               }}
               tabBar={({ navigation, insets }) => (
                    isSignedIn && (currentScreen === 'main' || currentScreen === 'stats') && (
                         <BottomNavBar navigation={navigation} insets={insets} route={currentScreen} statsHook={statsHook} navBarHook={navBarHook} />
                    )
               )}>

               {!isSignedIn ? (
                    <root.Screen
                         name='auth'
                         options={{
                              headerShown: false,
                         }}
                         component={AuthScreen}
                    />
               ) : (
                    <>
                         <root.Screen
                              name="diary"
                              options={{
                                   tabBarIcon: () => <Icon source={"book-open-variant"} size={20} />,
                              }}
                         >
                              {(props) =>
                                  <StackNavigation
                                        {...props}
                                        appData={appData}
                                        setAppData={setAppData}
                                        dbHook={dbHook}
                                        calendarHook={calendarHook}
                                        cameraHook={cameraHook}
                                        navBarHook={navBarHook}
                                   />

                              }
                                   
                              
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
                                        navBarHook={navBarHook}
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
                                        statsHook={statsHook}
                                        navBarHook={navBarHook}
                                   />
                              )}
                         </root.Screen>
                    </>
               )}





          </root.Navigator >
     )
}

export function StackNavigation(
     { appData, dbHook, calendarHook, cameraHook, navBarHook }: HookData & NavData & { navBarHook: any }

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
                              navBarHook={navBarHook}
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


