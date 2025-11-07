import { useAppTheme } from "@/app/constants/UI/theme";
import { View } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { useGraphs } from "@/app/hooks/useGraphs";
import { ViewSet } from "@/app/components/UI/ViewSet";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";



import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

export function StatisticsScreen({ appData, statsHook }: NavData & HookData) {
    const { styles, theme } = useAppTheme();
    const {
        selectedPeriod,
        setSelectedPeriod,
        medianGlucose,
        summaryStats,
        mealColors,
    } = statsHook;

    // Local state for stats section - show all by default
    const [statsSection, setStatsSection] = useState<'all' | 'summary' | 'carbs' | 'glucose'>('all');

    const gUnit = () => {
        return appData?.settings.glucose === 'mmol' ? ('mmol/L') : ('mg/Dl');
    }

    const periodText = () => {
        return selectedPeriod === 1 ? 'of today' : `of past ${selectedPeriod.toString()} days`
    }

    const summaryRow = (title: string, icon: string, value: string) => {
        const numValue = parseFloat(value);
        const isEmpty = value === '0' || value === '0.0' || !value || numValue === 0 || isNaN(numValue);

        return (
            <ViewSet
                title={title}
                titleSize="titleSmall"
                icon={icon}
                headerBgColor={theme.colors.secondaryContainer}
                headerTextColor={theme.colors.onSecondaryContainer}
                contentBgColor={theme.colors.surfaceVariant}
                iconSize={20}
                content={
                    <Text variant="bodyMedium" style={{ textAlign: isEmpty ? 'center' : 'left', fontWeight: 'bold' }}>
                        {isEmpty ? "---" : value}
                    </Text>
                } />
        );
    }

    const mealBox = (title: string, icon: string, values: string[], backgroundColor: string) => (



        <ViewSet
            title={title}
            icon={icon}
            titleSize={"titleSmall"}
            headerBgColor={backgroundColor}
            headerTextColor={theme.colors.onPrimary}
            iconColor={theme.colors.onPrimary}
            iconSize={20}
            content={
                <View>
                    {values.map((value, index) => (
                        <Text key={index} variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                            {value}
                        </Text>
                    ))}
                </View>
            } />

    )

    const { GlucoseChart, CarbsBarChart } = useGraphs(appData, statsHook);

    const renderStats = () => {
        // Show all sections or specific section based on statsSection
        const showSummary = statsSection === 'summary' || statsSection === 'all';
        const showGlucose = statsSection === 'glucose' || statsSection === 'all';
        const showCarbs = statsSection === 'carbs' || statsSection === 'all';

        return (
            <>
                {showSummary && (
                    <>
                        <ViewSet
                            title={`Summary ${periodText()}`}
                            icon={"chart-pie"}
                            content={
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        {summaryRow(/* title */ "Median Glucose", /* icon */ "water-outline", /* value */ `${medianGlucose.toFixed(1)} ${gUnit()}`)}
                                        {summaryRow(/* title */ "Total Meals", /* icon */ "food-outline", /* value */ summaryStats.totalMeals.toString())}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        {summaryRow(/* title */ "Total Insulin", /* icon */ "needle", /* value */ `${summaryStats.totalInsulin.toFixed(1)} u`)}
                                        {summaryRow(/* title */ "Total Carbs", /* icon */ "bread-slice-outline", /* value */ `${summaryStats.totalCarbs.toFixed(1)} g`)}
                                    </View>
                                </View>
                            } />
                        <ViewSet
                            title="Meal Break Down"
                            icon="food"
                            footer={<></>}
                            content={
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        {mealBox("Breakfast", "food-croissant", [
                                            `Meals: ${summaryStats.carbsByMeal.breakfast || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.breakfast || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.breakfast || 0}g`
                                        ], mealColors.breakfast)}
                                        {mealBox("Lunch", "food-hot-dog", [
                                            `Meals: ${summaryStats.carbsByMeal.lunch || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.lunch || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.lunch || 0}g`
                                        ], mealColors.lunch)}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        {mealBox("Dinner", "food", [
                                            `Meals: ${summaryStats.carbsByMeal.dinner || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.dinner || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.dinner || 0}g`
                                        ], mealColors.dinner)}
                                        {mealBox("Snack", "apple", [
                                            `Meals: ${summaryStats.carbsByMeal.snack || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.snack || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.snack || 0}g`
                                        ], mealColors.snack)}
                                    </View>
                                </View>
                            } />
                    </>
                )}

                {showGlucose && (
                    <ViewSet
                        title="Glucose"
                        icon="water"
                        content={
                            <View style={{ height: 300, width: '100%' }}>
                                <GlucoseChart />
                            </View>
                        }
                    />
                )}

                {showCarbs && (
                    <ViewSet
                        title="Carbohydrates"
                        icon="water"
                        footer={<View />}
                        content={
                            <View style={{ height: 300, width: '100%' }}>
                                <CarbsBarChart />
                            </View>
                        }
                    />
                )}
            </>
        );
    };

    const handlePeriodChange = (value: string) => {
        const period = parseInt(value, 10);
        setSelectedPeriod(period);
    };

    return (
        <View style={styles.background}>
            <SegmentedButtons
                value={selectedPeriod.toString()}
                onValueChange={handlePeriodChange}
                

                buttons={[
                    {

                        value: '1',
                        checkedColor: theme.colors.onPrimary,
                        uncheckedColor: theme.colors.onPrimaryContainer,
                        label: 'Today',
                        style: {
                            backgroundColor: selectedPeriod === 1 ? theme.colors.primary : theme.colors.primaryContainer,
                            borderRadius: 0,
                            borderColor: selectedPeriod === 1 ? theme.colors.customDarkGreen : theme.colors.customDarkTeal,
                        },
                    },
                    {

                        value: '7',
                        checkedColor: theme.colors.onPrimary,
                        uncheckedColor: theme.colors.onPrimaryContainer,
                        label: '7 Days',
                        style: {

                            backgroundColor: selectedPeriod === 7 ? theme.colors.primary : theme.colors.primaryContainer,
                            borderRadius: 0,
                            borderColor: selectedPeriod === 7 ? theme.colors.customDarkGreen : theme.colors.customDarkTeal,


                        },
                    },
                    {

                        value: '14',
                        checkedColor: theme.colors.onPrimary,
                        uncheckedColor: theme.colors.onPrimaryContainer,
                        label: '14 Days',
                        style: {
                            backgroundColor: selectedPeriod === 14 ? theme.colors.primary : theme.colors.primaryContainer,
                            borderRadius: 0,
                            borderColor: selectedPeriod === 14 ? theme.colors.customDarkGreen : theme.colors.customDarkTeal,


                        },
                    },
                    {
                        value: '30',
                        checkedColor: theme.colors.onPrimary,
                        uncheckedColor: theme.colors.onPrimaryContainer,
                        label: '30 Days',
                        style: {

                            backgroundColor: selectedPeriod === 30 ? theme.colors.secondary : theme.colors.primaryContainer,
                            borderRadius: 0,
                            borderColor: selectedPeriod === 30 ? theme.colors.outline : theme.colors.inverseSurface,

                        },
                    },
                ]}
            />
            <ScrollView style={{ flex: 1}}>
                {renderStats()}

            </ScrollView>

        </View>
    );
}