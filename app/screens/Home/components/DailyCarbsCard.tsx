import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';
import { ProgressBar } from '@/app/components/ProgressBar';

interface DailyCarbsCardProps {
  totalCarbs: number;
}

export function DailyCarbsCard({ totalCarbs }: DailyCarbsCardProps) {
  const { theme } = useAppTheme();

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
    mainValue: {
      marginBottom: 16,
    },
    progressContainer: {
      marginTop: 8,
    },
    bottomText: {
      marginTop: 12,
      opacity: 0.9,
    }
  });

  return (
    <Card 
      mode="elevated" 
      elevation={2}
      style={[styles.card, { backgroundColor: theme.colors.primary }]}
      contentStyle={styles.cardContent}
    >
      <Card.Content>
        <View style={styles.header}>
          <Icon source="trending-up" size={24} color={theme.colors.onPrimary} />
          <Text 
            variant="titleMedium" 
            style={[styles.headerText, { color: theme.colors.onPrimary }]}
          >
            Daily Carbs
          </Text>
        </View>

        <Text 
          variant="displaySmall" 
          style={[styles.mainValue, { color: theme.colors.onPrimary }]}
        >
          {Math.round(totalCarbs)}g
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={0.37} // Will be calculated based on goal in future
            height={8}
            backgroundColor="rgba(255, 255, 255, 0.3)"
            progressColor={theme.colors.secondary}
          />
        </View>

        <Text 
          variant="bodyMedium" 
          style={[styles.bottomText, { color: theme.colors.onPrimary }]}
        >
          consumed today
        </Text>
      </Card.Content>
    </Card>
  );
}

