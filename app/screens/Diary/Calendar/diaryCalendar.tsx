import { Surface } from "react-native-paper";
import { View } from "react-native";
import { CalendarNavigation } from "./calendarNavigation";
import { CalendarGrid } from "./calendarGrid";
import { useAppTheme } from "@/app/constants/UI/theme";



export default function DiaryCalendar(
    { calendarHook,
        dbHook,
    }: {
        calendarHook: any,
        dbHook: any,
    }
) {
    const { theme, styles } = useAppTheme();

    const {currentMonth, navigateMonth, setSelectedDate} = calendarHook

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


<View style={styles.calendarNavigationContainer}>
            <IconButton
                iconColor={theme.colors.primary}
                size={28}
                icon="calendar-today"
                mode="contained-tonal"
                onPress={() => {
                    calendarHook.setSelectedDate(new Date())
                    calendarHook.toggleCalendar()
                }}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                }}
            />
            <IconButton
                iconColor={theme.colors.primary}
                size={28}
                icon="chevron-left"
                mode="contained-tonal"
                onPress={() => calendarHook.navigateMonth('prev')}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                }}
            />
            <View style={[styles.container, { flex: 1, alignItems: 'center' }]}>
                <Text variant="titleMedium" style={{
                    color: theme.colors.onSurface,
                    fontWeight: '600',
                    letterSpacing: 0.25
                }}>
                    {calendarHook.currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>
            </View>
            <IconButton
                iconColor={disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary}
                size={28}
                icon="chevron-right"
                mode="contained-tonal"
                onPress={() => calendarHook.navigateMonth('next')}
                disabled={disabled}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                }}
            />
        </View>

                </Surface>

         



        </>
    );
}

