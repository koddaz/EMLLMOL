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
import { Appbar, BottomNavigation, Button, Icon, IconButton, Text } from "react-native-paper";
import { Image, Pressable, Touchable, View } from "react-native";
import { InputScreen } from "../screens/Diary/Input/inputScreen";
import { DiaryData } from "../constants/interface/diaryData";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../constants/UI/theme";
import { useMemo } from "react";
import { CameraScreen } from "../screens/Camera/cameraScreen";
import { useStatistics } from "../hooks/useStatistics";

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
     statsHook?: any,
}

export function RootNavigation({
     appData, setAppData, currentScreen
}: NavData) {
     const dbHook = useDB(appData!);
     const calendarHook = useCalendar(appData!);
     const cameraHook = useCamera(appData!);
     const authHook = useAuth(appData?.session, false);
     const statsHook = useStatistics(dbHook.diaryEntries || []);
     const { styles, theme } = useAppTheme()
     const navigation = useNavigation() as any


     const titleContainer = useMemo(() => (title: string) => {
          switch (title) {
               case 'main': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Image source={logo} resizeMethod="scale" style={{ width: 50, height: 50 }} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto' }}>emmiSense</Text>
                    </View>
               );
               case 'settings': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"cog"} size={50} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto' }}>Settings</Text>
                    </View>

               );
               case 'stats': return (
                    <View style={{ alignItems: 'flex-end', marginLeft: 16, flexDirection: 'row', gap: 8 }}>
                         <Icon source={"chart-bar"} size={50} />
                         <Text variant="headlineSmall" style={{ textAlign: 'auto' }}>Statistics</Text>
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

          <Appbar.Header mode={"small"} style={{ marginVertical: 8, paddingHorizontal: 16 }}>
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
               {(currentScreen === 'input') && (
                    <Appbar.Action icon={'camera-outline'} style={styles.iconButton} iconColor={theme.colors.onPrimary} onPress={() => { navigation.navigate('diary', { screen: 'camera' }) }} />
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
                    (currentScreen === 'main' || currentScreen === 'stats') && (

                         <BottomNavBar navigation={navigation} insets={insets} route={currentScreen} statsHook={statsHook} />

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
                              statsHook={statsHook}
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


export function BottomNavBar({ insets, navigation, route, statsHook }: { insets: any, navigation: any, route: string, statsHook: any }) {

     const { theme, styles } = useAppTheme();
     const { currentSection, setCurrentSection } = statsHook

     const button = (title: string, section: string, icon: string, nav?: boolean, ) => {
          const isActive = nav ? false : currentSection === section;
          return (
               <Pressable style={{
                    
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.surface,
                    padding: 8,
                    elevation: isActive ? 0 : 4,
                    borderWidth: 0.1,
                    minWidth: 75,
                    

               }} onPress={() => {
                    if (nav) {
                         if (section === 'input') {
                              navigation.navigate('diary', { screen: 'input' });
                         } else {
                              navigation.navigate(section);
                         }
                    } else {
                         setCurrentSection(section);
                    }
               }}>
                    <View style={{
                         alignItems: 'center',
                         justifyContent: 'center',
                    }}>
                         <Icon source={icon} size={25} color={isActive ? theme.colors.tertiary : theme.colors.onSurface} />
                         <Text
                              variant="labelSmall"
                              style={{ color: isActive ? theme.colors.tertiary : theme.colors.onSurface }}>
                              {title}
                         </Text>
                    </View>
               </Pressable>
          )
     }

     const renderButtons = (route: string) => {
          switch (route) {
               case 'stats':
                    return (
                         <>
                              {button(/* title */ 'Summary', /* section */ 'summary', /* icon */ 'chart-box-outline')}
                              {button(/* title */ 'Carbs', /* section */ 'carbs', /* icon */ 'bread-slice-outline')}
                              {button(/* title */ 'Glucose', /* section */ 'glucose', /* icon */ 'water-outline')}
                         </>
                    );
               case 'main':
                    return (
                         <>
                              
                              {button(/* title */ 'Statistics', /* section */ 'stats', /* icon */ 'chart-bar', /* nav? */ true)}
                              {button(/* title */ 'New entry', /* section */ 'input', /* icon */ 'note-plus-outline', /* nav? */ true)}
                         </>
                    );
               default:
                    return null;
          }
     }

     return (
          <View style={{
               
               position: 'absolute',
               alignItems: 'flex-end',
               bottom: insets.bottom + 32,
               right: insets.right,

               backgroundColor: 'transparent',
               width: '100%'





          }}>
               <View style={{
                    flexDirection: 'row',
                    //gap: 8,
                    


               }}>
                    <View style={{flex: 1}}></View>
                    <View style={{width: 32, backgroundColor: theme.colors.surface, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, elevation: 4}}></View>
                    {renderButtons(route)}
                    <View style={{flex: 0, width: 64, backgroundColor: theme.colors.surface, elevation: 4}}>

                    </View>


               </View>
          </View>
     );
}