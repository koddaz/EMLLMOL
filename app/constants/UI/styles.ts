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
        flex: 1,
        backgroundColor: theme.colors.surface
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100
    },
    centeredContent: {
        maxHeight: '70%',
        minHeight: '70%',
        maxWidth: '95%',
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

    // APP BAR STYLES
    appBar: {
        backgroundColor: theme.colors.surface,
        elevation: 0,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.outline + '20', // 20% opacity
    },
    appBarTitle: {
        color: theme.colors.onSurface,
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.15,
    },
    appBarAction: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    appBarContent: {
        alignItems: 'center',
    },
    bottomAppBar: {
        backgroundColor: theme.colors.surface,
        elevation: 8,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.outline + '20', // 20% opacity
        paddingBottom: 4,
        paddingTop: 8,
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

    // INPUT STYLES:
    inputWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.surface,
        zIndex: 100
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
        backgroundColor: theme.colors.surface,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        margin: 0,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        marginLeft: 8,
        color: theme.colors.onSurface,
        flex: 1,
    },
    input: {
        backgroundColor: 'transparent',
    },
    selectorRow: {
        marginBottom: 16,
    },
    selectorGroup: {
        flex: 1,
    },
    selectorLabel: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderRadius: 20,
        minWidth: 70,
    },
    photoButton: {
        marginLeft: 'auto',
    },
    cameraContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        height: 200,
    },
    cameraControls: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    photoScroll: {
        marginTop: 8,
    },
    photoItem: {
        marginRight: 12,
        position: 'relative',
    },
    photoDelete: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: theme.colors.errorContainer,
        width: 24,
        height: 24,
    },
    emptyPhotos: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    actionContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 2,
    },

    // DIARY LIST ITEM:
    diaryListRow: {
        marginHorizontal: 8,
        marginVertical: 4,
    },
    diaryListItem: {
        borderRadius: 8,
        backgroundColor: theme.colors.surface,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flex: 1,
    },
    glucoseBadge: {
        backgroundColor: theme.colors.primaryContainer,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 50,
        alignItems: 'center',
    }
});