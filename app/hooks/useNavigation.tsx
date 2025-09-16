import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

export function useNavigation() {
  const navigation = useReactNavigation<any>();

  const navigateTo = useCallback((screen: string, params?: any) => {
    navigation.navigate(screen, params);
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const goToRoot = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDiary' }],
    });
  }, [navigation]);

  const navigateToTab = useCallback((tabName: string, screen?: string, params?: any) => {
    if (screen) {
      navigation.navigate(tabName, { screen, ...params });
    } else {
      navigation.navigate(tabName);
    }
  }, [navigation]);

  return useMemo(() => ({
    navigateTo,
    goBack,
    goToRoot,
    navigateToTab,
    navigation, // Expose the original navigation object for advanced use
  }), [navigateTo, goBack, goToRoot, navigateToTab, navigation]);
}