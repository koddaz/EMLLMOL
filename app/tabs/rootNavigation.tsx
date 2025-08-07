import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SettingsScreen } from "./settings/settingsScreen";
import { BottomNavigation, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { customStyles } from "../constants/UI/styles";
import CameraScreen from "./camera/cameraScreen";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "./diary/diaryScreen";
import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();

export function RootNavigation({ appData }: { appData: AppData }) {
    const theme = useTheme();
    const styles = customStyles(theme);

    // Replace this with your actual navigation logic or component tree
    return (
        <SafeAreaView style={styles.background}>
            <Tab.Navigator
                initialRouteName="Diary"
                screenOptions={{
                    animation: "none",
                    headerShown: false,
                }}
                tabBar={({ navigation, state, descriptors, insets }) => (
                    <BottomNavigation.Bar
                        navigationState={state}
                        safeAreaInsets={insets}
                        style={{
                            height: 60, // Reduce from default ~80px

                        }}
                        onTabPress={({ route, preventDefault }) => {
                            const event = navigation.emit({
                                type: "tabPress",
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
                )}>

                <Tab.Screen
                    name="Diary"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="book-lock" color={color} size={26} />
                        ),
                    }}
                >
                    {(props) => <DiaryScreen {...props} appData={appData} />}
                </Tab.Screen>

                <Tab.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="blood-bag" color={color} size={26} />
                        ),
                        tabBarLabel: 'Glucose Reader',
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="cog" color={color} size={26} />
                        ),
                    }}
                >
                    {(props) => <SettingsScreen {...props} appData={appData} />}
                </Tab.Screen>



            </Tab.Navigator>
        </SafeAreaView>

    );
}