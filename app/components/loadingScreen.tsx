import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Card, Surface, useTheme, Text } from 'react-native-paper';
import { customStyles } from '../constants/UI/styles';

export function LoadingScreen() {
  const theme = useTheme();
  const styles = customStyles(theme);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons 
          name="diabetes" 
          size={28} 
          color={theme.colors.primary} 
        />
        <Text variant="headlineMedium" style={{ 
          color: theme.colors.onSurface, 
          marginLeft: 12,
          fontWeight: '600'
        }}>
          Diabetes Tracker
        </Text>
      </View>
    </View>
  );

  const renderLoadingCard = () => (
    <Card style={[styles.card, { alignItems: 'center' }]}>
      <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
        <ActivityIndicator 
          size="large" 
          animating={true} 
          color={theme.colors.primary}
          style={{ marginBottom: 16 }}
        />
        <Text variant="titleMedium" style={{ 
          color: theme.colors.onSurface,
          marginBottom: 8
        }}>
          Loading your data...
        </Text>
        <Text variant="bodyMedium" style={{ 
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          lineHeight: 20
        }}>
          Please wait while we set up your diabetes tracking dashboard
        </Text>
      </Card.Content>
    </Card>
  );

  const renderStatusCard = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons 
            name="shield-check" 
            size={20} 
            color={theme.colors.primary} 
          />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Secure & Private
          </Text>
        </View>
        <Text variant="bodySmall" style={{ 
          color: theme.colors.onSurfaceVariant,
          lineHeight: 16
        }}>
          Your health data is encrypted and stored securely. We prioritize your privacy and data protection.
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          {renderHeader()}
          {renderLoadingCard()}
          {renderStatusCard()}
        </View>
      </View>
    </View>
  );
}