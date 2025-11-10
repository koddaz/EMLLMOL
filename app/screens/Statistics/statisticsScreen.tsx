import { useAppTheme } from "@/app/constants/UI/theme";
import { View, StyleSheet } from "react-native";
import { Button, Text, Card, Icon, Surface } from "react-native-paper";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { useGraphs } from "@/app/hooks/useGraphs";
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
            <Card 
                mode="elevated" 
                elevation={2}
                style={{ marginVertical: 0, marginBottom: 8 }}
            >
                <Card.Content style={{ paddingVertical: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Icon source={icon} size={20} color={theme.colors.primary} />
                        <Text variant="titleSmall" style={{ flex: 1 }}>
                            {title}
                        </Text>
                    </View>
                    <Text variant="bodyMedium" style={{ textAlign: isEmpty ? 'center' : 'left', fontWeight: 'bold' }}>
                        {isEmpty ? "---" : value}
                    </Text>
                </Card.Content>
            </Card>
        );
    }

    const mealBox = (title: string, icon: string, values: string[], backgroundColor: string) => (
        <Card 
            mode="elevated" 
            elevation={2}
            style={{ marginVertical: 0, marginBottom: 8, backgroundColor: backgroundColor }}
        >
            <Card.Content style={{ paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon source={icon} size={20} color={theme.colors.onPrimary} />
                    <Text variant="titleSmall" style={{ color: theme.colors.onPrimary, flex: 1 }}>
                        {title}
                    </Text>
                </View>
                <View>
                    {values.map((value, index) => (
                        <Text key={index} variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                            {value}
                        </Text>
                    ))}
                </View>
            </Card.Content>
        </Card>
    )

    const { GlucoseChart, CarbsBarChart } = useGraphs(appData, statsHook);

    const localStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        buttonsContainer: {
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
        },
        contentContainer: {
            paddingHorizontal: 16,
            gap: 16,
        },
    });

    const renderStats = () => {
        // Show all sections or specific section based on statsSection
        const showSummary = statsSection === 'summary' || statsSection === 'all';
        const showGlucose = statsSection === 'glucose' || statsSection === 'all';
        const showCarbs = statsSection === 'carbs' || statsSection === 'all';

        return (
            <View style={localStyles.contentContainer}>
                {showSummary && (
                    <>
                        <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                            <Card.Title 
                                title={`Summary ${periodText()}`}
                                left={(props) => <Icon {...props} source="chart-pie" size={24} color={theme.colors.primary} />}
                            />
                            <Card.Content>
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
                            </Card.Content>
                        </Card>
                        <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                            <Card.Title 
                                title="Meal Break Down"
                                left={(props) => <Icon {...props} source="food" size={24} color={theme.colors.primary} />}
                            />
                            <Card.Content>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <View style={{ flex: 1 }}>
                                        {mealBox("Breakfast", "food-croissant", [
                                            `Meals: ${summaryStats.mealCount?.breakfast || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal?.breakfast || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal?.breakfast || 0}g`
                                        ], mealColors.breakfast)}
                                        {mealBox("Lunch", "food-hot-dog", [
                                            `Meals: ${summaryStats.mealCount?.lunch || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal?.lunch || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal?.lunch || 0}g`
                                        ], mealColors.lunch)}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        {mealBox("Dinner", "food", [
                                            `Meals: ${summaryStats.mealType?.dinner || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal?.dinner || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal?.dinner || 0}g`
                                        ], mealColors.dinner)}
                                        {mealBox("Snack", "apple", [
                                            `Meals: ${summaryStats.mealType?.snack || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal?.snack || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal?.snack || 0}g`
                                        ], mealColors.snack)}
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </>
                )}

                {showGlucose && (
                    <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                        <Card.Title 
                            title="Glucose"
                            left={(props) => <Icon {...props} source="water" size={24} color={theme.colors.primary} />}
                        />
                        <Card.Content>
                            <View style={{ height: 300, width: '100%' }}>
                                <GlucoseChart />
                            </View>
                        </Card.Content>
                    </Card>
                )}

                {showCarbs && (
                    <Card mode="elevated" elevation={2} style={{ marginVertical: 0 }}>
                        <Card.Title 
                            title="Carbohydrates"
                            left={(props) => <Icon {...props} source="water" size={24} color={theme.colors.primary} />}
                        />
                        <Card.Content>
                            <View style={{ height: 300, width: '100%' }}>
                                <CarbsBarChart />
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </View>
        );
    };

    const handlePeriodChange = (value: string) => {
        const period = parseInt(value, 10);
        setSelectedPeriod(period);
    };

    return (
        <View style={localStyles.container}>
            {/* Title Section */}
            <Surface style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 }} elevation={0}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flex: 1 }}>
                        <Text variant="headlineMedium" style={{
                            color: theme.colors.onBackground,
                            fontWeight: '700',
                            marginBottom: 4,
                        }}>
                            Statistics
                        </Text>
                        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
                            Track your glucose trends over time
                        </Text>
                    </View>
                    <Surface style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primaryContainer, justifyContent: 'center', alignItems: 'center', elevation: 2 }} elevation={2}>
                        <Icon source="heart-pulse" size={28} color={theme.colors.primary} />
                    </Surface>
                </View>

                {/* Period Selection Buttons */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Button
                        mode={selectedPeriod === 1 ? "contained" : "outlined"}
                        onPress={() => handlePeriodChange('1')}
                        style={{ flex: 1, borderRadius: 8 }}
                        buttonColor={selectedPeriod === 1 ? theme.colors.secondary : 'transparent'}
                        textColor={selectedPeriod === 1 ? theme.colors.onSecondary : theme.colors.onSurface}
                    >
                        Today
                    </Button>
                    <Button
                        mode={selectedPeriod === 7 ? "contained" : "outlined"}
                        onPress={() => handlePeriodChange('7')}
                        style={{ flex: 1, borderRadius: 8 }}
                        buttonColor={selectedPeriod === 7 ? theme.colors.secondary : 'transparent'}
                        textColor={selectedPeriod === 7 ? theme.colors.onSecondary : theme.colors.onSurface}
                    >
                        7 Days
                    </Button>
                    <Button
                        mode={selectedPeriod === 14 ? "contained" : "outlined"}
                        onPress={() => handlePeriodChange('14')}
                        style={{ flex: 1, borderRadius: 8 }}
                        buttonColor={selectedPeriod === 14 ? theme.colors.secondary : 'transparent'}
                        textColor={selectedPeriod === 14 ? theme.colors.onSecondary : theme.colors.onSurface}
                    >
                        14 Days
                    </Button>
                    <Button
                        mode={selectedPeriod === 30 ? "contained" : "outlined"}
                        onPress={() => handlePeriodChange('30')}
                        style={{ flex: 1, borderRadius: 8 }}
                        buttonColor={selectedPeriod === 30 ? theme.colors.secondary : 'transparent'}
                        textColor={selectedPeriod === 30 ? theme.colors.onSecondary : theme.colors.onSurface}
                    >
                        30 Days
                    </Button>
                </View>
            </Surface>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {renderStats()}
            </ScrollView>
        </View>
    );
}