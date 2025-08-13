import { Surface, useTheme } from "react-native-paper";
import { useCalendar } from "../hooks/useCalendar";
import { customStyles } from "@/app/constants/UI/styles";
import { ScrollView } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useMemo } from "react";
import { useAppTheme } from "@/app/constants/UI/theme";
import { DiaryData } from "@/app/constants/interface/diaryData";

export default function DiaryCalendar(
    { diaryEntries, selectedDate, setSelectedDate, currentMonth, setCurrentMonth, navigateMonth
    }: {
        diaryEntries: DiaryData[],
        selectedDate: Date, setSelectedDate: (date: Date) => void,
        currentMonth: Date, setCurrentMonth: (date: Date) => void,
        navigateMonth: (direction: 'prev' | 'next') => void
    }
) {
    const { theme, styles } = useAppTheme();



    return (
        <Surface
            style={[styles.calendarSheet, {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }]}
            elevation={4}
        >
            <ScrollView>
                <CalendarNavigation currentMonth={currentMonth} navigateMonth={navigateMonth} />
                <CalendarGrid diaryEntries={diaryEntries} selectedDate={selectedDate} setSelectedDate={setSelectedDate} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
            </ScrollView>
        </Surface>
    );
}