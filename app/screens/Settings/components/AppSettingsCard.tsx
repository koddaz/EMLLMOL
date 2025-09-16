import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";

interface AppSettingsCardProps {
    appData: AppData;
    setCurrentSection: (section: 'profile' | 'preferences' | 'account') => void;
    setAppData: (data: AppData) => void;
}

export function AppSettingsCard({
    appData,
    setCurrentSection,
    setAppData
}: AppSettingsCardProps) {
    const { theme, styles } = useAppTheme();
    const [weight, setWeight] = useState(appData.settings.weight);
    const [glucose, setGlucose] = useState(appData.settings.glucose);
    const [clockFormat, setClockFormat] = useState(appData.settings.clockFormat);
    const [dateFormat, setDateFormat] = useState(appData.settings.dateFormat);

    useEffect(() => {
        setCurrentSection('preferences');
    }, []);

    const saveAndLoadSetting = async (
        key: string,
        newValue: string,
        setValue: (v: string) => void
    ) => {
        try {
            await AsyncStorage.setItem(key, newValue);
            console.log(`Saved ${key}: ${newValue}`);
            const loaded = await AsyncStorage.getItem(key);
            setValue(loaded !== null ? loaded : newValue);
            console.log(`Loaded ${key}: ${loaded}`);
        } catch (error) {
            console.error(`Error saving/loading ${key}:`, error);
        }
    };

    const handleSettingChange = (
        key: keyof AppData["settings"],
        setValue: (v: string) => void
    ) => (newValue: string) => {
        setValue(newValue);
        saveAndLoadSetting(key, newValue, setValue);
        setAppData({
            ...appData,
            settings: {
                ...appData.settings,
                [key]: newValue,
            },
        });
    };

    return (
        
            <View style={[styles.box, {borderBottomWidth: 0, borderTopWidth: 0}]}>
                <View style={styles.header}>
                    <View style={styles.chip}>
                    <MaterialCommunityIcons name="scale-balance" size={20} color={theme.colors.onSecondary} />
                    </View>
                    <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                        Measurement Units
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Weight Unit
                    </Text>
                    <SegmentedButtons
                        value={weight}
                        style={{ marginBottom: 16 }}
                        onValueChange={handleSettingChange('weight', setWeight)}
                        buttons={[
                            { value: 'kg', label: 'Kilograms', icon: 'weight-kilogram' },
                            { value: 'lbs', label: 'Pounds', icon: 'weight-pound' },
                        ]}
                    />
                
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Glucose Unit
                    </Text>
                    <SegmentedButtons
                        value={glucose}
                        style={{ marginBottom: 16 }}
                        onValueChange={handleSettingChange('glucose', setGlucose)}
                        buttons={[
                            { value: 'mmol', label: 'mmol/L', icon: 'test-tube' },
                            { value: 'mgdl', label: 'mg/dL', icon: 'test-tube' },
                        ]}
                    />
                
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Clock Format
                    </Text>
                    <SegmentedButtons
                        value={clockFormat}
                        style={{ marginBottom: 16 }}
                        onValueChange={handleSettingChange('clockFormat', setClockFormat)}
                        buttons={[
                            { value: '12h', label: '12-hour', icon: 'clock' },
                            { value: '24h', label: '24-hour', icon: 'clock' },
                        ]}
                    />
                
                    <Text variant="labelMedium" style={styles.selectorLabel}>
                        Date Format
                    </Text>
                    <SegmentedButtons
                        value={dateFormat}
                        onValueChange={handleSettingChange('dateFormat', setDateFormat)}
                        buttons={[
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', icon: 'calendar' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', icon: 'calendar' },
                        ]}
                    />
                </View>
                
            </View>
        
    );
}