import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";



export const customStyles = (theme: MD3Theme) => StyleSheet.create({


    background: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,

    },
    wrapper: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: Colors.transparent,

    },
    plaincontainer: {
        backgroundColor: Colors.transparent,

    },
    errorcontainer: {

        paddingHorizontal: 8,
        backgroundColor: theme.colors.errorContainer
    },
    row: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 8, // or whatever spacing you want between cards/sections
    },
    textInput: {
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 12,
    },

    // MENU WITH FABS
    shutterButton: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.secondary,
        borderWidth: 4,
        borderRadius: 100,
        padding: 24
    },
    photoRow: {
        flexDirection: 'row',

        
    },
    cameraOptions: {

        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',

    },

    fabSecondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        marginLeft: 8,
        marginTop: 8,
    },
    fab: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        marginLeft: 16,
        marginTop: 8,
    },
    fabContainer: {
        position: 'absolute',
        bottom: '7.5%',
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    fabRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 32,
    },
    fabActionRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },


    centeredWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100
    },
    centeredContent: {
        marginTop: 40,
        maxHeight: '70%',
        minHeight: '70%',
        maxWidth: '95%',
        width: '100%',
        backgroundColor: 'transparent',
    },
    surface: {
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.error
    },

    // DIARY ENTRY:
    entryRow: {
        flexDirection: 'row', 
        backgroundColor: theme.colors.primary, 
        borderRadius: 16, 
        padding: 8, 
        alignItems: 'center', 
        marginTop: 8
    },


    // CALENDAR STYLES - Smaller and more compact

    calendarNavigationContainer: {
        backgroundColor: theme.colors.secondaryContainer,
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
        marginHorizontal: 8,
    },
    calendarContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 8,
    },
    weekdayRow: {
        backgroundColor: theme.colors.secondaryContainer,
        flexDirection: 'row',
        paddingHorizontal: 4,
    },
    weekdayHeader: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    calendarGridFiller: {
        backgroundColor: theme.colors.secondaryContainer,
        flexDirection: 'row',
        paddingHorizontal: 4,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
    },
    calendarGrid: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0,
    },
    calendarDay: {
        width: '14.28571%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical: 2,
    },
    calendarWeekDay: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.onSurfaceVariant ?? theme.colors.onSurface,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    calendarDayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        margin: 0,
        minWidth: 36,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface, // subtle highlight for button
    },
    calendarDayContent: {
        width: 36,
        height: 36,
        margin: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        backgroundColor: theme.colors.surface, // or transparent if you prefer
    },
    calendarDayLabel: {
        fontSize: 14,
        fontWeight: '500',
        margin: 0,
        lineHeight: 16,
        textAlign: 'center',
        color: theme.colors.onSurface,
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
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
        backgroundColor: theme.colors.primaryContainer,
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
        marginVertical: 4,
    },
    cardTitle: {
        marginLeft: 8,
        color: theme.colors.onSurface,
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
        marginTop: 4,
        marginBottom: 8
    },
    chip: {
        borderRadius: 20,
        minWidth: 70,
    },



    photoScroll: {
        marginTop: 8,
    },
    photoItem: {
        flex: 1,
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
        borderRadius: 25,
        minWidth: 50,
        alignItems: 'center',
    }
});