import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";


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



    topContainerChip: {
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 56, // Ensures consistent width
    },

    topContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingEnd: 8,
        paddingStart: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        elevation: 4,
        marginHorizontal: 8,
    },

    // STRUCTURED COMPONENTS
    listItem: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outline, // subtle borders
        backgroundColor: theme.colors.surface, // card surfaces
        marginVertical: 4,
    },
    box: {
        borderWidth: 1,
        borderColor: theme.colors.outline, // subtle borders
        backgroundColor: theme.colors.surface, // card surfaces
        marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: theme.colors.surface // selected items/highlighted sections
    },
    content: {
        padding: 8,
        backgroundColor: theme.colors.surface, // card surfaces
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface, // subtle backgrounds
    },

    // INTERACTIVE ELEMENTS
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chip: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primaryContainer, // info badges/chips
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
    },
    chipSecondary: {
        flexDirection: 'row',
        backgroundColor: theme.colors.secondaryContainer, // subtle chip backgrounds
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        margin: 2,
        gap: 4,
    },
    chipSuccess: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        margin: 2,
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
        backgroundColor: theme.colors.primaryContainer, // secondary action buttons
        borderRadius: 8,
        margin: 4,
        padding: 2,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary, // main action buttons
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary, // accent/alternative actions
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        paddingHorizontal: 8,
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
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        //padding: 8,
        alignItems: 'center',

        //marginHorizontal: 8,
    },
    calendarContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderColor: theme.colors.outline
        // marginHorizontal: 8,
    },
    weekdayRow: {
        backgroundColor: theme.colors.surfaceVariant,
        flexDirection: 'row',
        // paddingHorizontal: 4,
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
        borderBottomWidth: 1,
        borderColor: theme.colors.outline

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

    // PICKER

    boxPicker: {
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant, // subtle borders
        backgroundColor: theme.colors.surface, // card surfaces

        borderRadius: 4,
        padding: 8,
    }

});