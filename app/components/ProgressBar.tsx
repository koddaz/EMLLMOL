import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/app/constants/UI/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1 (0% to 100%)
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  backgroundColor,
  progressColor
}: ProgressBarProps) {
  const { theme } = useAppTheme();

  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: height,
      backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.3)',
      borderRadius: height / 2,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: progressColor || theme.colors.secondary,
      borderRadius: height / 2,
      width: `${clampedProgress * 100}%`,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.progress} />
    </View>
  );
}
