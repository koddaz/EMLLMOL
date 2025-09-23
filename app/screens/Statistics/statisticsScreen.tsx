import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useStatistics } from "@/app/hooks/useStatistics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Divider, SegmentedButtons, Text } from "react-native-paper";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { StatisticsTopContainer } from "@/app/components/topContainer";


interface StatisticsScreenProps {
    tabNav: any;
    dbHook: any;
    calendarHook: any;
    appData: AppData;
}

export function StatisticsScreen({ tabNav, dbHook, appData }: StatisticsScreenProps) {
    const { styles, theme } = useAppTheme();
    const { width: screenWidth } = useWindowDimensions();
    const {
        glucosePeriod,
        setGlucosePeriod,
        carbsPeriod,
        setCarbsPeriod,
        currentSection,
        setCurrentSection,
        selectedPeriod,
        medianGlucose,
        summaryStats,
        mealColors,
        glucoseChartData,
        carbsDataByMeal,
    } = useStatistics(dbHook.diaryEntries || []);

    // Simple glucose chart component
    const GlucoseChart = React.memo(({ data, period }: {
        data: { x: number; y: number; date: string; hasData?: boolean }[];
        period: number;
    }) => {
        const width = screenWidth - 32; // Account for margins
        const height = 220;
        const padding = 40;
        const bottomPadding = 80;

        const maxY = Math.max(1, Math.max(...data.map(d => d.y)));
        const dataLength = data.length;

        const xScale = d3Scale.scaleLinear().domain([0, dataLength - 1]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([0, maxY]).range([height - bottomPadding, padding]);

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3Shape.curveCardinal);

        const linePath = lineGenerator(data.filter(d => d.y > 0));

        // Generate grid lines
        const gridLines = [0, 1, 2, 3, 4].map(i => {
            const value = (maxY / 4) * i;
            const y = yScale(value);
            return { value, y };
        });

        // Generate labels based on period
        let labels: { x: number; label: string; index: number }[] = [];

        if (period === 1) {
            // Hourly labels for 1-day view
            labels = [0, 6, 12, 18, 23]
                .filter(i => i < dataLength)
                .map(i => ({
                    x: xScale(i),
                    label: `${i}:00`,
                    index: i
                }));
        } else {
            // Date labels for multi-day view
            labels = [0, Math.floor(dataLength / 2), dataLength - 1]
                .filter(i => i < dataLength)
                .map(i => {
                    const point = data[i];
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
                .filter(Boolean) as { x: number; label: string; index: number }[];
        }

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

                    {/* Glucose line */}
                    <Path
                        d={linePath || ""}
                        fill="none"
                        stroke={theme.colors.primary}
                        strokeWidth={3}
                    />

                    {/* Data points */}
                    {data.map((point, i) => (
                        <Circle
                            key={`point-${i}`}
                            cx={xScale(point.x)}
                            cy={yScale(point.y)}
                            r={point.y > 0 ? 4 : 1}
                            fill={point.y > 0 ? theme.colors.primary : 'transparent'}
                        />
                    ))}

                    {/* Value labels for points with data (only for 1-day view) */}
                    {period === 1 && data.filter(d => d.y > 0).map((point, i) => (
                        <SvgText
                            key={`value-${point.x}`}
                            x={xScale(point.x)}
                            y={yScale(point.y) - 10}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill={theme.colors.primary}
                        >
                            {point.y.toFixed(1)}
                        </SvgText>
                    ))}

                    {/* Time/Date labels */}
                    {labels.map((label, i) => (
                        <SvgText
                            key={`label-${i}`}
                            x={label.x}
                            y={height - bottomPadding + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#666"
                        >
                            {label.label}
                        </SvgText>
                    ))}
                </Svg>
            </View>
        );
    });

    // Bar chart component for carbs by meal type
    const CarbsBarChart = React.memo(({ data, period }: {
        data: { [mealType: string]: { x: number; y: number; date: string }[] },
        period: number
    }) => {
        const width = screenWidth - 32;
        const height = 220;
        const padding = 40;
        const bottomPadding = 80;

        // Calculate total carbs per meal type for the period
        const mealTotals = Object.entries(data).map(([mealType, entries]) => ({
            mealType,
            total: entries.reduce((sum, entry) => sum + entry.y, 0),
            color: mealColors[mealType as keyof typeof mealColors]
        })).filter(item => item.total > 0);

        if (mealTotals.length === 0) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
                    <Text>No carbs data available</Text>
                </View>
            );
        }

        const maxTotal = Math.max(...mealTotals.map(item => item.total));
        const barWidth = (width - padding * 2) / mealTotals.length * 0.8;
        const barSpacing = (width - padding * 2) / mealTotals.length * 0.2;

        const yScale = d3Scale.scaleLinear().domain([0, maxTotal]).range([height - bottomPadding, padding]);

        // Generate grid lines
        const gridLines = [0, 1, 2, 3, 4].map(i => {
            const value = (maxTotal / 4) * i;
            const y = yScale(value);
            return { value, y };
        });

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
                            {line.value.toFixed(0)}g
                        </SvgText>
                    ))}

                    {/* Bars */}
                    {mealTotals.map((item, i) => {
                        const barHeight = (height - bottomPadding) - yScale(item.total);
                        const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;

                        return (
                            <React.Fragment key={item.mealType}>
                                {/* Bar */}
                                <Rect
                                    x={x}
                                    y={yScale(item.total)}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={item.color}
                                    rx={4}
                                />

                                {/* Value label on top of bar */}
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={yScale(item.total) - 8}
                                    textAnchor="middle"
                                    fontSize="12"
                                    fontWeight="bold"
                                    fill="#333"
                                >
                                    {item.total.toFixed(0)}g
                                </SvgText>

                                {/* Meal type label */}
                                <SvgText
                                    x={x + barWidth / 2}
                                    y={height - bottomPadding + 20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#666"
                                    //style={{ textTransform: 'capitalize' }}
                                >
                                    {item.mealType}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>

                {/* Period indicator */}
                <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                    Total carbs over {period} {period === 1 ? 'day' : 'days'}
                </Text>
            </View>
        );
    });

    // Summary stats component with chips
    const SummaryStats = React.memo(() => {
        const ChipRow = ({ children }: { children: React.ReactNode }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                {children}
            </View>
        );

        const StatChip = ({ icon, label, value, color }: {
            icon: string;
            label: string;
            value: string;
            color?: string;
        }) => (
            <View style={{
                flex: 1,
                marginHorizontal: 2,
                padding: 8,
                backgroundColor: color || theme.colors.primaryContainer,
                borderRadius: 8,
                alignItems: 'center'
            }}>
                <MaterialCommunityIcons
                    name={icon as any}
                    size={16}
                    color={theme.colors.onPrimaryContainer}
                />
                <Text variant="bodySmall" style={{
                    color: theme.colors.onPrimaryContainer,
                    marginTop: 2,
                    fontSize: 10,
                    textAlign: 'center'
                }}>
                    {label}
                </Text>
                <Text variant="labelMedium" style={{
                    color: theme.colors.onPrimaryContainer,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {value}
                </Text>
            </View>
        );

        const MealTypeChip = ({ mealType, carbs, insulin }: {
            mealType: string;
            carbs: number;
            insulin: number;
        }) => (
            <View style={{
                flex: 1,
                marginHorizontal: 2,
                padding: 8,
                backgroundColor: mealColors[mealType as keyof typeof mealColors] + '20',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: mealColors[mealType as keyof typeof mealColors],
                alignItems: 'center'
            }}>
                <Text variant="bodySmall" style={{
                    color: mealColors[mealType as keyof typeof mealColors],
                    marginBottom: 4,
                    fontSize: 10,
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                }}>
                    {mealType}
                </Text>
                <Text variant="bodySmall" style={{
                    color: mealColors[mealType as keyof typeof mealColors],
                    fontSize: 9
                }}>
                    {carbs.toFixed(0)}g carbs
                </Text>
                <Text variant="bodySmall" style={{
                    color: mealColors[mealType as keyof typeof mealColors],
                    fontSize: 9
                }}>
                    {insulin.toFixed(1)}u insulin
                </Text>
            </View>
        );

        return (
            <View style={{ padding: 8 }}>
                {/* Main stats row */}
                <ChipRow>
                    <StatChip
                        icon="blood-bag"
                        label="Median Glucose"
                        value={`${medianGlucose.toFixed(1)} ${appData.settings.glucose}`}
                    />
                    <StatChip
                        icon="silverware"
                        label="Total Meals"
                        value={summaryStats.totalMeals.toString()}
                    />
                </ChipRow>

                <ChipRow>
                    <StatChip
                        icon="food"
                        label="Total Carbs"
                        value={`${summaryStats.totalCarbs.toFixed(0)}g`}
                    />
                    <StatChip
                        icon="needle"
                        label="Total Insulin"
                        value={`${summaryStats.totalInsulin.toFixed(1)}u`}
                    />
                </ChipRow>

                {/* Meal breakdown */}
                <Text variant="labelMedium" style={{
                    marginTop: 12,
                    marginBottom: 8,
                    color: theme.colors.onSurface,
                    textAlign: 'center'
                }}>
                    Breakdown by Meal Type
                </Text>

                <ChipRow>
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
            <View style={[styles.row, { justifyContent: 'center' }]}>
                <SegmentedButtons
                    value={periodToString(period)}
                    onValueChange={handlePeriodChange}
                    buttons={[
                        {
                            value: currentSection === 'carbs' || 'summary' ? '1' : '7',
                            label: currentSection === 'carbs' || 'summary' ? 'today' : '7 days',
                            style: { borderRadius: 0 },
                        },
                        {
                            value: currentSection === 'carbs' || 'summary' ? '7' : '14',
                            label: currentSection === 'carbs' || 'summary' ? '7 days' : '14 days',
                        },
                        {
                            value: currentSection === 'carbs' || 'summary' ? '14' : '30',
                            label: currentSection === 'carbs' || 'summary' ? '14 days' : '30 days',
                            style: { borderRadius: 0 },
                        },
                    ]}
                />
            </View>
        );
    });

    const renderStats = () => {
        let content;
        if (currentSection === 'glucose') {
            content = (
                <>
                    <View style={styles.content}>
                        <GlucoseChart data={glucoseChartData} period={glucosePeriod} />
                    </View>
                    <View style={styles.footer}>
                        <PeriodButtons period={glucosePeriod} setPeriod={setGlucosePeriod} />
                    </View>
                </>
            );
        } else if (currentSection === 'carbs') {
            content = (
                <>
                    <View style={styles.content}>
                        <CarbsBarChart data={carbsDataByMeal} period={carbsPeriod} />
                    </View>
                    <View style={styles.footer}>
                        <PeriodButtons period={carbsPeriod} setPeriod={setCarbsPeriod} />
                    </View>
                </>
            );
        } else if (currentSection === 'summary') {
            content = (
                <>
                    <View style={styles.content}>
                        <SummaryStats />
                        <PeriodButtons period={carbsPeriod} setPeriod={setCarbsPeriod} />
                    </View>
                </>
            );
        }

        return <View style={styles.box}>{content}</View>;
    }

    return (
        <View style={styles.background}>

            <SegmentedButtons
                value={currentSection}
                onValueChange={setCurrentSection}
                density="regular"
                buttons={[
                    {

                        value: 'summary',
                        label: 'Summary',
                        icon: "chart-pie",
                        checkedColor: theme.colors.onSurfaceDisabled,
                        uncheckedColor: theme.colors.primary,
                        style: {
                            borderTopWidth: 0,
                            borderRadius: 0,
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            backgroundColor: currentSection === 'summary' ? theme.colors.surfaceDisabled : theme.colors.surface,
                            elevation: currentSection === 'summary' ? 0 : 4
                        }
                    },
                    {
                        value: 'carbs',
                        label: 'Carbs',
                        icon: "food",
                        checkedColor: theme.colors.onSurfaceDisabled,
                        uncheckedColor: theme.colors.primary,
                        style: {
                            borderTopWidth: 0,
                            borderRadius: 0,
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            backgroundColor: currentSection === 'carbs' ? theme.colors.surfaceDisabled : theme.colors.surface,
                            elevation: currentSection === 'carbs' ? 0 : 4
                        }
                    },
                    {
                        value: 'glucose',
                        label: 'Glucose',
                        icon: "blood-bag",
                        checkedColor: theme.colors.onSurfaceDisabled,
                        uncheckedColor: theme.colors.primary,
                        style: {
                            borderTopWidth: 0,
                            borderRadius: 0,
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            backgroundColor: currentSection === 'glucose' ? theme.colors.surfaceDisabled : theme.colors.surface,
                            elevation: currentSection === 'glucose' ? 0 : 4
                        }
                    },

                ]}
            />

            <Divider style={{ marginTop: 2, marginBottom: 8, marginHorizontal: 8 }} />
            <View style={styles.container}>
                {renderStats()}
            </View>



        </View>
    );
}
