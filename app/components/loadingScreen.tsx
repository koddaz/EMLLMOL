import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { customStyles } from '../constants/UI/styles';


export function LoadingScreen() {
  const theme = useTheme();
  const styles = customStyles(theme);

  return (
    <View style={[styles.background, {justifyContent: 'center', alignItems: 'center'  }]}>

      <View style={styles.container}>
      <ActivityIndicator size="large" animating={true} color={theme.colors.primary} />
      <Text style={styles.message}>Loading...</Text>
      </View>
    </View>
  );
}
