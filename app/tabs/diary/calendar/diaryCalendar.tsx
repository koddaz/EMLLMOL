import { Divider, IconButton, Surface, useTheme } from "react-native-paper";
import { Platform, ScrollView, StatusBar, View } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function DiaryCalendar(
    { calendarHook, dbHook
    }: {

        calendarHook: any,
        dbHook: any
    }
) {
    const { theme, styles } = useAppTheme();



    return (
        <>
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                overflow: 'hidden',
            }}>
                {calendarHook.showCalendar && (
                    <Surface
                        style={[
                            styles.calendarSheet,
                            {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                backgroundColor: theme.colors.primaryContainer,
                                elevation: 4,
                                shadowColor: 'transparent', // Remove shadow on iOS
                            },
                        ]}
                        elevation={4}
                    >

                        <View>
                            <CalendarNavigation currentMonth={calendarHook.currentMonth} navigateMonth={calendarHook.navigateMonth} />
                            <CalendarGrid diaryEntries={dbHook.diaryEntries} calendarHook={calendarHook} />
                        </View>




                    </Surface>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 28 }}>
                    <Surface
                        elevation={4}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomStartRadius: 12,
                            borderBottomEndRadius: 12,
                            backgroundColor: theme.colors.primaryContainer,
                            flex: 0.2,
                            marginTop: 0, // No gap
                            shadowColor: 'transparent', // Remove shadow on iOS
                            
                        }}
                    >
                        <IconButton
                            icon={calendarHook.showCalendar ? "calendar-month-outline" : "calendar-month"}
                            size={24}

                            onPress={() => calendarHook.toggleCalendar()}
                            style={{ margin: 4, backgroundColor: theme.colors.primaryContainer }}
                        />

                        <Divider style={{
                            width: '60%',
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.colors.onPrimaryContainer,
                            marginTop: 2,
                            marginBottom: 4,
                            alignSelf: 'center',
                            opacity: 0.2,
                        }} />
                    </Surface>
                </View>


            </View>

        </>
    );
}