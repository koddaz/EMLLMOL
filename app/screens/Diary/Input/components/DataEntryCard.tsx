import { useAppTheme } from "@/app/constants/UI/theme";
import { AppData } from "@/app/constants/interface/appData";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface DataEntryCardProps {
    appData: AppData;
    diaryState: {
        glucose: string;
        setGlucose: (value: string) => void;
        carbs: string;
        setCarbs: (value: string) => void;
        note: string;
        setNote: (value: string) => void;
    };
    isSaving: boolean;
}

export function DataEntryCard({ appData, diaryState, isSaving }: DataEntryCardProps) {
    const { theme, styles } = useAppTheme();
    const glucoseInputRef = useRef<any>(null);
    const carbsInputRef = useRef<any>(null);
    const noteInputRef = useRef<any>(null);

    return (
        <View style={styles.box}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="database-edit" size={20} color={theme.colors.onSecondaryContainer} />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Data Entry
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 4 }}>
                        <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 4 }]}>
                            Blood Glucose
                        </Text>
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
                            disabled={isSaving}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 4 }}>
                        <Text variant="labelMedium" style={[styles.selectorLabel, { marginBottom: 4 }]}>
                            Carbohydrates
                        </Text>
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
                            disabled={isSaving}
                        />
                    </View>
                </View>

                <Text variant="labelMedium" style={[styles.selectorLabel, { marginTop: 12, marginBottom: 4 }]}>
                    Notes
                </Text>
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
                    dense
                    disabled={isSaving}
                />
            </View>
            <View style={styles.footer}></View>
        </View>
    );
}