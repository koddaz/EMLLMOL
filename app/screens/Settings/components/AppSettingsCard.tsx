import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Divider, RadioButton, SegmentedButtons, Text } from "react-native-paper";

interface AppSettingsCardProps {
    appData: AppData;
    handleSettingChange: (key: keyof AppData["settings"], setValue: (v: string) => void) => (newValue: string) => void;
}

export function AppSettingsCard({
    appData,
    handleSettingChange
}: AppSettingsCardProps) {
    const { theme, styles } = useAppTheme();
    const [weight, setWeight] = useState(appData.settings.weight);
    const [glucose, setGlucose] = useState(appData.settings.glucose);
    const [clockFormat, setClockFormat] = useState(appData.settings.clockFormat);
    const [dateFormat, setDateFormat] = useState(appData.settings.dateFormat);



    const renderRadioButtons = (title: string, firstValue: string, secondValue: string, currentValue: string, settingKey: keyof AppData["settings"], setValue: (value: string) => void) => (
        <View style={[styles.row, { marginBottom: 4 }]}>
            <View style={{ alignItems: 'flex-start', flex: 2 }}>
                <Text variant="labelMedium" style={styles.selectorLabel}>
                    {title}
                </Text>
            </View>
            
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View style={{ paddingHorizontal: 4, alignItems: 'center' }}>
                    <RadioButton
                        value={firstValue}
                        status={currentValue === firstValue ? 'checked' : 'unchecked'}
                        onPress={() => handleSettingChange(settingKey, setValue)(firstValue)}
                    />
                    <Text variant="labelSmall">{firstValue}</Text>
                </View>
                <View style={{ paddingHorizontal: 4, alignItems: 'center' }}>
                    <RadioButton
                        value={secondValue}
                        status={currentValue === secondValue ? 'checked' : 'unchecked'}
                        onPress={() => handleSettingChange(settingKey, setValue)(secondValue)}
                    />
                    <Text variant="labelSmall">{secondValue}</Text>
                </View>
            </View>
        </View>
    )

    return (

        <View style={[styles.box, { borderBottomWidth: 0, borderTopWidth: 0 }]}>
            <View style={styles.header}>
                <View style={styles.chip}>
                    <MaterialCommunityIcons name="scale-balance" size={20} color={theme.colors.onSecondary} />
                </View>
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                    Measurement Units
                </Text>
            </View>
            <Divider style={{marginHorizontal: 8, marginVertical: 4}} />
            <View style={styles.content}>
                {renderRadioButtons('Glucose Unit', 'mmol', 'mgdl', glucose, 'glucose', setGlucose)}
                <Divider style={{marginVertical: 4}} />
                {renderRadioButtons('Weight Unit', 'kg', 'lbs', weight, 'weight', setWeight)}
                <Divider style={{marginVertical: 4}} />
                {renderRadioButtons('Clock format', '12h', '24h', clockFormat, 'clockFormat', setClockFormat)}
                <Divider style={{marginVertical: 4}} />

       

               



                

                

                <Text variant="labelMedium" style={styles.selectorLabel}>
                    Date Format
                </Text>
                <SegmentedButtons
                    value={dateFormat}
                    onValueChange={handleSettingChange('dateFormat', setDateFormat)}
                    buttons={[
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', icon: 'calendar', style: {borderRadius: 0}},
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', icon: 'calendar',  style: {borderRadius: 0} },
                    ]}
                />
            </View>

        </View>

    );
}