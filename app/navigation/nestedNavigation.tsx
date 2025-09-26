
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "../constants/UI/theme";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import React, { useCallback } from "react";
import { goBack } from "expo-router/build/global-state/routing";

// Define navigation types
export type DiaryStackParamList = {
     Main: undefined;
     Input: undefined;
     Camera: undefined;
     Settings: undefined;
     Statistics: undefined;
};

export interface navData {
     stackNav?: NavigationProp<DiaryStackParamList>;
     appData?: AppData
     setAppData?: (AppData: any) => void
     currentScreen?: string
     dbHook?: any,
     calendarHook?: any,
     cameraHook?: any,
     authHook?: any,
}

const Stack = createNativeStackNavigator<DiaryStackParamList>()


function TopBar({ currentScreen, calendarHook, onNavigate }: { currentScreen: string, calendarHook: any, onNavigate: (screen: string) => void }) {

     const { theme, styles } = useAppTheme()


     const inputBottom = () => (

          <View style={{ flexDirection: 'row', alignContent: 'center', gap: 12, padding: 8 }}>
               <View style={[styles.boxPicker, { flexDirection: 'row', flex: 1, alignItems: 'center', gap: 8 }]}>
                    <Icon source={"note-plus"} size={25} />
                    <Text variant={"titleMedium"}>{calendarHook.formatDate(calendarHook.selectedDate)} - {calendarHook.formatTime(new Date())}</Text>
               </View>

               <View style={[styles.row, { gap: 12 }]}>
                    <IconButton icon={"camera"} onPress={() => { onNavigate('Camera') }} iconColor={theme.colors.onPrimary} style={styles.iconButton} />
                    <IconButton icon={"floppy"} onPress={() => { }} iconColor={theme.colors.onPrimary} style={styles.iconButton} />
               </View>
          </View>
     )

     const leftButton = () => {
          switch (currentScreen) {
               case 'Input':
                    return <IconButton icon={"arrow-left"} onPress={() => { onNavigate('Main') }} />;
               case 'Settings':
                    return <IconButton icon={"arrow-left"} onPress={() => { onNavigate('Main') }} />;
               case 'Statistics':
                    return <IconButton icon={"arrow-left"} onPress={() => { onNavigate('Main') }} />;
               default:
                    return null;
          }
     }

     const rightButton = () => {
          switch (currentScreen) {
               case 'Main':
                    return <IconButton icon={'calendar'} onPress={() => {calendarHook.toggleCalendar()}} iconColor={theme.colors.primary} />
               default:
                    return null;
          }
     }

     return (
          <View>
               <View style={{
                    backgroundColor: theme.colors.surface,
                    paddingHorizontal: 8,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3
               }}>
                    <View style={{ flexDirection: 'row' }}>
                         <View style={{ flex: 1 }}>
                              {leftButton()}
                         </View>

                         <View style={{ flex: 1, alignItems: 'center' }}>
                              <Image style={{ width: 50, height: 50 }} resizeMode="cover" source={require('./../../assets/images/logo-head.gif')} />

                              <Text variant={"titleSmall"} style={{ backgroundColor: 'transparent' }}>
                                   emmiSense
                              </Text>
                         </View>
                         <View style={{ flex: 1, alignItems: 'flex-end' }}>
                              {rightButton()}
                         </View>
                    </View>


               </View>
               {currentScreen === 'Input' && inputBottom()}
          </View>

     );
}

function CustomTabBar({ onNavigate, currentScreen }: { onNavigate: (screen: string) => void, currentScreen: string }) {
     const { theme } = useAppTheme();

     return (
          <View style={{
               flexDirection: 'row',
               justifyContent: 'space-around',
               backgroundColor: theme.colors.surface,
               paddingVertical: 8,
               elevation: 4,
               shadowColor: '#000',
               shadowOffset: { width: 0, height: -2 },
               shadowOpacity: 0.1,
               shadowRadius: 3
          }}>
               <IconButton
                    icon={"book-open-variant"}
                    onPress={() => onNavigate('Main')}
                    disabled={currentScreen === 'Main' ? true : false}
                    iconColor={currentScreen === 'Main' ? theme.colors.primary : theme.colors.onSurface}
               />
               <IconButton
                    icon={"chart-line"}
                    disabled={currentScreen === 'Statistics' ? true : false}
                    onPress={() => onNavigate('Statistics')}
                    iconColor={currentScreen === 'Statistics' ? theme.colors.primary : theme.colors.onSurface}
               />
               <IconButton
                    icon={"cog"}
                    disabled={currentScreen === 'Settings' ? true : false}
                    onPress={() => onNavigate('Settings')}
                    iconColor={currentScreen === 'Settings' ? theme.colors.primary : theme.colors.onSurface}
               />
          </View>
     );
}




export function DiaryNav({ appData, setAppData, currentScreen = 'Main' }: navData) {
     const dbHook = useDB(appData!);
     const calendarHook = useCalendar(appData!);
     const cameraHook = useCamera(appData!);
     const authHook = useAuth(appData?.session, false);
     const { styles } = useAppTheme();

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

     const navigation = useNavigation<NavigationProp<DiaryStackParamList>>();

     const handleNavigation = useCallback((screen: string) => {
          try {
               navigation.navigate(screen as keyof DiaryStackParamList);
          } catch (error) {
               console.error('Navigation error:', error);
          }
     }, [navigation]);

     // Memoize the custom tab bar component
     const CustomTabBarComponent = useCallback(() => (
          <CustomTabBar
               onNavigate={handleNavigation}
               currentScreen={currentScreen}
          />
     ), [currentScreen, handleNavigation]);

     const CustomTopAppBarComponent = useCallback(() => (
          <TopBar
               onNavigate={handleNavigation}
               calendarHook={calendarHook}
               currentScreen={currentScreen}
          />
     ), [currentScreen, calendarHook, handleNavigation]);

     return (
          <SafeAreaView style={styles.background}>
               {/* Static TopBar - never animates */}
               {CustomTopAppBarComponent()}

               {/* Only the content area animates */}
               <View style={{ flex: 1 }}>
                    <Stack.Navigator
                         initialRouteName="Main"
                         screenOptions={{
                              headerShown: false,
                              animation: 'slide_from_right',
                              animationDuration: 200,
                         }}>

                         <Stack.Screen name="Main"
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

                         <Stack.Screen name="Input"
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

                         <Stack.Screen name="Camera"
                              options={{
                                   animation: 'none',
                              }

                              }
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

                         <Stack.Screen name="Statistics"
                              options={{
                                   animation: 'slide_from_right',
                              }

                              }
                         >
                              {(props) => (
                                   <StatisticsScreen
                                        {...props}
                                        appData={appData}
                                        calendarHook={calendarHook}
                                        dbHook={dbHook}
                                   />
                              )}
                         </Stack.Screen>

                         <Stack.Screen name="Settings"
                              options={{
                                   animation: 'slide_from_right',
                              }

                              }
                         >
                              {(props) => (
                                   <SettingsScreen
                                        {...props}
                                        appData={appData!}
                                        setAppData={setAppData!}
                                        authHook={authHook}
                                   />
                              )}
                         </Stack.Screen>

                    </Stack.Navigator>
               </View>

               {/* Static CustomTabBar - never animates */}
               <CustomTabBarComponent />
          </SafeAreaView>
     );

}