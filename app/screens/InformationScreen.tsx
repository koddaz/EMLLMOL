import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { appInformation } from '../../assets/docs/appInformation';

const { width, height } = Dimensions.get('window');

interface InformationScreenProps {
  onClose: () => void;
}

export function InformationScreen({ onClose }: InformationScreenProps) {
  const theme = useTheme();
  const [appInfo, setAppInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppInformation();
  }, []);

  const loadAppInformation = async () => {
    try {
      setAppInfo(appInformation);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading app information:', error);
      setAppInfo('Error loading app information. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[infoStyles.container, { backgroundColor: theme.colors.primary }]}>
        <Surface style={[infoStyles.loadingContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={{ color: theme.colors.onSurface }}>Loading information...</Text>
        </Surface>
      </View>
    );
  }

  return (
    <View style={[infoStyles.container, { backgroundColor: theme.colors.primary }]}>
      {/* Header */}
      <Surface style={[infoStyles.header, { backgroundColor: theme.colors.secondary }]}>
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color={theme.colors.onSecondary}
        />
        <Text variant="headlineSmall" style={[infoStyles.headerTitle, { color: theme.colors.onSecondary }]}>
          App Information
        </Text>
        <Button
          mode="contained"
          onPress={onClose}
          style={[infoStyles.closeButton, { backgroundColor: theme.colors.onSecondary }]}
          labelStyle={{ color: theme.colors.secondary }}
          icon="close"
          compact
        >
          Close
        </Button>
      </Surface>

      {/* Content */}
      <ScrollView style={infoStyles.scrollView} showsVerticalScrollIndicator={false}>
        <Surface style={[infoStyles.contentContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <Text variant="bodyMedium" style={[infoStyles.contentText, { color: theme.colors.onPrimary }]}>
            {appInfo}
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600',
  },
  closeButton: {
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  contentContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  contentText: {
    lineHeight: 20,
    textAlign: 'left',
  },
});