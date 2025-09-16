import { useMemo } from 'react';
import { MD3LightTheme as DefaultTheme, useTheme } from 'react-native-paper';
import { customStyles } from './styles';
import { mainStyle } from '@/app/layout';



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
    primary: "#3D3B8E", // deep purple-blue
    onPrimary: "#FFFFFF",
    primaryContainer: "#6883BA", // lighter blue
    onPrimaryContainer: "#FFFFFF",
    secondary: "#E072A4", // bright pink
    onSecondary: "#FFFFFF",
    secondaryContainer: "#F9F9F9", // light gray/white
    onSecondaryContainer: "#3D3B8E",
    background: "#F9F9F9", // light background
    onBackground: "#3D3B8E",
    surface: "#FFFFFF",
    onSurface: "#3D3B8E",
    surfaceVariant: "#F9F9F9", // light backgrounds for subtle variations
    onSurfaceVariant: "#3D3B8E",
    outline: "#E0E0E0", // subtle borders and dividers
    // Custom color roles following the guide
    customBlue: "#6883BA", // info elements, neutral badges
    customPink: "#E072A4", // error states, delete actions
    customGreen: "#B0E298", // success states, positive feedback
    customDark: "#3D3B8E", // high contrast text, emphasis
    customLight: "#F9F9F9", // subtle backgrounds, disabled states
    customWarning: "#F39C12", // warning states
    // Semantic colors for better organization
    success: "#B0E298",
    onSuccess: "#3D3B8E",
    error: "#E072A4", 
    onError: "#FFFFFF",
    warning: "#F39C12",
    onWarning: "#3D3B8E",
    info: "#6883BA",
    onInfo: "#FFFFFF"
  }
};