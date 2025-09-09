import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAppTheme } from '../constants/UI/theme';

const { width } = Dimensions.get('window');

export function LoadingScreen() {
  const { theme, styles } = useAppTheme();

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.loadingContainer}>
        {/* Logo Section */}
        <View style={styles.marginVertical}>
          <Image
            style={{
              width: width * 0.6,
              height: width * 0.6,
              marginBottom: 32,
            }}
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
          />
        </View>

        {/* Loading Content */}
        <View style={styles.box}>
          <View style={styles.content}>
            <ActivityIndicator 
              size="large" 
              animating={true} 
              color={theme.colors.primary}
              style={{ marginBottom: 16 }}
            />
            <Text variant="bodyMedium" style={{
              color: theme.colors.onSurface,
              textAlign: 'center'
            }}>
              Please wait while we prepare your data...
            </Text>
          </View>
        </View>

        {/* Status Section */}
        <View style={[styles.box, { backgroundColor: theme.colors.secondaryContainer, marginTop: 16 }]}>
          <View style={styles.content}>
            <View style={styles.row}>
              <MaterialCommunityIcons 
                name="shield-check" 
                size={24} 
                color={theme.colors.onSecondaryContainer}
                style={{ marginRight: 8 }}
              />
              <Text variant="bodyMedium" style={{
                color: theme.colors.onSecondaryContainer,
                flex: 1
              }}>
                Your health data is encrypted and stored securely
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

