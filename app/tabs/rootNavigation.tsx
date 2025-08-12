import { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar, BottomNavigation, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppData } from "../constants/interface/appData";
import { customStyles } from "../constants/UI/styles";
import CameraScreen from "./camera/cameraScreen";
import { DiaryScreen } from "./diary/diaryScreen";
import { useCalendar } from "./diary/hooks/useCalendar";
import { useDB } from "./diary/hooks/useDB";
import { SettingsScreen } from "./settings/settingsScreen";

export function RootNavigation({ appData }: { appData: AppData }) {
    const theme = useTheme();
    const styles = customStyles(theme);
    const insets = useSafeAreaInsets();

    const { navigateDate, formatDate, selectedDate, showCalendar, setShowCalendar } = useCalendar();

    // Move the DB hook to root level
    const { isLoading, diaryEntries, retrieveEntries } = useDB(appData);

    // Load entries once when app starts
    useEffect(() => {
        retrieveEntries();
    }, []);

    const DiaryRoute = () => (
        <DiaryScreen
            appData={appData}
            setShowCalendar={setShowCalendar}
            showCalendar={showCalendar}
            selectedDate={selectedDate}
            // Pass the data and loading state down
            diaryEntries={diaryEntries}
            isLoading={isLoading}
            refreshEntries={retrieveEntries}
        />
    );
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

    const getCurrentRoute = () => routes[index].key;

    return (
        <View style={styles.container}>
            <Appbar.Header
                style={[styles.appBar, { paddingTop: insets.top }]}
                statusBarHeight={insets.top}
                elevated={false}
            >
                {getCurrentRoute() === 'diary' && (
                    <>
                        <Appbar.Action
                            icon='chevron-left'
                            onPress={() => { navigateDate('prev') }}
                            iconColor={theme.colors.onSurfaceVariant}
                            style={styles.appBarAction}
                            size={22}
                        />
                        <Appbar.Content
                            title={formatDate(selectedDate)}
                            titleStyle={styles.appBarTitle}
                        />
                        <Appbar.Action
                            icon="chevron-right"
                            onPress={() => navigateDate('next')}
                            iconColor={theme.colors.onSurfaceVariant}
                            style={styles.appBarAction}
                            size={22}
                        />
                        <Appbar.Action
                            icon="calendar"
                            onPress={() => setShowCalendar(!showCalendar)}
                            iconColor={showCalendar ? theme.colors.primary : theme.colors.onSurfaceVariant}
                            style={[
                                styles.appBarAction,
                                showCalendar && { backgroundColor: theme.colors.primaryContainer }
                            ]}
                            size={22}
                        />
                    </>
                )}

                {getCurrentRoute() === 'camera' && (
                    <>
                        <Appbar.Content
                            title="Camera"
                            titleStyle={styles.appBarTitle}
                        />
                        <Appbar.Action
                            icon="flash"
                            onPress={() => {
                                console.log('Toggle flash');
                            }}
                            iconColor={theme.colors.onSurfaceVariant}
                            style={styles.appBarAction}
                            size={22}
                        />
                        <Appbar.Action
                            icon="camera-flip"
                            onPress={() => {
                                console.log('Flip camera');
                            }}
                            iconColor={theme.colors.onSurfaceVariant}
                            style={styles.appBarAction}
                            size={22}
                        />
                    </>
                )}

                {getCurrentRoute() === 'settings' && (
                    <>
                        <Appbar.Content
                            title="Settings"
                            titleStyle={styles.appBarTitle}
                        />
                        <Appbar.Action
                            icon="information-outline"
                            onPress={() => {
                                console.log('Show app info');
                            }}
                            iconColor={theme.colors.onSurfaceVariant}
                            style={styles.appBarAction}
                            size={22}
                        />
                    </>
                )}
            </Appbar.Header>

            <BottomNavigation
                activeColor={theme.colors.primary}
                inactiveColor={theme.colors.onPrimaryContainer}
                barStyle={styles.bottomAppBar}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </View>
    );
}