import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Icon, Divider } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';
import { MealBadge } from '@/app/components/MealBadge';

interface Meal {
  id: string;
  name: string;
  time: string;
  carbs: number;
  glucose: number;
  mealType: string;
}

interface TodaysMealsCardProps {
  meals: Meal[];
}

export function TodaysMealsCard({ meals }: TodaysMealsCardProps) {
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
    mealItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    mealInfo: {
      flex: 1,
      marginRight: 12,
    },
    mealTime: {
      marginTop: 4,
    },
    badgesContainer: {
      flexDirection: 'row',
      gap: 6,
    },
    noMealsContainer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
  });

  const renderMealItem = ({ item, index }: { item: Meal; index: number }) => {
    const isLast = index === meals.length - 1;

    return (
      <View>
        <View style={styles.mealItem}>
          <View style={styles.mealInfo}>
            <Text variant="bodyLarge" style={{ fontWeight: '500' }}>
              {item.name}
            </Text>
            <Text 
              variant="bodySmall" 
              style={[styles.mealTime, { color: theme.colors.onSurfaceVariant }]}
            >
              {item.time}
            </Text>
          </View>

          <View style={styles.badgesContainer}>
            <MealBadge value={Math.round(item.carbs)} unit="g carbs" variant="carbs" />
            <MealBadge value={item.glucose} unit=" mmol/L" variant="glucose" />
          </View>
        </View>
        {!isLast && <Divider style={{ marginVertical: 4 }} />}
      </View>
    );
  };

  return (
    <Card 
      mode="elevated" 
      elevation={2}
      style={styles.card}
      contentStyle={styles.cardContent}
    >
      <Card.Content>
        <View style={styles.header}>
          <Icon source="calendar" size={24} color={theme.colors.primary} />
          <Text 
            variant="titleMedium" 
            style={styles.headerText}
          >
            Today's Meals
          </Text>
        </View>

        {meals.length > 0 ? (
          <FlatList
            data={meals}
            renderItem={renderMealItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noMealsContainer}>
            <Text 
              variant="bodyLarge" 
              style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}
            >
              No meals logged today
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

