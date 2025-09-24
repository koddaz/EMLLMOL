import { useAppTheme } from "@/app/constants/UI/theme";
import { View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";

export function ButtonPicker({
  value,
  setValue,
  valueArray,
  iconName = "food",
  label
}: {
  value: string;
  valueArray: string[];
  setValue: (value: string) => void;
  iconName?: string;
  label?: string;
}) {
  const { theme, styles } = useAppTheme();

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      
      <View style={[styles.boxPicker, { flex: 1 }]}>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          flex: 1
        }}>
          {valueArray.map((item) => {
            const isSelected = value === item;
            return (
              <View
                key={item}
                style={{
                  alignItems: 'center',
                  marginBottom: 4
                }}
              >
                <IconButton
                  icon={isSelected ? "radiobox-marked" : "radiobox-blank"}
                  iconColor={isSelected ? theme.colors.primary : theme.colors.outline}
                  size={20}
                  onPress={() => setValue(item)}
                  style={{
                    margin: 0,
                  }}
                />
                <Text variant={"labelSmall"} style={{
                  color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                  textAlign: 'center',
                  fontWeight: isSelected ? '600' : '400',
                  marginTop: -4
                }}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>


      {label && (
        <Text
          variant="bodySmall"
          style={{
            position: 'absolute',
            top: -6,
            left: 12,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 4,
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
            fontWeight: '400',
            zIndex: 1
          }}
        >
          {label}
        </Text>
      )}
    </View>

  );
}