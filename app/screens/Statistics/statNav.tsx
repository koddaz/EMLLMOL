import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import React from "react";
import * as d3Shape from "d3-shape";
import * as d3Scale from "d3-scale";
import { useEffect, useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import Svg, { Line, Path, G, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { add } from 'date-fns';
import { MaterialIcons } from "@expo/vector-icons";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useDB } from "@/app/hooks/useDB";

const chipButton = (text: string, onPress: () => void) => {
    return (
        <View style={{
            backgroundColor: '#e0e0e0',
            padding: 8,
            borderRadius: 16,
            margin: 4,
            alignItems: 'center',
            justifyContent: 'center'
        }} onTouchEnd={onPress}>
            <Text style={{ color: '#000' }}>{text}</Text>
        </View>
    );
}

export default function StatNav(
    { navigation, dbHook, calendarHook, appData }: { navigation: any, dbHook: any, calendarHook: any, appData: AppData }
) {
    const { styles, theme } = useAppTheme();

    return (
        <View style={styles.background}>
            <StatisticsScreen navigation={navigation} dbHook={dbHook} calendarHook={calendarHook} appData={appData} />
        </View>
    );
}

export function StatisticsScreen({ navigation, dbHook }: {
    navigation: any,
    dbHook: any,
    calendarHook: any,
    appData: AppData
}) {
    const { styles, theme } = useAppTheme();
    const { LineChart, setTimeArray, setDaysArray, generateDateArray, days, time, daysArray } = useStats(dbHook);

    

    useEffect(() => {
        setDaysArray(generateDateArray(days, 'days'));
        setTimeArray(generateDateArray(time, 'hours'));
    }, [days, time]);

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <MaterialIcons name="bar-chart" size={30} color={theme.colors.onPrimaryContainer} />
                    <Text style={{ fontSize: 18, marginBottom: 20 }}>
                        {daysArray.length > 0
                            ? `Diary Entries Per Day (Last ${days} Days)` : "No entries found"}
                    </Text>
                </View>

                <View style={styles.weekdayRow}>
                    {chipButton("7 Days", () => {
                        generateDateArray(7, 'days');
                    })}
                    {chipButton("14 Days", () => {
                        generateDateArray(14, 'days');
                    })}
                </View>

                <View style={[styles.container, { flex: 1 }]}>
                    <LineChart daysArray={daysArray} />
                </View>


            </View>


        </View>
    );
}

export function useStats(dbHook: any) {
    const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 200 });

    const [daysArray, setDaysArray] = useState([new Date()]);
    const [timeArray, setTimeArray] = useState([new Date()]);
    const [days, setDays] = useState(7);
    const [time, setTime] = useState(12);

    const generateDateArray = (count: number, unit: 'days' | 'hours') => {
        if (unit === 'days') {
            setDays(count);
        } else {
            setTime(count);
        }

        const array: Date[] = [];
        const now = new Date();

        for (let i = count - 1; i >= 0; i--) {
            if (unit === 'days') {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                array.push(date);
            } else {
                const date = new Date(now);
                date.setHours(date.getHours() - i);
                array.push(date);
            }
        }

        return array;
    };

    const getEntriesCountByDate = (entries: DiaryData[]) => {
        const countByDate: { [key: string]: number } = {};
        entries.forEach((entry) => {
            const date = new Date(entry.created_at).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
            countByDate[date] = (countByDate[date] || 0) + 1;
        });
        return countByDate;
    };

    // Chart component
    const LineChart = ({ daysArray }: { daysArray: Date[] }) => {
        const containerRef = useRef<View>(null);
        const { styles, theme } = useAppTheme();

        // Handle container layout to get actual dimensions
        const onLayout = (event: any) => {
            const { width, height } = event.nativeEvent.layout;
            setContainerDimensions({ width: width || 300, height: height || 200 });
        };

        // Dynamic chart dimensions based on container
        const width = containerDimensions.width;
        const height = containerDimensions.height;
        const padding = 20;
        const bottomPadding = 40; // Extra space for date labels
        
        // Create the data array for the chart
        const countByDate = getEntriesCountByDate(dbHook.diaryEntries);

        const data = daysArray.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            return {
                x: i,
                y: countByDate[dateStr] || 0, // Use 0 if no entries for that date
                date: dateStr,
            };
        });

        // Calculate max Y value for better scaling
        const maxY = 25; // Minimum 1 to avoid flat line

        // Scales
        const xScale = d3Scale
            .scaleLinear()
            .domain([0, data.length - 1])
            .range([padding, width - padding]);

        const yScale = d3Scale
            .scaleLinear()
            .domain([0, maxY])
            .range([height - bottomPadding, padding]);

        // Line generator
        const lineGenerator = d3Shape
            .line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3Shape.curveMonotoneX); // Better curve for time series data

        const linePath = lineGenerator(data);

        return (
            <View
                ref={containerRef}
                style={{ flex: 1, minHeight: 150 }}
                onLayout={onLayout}
            >
                <Svg width={width} height={height}>
                    {/* Grid lines */}
                    {[...Array(5)].map((_, i) => {
                        const y = padding + (height - bottomPadding - padding) * i / 4;
                        return (
                            <Line
                                key={i}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#f0f0f0"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Main line */}
                    <Path
                        d={linePath || ""}
                        fill="none"
                        stroke={theme.colors.primary}
                        strokeWidth={2}
                    />

                    {/* Data points */}
                    {data.map((point, i) => (
                        <Circle
                            key={i}
                            cx={xScale(point.x)}
                            cy={yScale(point.y)}
                            r={3}
                            fill={theme.colors.tertiary}
                        />
                    ))}

                    {/* Y-axis labels */}
                    {[...Array(6)].map((_, i) => {
                        const value = (maxY / 5) * i;
                        const y = yScale(value);
                        return (
                            <SvgText
                                key={`y-label-${i}`}
                                x={padding - 5}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="10"
                                fill="#999"
                            >
                                {Math.round(value)}
                            </SvgText>
                        );
                    })}


                    {/* Date labels */}
                    {data.map((point, i) => {
                        const day = daysArray[i];
                        const dayNumber = day.toLocaleDateString('en-US', { day: 'numeric' });
                        const labelX = xScale(point.x);
                        const labelY = height - bottomPadding + 20;
                        const rectWidth = 28; // adjust as needed
                        const rectHeight = 18; // adjust as needed
                        const rectColor = theme.colors.secondaryContainer; // or any color you want

                        return (
                            <React.Fragment key={`label-${i}`}>
                                <Rect
                                    x={labelX - rectWidth / 2}
                                    y={labelY - rectHeight / 2}
                                    width={rectWidth}
                                    height={rectHeight}
                                    fill={rectColor}
                                    rx={4} // rounded corners
                                />
                                <SvgText
                                    x={labelX}
                                    y={labelY + 4} // +4 to vertically center text, adjust as needed
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill={theme.colors.onSecondaryContainer} // or any color you want
                                >
                                    {dayNumber}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>
            </View>
        );
    };

    return { 
        LineChart,
        generateDateArray,
        setDaysArray,
        setTimeArray,
        daysArray,
        timeArray,
        days,
        time};
}