import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDB } from "../hooks/useDB";
import { useCalendar } from "../hooks/useCalendar";
import { useCamera } from "../hooks/useCamera";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "../screens/Diary/diaryScreen";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { StatisticsScreen } from "../screens/Statistics/statisticsScreen";
import { HomeScreen } from "../screens/Home/homeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, Appbar } from "react-native-paper";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../constants/UI/theme";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { useStatistics } from "../hooks/useStatistics";
import AuthScreen from "../api/supabase/auth/authScreen";
import { LoadingScreen } from "../components/loadingScreen";
import { View, Image } from "react-native";
import { useCallback, useEffect } from "react";

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
}: NavData & { authHook: HookData }) {
     const { styles, theme } = useAppTheme()

     // Always call hooks unconditionally (Rules of Hooks)
     const dbHook = useDB(appData || undefined, setAppData);
     const calendarHook = useCalendar(appData);
     const cameraHook = useCamera(appData);
     const statsHook = useStatistics(dbHook.diaryEntries || []);
     const navigation = useNavigation() as any

     // Load diary entries on app startup when user is signed in
     useEffect(() => {
          if (appData?.session?.user?.id && !appData.isEntriesLoaded) {
               console.log('📥 Loading diary entries on app startup...');
               dbHook.retrieveEntries();
          }
     }, [appData?.session?.user?.id, appData?.isEntriesLoaded, dbHook.retrieveEntries]);

     const MainTopBar = useCallback(() => {
          return (
               <Appbar.Header mode={"small"} style={{ backgroundColor: theme.colors.primaryContainer, marginHorizontal: -8, paddingHorizontal: 16 }}>

                    {currentScreen !== "home" ? (
                         <Appbar.Action icon="chevron-left" style={styles.iconButton} iconColor={theme.colors.onBackground} onPress={() => { navigation.goBack() }} />
                    ) :
                         (
                              <Appbar.Action icon="cog" style={styles.iconButton} iconColor={theme.colors.onBackground} onPress={() => { navigation.navigate("settings") }} />
                         )
                    }



                    {/* Logo always centered */}
                    <Appbar.Content
                         title={
                              <Image
                                   source={logo}
                                   resizeMethod="resize"
                                   style={{ width: 200, height: 50, }}
                              />
                         }
                    />


               </Appbar.Header>
          );
     }, [currentScreen, calendarHook, navigation, styles.iconButton, theme.colors, logo])

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
                    tabBarActiveTintColor: theme.colors.secondary,
                    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                    tabBarStyle: currentScreen === 'camera' ? { display: 'none' } : {
                         backgroundColor: theme.colors.primaryContainer,
                         borderTopColor: theme.colors.primaryContainer,
                         borderTopWidth: 0,
                         paddingBottom: 8,
                         paddingTop: 8,
                         height: 70,
                         elevation: 8,
                         shadowColor: '#000',
                         shadowOffset: { width: 0, height: -2 },
                         shadowOpacity: 0.1,
                         shadowRadius: 4,
                    },
                    tabBarLabelStyle: {
                         fontSize: 12,
                         fontWeight: '600',
                         letterSpacing: 0.5,
                    },
                    tabBarIconStyle: {
                         marginTop: 4,
                    }
               }}>

               {!isSignedIn ? (
                    <root.Screen
                         name='auth'
                         options={{
                              headerShown: false,
                              tabBarItemStyle: { flex: 0 },
                              tabBarButton: () => null
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
                                   tabBarItemStyle: { flex: 1 },
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
                                   tabBarItemStyle: { flex: 1 },
                              }}
                              listeners={{
                                   tabPress: (e) => {
                                        e.preventDefault();
                                        navigation.navigate('addmeal');
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
                                   tabBarItemStyle: { flex: 1 },
                              }}
                         >
                              {(props) =>
                                   <DiaryScreen
                                        {...props}
                                        appData={appData}
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
                                   tabBarItemStyle: { flex: 1 },
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
                                   tabBarItemStyle: { display: 'none' },
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
                                   tabBarItemStyle: { display: 'none' },
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

                         {/* Camera Screen - Hidden from tab bar, accessible from input screens */}
                         <root.Screen
                              name="camera"
                              options={{
                                   tabBarButton: () => null,
                                   tabBarItemStyle: { display: 'none' },
                              }}
                         >
                              {(props) => (
                                   <CameraScreen
                                        {...props}
                                        appData={appData}
                                        cameraHook={cameraHook}
                                        dbHook={dbHook}
                                   />
                              )}
                         </root.Screen>
                    </>
               )}

          </root.Navigator >
     )
}




