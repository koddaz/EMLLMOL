import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Divider, IconButton, Surface, Text, TextInput } from "react-native-paper";

// Remove the complex memo comparison and just use basic memo
export function DiaryInput({
    appData,
    toggleInput,
    calendarHook,
    dbHook,
    cameraHook,
    diaryState
}: {
    appData: AppData,
    toggleInput?: (state: boolean) => void,
    calendarHook: any,
    dbHook: any,
    cameraHook: any,
    diaryState: {
        glucose: string,
        setGlucose: (value: string) => void,
        carbs: string,
        setCarbs: (value: string) => void,
        note: string,
        setNote: (value: string) => void,
        activity: string,
        setActivity: (value: string) => void,
        foodType: string,
        setFoodType: (value: string) => void
    }
}) {
    const { theme, styles } = useAppTheme();

    console.log('🔄 DiaryInput rendered');



    // toggles and arrays
    const [toggleCamera, setToggleCamera] = useState(false);
    // const [toggleNote, setToggleNote] = useState(false);

    // keyboard related
    const glucoseInputRef = useRef<any>(null);
    const carbsInputRef = useRef<any>(null);
    const noteInputRef = useRef<any>(null);

    // Stabilize the save function
    const handleSave = useCallback(async () => {
        console.log('📝 Saving entry...');

        try {
            // First, save all photos locally and get permanent URIs
            const permanentURIs: string[] = [];
            for (const tempUri of cameraHook.photoURIs) {
                console.log('📷 Processing photo:', tempUri);
                const permanentUri = await cameraHook.savePhotoLocally(tempUri);
                console.log('📷 Saved as:', permanentUri);
                permanentURIs.push(permanentUri);
            }

            console.log('📷 All permanent URIs:', permanentURIs);
            // Create the diary entry data object
            const entryData = {
                glucose: diaryState.glucose,
                carbs: diaryState.carbs,
                note: diaryState.note,
                activity: diaryState.activity,
                foodType: diaryState.foodType,
            };
            await dbHook.saveDiaryEntry(entryData, permanentURIs);


            console.log('✅ Entry saved, closing input...');

            // Clear camera and note states
            setToggleCamera(false);
            // setToggleNote(false);
            cameraHook.clearPhotoURIs();

            // Clear the diary state
            diaryState.setGlucose('');
            diaryState.setCarbs('');
            diaryState.setNote('');
            diaryState.setActivity('');
            diaryState.setFoodType('');

            // Close the input after successful save
            if (toggleInput) {
                toggleInput(false);
            }
        } catch (error) {
            console.error('❌ Error saving entry:', error);
        }
    }, [cameraHook.photoURIs, cameraHook.savePhotoLocally, dbHook, cameraHook.clearPhotoURIs, toggleInput, diaryState]);

    const renderNoteCard = () => (
        <View style={styles.wrapper}>
            <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="note-text" size={20} color={theme.colors.primary} />
                    <Text variant="titleMedium" style={styles.cardTitle}>
                        Notes
                    </Text>
                </View>

            </View>
            <TextInput
                ref={noteInputRef}
                mode="outlined"
                value={diaryState.note}
                onChangeText={diaryState.setNote}
                outlineColor={theme.colors.outlineVariant}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                placeholder="Add any notes about your meal or how you're feeling..."
                multiline
                numberOfLines={3}
                style={[styles.textInput, { maxHeight: 100, minHeight: 100 }]}
                returnKeyType="default"
                textAlignVertical="top"
                blurOnSubmit={false}
                dense
            />
        </View>
    );

    const renderInputCard = () => (

        <View style={styles.wrapper}>
            <View style={styles.row}>
                <View style={{ flex: 1, }}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="blood-bag" size={20} color={theme.colors.primary} />
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            Blood Glucose
                        </Text>
                    </View>
                    <TextInput
                        ref={glucoseInputRef}
                        mode="outlined"
                        value={diaryState.glucose}
                        onChangeText={(text) => diaryState.setGlucose(text)}
                        outlineColor={theme.colors.outlineVariant}
                        activeOutlineColor={theme.colors.primary}
                        textColor={theme.colors.onSurface}
                        placeholder="5.5"
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        onSubmitEditing={() => carbsInputRef.current?.focus()}
                        style={styles.textInput}
                        right={<TextInput.Affix text={appData.settings.glucose} />}
                        dense
                    />


                </View>
                <View style={{ flex: 1 }}>

                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="food" size={20} color={theme.colors.primary} />
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            Carbohydrates
                        </Text>
                    </View>
                    <TextInput
                        ref={carbsInputRef}
                        mode="outlined"
                        value={diaryState.carbs}
                        onChangeText={(text) => diaryState.setCarbs(text)}
                        outlineColor={theme.colors.outlineVariant}
                        activeOutlineColor={theme.colors.primary}
                        textColor={theme.colors.onSurface}
                        placeholder="60"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            noteInputRef.current?.focus();
                        }}
                        style={styles.textInput}
                        right={<TextInput.Affix text="g" />}
                        dense
                    />

                </View>

            </View>

        </View>



    );

    const renderMealSelector = () => (

        <View style={styles.wrapper}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="food-fork-drink" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Meal
                </Text>
            </View>
            <View style={styles.chipContainer}>
                {dbHook.foodOptions.map((option: any) => (
                    <Button
                        key={option}
                        mode={diaryState.foodType === option ? "contained" : "outlined"}
                        onPress={() => diaryState.setFoodType(option)}
                        style={[
                            styles.chip,
                            diaryState.foodType === option && { backgroundColor: theme.colors.primary }
                        ]}
                        labelStyle={{
                            fontSize: 12,
                            color: diaryState.foodType === option ? theme.colors.onPrimary : theme.colors.onSurface
                        }}
                        compact
                    >
                        {option}
                    </Button>
                ))}
            </View>

        </View>

    );

    const renderActivitySelector = () => (

        <View style={styles.wrapper}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="run-fast" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Activity
                </Text>
            </View>
            <View style={styles.chipContainer}>
                {dbHook.activityOptions.map((option: any) => (
                    <Button
                        key={option}
                        mode={diaryState.activity === option ? "contained" : "outlined"}
                        onPress={() => diaryState.setActivity(option)}
                        style={[
                            styles.chip,
                            diaryState.activity === option && { backgroundColor: theme.colors.secondary }
                        ]}
                        labelStyle={{
                            fontSize: 12,
                            color: diaryState.activity === option ? theme.colors.onSecondary : theme.colors.onSurface
                        }}
                        compact
                    >
                        {option}
                    </Button>
                ))}
            </View>
        </View>
    );

    const renderPhotosCard = () => (
        <View style={styles.wrapper}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Photos
                </Text>
            </View>

            {cameraHook.photoURIs.length > 0 ? (
                <ScrollView horizontal style={styles.photoScroll}>
                    {cameraHook.photoURIs.map((uri: string, index: any) => (
                        <View key={index} style={styles.photoItem}>
                            <Avatar.Image size={60} source={{ uri }} />
                            <IconButton
                                icon="close"
                                size={16}
                                onPress={() => cameraHook.removePhotoURI(index)}
                                style={styles.photoDelete}
                                iconColor={theme.colors.onErrorContainer}
                            />
                        </View>
                    ))}
                </ScrollView>
            ) : (

                <View style={{}}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                        No photos added yet
                    </Text>
                </View>
            )}
        </View>
    );

    const renderActionButtons = () => (
        <View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <IconButton
                        icon='camera-off'
                        size={30}
                        onPress={() => setToggleCamera(false)}
                        mode="contained"
                        style={{ backgroundColor: theme.colors.error }}
                        iconColor={theme.colors.onError}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <IconButton
                        icon="camera"
                        size={30}
                        onPress={cameraHook.capturePhoto}
                        mode="contained"
                        style={{ backgroundColor: theme.colors.primary }}
                        iconColor={theme.colors.onPrimary}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }} >
                    <IconButton
                        icon={cameraHook.getFlashIcon()}
                        iconColor={cameraHook.getFlashIconColor()}
                        size={30}
                        onPress={cameraHook.cycleFlash}
                        mode="contained"
                    />
                </View>



            </View>




        </View>
    );

    const renderHeaderCard = () => {
        return (


            <View style={styles.header}>
                <View style={styles.row}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialCommunityIcons name="note" size={30} color={theme.colors.onPrimaryContainer} />
                        <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer }}>
                            {calendarHook.formatTime(new Date())}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text>
                            {calendarHook.formatDate(new Date())}
                        </Text>
                    </View>

                </View>

            </View>


        );
    }





    return (
        <View style={styles.background}>

            {toggleCamera ? (
                <View style={[styles.container, { padding: 8 }]}>
                    {renderPhotosCard()}
                    {cameraHook.renderCamera()}
                </View>
            ) : (



                <View style={styles.container}>

                    {renderHeaderCard()}
                    {renderInputCard()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderNoteCard()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderMealSelector()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderActivitySelector()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderPhotosCard()}

                    <View style={styles.content}>
                        {dbHook.error && (
                            <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                                    {dbHook.error}
                                </Text>
                            </Surface>
                        )}
                    </View>





                </View>

            )}
            {toggleCamera && (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.colors.background,
                    padding: 8,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.outlineVariant,
                }}
                >
                    {renderActionButtons()}

                </View>
            )}
        </View>
    );
}