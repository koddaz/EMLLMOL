import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { customStyles } from './styles';

export function useAppTheme() {
  const theme = useTheme();
  
  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => customStyles(theme), [theme]);
  
  return { theme, styles };
}