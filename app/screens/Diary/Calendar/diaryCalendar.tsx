import { Divider, Icon, IconButton, Surface, useTheme } from "react-native-paper";
import { Platform, ScrollView, StatusBar, Touchable, TouchableOpacity, View } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function DiaryCalendar(
    { calendarHook,
        dbHook,
    }: {
        calendarHook: any,
        dbHook: any,
    }
) {
    const { theme, styles } = useAppTheme();

    return (
        <>

            {calendarHook.showCalendar && (
                <Surface
                    style={[
                        styles.plaincontainer,
                        {
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                            backgroundColor: theme.colors.primary,
                            elevation: 4,
                            shadowColor: 'transparent', // Remove shadow on iOS
                        },
                    ]}
                    elevation={4}
                >

                    <View style={{ gap: 0 }}>
                        <CalendarNavigation currentMonth={calendarHook.currentMonth} navigateMonth={calendarHook.navigateMonth} />
                        <CalendarGrid diaryEntries={dbHook.diaryEntries} calendarHook={calendarHook} />
                    </View>




                </Surface>

            )}



        </>
    );
}

