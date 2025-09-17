import { useAppTheme } from "../constants/UI/theme";
import { Icon, IconButton, Text } from "react-native-paper";
import { DiaryData } from "../constants/interface/diaryData";
import { FlatList, View } from "react-native";

interface ChipData {
  icon: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

interface TopContainerProps {
  leftIcon?: string;
  leftIconSize?: number;
  rightIcon?: string;
  rightIconSize?: number;
  title: string;
  subtitle?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  chips?: ChipData[];
  showRightButton?: boolean;
}

export function TopContainer({
  leftIcon = "note",
  leftIconSize = 24,
  rightIcon = "camera",
  rightIconSize = 24,
  title,
  subtitle,
  onLeftPress,
  onRightPress,
  chips = [],
  showRightButton = true
}: TopContainerProps) {
  const { styles, theme } = useAppTheme();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      margin: 8,
      padding: 8,
      backgroundColor: theme.colors.surface,
      elevation: 4,
      borderRadius: 8
    }}>
      {/* Left Icon */}
      {!leftIcon && (
        <View style={{ marginRight: 8 }}>
          <Icon
            source={leftIcon}
            size={leftIconSize}
            color={theme.colors.onSurface}
          />
        </View>
      )}

      {/* Center Content */}
      <View style={{ flex: 2, marginLeft: leftIcon ? 8 : 0 }}>
        <Text variant="titleLarge" style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.colors.onSurface
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" style={{
            fontSize: 14,
            color: theme.colors.onSurface,
            marginTop: 2
          }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Chips */}
      <FlatList
        data={chips}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 0 }}
        renderItem={({ item: chip }) => (
          <View
            style={[
              styles.chip,
              {
                backgroundColor: chip.backgroundColor || theme.colors.primaryContainer,
                flex: 1,
                marginHorizontal: 2
              }
            ]}
          >
            <Icon
              source={chip.icon}
              size={16}
              color={chip.iconColor || theme.colors.onPrimaryContainer}
            />
            {chip.text && (
              <Text
                variant="bodySmall"
                style={{
                  color: chip.textColor || theme.colors.onPrimaryContainer,
                  marginLeft: 4
                }}
              >
                {chip.text}
              </Text>
            )}
          </View>
        )}
      />

      {/* Right Button */}
      {showRightButton && (
        <IconButton
          mode="outlined"
          icon={rightIcon}
          iconColor={theme.colors.onPrimary}
          size={rightIconSize}
          onPress={onRightPress}
          style={{
            backgroundColor: theme.colors.secondary,
            marginLeft: 8
          }}
          containerColor={theme.colors.onSecondary}
        />
      )}
    </View>
  );
}

// Specialized components
interface DiaryTopContainerProps {
  editingEntry?: DiaryData | null;
  calendarHook: any;
  entriesData?: {
    filteredEntries: any[];
    totalCarbs: number;
    totalInsulin: number;
    avgGlucose: string;
  };
}

export function InputTopContainer({ editingEntry, calendarHook }: DiaryTopContainerProps) {
  const title = editingEntry ? 'Edit entry' : 'New entry';
  const subtitle = editingEntry
    ? calendarHook.formatTime(editingEntry.created_at) + ' [' + calendarHook.formatDate(editingEntry.created_at) + ']'
    : calendarHook.formatTime(new Date()) + ' [' + calendarHook.formatDate(new Date()) + ']';

  return (
    <TopContainer
      leftIcon="note-plus"
      rightIcon="camera-plus"
      title={title}
      subtitle={subtitle}
    />
  );
}

export function DiaryTopContainer({
  calendarHook,
  entriesData
}: DiaryTopContainerProps) {
  const chips: ChipData[] = entriesData ? [
    {
      icon: "note-multiple",
      text: entriesData.filteredEntries.length.toString()
    },
    {
      icon: "food",
      text: `${entriesData.totalCarbs}g`
    },
    {
      icon: "blood-bag",
      text: entriesData.avgGlucose
    },
    { icon: "needle",
      text: entriesData.totalInsulin.toString()
    }
  ] : [];

  return (
    <TopContainer
      title="Daily Summary"
      subtitle={calendarHook.selectedDate.toLocaleDateString('en-EU', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })}
      chips={chips}
      showRightButton={false}
    />
  );
}

export function StatisticsTopContainer({ period }: { period: string }) {
  return (
    <TopContainer
      leftIcon="chart-line"
      rightIcon="filter"
      title="Statistics"
      subtitle={period}
    />
  );
}

export function SettingsTopContainer() {
  return (
    <TopContainer
      leftIcon="cog"
      title="Settings"
      subtitle="Manage your preferences"
      //rightIcon={editMode ? "check" : "pencil"}
      showRightButton={false}
    />
  );
}