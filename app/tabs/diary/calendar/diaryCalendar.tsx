import { Surface, useTheme } from "react-native-paper";
import { ScrollView } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";


export default function DiaryCalendar(
    { calendarHook, dbHook
    }: {
        
        calendarHook: any,
        dbHook: any
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
                <CalendarNavigation currentMonth={calendarHook.currentMonth} navigateMonth={calendarHook.navigateMonth} />
                <CalendarGrid diaryEntries={dbHook.diaryEntries} selectedDate={calendarHook.selectedDate} setSelectedDate={calendarHook.setSelectedDate} currentMonth={calendarHook.currentMonth} setCurrentMonth={calendarHook.setCurrentMonth} />
            </ScrollView>
        </Surface>
    );
}