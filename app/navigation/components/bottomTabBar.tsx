import { useAppTheme } from "@/app/constants/UI/theme";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";

interface BottomTabBarProps {
  navigation: any;
  state: any;
  descriptors: any;
  insets: any;
}

export function CustomBottomTabBar({ navigation, state, descriptors, insets }: BottomTabBarProps) {
  const { theme } = useAppTheme();

  return (
    <BottomNavigation.Bar
      navigationState={state}
      safeAreaInsets={insets}
      style={{
        height: 100,
        backgroundColor: theme.colors.surface,
        elevation: 8,
      }}
      activeColor={theme.colors.secondary}
      inactiveColor={theme.colors.onSurface}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          // Find the actual route in the navigation state
          const navRoute = state.routes.find((r: any) => r.key === route.key);
          navigation.dispatch({
            ...CommonActions.navigate(navRoute?.name || route.key, navRoute?.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) =>
        descriptors[route.key].options.tabBarIcon?.({
          focused,
          color,
          size: 24,
        }) || null
      }
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        // Find the actual route in the navigation state
        const navRoute = state.routes.find((r: any) => r.key === route.key);
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : navRoute?.name || route.key;

        return label;
      }}
      labeled={true}
      shifting={false}
    />
  );
}