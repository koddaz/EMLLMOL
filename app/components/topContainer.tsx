
import { useAppTheme } from "../constants/UI/theme";
import { Icon, IconButton, Text } from "react-native-paper";
import { DiaryData } from "../constants/interface/diaryData";
import { View } from "react-native";

interface TopContainerProps {
    leftIcon?: string;
    leftIconSize?: number;
    rightIcon?: string;
    rightIconSize?: number;
    title: string;
    subtitle?: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
}

export function TopContainer({
  leftIcon = "note",
  leftIconSize = 24,
  rightIcon = "camera",
  rightIconSize = 24,
  title,
  subtitle,
  onLeftPress,
  onRightPress
}: TopContainerProps) {
  const { styles, theme } = useAppTheme();
  
  return (
    <View style={styles.topContainerWrapper}>
      {/* Separate Left Chip */}
      <View style={styles.topContainerChip}>
        <Icon
          source={leftIcon}
          size={leftIconSize}
          color={theme.colors.onPrimaryContainer}
        />
      </View>
      
      {/* Main Container */}
      <View style={styles.topContainer}>
        {/* Center Content */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text variant="titleLarge" style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.onPrimaryContainer
          }}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodyMedium" style={{
              fontSize: 16,
              color: theme.colors.onPrimaryContainer,
              marginTop: 2
            }}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {/* Right Circular Button */}
        <IconButton
        mode={"outlined"}
          icon={rightIcon}
          iconColor={theme.colors.onPrimary}
          size={rightIconSize}
          onPress={onRightPress}
          style={{
            backgroundColor: theme.colors.secondary,
          }}
          containerColor={theme.colors.onSecondary}
        />
      </View>
    </View>
  );
}

// Specialized components for specific use cases
interface DiaryTopContainerProps {
    editingEntry?: DiaryData | null;
    calendarHook: any;
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
            rightIcon="account"
            title="Settings"
        />
    );
}