import { useMemo } from 'react';
import { MD3LightTheme as DefaultTheme, useTheme } from 'react-native-paper';
import { customStyles } from './styles';



export function useAppTheme() {
  const theme = useTheme();

  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => customStyles(customTheme), [theme]);

  return { theme, styles };
}

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    primary: "#7BDFF2", // non-photo blue
    onPrimary: "#FFFFFF",
    primaryContainer: "#B2F7EF",
    onPrimaryContainer: "#003340",

    secondary: "#F2B5D4", // lavender pink
    onSecondary: "#FFFFFF",
    secondaryContainer: "#F7D6E0",
    onSecondaryContainer: "#3B1020",

    background: "#EFF7F6", // mint cream
    onBackground: "#1E1E1E",
    surface: "#FFFFFF",
    onSurface: "#1E1E1E",

    // you can add custom roles if you want
    customBlue: "#B2F7EF",
    customPink: "#F7D6E0"
  }
};