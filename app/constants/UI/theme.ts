import { useMemo } from 'react';
import { MD3LightTheme as DefaultTheme, useTheme } from 'react-native-paper';
import { customStyles } from './styles';




export function useAppTheme() {
  // Use customTheme instead of the default theme from useTheme()
  const theme = customTheme;

  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => customStyles(customTheme), []);


  return { theme, styles };
}

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3d7068", // deep teal-green
    onPrimary: "#FFFFFF",
    primaryContainer: "#43c59e", // bright teal
    onPrimaryContainer: "#14453d",
    secondary: "#3dfaff", // bright cyan
    onSecondary: "#14453d",
    secondaryContainer: "#48beff", // light blue
    onSecondaryContainer: "#14453d",
    background: "#F9F9F9", // light background
    onBackground: "#14453d",
    surface: "#FFFFFF",
    onSurface: "#14453d",
    surfaceVariant: "#F9F9F9", // light backgrounds for subtle variations
    onSurfaceVariant: "#3d7068",
    outline: "#E0E0E0", // subtle borders and dividers
    
    // Custom color roles using your palette
    customBlue: "#48beff", // light blue for info elements
    customCyan: "#3dfaff", // bright cyan for highlights
    customTeal: "#43c59e", // teal for success states
    customDarkTeal: "#3d7068", // dark teal for emphasis
    customDarkGreen: "#14453d", // darkest for high contrast text
    customLight: "#F9F9F9", // subtle backgrounds, disabled states
    customWarning: "#F39C12", // warning states (keeping from original)
    
    // Semantic colors for better organization
    success: "#43c59e", // teal
    onSuccess: "#14453d",
    error: "#E072A4", // keeping pink from original for contrast
    onError: "#FFFFFF",
    warning: "#F39C12",
    onWarning: "#14453d",
    info: "#48beff", // light blue
    onInfo: "#14453d",

    none:  "#F9F9F9",
    low:  '#E3F5FF',
    medium: '#E0F7EF',
    high: '#D4E7E4'
  }
};