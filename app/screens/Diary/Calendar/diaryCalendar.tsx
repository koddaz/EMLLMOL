import { Divider, Icon, IconButton, Surface, useTheme } from "react-native-paper";
import { Platform, ScrollView, StatusBar, Touchable, TouchableOpacity, View } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function DiaryCalendar(
    { calendarHook, 
        dbHook,
        toggleInput,
        toggleEntry
    }: {

        calendarHook: any,
        dbHook: any,
        toggleInput: boolean,
        toggleEntry: boolean
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

                        <View style={{gap: 0}}>
                            <CalendarNavigation currentMonth={calendarHook.currentMonth} navigateMonth={calendarHook.navigateMonth} />
                            <CalendarGrid diaryEntries={dbHook.diaryEntries} calendarHook={calendarHook} />
                        </View>




                    </Surface>
                    
                )}
                {!toggleInput && !toggleEntry && (
                <CalendarTab calendarHook={calendarHook} /> 
                )}
         

        </>
    );
}

export function CalendarTab(
    {calendarHook}: {
        calendarHook: any}
) {

    const { theme, styles } = useAppTheme();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 28 }}>
                    <TouchableOpacity
                        // elevation={4}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomStartRadius: 12,
                            borderBottomEndRadius: 12,
                            backgroundColor: theme.colors.primaryContainer,
                            opacity: 0.5,
                            flex: 0.4,
                        }}
                        onPress={() => calendarHook.toggleCalendar()}
                    >
                        <MaterialCommunityIcons
                            name="calendar-month"
                            size={24}
                            color={theme.colors.onPrimaryContainer}
                            style={{marginTop: 4}}
                        />

                        <Divider style={{
                            width: '60%',
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.colors.onPrimaryContainer,
                            marginTop: 0,
                            marginBottom: 4,
                            alignSelf: 'center',
                            opacity: 0.2,
                        }} />
                    </TouchableOpacity>
                </View>
    )
}