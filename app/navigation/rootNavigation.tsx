import { useMemo, useState } from "react";
import { Appbar, Button, FAB, Icon, IconButton } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppData } from "../constants/interface/appData";
import { useAppTheme } from "../constants/UI/theme";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DiaryData } from "../constants/interface/diaryData";
import { useCalendar } from "../hooks/useCalendar";
import { DiaryScreen } from "../screens/Diary/diaryScreen";

import { useCamera } from "../hooks/useCamera";
import { useDB } from "../hooks/useDB";
import { SettingsScreen } from "../screens/Settings/settingsScreen";
import { TouchableOpacity, View } from "react-native";
import { DiaryInput } from "../screens/Diary/Input/diaryInput";
// import { useNavigation } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";


const Stack = createNativeStackNavigator();

export const nav = {
    diary: "Diary",
    input: "Input",
    settings: "Settings",

};

export function RootNavigation({ appData, setAppData }: { appData: AppData, setAppData: (data: AppData) => void }) {
    const { theme, styles } = useAppTheme();
    const navigation = useNavigation();


    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // SINGLE SOURCE OF TRUTH - Only create dbHook here
    const dbHook = useDB(appData);
    const calendarHook = useCalendar(appData);
    const cameraHook = useCamera(appData);

    const diaryState = {
        glucose: dbHook.glucose,
        setGlucose: dbHook.setGlucose,
        carbs: dbHook.carbs,
        setCarbs: dbHook.setCarbs,
        note: dbHook.note, setNote: dbHook.setNote,
        activity: dbHook.activity, setActivity: dbHook.setActivity,
        foodType: dbHook.foodType, setFoodType: dbHook.setFoodType,
        foodOptions: dbHook.foodOptions,
        activityOptions: dbHook.activityOptions
    };












    // Settings helper functions
    const getSettingsTitle = () => {
        switch (settingsSection) {
            case 'profile': return 'Profile';
            case 'preferences': return 'Preferences';
            case 'account': return 'Account';
            default: return 'Settings';
        }
    };

    const getSettingsIcon = () => {
        switch (settingsSection) {
            case 'profile': return 'account-circle';
            case 'preferences': return 'tune';
            case 'account': return 'account-cog';
            default: return 'cog';
        }
    };


    return (

        <Stack.Navigator
            initialRouteName="Camera"
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.primary, },
                headerBackButtonMenuEnabled: false,
                headerTintColor: theme.colors.onPrimary,
                headerTitleStyle: { fontWeight: 'bold' },
                contentStyle: { backgroundColor: theme.colors.background },

            }}>
            <Stack.Screen
                name="Diary"
                options={{

                    headerLeft: () => null,
                    headerRight: () => (
                        <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon="cog"
                            mode="contained-tonal"
                            onPress={() => navigation.navigate('Settings')}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />
                    ),


                }}
            >{(props) => (
                <DiaryScreen {...props}
                    navigation={navigation}
                    appData={appData}
                    calendarHook={calendarHook}
                    dbHook={dbHook}
                    cameraHook={cameraHook}
                    diaryState={diaryState}
                />
            )}
            </Stack.Screen>


            <Stack.Screen
                name="Input"
                options={{
                    headerLeft: () => (
                        <View style={styles.row}>
                            <IconButton
                                iconColor={theme.colors.onSecondary}
                                size={28}
                                icon="chevron-left"
                                mode="contained-tonal"
                                onPress={() => navigation.goBack()}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    borderRadius: 12,
                                }}
                            />
                        </View>
                    ),



                }}
            >
                {(props) => <DiaryInput {...props}
                    navigation={navigation}
                    appData={appData}
                    calendarHook={calendarHook}
                    cameraHook={cameraHook}
                    dbHook={dbHook}
                    diaryState={diaryState}
                />}
            </Stack.Screen>

            <Stack.Screen
                name="Camera"
                
                options={{
                    headerTransparent: true,
                    headerStyle: { backgroundColor: 'transparent' },
                    headerTintColor: theme.colors.onPrimary,
                    headerTitle: '',
                    headerLeft: () => (
                        <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon="close"
                            mode="contained-tonal"
                            onPress={() => navigation.goBack()}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />
                    ),
                    headerRight: () => (
                        <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon={getSettingsIcon()}
                            mode="contained-tonal"
                            onPress={() => cameraHook.cycleFlash}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />

                    ),
                }}
            >{(props) => (
                <CameraScreen {...props}
                    appData={appData}
                    dbHook={dbHook}
                    cameraHook={cameraHook}
                />
            )
                }
            </Stack.Screen>

            <Stack.Screen
                name="Settings"

                options={{
                    title: getSettingsTitle(),
                    headerStyle: { backgroundColor: theme.colors.primary, },
                    headerTintColor: theme.colors.onPrimary,
                    headerLeft: () => (
                        <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon="arrow-left"
                            mode="contained-tonal"
                            onPress={() => navigation.goBack()}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />
                    ),
                    headerRight: () => (
                        <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon={getSettingsIcon()}
                            mode="contained-tonal"
                            onPress={() => setSettingsEditMode(!settingsEditMode)}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />
                    ),
                }}
            >{(props) => (
                <SettingsScreen {...props}
                    appData={appData}
                    editMode={settingsEditMode}
                    setEditMode={setSettingsEditMode}
                    currentSection={settingsSection}
                    setCurrentSection={setSettingsSection}
                    setAppData={setAppData}
                />
            )
                }
            </Stack.Screen>
        </Stack.Navigator >




    );
}

export function CameraScreen(
    { cameraHook, dbHook, appData }: { cameraHook: any, dbHook: any, appData: AppData }
) {
    const { styles, theme } = useAppTheme();
    return (
        <View style={styles.background}>
            {cameraHook.renderCamera()}
            <View style={{
                position: 'absolute',
                bottom: '10%',
                left: 0,
                right: 0,
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    style={styles.shutterButton}
                    onPress={() => {cameraHook.capturePhoto()}}
                >
                    
                    <MaterialCommunityIcons
                        name="circle"
                        size={24}
                        color={theme.colors.secondary}
                    />
                    
                </TouchableOpacity>
                
           
                
            </View>
        </View>
    );
}