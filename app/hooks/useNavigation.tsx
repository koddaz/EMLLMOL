import { useNavigation as useReactNavigation } from '@react-navigation/native';

export function useNavigation() {
  const navigation = useReactNavigation<any>();

  const navigateTo = (screen: string, params?: any) => {
    navigation.navigate(screen, params);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToRoot = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDiary' }],
    });
  };

  const navigateToTab = (tabName: string, screen?: string, params?: any) => {
    if (screen) {
      navigation.navigate(tabName, { screen, ...params });
    } else {
      navigation.navigate(tabName);
    }
  };

  return {
    navigateTo,
    goBack,
    goToRoot,
    navigateToTab,
    navigation, // Expose the original navigation object for advanced use
  };
}