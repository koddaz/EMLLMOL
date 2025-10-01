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
    <View style={{ position: 'relative' }}>

      <View style={[styles.boxPicker]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}>
          <View style={{ paddingLeft: 8, paddingRight: 16 }}>
            <Icon source={iconName} size={20} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            {valueArray.map((item) => {
              const isSelected = value === item;
              return (
                <View
                  key={item}
                  style={{
                    alignItems: 'center',
                    paddingVertical: 4,
                  }}
                >
                  <IconButton
                    icon={isSelected ? "radiobox-marked" : "radiobox-blank"}
                    iconColor={isSelected ? theme.colors.primary : theme.colors.outline}
                    size={20}
                    onPress={() => setValue(item)}
                    style={{
                      margin: 0,
                      padding: 0,
                    }}
                  />
                  <Text variant={"labelSmall"} style={{
                    color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                    textAlign: 'center',
                    fontWeight: isSelected ? '600' : '400',
                    marginTop: -8,
                    fontSize: 12,
                  }}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>


      {label && (
        <Text
          variant="bodySmall"
          style={{
            position: 'absolute',
            top: -2,
            left: 12,
            backgroundColor: 'transparent',
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