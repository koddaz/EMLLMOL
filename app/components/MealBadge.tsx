import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';

interface MealBadgeProps {
  value: number;
  unit: string;
  variant: 'carbs' | 'calories';
}

export function MealBadge({ value, unit, variant }: MealBadgeProps) {
  const { theme } = useAppTheme();

  const badgeStyles = StyleSheet.create({
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: variant === 'carbs' ? theme.colors.secondaryContainer : theme.colors.surfaceVariant,
    },
    text: {
      fontSize: 12,
      fontWeight: '500',
      color: variant === 'carbs' ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant,
    }
  });

  return (
    <View style={badgeStyles.badge}>
      <Text style={badgeStyles.text}>
        {value}{unit}
      </Text>
    </View>
  );
}
