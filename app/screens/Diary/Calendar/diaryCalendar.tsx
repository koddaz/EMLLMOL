import { IconButton, Surface, Text } from "react-native-paper";
import { View } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";
import { ViewSet } from "@/app/components/UI/ViewSet";



export default function DiaryCalendar(
    { calendarHook,
        dbHook,
    }: {
        calendarHook: any,
        dbHook: any,
    }
) {
    const { theme, styles } = useAppTheme();

    const { currentMonth, navigateMonth, setSelectedDate } = calendarHook

    return (
        <>


            <Surface
                style={[

                    {
                        backgroundColor: 'transparent',
                        elevation: 4,
                        shadowColor: 'transparent', // Remove shadow on iOS
                    },
                ]}
                elevation={4}
            >

                <View style={{ gap: 0 }}>
                    <CalendarNavigation calendarHook={calendarHook} />
                    <CalendarGrid diaryEntries={dbHook.diaryEntries} calendarHook={calendarHook} />

                </View>




            </Surface>





        </>
    );
}

