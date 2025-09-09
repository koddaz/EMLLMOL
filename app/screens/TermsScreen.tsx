import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../constants/UI/theme';
import { termsOfAgreement } from '../../assets/docs/termsOfAgreement';

const { width, height } = Dimensions.get('window');

interface TermsScreenProps {
  onClose: () => void;
}

export function TermsScreen({ onClose }: TermsScreenProps) {
  const { theme, styles } = useAppTheme();
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
      <View style={styles.background}>
        <View style={styles.loadingContainer}>
          <View style={styles.box}>
            <View style={styles.content}>
              <Text variant="bodyMedium" style={{ 
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center'
              }}>
                Loading terms...
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      {/* Header */}
      <View style={styles.topContainer}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={20}
          color={theme.colors.onSecondaryContainer}
        />
        <Text variant="titleMedium" style={{
          color: theme.colors.onSecondaryContainer,
          fontWeight: '600',
          flex: 1,
          marginLeft: 8
        }}>
          Terms of Agreement
        </Text>
        <IconButton
          icon="close"
          size={20}
          iconColor={theme.colors.onSecondaryContainer}
          style={styles.iconButton}
          onPress={onClose}
        />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.box}>
          <View style={styles.content}>
            <Text variant="bodyMedium" style={{
              color: theme.colors.onSurface,
              lineHeight: 20,
              textAlign: 'left'
            }}>
              {termsContent}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

