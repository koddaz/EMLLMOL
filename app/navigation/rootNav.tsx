import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDB } from "../hooks/useDB";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { useAuth } from "../hooks/useAuth";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { HomeScreen } from "../screens/Home/homeScreen";
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

const root = createBottomTabNavigator()
const stack = createNativeStackNavigator()
const logo = require('../../assets/images/logo1.png')

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
     const statsHook = useStatistics(dbHook.diaryEntries || []);
     const navigation = useNavigation() as any

     const titleContainer = useMemo(() => (title: string) => {
          switch (title) {
               case 'home': return (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Image source={logo} resizeMethod="resize" style={{width: 200, height: 50}} />
                         
                    </View>
               );
               case 'main': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"history"} size={50} color={theme.colors.onPrimary} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>History</Text>
                    </View>
               );
               case 'settings': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"cog"} size={50} color={theme.colors.onPrimary} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>Settings</Text>
                    </View>

               );
               case 'glucose': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"heart-pulse"} size={50} color={theme.colors.onPrimary} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>Glucose</Text>
                    </View>

               );
               case 'input': return (

                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Image source={logo} resizeMethod="scale" style={{ width: 50, height: 50 }} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto', color: theme.colors.onPrimary, fontWeight: 'bold' }}>Add Meal</Text>

                    </View>


               )
          }
     }, [calendarHook, styles.boxPicker, theme.colors])

     const MainTopBar = useCallback(() => (

          <Appbar.Header mode={"small"} style={{ paddingHorizontal: 16, backgroundColor: theme.colors.primary }}>
               {/* Left icon - Calendar for home, calendar toggle for history, back button for others */}
               {currentScreen === 'home' && (
                    <Appbar.Action icon="calendar" style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('history') }} />
               )}
               {currentScreen === 'main' && (
                    <Appbar.Action icon={calendarHook.showCalendar ? "calendar-remove-outline" : "calendar"} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { calendarHook.toggleCalendar() }} />
               )}
               {(currentScreen !== 'main' && currentScreen !== 'home' && currentScreen !== 'glucose') && (
                    <Appbar.Action icon={"chevron-left"} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.goBack() }} />
               )}

               <Appbar.Content title={titleContainer(currentScreen!)} />

               {/* Right icons - Apple/Health icon and Settings */}
               {currentScreen === 'home' && (
                    <>
                         <Appbar.Action icon="heart-pulse" style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('glucose') }} />
                         <Appbar.Action icon={'cog-outline'} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('settings') }} />
                    </>
               )}
               {(currentScreen === 'main' || currentScreen === 'glucose') && (
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
               initialRouteName={isSignedIn ? "home" : "auth"}
               screenOptions={{
                    headerShown: currentScreen != 'camera' ? true : false,
                    header: () => MainTopBar(),
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                    tabBarStyle: {
                         backgroundColor: theme.colors.surface,
                         borderTopColor: theme.colors.outline,
                         paddingBottom: 8,
                         paddingTop: 8,
                         height: 70,
                    },
                    tabBarLabelStyle: {
                         fontSize: 12,
                         fontWeight: '500',
                    }
               }}>

               {!isSignedIn ? (
                    <root.Screen
                         name='auth'
                         options={{
                              headerShown: false,
                              tabBarButton: () => null,
                         }}
                         component={AuthScreen}
                    />
               ) : (
                    <>
                         {/* Home Tab - Dashboard */}
                         <root.Screen
                              name="home"
                              options={{
                                   tabBarLabel: 'Home',
                                   tabBarIcon: ({ color, size }) => <Icon source="home" size={size} color={color} />,
                              }}
                         >
                              {(props) => (
                                   <HomeScreen
                                        {...props}
                                        appData={appData}
                                        setAppData={setAppData}
                                        dbHook={dbHook}
                                   />
                              )}
                         </root.Screen>

                         {/* Add Meal Tab - Directly to Input */}
                         <root.Screen
                              name="addmeal"
                              options={{
                                   tabBarLabel: 'Add Meal',
                                   tabBarIcon: ({ color, size }) => <Icon source="plus-circle" size={size} color={color} />,
                              }}
                              listeners={{
                                   tabPress: (e) => {
                                        e.preventDefault();
                                        navigation.navigate('input');
                                   }
                              }}
                         >
                              {(props) => (
                                   <InputScreen
                                        {...props}
                                        appData={appData}
                                        dbHook={dbHook}
                                        calendarHook={calendarHook}
                                        cameraHook={cameraHook}
                                   />
                              )}
                         </root.Screen>

                         {/* History Tab - Diary List */}
                         <root.Screen
                              name="history"
                              options={{
                                   tabBarLabel: 'History',
                                   tabBarIcon: ({ color, size }) => <Icon source="history" size={size} color={color} />,
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
                                   />
                              }
                         </root.Screen>

                         {/* Glucose Tab - Statistics/Glucose View */}
                         <root.Screen
                              name="glucose"
                              options={{
                                   tabBarLabel: 'Glucose',
                                   tabBarIcon: ({ color, size }) => <Icon source="heart-pulse" size={size} color={color} />,
                              }}
                         >
                              {(props) => (
                                   <StatisticsScreen
                                        {...props}
                                        appData={appData}
                                        dbHook={dbHook}
                                        calendarHook={calendarHook}
                                        statsHook={statsHook}
                                   />
                              )}
                         </root.Screen>

                         {/* Settings - Hidden from tab bar, accessible via header */}
                         <root.Screen
                              name="settings"
                              options={{
                                   tabBarButton: () => null,
                              }}
                         >
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

                         {/* Input Screen - Standalone for stack navigation */}
                         <root.Screen
                              name="input"
                              options={{
                                   tabBarButton: () => null,
                              }}
                         >
                              {(props) => (
                                   <InputScreen
                                        {...props}
                                        appData={appData}
                                        dbHook={dbHook}
                                        calendarHook={calendarHook}
                                        cameraHook={cameraHook}
                                   />
                              )}
                         </root.Screen>
                    </>
               )}

          </root.Navigator >
     )
}

export function StackNavigation(
     { appData, dbHook, calendarHook, cameraHook }: HookData & NavData

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


