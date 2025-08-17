import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Divider, Icon, IconButton, Surface, Text, TextInput } from "react-native-paper";

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

    // Stabilize the cancel function
    const handleCancel = useCallback(() => {
        console.log('❌ Canceling input...');
        if (toggleInput) {
            toggleInput(false);
        }
    }, [toggleInput]);


    const renderInputCard = () => (
        <View style={{ margin: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
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
                        placeholder="5.5"
                        keyboardType="decimal-pad"
                        returnKeyType="next"
                        onSubmitEditing={() => carbsInputRef.current?.focus()}
                        style={styles.input}
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
                        placeholder="60"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            noteInputRef.current?.focus();
                        }}
                        style={styles.input}
                        right={<TextInput.Affix text="g" />}
                        dense
                    />

                </View>

            </View>
            <View>
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
                    placeholder="Add any notes about your meal or how you're feeling..."
                    multiline
                    numberOfLines={3}
                    style={[styles.input, { maxHeight: 100, minHeight: 100 }]}
                    returnKeyType="default"
                    textAlignVertical="top"
                    blurOnSubmit={false}
                    dense
                />
            </View>
        </View>
    );

    const renderMealSelector = () => (

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={{ flex: 1, }}>
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
        </View>

    );

    const renderActivitySelector = () => (

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={{ flex: 1, }}>
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
        </View>
    );

    const renderPhotosCard = () => (
        <View>
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
            {toggleCamera ? (
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
            ) : (
                <View style={{ flexDirection: 'row', }}>
                    <View style={{ flex: 1 }} >

                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <IconButton
                            icon={"camera-plus"}
                            size={30}
                            onPress={() => setToggleCamera(!toggleCamera)}
                            // style={styles.actionButton}
                            iconColor={theme.colors.primary}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }} >
                        <IconButton
                            icon="content-save"
                            size={30}
                            onPress={handleSave}
                            // style={styles.actionButton}
                            iconColor={theme.colors.primary}
                            disabled={!diaryState.glucose || !diaryState.carbs}
                            loading={dbHook.isLoading}
                        />
                    </View>
                </View>
            )}



        </View>
    );

    const renderHeaderCard = () => {
        return (

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text variant="titleSmall" style={styles.appBarTitle}>
                        12:24 - 21/8
                    </Text>

                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <IconButton
                        icon="close"
                        mode="outlined"
                        size={24}
                        onPress={() => handleCancel()}
                        style={{ backgroundColor: theme.colors.error }}
                        iconColor={theme.colors.onError}
                    />
                </View>
            </View>


        );
    }

    



    return (
        <View style={{ flex: 1, position: 'relative' }}>

            {toggleCamera ? (
                <View style={[styles.background, { padding: 8 }]}>
                    {renderPhotosCard()}
                    {cameraHook.renderCamera()}
                </View>
            ) : (



                <ScrollView style={styles.background} showsVerticalScrollIndicator={false}>
                    <Surface style={[styles.card, { margin: 8 }]} elevation={2}>
                        {renderHeaderCard()}
                        <Divider style={{ marginVertical: 4 }} />
                        {renderInputCard()}
                        <Divider style={{ marginVertical: 4 }} />
                        <View style={{
                            flexDirection: 'row',
                            gap: 8,
                            marginBottom: 8,
                            marginTop: 8,

                        }}>
                            <View style={{ flex: 1, paddingLeft: 16 }}>
                                {renderMealSelector()}
                            </View>
                            <View style={{ flex: 1, paddingLeft: 16 }}>
                                {renderActivitySelector()}
                            </View>
                        </View>
                        <Divider style={{ marginVertical: 4 }} />
                        <View style={{ padding: 16 }}>
                            {renderPhotosCard()}
                        </View>
                    </Surface>
                    <View style={styles.content}>






                        {dbHook.error && (
                            <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                                    {dbHook.error}
                                </Text>
                            </Surface>
                        )}
                    </View>




                </ScrollView>

            )}

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
        </View>
    );
}