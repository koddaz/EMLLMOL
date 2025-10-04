import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    Text as RNText,
    Animated,
    StyleSheet
} from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';
import { AppData } from '@/app/constants/interface/appData';

interface GlucosePickerProps {
    selectedValue: number;
    onValueChange: (value: number) => void;
    disabled?: boolean;
    height?: number;
    itemHeight?: number;
    appData?: AppData
}

// Updated component using the stylesheet
export function GlucosePicker({
    appData,
    selectedValue,
    onValueChange,
    disabled = false,
    height = 160,
    itemHeight = 32
}: GlucosePickerProps) {
    const { theme } = useAppTheme();
    const styles = createGlucosePickerStyles(theme, height, itemHeight);

    const ismmol = appData?.settings.glucose === "mmol";

    // mg/dL ranges from 20-466 (integer values)
    const mgdlNumbers = Array.from({ length: 447 }, (_, i) => i + 20);

    // mmol/L ranges from 2.0-25.9 (decimal values)
    const mmolNumbers = Array.from({ length: 24 }, (_, i) => i + 2);
    const mmolDecimals = Array.from({ length: 10 }, (_, i) => i);

    // Initialize values based on current unit
    const initializemmolValues = (value: number) => {
        if (ismmol) {
            return {
                whole: Math.floor(value),
                decimal: Math.round((value - Math.floor(value)) * 10)
            };
        } else {
            // Convert mg/dL to mmol/L for internal calculation
            const mmolValue = value / 18.0;
            return {
                whole: Math.floor(mmolValue),
                decimal: Math.round((mmolValue - Math.floor(mmolValue)) * 10)
            };
        }
    };

    const initializeMgdlValue = (value: number) => {
        if (ismmol) {
            // Convert mmol/L to mg/dL
            return Math.round(value * 18.0);
        } else {
            return Math.floor(value);
        }
    };

    const mmolValues = initializemmolValues(selectedValue);
    const mgdlValue = initializeMgdlValue(selectedValue);

    const [mmolNumber, setmmolNumber] = useState(mmolValues.whole);
    const [decimal, setDecimal] = useState(mmolValues.decimal);
    const [mgdlNumber, setMgdlNumber] = useState(mgdlValue);

    useEffect(() => {
        if (disabled) return;

        if (ismmol) {
            const newValue = mmolNumber + (decimal / 10);
            if (newValue >= 2.0 && newValue <= 25.9) {
                onValueChange(newValue);
            }
        } else {
            if (mgdlNumber >= 20 && mgdlNumber <= 466) {
                onValueChange(mgdlNumber);
            }
        }
    }, [mmolNumber, decimal, mgdlNumber, ismmol, disabled, onValueChange]);

    const handleWholeScroll = (event: any) => {
        if (disabled) return;
        const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, mmolNumbers.length - 1));
        setmmolNumber(mmolNumbers[clampedIndex]);
    };

    const handlemmolDecimalScroll = (event: any) => {
        if (disabled) return;
        const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, mmolDecimals.length - 1));
        const newDecimal = mmolDecimals[clampedIndex];

        // Validate range for mmol/L
        if (mmolNumber === 2 && newDecimal < 0) return;
        if (mmolNumber === 25 && newDecimal > 9) return;

        setDecimal(newDecimal);
    };

    const handleMgdlScroll = (event: any) => {
        if (disabled) return;
        const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
        const clampedIndex = Math.max(0, Math.min(index, mgdlNumbers.length - 1));
        setMgdlNumber(mgdlNumbers[clampedIndex]);
    };

    const renderItem = (value: number, isSelected: boolean) => (
        <View style={styles.itemContainer}>
            <Text style={[
                isSelected ? styles.selectedItemText : styles.unselectedItemText,
                disabled && styles.disabledText
            ]}>
                {value}
            </Text>
        </View>
    );

    const containerStyle = [
        ismmol ? styles.mmolContainer : styles.mgdlContainer,
        disabled && styles.disabledContainer
    ];

    if (ismmol) {
        // mmol/L mode with decimal picker
        return (
            <View style={{ position: 'relative' }}>
                <View style={containerStyle}>
                    <View style={styles.selectionIndicator} />

                    <View style={styles.wholeNumberColumn}>
                        <FlatList
                            data={mmolNumbers}
                            renderItem={({ item }) => renderItem(item, item === mmolNumber)}
                            keyExtractor={item => `w-${item}`}
                            snapToInterval={itemHeight}
                            onMomentumScrollEnd={handleWholeScroll}
                            contentContainerStyle={styles.listContentContainer}
                            getItemLayout={(data, index) => ({
                                length: itemHeight,
                                offset: itemHeight * index,
                                index,
                            })}
                            initialScrollIndex={Math.max(0, mmolNumbers.indexOf(mmolNumber))}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={!disabled}
                        />
                    </View>

                    <View style={styles.decimalSeparator}>
                        <Text style={[styles.decimalPointText, disabled && styles.disabledText]}>.</Text>
                    </View>

                    <View style={styles.decimalColumn}>
                        <FlatList
                            data={mmolDecimals}
                            renderItem={({ item }) => renderItem(item, item === decimal)}
                            keyExtractor={item => `d-${item}`}
                            snapToInterval={itemHeight}
                            onMomentumScrollEnd={handlemmolDecimalScroll}
                            contentContainerStyle={styles.listContentContainer}
                            getItemLayout={(data, index) => ({
                                length: itemHeight,
                                offset: itemHeight * index,
                                index,
                            })}
                            initialScrollIndex={Math.max(0, mmolDecimals.indexOf(decimal))}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={!disabled}
                        />
                    </View>

                    <View style={styles.unitLabelContainer}>
                        <Text
                            variant="labelSmall"
                            style={[styles.unitLabelText, disabled && styles.disabledText]}
                        >
                            mmol/L
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        alignItems: 'center',
                        gap: 8,
                        top: -6,
                        left: 12,
                        backgroundColor: theme.colors.surface,
                        paddingHorizontal: 4,
                        zIndex: 4
                    }}
                >
                    <Icon source={"blood-bag"} size={10} />
                    <Text variant="bodySmall" style={{
                        color: theme.colors.onSurfaceVariant,
                        fontSize: 12,
                        fontWeight: '400',
                    }}>glucose</Text>
                </View>

            </View>
        );
    } else {
        // mg/dL mode with single integer picker
        return (
            <View style={{ position: 'relative' }}>
                <View style={containerStyle}>
                    <View style={styles.selectionIndicator} />

                    <View style={styles.mgdlColumn}>
                        <FlatList
                            data={mgdlNumbers}
                            renderItem={({ item }) => renderItem(item, item === mgdlNumber)}
                            keyExtractor={item => `mg-${item}`}
                            snapToInterval={itemHeight}
                            onMomentumScrollEnd={handleMgdlScroll}
                            contentContainerStyle={styles.listContentContainer}
                            getItemLayout={(data, index) => ({
                                length: itemHeight,
                                offset: itemHeight * index,
                                index,
                            })}
                            initialScrollIndex={Math.max(0, mgdlNumbers.indexOf(mgdlNumber))}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={!disabled}
                        />
                    </View>

                    <View style={styles.unitLabelContainer}>
                        <Text
                            variant="labelSmall"
                            style={[styles.unitLabelText, disabled && styles.disabledText]}
                        >
                            mg/dL
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        alignItems: 'center',
                        gap: 8,
                        top: -6,
                        left: 12,
                        backgroundColor: theme.colors.surface,
                        paddingHorizontal: 4,
                        zIndex: 4
                    }}
                >
                    <Icon source={"blood-bag"} size={10} />
                    <Text variant="bodySmall" style={{
                        color: theme.colors.onSurfaceVariant,
                        fontSize: 12,
                        fontWeight: '400',
                    }}>glucose</Text>
                </View>
            </View>

        );
    }
}

export const createGlucosePickerStyles = (theme: any, height: number, itemHeight: number) =>
    StyleSheet.create({
        // Container styles
        mmolContainer: {
            flexDirection: 'row',
            height,
            backgroundColor: theme.colors.surface,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            marginBottom: 8,
        },

        mgdlContainer: {
            flexDirection: 'row',
            height,
            backgroundColor: theme.colors.surface,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
        },

        // Selection indicator overlay
        selectionIndicator: {
            position: 'absolute',
            top: height / 2 - itemHeight / 2,
            left: 0,
            right: 0,
            height: itemHeight,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.colors.primary + '30',
            backgroundColor: theme.colors.primaryContainer + '15',
            zIndex: 1,
            pointerEvents: 'none',
        },

        // Picker column styles
        wholeNumberColumn: {
            flex: 1,
        },

        decimalColumn: {
            flex: 1,
        },

        mgdlColumn: {
            flex: 2,
        },

        // Decimal point separator
        decimalSeparator: {
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },

        decimalPointText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.onSurface,
        },

        // Unit label styles
        unitLabelContainer: {
            flex: 0.5,
            justifyContent: 'center',
            paddingHorizontal: 4,
        },

        unitLabelText: {
            color: theme.colors.onSecondaryContainer,
            fontWeight: '600',
            textAlign: 'center',
        },

        // FlatList content styles
        listContentContainer: {
            paddingTop: height / 2 - itemHeight / 2,
            paddingBottom: height / 2 - itemHeight / 2,
        },

        // Individual item styles
        itemContainer: {
            height: itemHeight,
            justifyContent: 'center',
            alignItems: 'center',
        },

        selectedItemText: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.primary,
        },

        unselectedItemText: {
            fontSize: 16,
            fontWeight: '400',
            color: theme.colors.onSurface,
        },

        // Disabled state styles
        disabledContainer: {
            opacity: 0.6,
        },

        disabledText: {
            color: theme.colors.onSurface + '60',
        },
    });