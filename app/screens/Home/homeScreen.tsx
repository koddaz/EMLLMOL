import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Icon, Surface } from 'react-native-paper';
import { useAppTheme } from '@/app/constants/UI/theme';
import { NavData, HookData } from '@/app/navigation/rootNav';
import { useHomeData } from '@/app/hooks/useHomeData';
import { DailyCarbsCard } from './components/DailyCarbsCard';
import { BloodGlucoseCard } from './components/BloodGlucoseCard';
import { TodaysMealsCard } from './components/TodaysMealsCard';
import { DiaryStatsCard } from './components/DiaryStatsCard';

export function HomeScreen({ appData, dbHook }: NavData & HookData) {
  const { theme } = useAppTheme();

  const homeData = useHomeData(appData?.diaryEntries || []);

  const formatDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();

    return `${dayName}, ${monthName} ${date}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    welcomeSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 16,
    },
    welcomeContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    welcomeText: {
      flex: 1,
    },
    dateText: {
      marginTop: 4,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
    },
    cardsContainer: {
      paddingHorizontal: 16,
      gap: 16,
    },
  });

  const glucoseUnit = appData?.settings?.glucose || 'mmol';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Welcome Section */}
        <Surface style={styles.welcomeSection} elevation={0}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeText}>
              <Text variant="headlineMedium" style={{
                color: theme.colors.onBackground,
                fontWeight: '700',
                marginBottom: 2,
              }}>
                {appData?.isFirstLogin ? 'Welcome!' : 'Welcome Back!'}
              </Text>
              <Text variant="bodyLarge" style={{
                color: theme.colors.onSurfaceVariant,
                marginBottom: 4,
              }}>
                {appData?.isFirstLogin
                  ? "Let's get started with your diabetes management journey"
                  : 'Your diabetes management dashboard'}
              </Text>
              <Text variant="bodyLarge" style={{
                color: theme.colors.onSurfaceVariant,
              }}>
                {formatDate()}
              </Text>
            </View>
            <Surface style={styles.iconContainer} elevation={2}>
              <Icon source="heart-pulse" size={28} color={theme.colors.primary} />
            </Surface>
          </View>
        </Surface>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          <DiaryStatsCard
            latestGlucose={homeData.latestGlucose?.value || 0}
            avgGlucose={homeData.avgGlucoseToday}
            totalCarbs={homeData.totalCarbsToday}
            glucoseUnit={appData?.settings?.glucose === 'mmol' ? 'mmol/L' : 'mg/dL'}
          />

          {/* Today's Meals Card */}
          <TodaysMealsCard meals={homeData.todaysMeals} />
        </View>
      </ScrollView>
    </View>
  );
}

