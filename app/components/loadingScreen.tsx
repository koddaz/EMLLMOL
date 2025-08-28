import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Surface, useTheme, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export function LoadingScreen() {
  const theme = useTheme();

  return (
    <View style={[loadingStyles.container, { backgroundColor: theme.colors.primary, alignContent: 'center', justifyContent: 'center' }]}>
      {/* Logo Section */}
      <View style={loadingStyles.logoContainer}>
        <Image
          style={loadingStyles.logo}
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
        />
      </View>

      {/* Loading Content */}
      <View style={[loadingStyles.contentContainer]}>
        
        <View style={loadingStyles.loadingBody}>
          <ActivityIndicator 
            size="large" 
            animating={true} 
            color={theme.colors.onPrimary}
            style={loadingStyles.spinner}
          />
          <Text variant="bodyMedium" style={[loadingStyles.loadingText, { color: theme.colors.onPrimary }]}>
            Please wait while we prepare your data...
          </Text>
        </View>
      </View>

      {/* Status Section */}
      <View style={[loadingStyles.statusContainer, { backgroundColor: theme.colors.secondary }]}>
        <MaterialCommunityIcons 
          name="shield-check" 
          size={24} 
          color={theme.colors.onSecondary}
          style={loadingStyles.statusIcon}
        />
        <Text variant="bodyMedium" style={[loadingStyles.statusText, { color: theme.colors.onSecondary }]}>
          Your health data is encrypted and stored securely
        </Text>
      </View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  logo: {
    width: width * 0.75,
    height: width * 0.75,
    marginBottom: 4,
  },
  appSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 8,
  },
  contentContainer: {
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',

  },
  loadingHeader: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  loadingIcon: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  loadingTitle: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  loadingSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 8,
  },
  loadingBody: {
    gap: 8,
    padding: 8,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 4,
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 8,
    borderRadius: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    flex: 1,
    opacity: 0.8,
  },
});