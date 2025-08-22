import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Avatar, Button, Divider, FAB, IconButton, Surface, Text, TextInput } from "react-native-paper";

// Remove the complex memo comparison and just use basic memo
export function InputScreen({
    appData,
    calendarHook,
    dbHook,
    cameraHook,
    diaryState,
    navigation
}: {
    appData: AppData,
    calendarHook: any,
    dbHook: any,
    cameraHook: any,
    navigation: any,
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

    const handleSave = useCallback(async () => {
    try {
      const permanentURIs = await Promise.all(
        cameraHook.photoURIs.map((tempUri: string) => cameraHook.savePhotoLocally(tempUri))
      );

      const entryData = {
        glucose: diaryState.glucose,
        carbs: diaryState.carbs,
        note: diaryState.note,
        activity: diaryState.activity,
        foodType: diaryState.foodType,
      };

      await dbHook.saveDiaryEntry(entryData, permanentURIs);
      // Clear camera and diary states
      if (cameraHook.showCamera) cameraHook.toggleCamera();
      cameraHook.clearPhotoURIs();

      diaryState.setGlucose('');
      diaryState.setCarbs('');
      diaryState.setNote('');
      diaryState.setActivity('');
      diaryState.setFoodType('');

      // Optionally close the input
      if (dbHook.toggleInput) dbHook.toggleInput();
    } catch (error) {
      console.error('❌ Error saving entry:', error);
    } finally {
        navigation.goBack();
    }
  }, [
    cameraHook.photoURIs,
    cameraHook.savePhotoLocally,
    cameraHook.showCamera,
    cameraHook.toggleCamera,
    cameraHook.clearPhotoURIs,
    dbHook,
    dbHook.toggleInput,
    diaryState,
  ]);

    // keyboard related
    const glucoseInputRef = useRef<any>(null);
    const carbsInputRef = useRef<any>(null);
    const noteInputRef = useRef<any>(null);

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
    const renderHeaderCard = () => (
        <View style={styles.header}>
            
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

    );

    const renderFAB = () => (
        <View style={styles.fabContainer}>
        <View style={styles.fabRow}>
            <View>
          <FAB
            color={theme.colors.onPrimary}
            icon="floppy"
            size="medium"
            style={styles.fabSecondary}
            onPress={handleSave}
          />
          <FAB
            color={theme.colors.onPrimary}
            icon="camera-plus"
            size="medium"
            style={styles.fabSecondary}
            onPress={() => navigation.navigate('DiaryCamera')}
          />
          </View>
        </View>
      </View>
    );





    return (
        <View style={styles.background}>

                <KeyboardAvoidingView
                    style={styles.background}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >

                    {renderHeaderCard()}
                    {dbHook.error && (
                        <View style={styles.content}>

                            <Surface style={[styles.container, { backgroundColor: theme.colors.errorContainer }]} elevation={2}>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                                    {dbHook.error}
                                </Text>
                            </Surface>

                        </View>
                    )}
                    {renderInputCard()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderNoteCard()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderMealSelector()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderActivitySelector()}
                    <Divider style={{ borderWidth: 0.1, marginTop: 12 }} />
                    {renderPhotosCard()}
                    {renderFAB()}

                </KeyboardAvoidingView>

        </View>
    );
}