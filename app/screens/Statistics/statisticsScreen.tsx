import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Button, SegmentedButtons, Text } from "react-native-paper";
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { StatisticsHeader } from "./components/StatisticsHeader";

interface StatisticsScreenProps {
    navigation: any;
    dbHook: any;
    calendarHook: any;
    appData: AppData;
}

export function StatisticsScreen({ navigation, dbHook, calendarHook, appData }: StatisticsScreenProps) {
    const { styles, theme } = useAppTheme();
    const [glucosePeriod, setGlucosePeriod] = useState(7);
    const [carbsPeriod, setCarbsPeriod] = useState(7);
    const [entriesPeriod, setEntriesPeriod] = useState(7);
    const [selectedMealTypes, setSelectedMealTypes] = useState(['breakfast', 'lunch', 'dinner', 'snack']);
    const [selectedScreen, setSelectedScreen] = useState('glucose');
    // Calculate the max period to show in header
    const selectedPeriod = Math.max(glucosePeriod, carbsPeriod, entriesPeriod);

    // Generate date array
    const generateDateArray = useCallback((days: number) => {
        const array: Date[] = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            array.push(date);
        }
        return array;
    }, []);

    // Process data functions with meal type separation
    const processGlucoseData = useCallback((entries: DiaryData[], days: number) => {
        const daysArray = generateDateArray(days);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

        mealTypes.forEach(mealType => {
            const dataByDate: { [key: string]: number[] } = {};

            entries.forEach((entry) => {
                if (entry.glucose && entry.glucose > 0 && entry.meal_type === mealType) {
                    const date = new Date(entry.created_at).toISOString().split('T')[0];
                    if (!dataByDate[date]) dataByDate[date] = [];
                    dataByDate[date].push(entry.glucose);
                }
            });

            result[mealType] = daysArray.map((day, i) => {
                const dateStr = day.toISOString().split('T')[0];
                const values = dataByDate[dateStr] || [];
                const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
                return { x: i, y: avg, date: dateStr };
            });
        });

        return result;
    }, [generateDateArray]);

    const processCarbsData = useCallback((entries: DiaryData[], days: number) => {
        const daysArray = generateDateArray(days);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

        mealTypes.forEach(mealType => {
            const dataByDate: { [key: string]: number } = {};

            entries.forEach((entry) => {
                if (entry.carbs && entry.carbs > 0 && entry.meal_type === mealType) {
                    const date = new Date(entry.created_at).toISOString().split('T')[0];
                    dataByDate[date] = (dataByDate[date] || 0) + entry.carbs;
                }
            });

            result[mealType] = daysArray.map((day, i) => {
                const dateStr = day.toISOString().split('T')[0];
                return { x: i, y: dataByDate[dateStr] || 0, date: dateStr };
            });
        });

        return result;
    }, [generateDateArray]);

    const processEntriesData = useCallback((entries: DiaryData[], days: number) => {
        const daysArray = generateDateArray(days);
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        const result: { [mealType: string]: { x: number; y: number; date: string }[] } = {};

        mealTypes.forEach(mealType => {
            const countByDate: { [key: string]: number } = {};

            entries.forEach((entry) => {
                if (entry.meal_type === mealType) {
                    const date = new Date(entry.created_at).toISOString().split('T')[0];
                    countByDate[date] = (countByDate[date] || 0) + 1;
                }
            });

            result[mealType] = daysArray.map((day, i) => {
                const dateStr = day.toISOString().split('T')[0];
                return { x: i, y: countByDate[dateStr] || 0, date: dateStr };
            });
        });

        return result;
    }, [generateDateArray]);

    // Multi-line chart component for meal types
    const MealTypeChart = React.memo(({ dataByMeal, title }: {
        dataByMeal: { [mealType: string]: { x: number; y: number; date: string }[] },
        title: string
    }) => {
        const width = 320;
        const height = 220;
        const padding = 40;
        const bottomPadding = 80;

        // Meal type colors
        const mealColors = {
            breakfast: '#ff9500', // Orange
            lunch: '#34c759',     // Green  
            dinner: '#007aff',    // Blue
            snack: '#ff3b30'      // Red
        };

        // Find max Y across all meal types
        const allData = Object.values(dataByMeal).flat();
        const maxY = Math.max(1, Math.max(...allData.map(d => d.y)));
        const dataLength = Object.values(dataByMeal)[0]?.length || 0;

        const xScale = d3Scale.scaleLinear().domain([0, dataLength - 1]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([0, maxY]).range([height - bottomPadding, padding]);

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3Shape.curveCardinal);

        // Generate grid lines and labels
        const gridLines = [0, 1, 2, 3, 4].map(i => {
            const value = (maxY / 4) * i;
            const y = yScale(value);
            return { value, y };
        });

        // Generate date labels - show first, middle, and last dates
        const firstMealData = Object.values(dataByMeal)[0] || [];
        const dateLabels = [0, Math.floor(dataLength / 2), dataLength - 1]
            .filter(i => i < dataLength)
            .map(i => {
                const point = firstMealData[i];
                if (!point) return null;
                const date = new Date(point.date);
                const label = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
                return {
                    x: xScale(i),
                    label: label,
                    index: i
                };
            })
            .filter(Boolean);

        return (
            <View style={{ alignItems: 'center', marginVertical: 8 }}>
                <Svg width={width} height={height}>
                    {/* Grid lines */}
                    {gridLines.map((line, i) => (
                        <Line
                            key={`grid-${i}`}
                            x1={padding}
                            y1={line.y}
                            x2={width - padding}
                            y2={line.y}
                            stroke="#f0f0f0"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Y-axis labels */}
                    {gridLines.map((line, i) => (
                        <SvgText
                            key={`y-label-${i}`}
                            x={padding - 8}
                            y={line.y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#666"
                        >
                            {line.value.toFixed(line.value < 10 ? 1 : 0)}
                        </SvgText>
                    ))}

                    {/* Lines for each meal type */}
                    {Object.entries(dataByMeal).map(([mealType, data]) => {
                        const linePath = lineGenerator(data);
                        const color = mealColors[mealType as keyof typeof mealColors];

                        return (
                            <React.Fragment key={mealType}>
                                {/* Meal line */}
                                <Path
                                    d={linePath || ""}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={2}
                                />

                                {/* Data points for this meal */}
                                {data.map((point, i) => (
                                    <Circle
                                        key={`${mealType}-point-${i}`}
                                        cx={xScale(point.x)}
                                        cy={yScale(point.y)}
                                        r={point.y > 0 ? 3 : 1}
                                        fill={color}
                                    />
                                ))}
                            </React.Fragment>
                        );
                    })}

                    {/* Date labels at bottom */}
                    {dateLabels.map((dateLabel, i) => (
                        <SvgText
                            key={`date-${i}`}
                            x={dateLabel.x}
                            y={height - bottomPadding + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#666"
                        >
                            {dateLabel.label}
                        </SvgText>
                    ))}
                </Svg>

                {/* Legend */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                    {Object.entries(mealColors).map(([mealType, color]) => (
                        <View key={mealType} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 8,
                            marginVertical: 2
                        }}>
                            <View style={{
                                width: 12,
                                height: 2,
                                backgroundColor: color,
                                marginRight: 4
                            }} />
                            <Text variant="bodySmall" style={{ textTransform: 'capitalize' }}>
                                {mealType}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    });

    const PeriodButtons = React.memo(({
        period,
        setPeriod
    }: {
        period: number,
        setPeriod: (p: number) => void
    }) => {
        // Convert number to string for SegmentedButtons
        const periodToString = (p: number): string => p.toString();

        // Convert string back to number when value changes
        const handlePeriodChange = (value: string) => {
            setPeriod(parseInt(value, 10));
        };

        return (
            <View style={[styles.row, { justifyContent: 'center', marginVertical: 8 }]}>
                <SegmentedButtons
                    value={periodToString(period)}
                    onValueChange={handlePeriodChange}
                    buttons={[
                        {
                            value: '7',
                            label: '7 Days',
                            style: { borderRadius: 8 },
                        },
                        {
                            value: '14',
                            label: '14 Days',
                        },
                        {
                            value: '30',
                            label: '30 Days',
                            style: { borderRadius: 8 },
                        },
                    ]}
                />
            </View>
        );
    });

    // Memoized data by meal type
    const glucoseDataByMeal = useMemo(() =>
        processGlucoseData(dbHook.diaryEntries || [], glucosePeriod),
        [dbHook.diaryEntries, glucosePeriod, processGlucoseData]
    );

    const carbsDataByMeal = useMemo(() =>
        processCarbsData(dbHook.diaryEntries || [], carbsPeriod),
        [dbHook.diaryEntries, carbsPeriod, processCarbsData]
    );

    const entriesDataByMeal = useMemo(() =>
        processEntriesData(dbHook.diaryEntries || [], entriesPeriod),
        [dbHook.diaryEntries, entriesPeriod, processEntriesData]
    );

    const renderStats = () => {
        let content;
        if (selectedScreen === 'glucose') {
            content = (
                <>
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="blood-bag" size={20} color={theme.colors.onSecondaryContainer} />
                        <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                            Blood Glucose
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <PeriodButtons period={glucosePeriod} setPeriod={setGlucosePeriod} />
                        <MealTypeChart dataByMeal={glucoseDataByMeal} title="Glucose" />
                    </View>
                    <View style={styles.footer} />
                </>
            );
        } else if (selectedScreen === 'carbs') {
            content = (
                <>
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="food" size={20} color={theme.colors.onSecondaryContainer} />
                        <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                            Carbohydrates
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <PeriodButtons period={carbsPeriod} setPeriod={setCarbsPeriod} />
                        <MealTypeChart dataByMeal={carbsDataByMeal} title="Carbs" />
                    </View>
                    <View style={styles.footer} />
                </>
            );
        } else if (selectedScreen === 'entries') {
            content = (
                <>
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="calendar-check" size={20} color={theme.colors.onSecondaryContainer} />
                        <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                            Diary Entries
                        </Text>
                    </View>
                    <View style={styles.content}>
                        <PeriodButtons period={entriesPeriod} setPeriod={setEntriesPeriod} />
                        <MealTypeChart dataByMeal={entriesDataByMeal} title="Entries" />
                    </View>
                    <View style={styles.footer} />
                </>
            );
        }

        return <View style={styles.box}>{content}</View>;
    }

    return (
        <View style={styles.background}>
            <StatisticsHeader selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen} selectedPeriod={selectedPeriod} selectedMealTypes={selectedMealTypes} />
            <View style={styles.container}>
                {renderStats()}
            </View>
        </View>
    );
}
