import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/app/constants/UI/theme';

export function useGraphs(appData: any, statsHook: any) {
    const { theme } = useAppTheme();
    const {
        selectedPeriod,
        medianGlucose,
        summaryStats,
        mealColors,
        glucoseChartData,
        carbsDataByMeal,
    } = statsHook;

    // Glucose Chart Component
    const GlucoseChart = React.memo(() => {
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
        const padding = 40;
        const bottomPadding = 80;

        const onLayout = (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setDimensions({ width, height });
        };

        if (dimensions.width === 0 || dimensions.height === 0) {
            return (
                <View style={{ flex: 1 }} onLayout={onLayout} />
            );
        }

        const { width, height } = dimensions;

        const data = glucoseChartData;
        const maxY = Math.max(1, Math.max(...data.map((d: any) => d.y)));
        const dataLength = data.length;

        const xScale = d3Scale.scaleLinear().domain([0, dataLength - 1]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([0, maxY]).range([height - bottomPadding, padding]);

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3Shape.curveCardinal);

        const linePath = lineGenerator(data.filter((d: any) => d.y > 0));

        // Generate grid lines
        const gridLines = [0, 1, 2, 3, 4].map(i => {
            const value = (maxY / 4) * i;
            const y = yScale(value);
            return { value, y };
        });

        // Generate labels based on period
        let labels: { x: number; label: string; index: number }[] = [];

        if (selectedPeriod === 1) {
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

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onLayout={onLayout}>
                <View style={{ flex: 1 }}>
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
                        {data.map((point: any, i: number) => (
                            <Circle
                                key={`point-${i}`}
                                cx={xScale(point.x)}
                                cy={yScale(point.y)}
                                r={point.y > 0 ? 4 : 1}
                                fill={point.y > 0 ? theme.colors.primary : 'transparent'}
                            />
                        ))}

                        {/* Value labels for points with data (only for 1-day view) */}
                        {selectedPeriod === 1 && data.filter((d: any) => d.y > 0).map((point: any, i: number) => (
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
                <View>
                    {/* Period indicator */}
                    <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                        Glucose levels over {selectedPeriod} {selectedPeriod === 1 ? 'day' : 'days'}
                    </Text>
                </View>
            </View>



        );
    });

    // Carbs Bar Chart Component
    const CarbsBarChart = React.memo(() => {
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
        const padding = 40;
        const bottomPadding = 80;

        const onLayout = (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setDimensions({ width, height });
        };

        if (dimensions.width === 0 || dimensions.height === 0) {
            return (
                <View style={{ flex: 1 }} onLayout={onLayout} />
            );
        }

        const { width, height } = dimensions;

        const data = carbsDataByMeal;

        // Calculate total carbs per meal type for the period
        const mealTotals = Object.entries(data).map(([mealType, entries]: [string, any]) => ({
            mealType,
            total: entries.reduce((sum: number, entry: any) => sum + entry.y, 0),
            color: mealColors[mealType as keyof typeof mealColors]
        })).filter(item => item.total > 0);

        if (mealTotals.length === 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={onLayout}>
                <View style={{ flex: 1 }}>
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
                                    >
                                        {item.mealType}
                                    </SvgText>
                                </React.Fragment>
                            );
                        })}
                    </Svg>



                </View>
                <View>
                    {/* Period indicator */}
                    <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
                        Total carbs over {selectedPeriod} {selectedPeriod === 1 ? 'day' : 'days'}
                    </Text>
                </View>
            </View >
        );
    });

    // Summary Stats Component
    const SummaryStats = React.memo(() => {
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

        const onLayout = (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setDimensions({ width, height });
        };

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
            <View style={{ flex: 1, padding: 8 }} >
                <View style={{ flex: 1 }}>
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
            </View>
        );
    });

    return {
        GlucoseChart,
        CarbsBarChart
    };
}