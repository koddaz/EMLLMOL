import { useMemo, useState } from "react";
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
import { useAppTheme } from "../constants/UI/theme";

export function RootNavigation({ appData }: { appData: AppData }) {
    const { theme, styles } = useAppTheme();
    const insets = useSafeAreaInsets();

    const { navigateMonth, currentMonth, setCurrentMonth, selectedDate, setSelectedDate, showCalendar, setShowCalendar } = useCalendar();

    // Settings state management
    const [settingsEditMode, setSettingsEditMode] = useState(false);
    const [settingsSection, setSettingsSection] = useState<'profile' | 'preferences' | 'account'>('profile');

    // Move the DB hook to root level
    const { retrieveEntries } = useDB(appData);
    const diaryEntries = appData.diaryEntries || [];
    const isLoading = !appData.isEntriesLoaded;

    const DiaryRoute = () => (
        <DiaryScreen
            appData={appData}
            showCalendar={showCalendar}
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            setSelectedDate={setSelectedDate} // Pass the setter
            diaryEntries={diaryEntries}
            isLoading={isLoading}
            refreshEntries={async () => {
                const updatedEntries = await retrieveEntries();
            }}
            navigateMonth={navigateMonth}
        />
    );
    const CameraRoute = () => <CameraScreen />;
    const SettingsRoute = () => (
        <SettingsScreen
            appData={appData}
            editMode={settingsEditMode}
            setEditMode={setSettingsEditMode}
            currentSection={settingsSection}
            setCurrentSection={setSettingsSection}
        />
    );

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

    // Format diary date for AppBar
    const formatDiaryDate = () => {
        return selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <Appbar.Header
                mode="small"
                style={styles.appBar}
                statusBarHeight={insets.top}
                elevated={
                    showCalendar ? false : true
                }

            >
                {getCurrentRoute() === 'diary' && (
                    <>
                        <Appbar.Action
                            mode="outlined"
                            icon="book"
                            // onPress={() => { navigateDate('prev') }}
                            iconColor={theme.colors.primary}
                            style={styles.appBarAction}
                            size={30}
                        />

                        <Appbar.Content
                            title={"Diary"}
                            titleStyle={[styles.appBarTitle, { fontSize: 18 }]} // Slightly smaller for longer text
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
                        <Appbar.Action
                            icon={getSettingsIcon()}
                            iconColor={theme.colors.primary}
                            style={styles.appBarAction}
                            size={22}
                        />
                        <Appbar.Content
                            title={getSettingsTitle()}
                            titleStyle={styles.appBarTitle}
                        />
                        {settingsSection === 'profile' && (
                            <Appbar.Action
                                icon={settingsEditMode ? "check" : "pencil"}
                                onPress={() => setSettingsEditMode(!settingsEditMode)}
                                iconColor={theme.colors.primary}
                                style={[
                                    styles.appBarAction,
                                    settingsEditMode && { backgroundColor: theme.colors.primaryContainer }
                                ]}
                                size={22}
                            />
                        )}
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
                inactiveColor={theme.colors.onSurfaceVariant}
                barStyle={styles.bottomAppBar}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                compact={true}
                shifting={false}
                sceneAnimationEnabled={true}
                sceneAnimationType="opacity"
                keyboardHidesNavigationBar={true}
                safeAreaInsets={{ bottom: insets.bottom }}
            />
        </View>
    );
}