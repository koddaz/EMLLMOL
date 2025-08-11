import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const customStyles = (theme: MD3Theme) => StyleSheet.create({

    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.backdrop,

    },
    container: {
        width: '100%',
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: theme.colors.primaryContainer,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 10,
    },
    plaincontainer: {
        width: '100%',
        backgroundColor: Colors.transparent,
        marginBottom: 8
    },
    errorcontainer: {
        width: '100%',
        paddingHorizontal: 8,
        backgroundColor: theme.colors.errorContainer
    },
    row: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInput: {
        marginVertical: 8,
        backgroundColor: theme.colors.elevation?.level1 ?? theme.colors.surface,
        borderRadius: 8,
        fontSize: 16,
        color: theme.colors.onSurface,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    centeredWrapper: {
        position: 'absolute',
        top: -100,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centeredContent: {
        maxHeight: '70%',
        maxWidth: '90%',
        width: '100%',
        backgroundColor: 'transparent',
    },
    surface: {
        backgroundColor: theme.colors.primaryContainer,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.error
    },

    // DIARY
    diaryListItem: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    // CALENDAR
    calendarSheet: {
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 8,
        position: 'absolute',
        top: 0, // Adjusted to match the smaller app bar height
        left: 0,
        right: 0,
        zIndex: 1000,
        
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    calendarHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
    },
    calendarWeekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    calendarWeekDay: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        flex: 1,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    calendarDay: {
        width: '14.28%', // 100% / 7 days
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    selectedDateInfo: {
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectedDateText: {
        fontSize: 14,
        color: theme.colors.onSurface,
        textAlign: 'center',
    },


    // CRAP FOR THE AI CAM

    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: theme.colors.onBackground
    },
    camera: {
        flex: 1,
        width: '100%'
    },
    buttonContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        backgroundColor: 'transparent',
        paddingBottom: 32,
    },
    iconButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',

    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});