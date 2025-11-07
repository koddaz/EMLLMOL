import { useMemo } from 'react';
import { MD3LightTheme as DefaultLightTheme, MD3DarkTheme as DefaultDarkTheme, useTheme } from 'react-native-paper';
import { customStyles } from './styles';

// Type for theme variants
export type ThemeMode = 'light' | 'dark';

export function useAppTheme() {
  // Get theme from PaperProvider context
  const theme = useTheme();

  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => customStyles(theme), [theme]);

  // Determine if dark mode by checking background color
  const themeMode: ThemeMode = theme.dark ? 'dark' : 'light';

  return { theme, styles, themeMode };
}

// Light Theme - based on new pink/slate logo palette
export const customLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    // Primary family - Slate blue from logo icon
    primary: "#4A5F72", // slate blue from blood drop icon
    onPrimary: "#FFFFFF",
    primaryContainer: "#D4E3F0", // light slate blue
    onPrimaryContainer: "#1E2833",

    // Secondary family - Mauve pink from logo text
    secondary: "#C9A3C3", // mauve pink
    onSecondary: "#FFFFFF",
    secondaryContainer: "#F5E8F3", // very light mauve
    onSecondaryContainer: "#3D1F39",

    // Tertiary family - Soft pink from logo gradient
    tertiary: "#E8C5D8", // soft pink
    onTertiary: "#4A2F42",
    tertiaryContainer: "#F9E5EF", // very light pink
    onTertiaryContainer: "#2F1829",

    // Background & Surface
    background: "#FFF8FB", // very light pink background
    onBackground: "#1E1B1E",
    surface: "#FFFFFF",
    onSurface: "#1E1B1E",
    surfaceVariant: "#F5F0F3", // light pink-tinted surface
    onSurfaceVariant: "#4A5F72",
    outline: "#D9CCD4", // soft pink-gray border
    outlineVariant: "#EBE3E8",

    // Shadows and overlays
    shadow: "#000000",
    scrim: "#000000",
    backdrop: "rgba(74, 95, 114, 0.4)", // slate blue with transparency

    // Elevation tints
    elevation: {
      level0: "transparent",
      level1: "#FAF5F8",
      level2: "#F7F2F5",
      level3: "#F5EFF3",
      level4: "#F3EDF1",
      level5: "#F0EAF0"
    },

    // Semantic colors
    success: "#A8D5BA", // soft mint green
    onSuccess: "#1E4D2B",
    successContainer: "#E5F5EB",
    onSuccessContainer: "#1E4D2B",

    error: "#E072A4", // rose pink (fits the palette!)
    onError: "#FFFFFF",
    errorContainer: "#FFEBF1",
    onErrorContainer: "#5D1138",

    warning: "#F5C98D", // warm peach
    onWarning: "#4D3517",
    warningContainer: "#FFF4E6",
    onWarningContainer: "#4D3517",

    info: "#9DB8D4", // soft blue
    onInfo: "#1E3448",
    infoContainer: "#E8F1F9",
    onInfoContainer: "#1E3448",

    // Activity level colors - pink/mauve variations
    none: "#FFF8FB",
    low: "#EFE3F0",
    medium: "#E8D5E8",
    high: "#D9C5D9",

    // Camera flash colors (keep functional)
    flashAuto: '#F5C98D',
    flash: '#FFE5A0',
    flashOff: '#4A5F72',

    // Chart colors
    chartGrid: "#EBE3E8",
    chartLabel: "#6B7E92",

    // Meal type colors
    mealBreakfast: "#F5C98D", // warm peach
    mealLunch: "#E89BB5", // rose
    mealDinner: "#B4A5D8", // lavender
    mealSnack: "#A8D5BA", // mint
  }
};

// Dark Theme - inverted palette
export const customDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    // Primary family - Light mauve for dark mode
    primary: "#E8C5D8", // light pink/mauve
    onPrimary: "#2F1829",
    primaryContainer: "#5F3F54", // medium mauve
    onPrimaryContainer: "#FFE5F0",

    // Secondary family - Muted slate
    secondary: "#9BAAB8", // light slate
    onSecondary: "#1E2833",
    secondaryContainer: "#3D4B5C", // medium slate
    onSecondaryContainer: "#D4E3F0",

    // Tertiary family - Soft lavender
    tertiary: "#C9B5D4", // lavender
    onTertiary: "#2F1F39",
    tertiaryContainer: "#463556", // deep lavender
    onTertiaryContainer: "#E8DCEF",

    // Background & Surface
    background: "#0F0D10", // very dark with slight pink tint
    onBackground: "#EBE3E8",
    surface: "#1E1B1E", // dark slate surface
    onSurface: "#EBE3E8",
    surfaceVariant: "#2B2730", // dark pink-tinted surface
    onSurfaceVariant: "#C9B5D4",
    outline: "#5F5563", // medium gray-purple
    outlineVariant: "#3D3640",

    // Shadows and overlays
    shadow: "#000000",
    scrim: "#000000",
    backdrop: "rgba(232, 197, 216, 0.4)", // pink with transparency

    // Elevation tints
    elevation: {
      level0: "transparent",
      level1: "#251F24",
      level2: "#2B2529",
      level3: "#312A2E",
      level4: "#352E33",
      level5: "#3A3338"
    },

    // Semantic colors
    success: "#7FB896", // muted mint
    onSuccess: "#1E4D2B",
    successContainer: "#2F5D3E",
    onSuccessContainer: "#C8E8D5",

    error: "#E89BB5", // light rose
    onError: "#5D1138",
    errorContainer: "#7D2650",
    onErrorContainer: "#FFD6E5",

    warning: "#E5B678", // muted peach
    onWarning: "#4D3517",
    warningContainer: "#6B4D25",
    onWarningContainer: "#FFE8C8",

    info: "#8BA4BF", // muted blue
    onInfo: "#1E3448",
    infoContainer: "#2E4A62",
    onInfoContainer: "#D4E3F0",

    // Activity level colors - darker variants
    none: "#1E1B1E",
    low: "#332D38",
    medium: "#463F4D",
    high: "#5A5262",

    // Camera flash colors
    flashAuto: '#E5B678',
    flash: '#FFD9A0',
    flashOff: '#9BAAB8',

    // Chart colors
    chartGrid: "#3D3640",
    chartLabel: "#9BAAB8",

    // Meal type colors - darker variants
    mealBreakfast: "#E5B678",
    mealLunch: "#D88AA5",
    mealDinner: "#9B8BC4",
    mealSnack: "#7FB896",
  }
};

// Export default light theme for backward compatibility
export const customTheme = customLightTheme;