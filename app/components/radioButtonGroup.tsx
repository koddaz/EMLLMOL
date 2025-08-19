import { customStyles } from "@/app/constants/UI/styles";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { RadioButton, Text, useTheme } from "react-native-paper";

export function RadioButtonGroup(
  { value, setValue, options, title, icon }: { value: string, setValue: (value: string) => void, options: any[], title?: string, icon?: any }
) {
  const { theme, styles } = useAppTheme();

  const groupedOptions = [];
  for (let i = 0; i < options.length; i += 2) {
    groupedOptions.push(options.slice(i, i + 2));
  }

  return (

    <View style={{ paddingHorizontal: 8 }}>
      <View style={styles.row}>
        <MaterialCommunityIcons name={icon || "circle"} size={24} color={theme.colors.onSurfaceVariant} />
        <Text style={{ fontSize: 16, fontWeight: '500', marginStart: 5, marginTop: 8, marginBottom: 8 }}>
          {title}
        </Text>
      </View>
      {groupedOptions.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, { justifyContent: 'center' }]}>
          {row.map((option) => (
            <View key={option} style={{ alignItems: 'center', flex: 1 }}>
              <RadioButton
                value={option}
                status={value === option ? 'checked' : 'unchecked'}
                onPress={() => setValue(option)}
              />
              <Text style={{ fontSize: 14 }}>{option}</Text>
            </View>
          ))}

          {/* Add empty space if row has only one item */}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View >
  )
}
