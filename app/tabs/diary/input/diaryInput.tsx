import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useCallback, useRef, useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import { Avatar, Button, IconButton, Surface, Text, TextInput } from "react-native-paper";
import { useCamera } from "../hooks/useCamera";

// Remove the complex memo comparison and just use basic memo
export function DiaryInput({
    appData,
    toggleInput,
    calendarHook,
    dbHook,
    diaryState
}: {
    appData: AppData,
    toggleInput?: (state: boolean) => void,
    calendarHook: any,
    dbHook: any,
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

    // camera related
    const {
        renderCamera,
        cycleFlash,
        getFlashIcon,
        getFlashIconColor,
        capturePhoto,
        photoURIs,
        removePhotoURI,
        clearPhotoURIs,
        savePhotoLocally,
    } = useCamera(appData);

    // toggles and arrays
    const [toggleCamera, setToggleCamera] = useState(false);
    const [toggleNote, setToggleNote] = useState(false);

    // keyboard related
    const glucoseInputRef = useRef<any>(null);
    const carbsInputRef = useRef<any>(null);

    // Stabilize the save function
    const handleSave = useCallback(async () => {
        console.log('📝 Saving entry...');

        try {
            // First, save all photos locally and get permanent URIs
            const permanentURIs: string[] = [];
            for (const tempUri of photoURIs) {
                const permanentUri = await savePhotoLocally(tempUri);
                permanentURIs.push(permanentUri);
            }

            // Use dbHook directly
            await dbHook.saveDiaryEntry(permanentURIs);

            console.log('✅ Entry saved, closing input...');

            // Clear camera and note states
            setToggleCamera(false);
            setToggleNote(false);
            clearPhotoURIs();

            // Close the input after successful save
            if (toggleInput) {
                toggleInput(false);
            }
        } catch (error) {
            console.error('❌ Error saving entry:', error);
        }
    }, [photoURIs, savePhotoLocally, dbHook, clearPhotoURIs, toggleInput]);

    // Stabilize the cancel function
    const handleCancel = useCallback(() => {
        console.log('❌ Canceling input...');
        if (toggleInput) {
            toggleInput(false);
        }
    }, [toggleInput]);

    const renderGlucoseCard = () => (
        <Surface style={styles.card} elevation={2}>
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
                onChangeText={diaryState.setGlucose}
                placeholder="Enter glucose level"
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => carbsInputRef.current?.focus()}
                style={styles.input}
                right={<TextInput.Affix text={appData.settings.glucose} />}
                dense
            />
        </Surface>
    );

    const renderCarbsCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="food" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Carbohydrates
                </Text>
            </View>
            <TextInput
                ref={carbsInputRef}
                mode="outlined"
                value={dbHook.carbs}
                onChangeText={dbHook.setCarbs}
                placeholder="Enter carbs amount"
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                style={styles.input}
                right={<TextInput.Affix text="g" />}
                dense
            />
        </Surface>
    );

    const renderQuickSelectors = () => (
        <Surface style={styles.card} elevation={2}>
            <Text variant="titleMedium" style={[styles.cardTitle, { marginBottom: 16 }]}>
                Quick Details
            </Text>

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Meal Type
                    </Text>
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

            <View style={styles.selectorRow}>
                <View style={styles.selectorGroup}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Activity Level
                    </Text>
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
        </Surface>
    );

    const renderNotesCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="note-text" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Notes
                </Text>
            </View>
            <TextInput
                mode="outlined"
                value={diaryState.note}
                onChangeText={diaryState.setNote}
                placeholder="Add any notes about your meal or how you're feeling..."
                multiline
                numberOfLines={3}
                style={[styles.input, { height: 80 }]}
                textAlignVertical="top"
                dense
            />
        </Surface>
    );

    const renderPhotosCard = () => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.cardTitle}>
                    Photos
                </Text>
                <Button
                    mode="outlined"
                    onPress={() => setToggleCamera(!toggleCamera)}
                    style={styles.photoButton}
                    compact
                >
                    {toggleCamera ? "Close Camera" : "Take Photo"}
                </Button>
            </View>

            {toggleCamera ? (
                <View style={styles.cameraContainer}>
                    {renderCamera()}
                    <View style={styles.cameraControls}>
                        <IconButton
                            icon={getFlashIcon()}
                            iconColor={getFlashIconColor()}
                            size={24}
                            onPress={cycleFlash}
                            mode="contained"
                        />
                        <IconButton
                            icon="camera"
                            size={30}
                            onPress={capturePhoto}
                            mode="contained"
                            style={{ backgroundColor: theme.colors.primary }}
                            iconColor={theme.colors.onPrimary}
                        />
                    </View>
                </View>
            ) : photoURIs.length > 0 ? (
                <ScrollView horizontal style={styles.photoScroll}>
                    {photoURIs.map((uri, index) => (
                        <View key={index} style={styles.photoItem}>
                            <Avatar.Image size={60} source={{ uri }} />
                            <IconButton
                                icon="close"
                                size={16}
                                onPress={() => removePhotoURI(index)}
                                style={styles.photoDelete}
                                iconColor={theme.colors.onErrorContainer}
                            />
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyPhotos}>
                    <MaterialCommunityIcons name="camera-plus" size={32} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                        No photos added yet
                    </Text>
                </View>
            )}
        </Surface>
    );

    const renderActionButtons = () => (
        <View style={styles.actionContainer}>
            <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                icon="close"
            >
                Cancel
            </Button>
            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                icon="content-save"
                loading={dbHook.isLoading}
                disabled={!dbHook.glucose || !dbHook.carbs}
            >
                Save Entry
            </Button>
        </View>
    );

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.surface,
            minHeight: 400
        }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {renderGlucoseCard()}
                    {renderCarbsCard()}
                    {renderQuickSelectors()}
                    {renderNotesCard()}
                    {renderPhotosCard()}

                    {dbHook.error && (
                        <Surface style={[styles.card, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                                {dbHook.error}
                            </Text>
                        </Surface>
                    )}
                </View>

                {renderActionButtons()}
            </ScrollView>
        </View>
    );
}