import { useAppTheme } from '@/app/constants/UI/theme';
import React from 'react';
import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';

interface DiaryStatsCardProps {
  latestGlucose: number;
  avgGlucose: number;
  totalCarbs: number;
  glucoseUnit: string;
}

export function DiaryStatsCard({ latestGlucose, avgGlucose, totalCarbs, glucoseUnit }: DiaryStatsCardProps) {
  const { theme } = useAppTheme();

  return (
    <Card
      style={{

        marginVertical: 12,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
      }}
      elevation={2}
    >
      <Card.Content style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Blood Glucose Section */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="water" size={20} color={theme.colors.onPrimary} />
              <Text variant="titleSmall" style={{ color: theme.colors.onPrimary, marginLeft: 8, fontWeight: '600' }}>
                Blood Glucose
              </Text>
            </View>
            <Text variant="headlineMedium" style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
              {latestGlucose.toFixed(1)}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.9 }}>
              {glucoseUnit}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.7, marginTop: 4 }}>
              Avg: {avgGlucose.toFixed(1)} {glucoseUnit}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ width: 1, backgroundColor: theme.colors.onPrimary, opacity: 0.3 }} />

          {/* Daily Carbs Section */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon source="bread-slice" size={20} color={theme.colors.onPrimary} />
              <Text variant="titleSmall" style={{ color: theme.colors.onPrimary, marginLeft: 8, fontWeight: '600' }}>
                Daily Carbs
              </Text>
            </View>
            <Text variant="headlineMedium" style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
              {totalCarbs}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.9 }}>
              grams
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimary, opacity: 0.7, marginTop: 4 }}>
              Total for today
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
