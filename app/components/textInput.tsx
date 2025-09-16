import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/app/constants/UI/theme';

interface CustomTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  
  // Multi-line specific
  multiline?: boolean;
  numberOfLines?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Icons
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  
  // Input behavior
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  maxLength?: number;
  
  // Validation & Error
  error?: boolean;
  errorText?: string;
  
  // Styling
  suffix?: string;
  prefix?: string;
  dense?: boolean;
  mode?: 'flat' | 'outlined';
  
  // Events
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Custom styling
  containerStyle?: any;
  inputStyle?: any;
}

export function CustomTextInput({
  value,
  onChangeText,
  placeholder = "Enter text...",
  disabled = false,
  
  // Multi-line
  multiline = false,
  numberOfLines = 1,
  minHeight,
  maxHeight,
  
  // Icons
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  
  // Input behavior
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  maxLength,
  
  // Validation
  error = false,
  errorText,
  
  // Styling
  suffix,
  prefix,
  dense = false,
  mode = 'outlined',
  
  // Events
  onFocus,
  onBlur,
  
  // Custom styling
  containerStyle,
  inputStyle
}: CustomTextInputProps) {
  const { theme, styles } = useAppTheme();

  // Dynamic height calculation for multiline
  const getInputHeight = () => {
    if (!multiline) return undefined;
    
    const defaultMinHeight = minHeight || (numberOfLines * 20 + 32);
    const defaultMaxHeight = maxHeight || defaultMinHeight;
    
    return {
      minHeight: defaultMinHeight,
      maxHeight: defaultMaxHeight
    };
  };

  // Dynamic content style for multiline
  const getContentStyle = () => {
    if (!multiline) return {};
    
    return {
      paddingTop: 12,
      paddingBottom: 8,
      paddingHorizontal: 8,
      textAlignVertical: 'top' as const,
      fontSize: 16,
      lineHeight: 20,
    };
  };

  return (
    <View style={[{ marginBottom: error && errorText ? 0 : 8 }, containerStyle]}>
      <TextInput
        mode={mode}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        
        // Colors
        outlineColor={error ? theme.colors.error : theme.colors.outlineVariant}
        activeOutlineColor={error ? theme.colors.error : theme.colors.primary}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        
        // Content
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        
        // Behavior
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        returnKeyType={multiline ? "default" : "done"}
        textAlignVertical={multiline ? "top" : "center"}
        
        // Styling
        dense={multiline ? false : dense}
        disabled={disabled}
        
        style={[
          getInputHeight(),
          {
            fontSize: 16,
            backgroundColor: theme.colors.surface,
          },
          inputStyle
        ]}
        
        contentStyle={[
          getContentStyle(),
          multiline && { textAlignVertical: 'top' }
        ]}
        
        // Icons and affixes
        left={leftIcon ? (
          <TextInput.Icon 
            icon={leftIcon} 
            onPress={onLeftIconPress}
            color={theme.colors.onSurfaceVariant}
          />
        ) : (prefix ? (
          <TextInput.Affix text={prefix} />
        ) : undefined)}
        
        right={rightIcon ? (
          <TextInput.Icon 
            icon={rightIcon} 
            onPress={onRightIconPress}
            color={theme.colors.onSurfaceVariant}
          />
        ) : (suffix ? (
          <TextInput.Affix text={suffix} />
        ) : undefined)}
      />
      
      {/* Error Message */}
      {error && errorText && (
        <HelperText type="error" visible={true}>
          {errorText}
        </HelperText>
      )}
    </View>
  );
}