import { useAppTheme } from "@/app/constants/UI/theme";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Divider, Icon, SegmentedButtons, Text } from "react-native-paper";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { useGraphs } from "@/app/hooks/useGraphs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ViewSet } from "@/app/components/UI/ViewSet";



export function StatisticsScreen({ dbHook, appData, calendarHook, statsHook }: NavData & HookData) {
    const { styles, theme } = useAppTheme();
    const {
        selectedPeriod,
        setSelectedPeriod,
        currentSection,
        medianGlucose,
        summaryStats,
        mealColors,
    } = statsHook;

    const gUnit = () => {
        return appData.settings.glucose === 'mmol' ? ('mmol/L') : ('mg/Dl');
    }

    const periodText = () => {
        return selectedPeriod === 1 ? 'of today' : `of past ${selectedPeriod.toString()} days`
    }

    const summaryRow = (title: string, icon: string, value: string) => (
        <View style={{ flexDirection: 'row', backgroundColor: theme.colors.customPink, padding: 8, alignContent: 'center' }}>
            <View style={[styles.row, { flex: 1, alignContent: 'center' }]}>
                <Icon source={icon} size={25} />
                <Text variant="titleMedium" style={{ color: theme.colors.onPrimary }}>
                    {title}
                </Text>
            </View>
            <Text variant="bodyLarge" style={{ color: theme.colors.onPrimary }}>
                {value}
            </Text>
        </View>
    )

    const mealBox = (title: string, icon: string, values: string[], backgroundColor: string) => (
        <View style={{ flex: 1, backgroundColor, padding: 8, alignContent: 'center', marginBottom: 8, }}>
            <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
                <Icon source={icon} size={18} />
                <View>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontSize: 18 }}>{title}</Text>
                    {values.map((value, index) => (
                        <Text key={index} variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                            {value}
                        </Text>
                    ))}
                </View>
            </View>

        </View>
    )

    const { GlucoseChart, CarbsBarChart } = useGraphs(appData, statsHook);

    const renderStats = () => {
        if (currentSection === 'glucose') {
            return (
                <>
                    <View style={{ backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', padding: 16, flexDirection: 'row', gap: 8 }}>
                        <Icon source={"food"} size={32} />
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurfaceVariant }}>Carbs: </Text>
                    </View>
                    <View style={{ minHeight: '40%', backgroundColor: theme.colors.surface }}>
                        <GlucoseChart />
                    </View>
                </>
            );
        } else if (currentSection === 'carbs') {
            return (
                <>
                    <View style={{ backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', padding: 16, flexDirection: 'row', gap: 8 }}>
                        <Icon source={"food"} size={32} />
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurfaceVariant }}>Carbs: </Text>
                    </View>
                    <View style={{ minHeight: '40%', backgroundColor: theme.colors.surface }}>
                        <CarbsBarChart />
                    </View>
                </>

            );
        } else if (currentSection === 'summary') {
            return (

                <>


                    <ViewSet
                        title={`Summary ${periodText()}`}
                        icon={"chart-pie"}
                        content={

                            <View style={{ gap: 8 }}>
                                {summaryRow(/* title */ "Median Glucose", /* icon */ "water-outline", /* value */ `${medianGlucose.toFixed(1)} ${gUnit()}`)}
                                {summaryRow(/* title */ "Total Meals", /* icon */ "food-outline", /* value */ summaryStats.totalMeals.toString())}
                                {summaryRow(/* title */ "Total Insulin", /* icon */ "needle", /* value */ `${summaryStats.totalInsulin.toFixed(1)}u`)}
                                {summaryRow(/* title */ "Total Carbs", /* icon */ "bread-slice-outline", /* value */ `${summaryStats.totalCarbs.toFixed(1)}g`)}
                            </View>




                        } />
                    <ViewSet
                        title="Meal Break Down"
                        icon="food"
                        content={

                            <>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {mealBox(
                                        /* Title */ "Breakfast",
                                        /* Icon */ "food-croissant",
                                        /* Values */[
                                            `Meals: ${summaryStats.carbsByMeal.breakfast || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.breakfast || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.breakfast || 0}g`
                                        ],
                                        /* Background */ mealColors.breakfast
                                    )}

                                    {mealBox(
                                        /* Title */ "Lunch",
                                        /* Icon */ "food-hot-dog",
                                        /* Values */[
                                            `Meals: ${summaryStats.carbsByMeal.lunch || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.lunch || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.lunch || 0}g`
                                        ],
                                        /* Background */ mealColors.lunch
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {mealBox(
                                        /* Title */ "Dinner",
                                        /* Icon */ "food",
                                        /* Values */[
                                            `Meals: ${summaryStats.carbsByMeal.dinner || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.dinner || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.dinner || 0}g`
                                        ],
                                        /* Background */ mealColors.dinner
                                    )}

                                    {mealBox(
                                        /* Title */ "Snack",
                                        /* Icon */ "apple",
                                        /* Values */[
                                            `Meals: ${summaryStats.carbsByMeal.snack || 0}`,
                                            `Insulin: ${summaryStats.insulinByMeal.snack || 0}u`,
                                            `Carbs: ${summaryStats.carbsByMeal.snack || 0}g`
                                        ],
                                        /* Background */ mealColors.snack
                                    )}
                                </View>

                            </>
                        } />






                    {/* <View style={{ backgroundColor: theme.colors.surface, padding: 8 }}>
                       
                        
                            <MealTypeChip
                                mealType="breakfast"
                                carbs={summaryStats.carbsByMeal.breakfast}
                                insulin={summaryStats.insulinByMeal.breakfast}
                            />
                            <MealTypeChip
                                mealType="lunch"
                                carbs={summaryStats.carbsByMeal.lunch}
                                insulin={summaryStats.insulinByMeal.lunch}
                            />
                        </ChipRow>

                        <ChipRow>
                            <MealTypeChip
                                mealType="dinner"
                                carbs={summaryStats.carbsByMeal.dinner}
                                insulin={summaryStats.insulinByMeal.dinner}
                            />
                            <MealTypeChip
                                mealType="snack"
                                carbs={summaryStats.carbsByMeal.snack}
                                insulin={summaryStats.insulinByMeal.snack}
                            />
                        </ChipRow>

                        <Text variant="bodySmall" style={{
                            marginTop: 8,
                            color: theme.colors.onSurfaceVariant,
                            textAlign: 'center'
                        }}>
                            Summary over {selectedPeriod} {selectedPeriod === 1 ? 'day' : 'days'}
                        </Text>
                    </View> */}
                </>
            );
        }
    };

    const handlePeriodChange = (value: string) => {
        const period = parseInt(value, 10);
        setSelectedPeriod(period);
    };

    return (
        <View style={styles.background}>

            <View>
                {renderStats()}
            </View>

            <SegmentedButtons
                value={selectedPeriod.toString()}
                style={{ backgroundColor: theme.colors.surface, elevation: 4 }}
                onValueChange={handlePeriodChange}
                buttons={[
                    {
                        disabled: selectedPeriod === 1 ? true : false,
                        value: '1',
                        label: 'Today',
                        style: {
                            borderBottomLeftRadius: 8,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderTopWidth: selectedPeriod === 1 ? 0 : 1,
                            elevation: selectedPeriod === 1 ? 4 : 0
                        },
                    },
                    {
                        disabled: selectedPeriod === 7 ? true : false,
                        value: '7',
                        label: '7 Days',
                        style: {

                            borderRadius: 0,
                            borderTopWidth: selectedPeriod === 7 ? 0 : 1,
                            elevation: selectedPeriod === 7 ? 4 : 0
                        },
                    },
                    {
                        disabled: selectedPeriod === 14 ? true : false,
                        value: '14',
                        label: '14 Days',
                        style: {
                            borderRadius: 0,
                            borderTopWidth: selectedPeriod === 14 ? 0 : 1,
                            elevation: selectedPeriod === 14 ? 4 : 0
                        },
                    },
                    {
                        disabled: selectedPeriod === 30 ? true : false,
                        value: '30',
                        label: '30 Days',
                        style: {
                            borderBottomLeftRadius: 0,
                            borderTopLeftRadius: 0,
                            borderBottomRightRadius: 8,
                            borderTopRightRadius: 0,
                            borderTopWidth: selectedPeriod === 30 ? 0 : 1,
                            elevation: selectedPeriod === 30 ? 4 : 0
                        },
                    },
                ]}
            />
        </View>
    );
}