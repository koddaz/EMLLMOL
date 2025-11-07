import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';

interface BloodGlucoseCardProps {
  latestGlucose: {
    value: number;
    timestamp: Date;
  } | null;
  avgGlucose: number;
  glucoseUnit: string;
}

export function BloodGlucoseCard({ latestGlucose, avgGlucose, glucoseUnit }: BloodGlucoseCardProps) {
  const { theme } = useAppTheme();

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const styles = StyleSheet.create({
    card: {
      marginVertical: 0,
    },
    cardContent: {
      paddingVertical: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerText: {
      marginLeft: 8,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      flex: 1,
    },
    timestamp: {
      marginTop: 4,
    },
    rightSection: {
      alignItems: 'flex-end',
    },
    avgLabel: {
      marginBottom: 4,
    },
    noDataContainer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
  });

  return (
    <Card 
      mode="elevated" 
      elevation={2}
      style={styles.card}
      contentStyle={styles.cardContent}
    >
      <Card.Content>
        <View style={styles.header}>
          <Icon source="water" size={24} color={theme.colors.primary} />
          <Text 
            variant="titleMedium" 
            style={styles.headerText}
          >
            Blood Glucose
          </Text>
        </View>

        {latestGlucose ? (
          <View style={styles.content}>
            <View style={styles.leftSection}>
              <Text variant="headlineLarge" style={{ fontWeight: '700' }}>
                {Math.round(latestGlucose.value)} {glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL'}
              </Text>
              <Text 
                variant="bodyMedium" 
                style={[styles.timestamp, { color: theme.colors.onSurfaceVariant }]}
              >
                {formatTime(latestGlucose.timestamp)}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text 
                variant="labelSmall" 
                style={[styles.avgLabel, { color: theme.colors.onSurfaceVariant }]}
              >
                Avg Today
              </Text>
              <Text variant="titleLarge" style={{ fontWeight: '600' }}>
                {avgGlucose} {glucoseUnit === 'mmol' ? 'mmol/L' : 'mg/dL'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text 
              variant="bodyLarge" 
              style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}
            >
              No readings today
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

