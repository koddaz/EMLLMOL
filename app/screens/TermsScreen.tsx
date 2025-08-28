import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { termsOfAgreement } from '../../assets/docs/termsOfAgreement';

const { width, height } = Dimensions.get('window');

interface TermsScreenProps {
  onClose: () => void;
}

export function TermsScreen({ onClose }: TermsScreenProps) {
  const theme = useTheme();
  const [termsContent, setTermsContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTermsContent();
  }, []);

  const loadTermsContent = async () => {
    try {
      setTermsContent(termsOfAgreement);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading terms:', error);
      setTermsContent('Error loading terms of agreement. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[termsStyles.container, { backgroundColor: theme.colors.primary }]}>
        <Surface style={[termsStyles.loadingContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={{ color: theme.colors.onSurface }}>Loading terms...</Text>
        </Surface>
      </View>
    );
  }

  return (
    <View style={[termsStyles.container, { backgroundColor: theme.colors.primary }]}>
      {/* Header */}
      <Surface style={[termsStyles.header, { backgroundColor: theme.colors.secondary }]}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color={theme.colors.onSecondary}
        />
        <Text variant="headlineSmall" style={[termsStyles.headerTitle, { color: theme.colors.onSecondary }]}>
          Terms of Agreement
        </Text>
        <Button
          mode="contained"
          onPress={onClose}
          style={[termsStyles.closeButton, { backgroundColor: theme.colors.onSecondary }]}
          labelStyle={{ color: theme.colors.secondary }}
          icon="close"
          compact
        >
          Close
        </Button>
      </Surface>

      {/* Content */}
      <ScrollView style={termsStyles.scrollView} showsVerticalScrollIndicator={false}>
        <Surface style={[termsStyles.contentContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <Text variant="bodyMedium" style={[termsStyles.contentText, { color: theme.colors.onPrimary }]}>
            {termsContent}
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

const termsStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
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