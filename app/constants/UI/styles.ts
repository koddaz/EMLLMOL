import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const customStyles = (theme: MD3Theme) => StyleSheet.create({

    // LAYOUT COMPONENTS
    background: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: 'transparent'
    },
    topContainer: {
        flexDirection: 'row',
        padding: 8,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        borderTopWidth: 0,
        borderWidth: 1,
        backgroundColor: theme.colors.secondaryContainer,
        alignItems: 'center',
        minHeight: 56,
        marginBottom: 16,
    },

    // STRUCTURED COMPONENTS
    listItem: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
        marginVertical: 4,
    },
    box: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
        marginBottom: 8,
    },
    header: {
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        padding: 8,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: theme.colors.secondaryContainer,
    },
    content: {
        padding: 8,
        backgroundColor: theme.colors.surface,
    },
    footer: {
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        padding: 8,
        flexDirection: 'row',
        backgroundColor: theme.colors.secondaryContainer,
    },

    // INTERACTIVE ELEMENTS
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        backgroundColor: theme.colors.secondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 4,
        gap: 4,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        marginBottom: 8
    },
    iconButton: {
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 8,
        margin: 0,
        padding: 4,
    },

    // LOADING STATES
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },

    // CARD COMPONENTS
    card: {
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        overflow: 'hidden',
    },
    cardTitle: {
        color: theme.colors.onSecondaryContainer,
        fontWeight: '600',
        flex: 1,
    },

    // ACTION BUTTONS
    actionContainer: {
        flexDirection: 'row',
        padding: 8,
        gap: 8,
    },

    // IMAGE AND MEDIA
    imageContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceVariant,
    },
    imageOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    // SPACING UTILITIES
    marginVertical: {
        marginVertical: 8,
    },

    // INPUT STYLES
    textInput: {
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    selectorLabel: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },

    // PHOTO COMPONENTS
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

    // OVERLAY COMPONENTS
    centeredWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100
    },
    centeredContent: {
        marginTop: 40,
        maxHeight: '70%',
        minHeight: '70%',
        width: '100%',
        backgroundColor: 'transparent',
    },

    // CALENDAR STYLES
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
        backgroundColor: theme.colors.surface,
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
        backgroundColor: theme.colors.surface,
    },
    calendarDayLabel: {
        fontSize: 14,
        fontWeight: '500',
        margin: 0,
        lineHeight: 16,
        textAlign: 'center',
        color: theme.colors.onSurface,
    },

    // LEGACY SUPPORT
    plaincontainer: {
        backgroundColor: Colors.transparent,
    },
});