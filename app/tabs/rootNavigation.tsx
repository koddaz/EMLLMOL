import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "./settings/settingsScreen";
import { BottomNavigation, useTheme } from "react-native-paper";
import { customStyles } from "../constants/UI/styles";
import CameraScreen from "./camera/cameraScreen";
import { AppData } from "../constants/interface/appData";
import { DiaryScreen } from "./diary/diaryScreen";
import { useState } from "react";

export function RootNavigation({ appData }: { appData: AppData }) {
    const theme = useTheme();
    const styles = customStyles(theme);

    const DiaryRoute = () => <DiaryScreen appData={appData} />;
    const CameraRoute = () => <CameraScreen />;
    const SettingsRoute = () => <SettingsScreen appData={appData} />;

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'diary', title: 'Diary', focusedIcon: 'book', unfocusedIcon: 'book-outline' },
        { key: 'camera', title: 'Camera', focusedIcon: 'camera', unfocusedIcon: 'camera-outline' },
        { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },

    ]);

    const renderScene = BottomNavigation.SceneMap({
        diary: DiaryRoute,
        camera: CameraRoute,
        settings: SettingsRoute,
    });

    // Replace this with your actual navigation logic or component tree
    return (
        
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        

    );
}