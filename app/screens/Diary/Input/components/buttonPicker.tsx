import { useAppTheme } from "@/app/constants/UI/theme";
import { View } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";

export function ButtonPicker({
  value,
  setValue,
  valueArray,
  iconName = "food"
}: {
  value: string;
  valueArray: string[];
  setValue: (value: string) => void;
  iconName?: string;
}) {
  const { theme, styles } = useAppTheme();

  return (
    <View style={styles.boxPicker}>
      <View style={styles.row}>
        <View style={{ paddingHorizontal: 10, width: 44 }}>
          <Icon source={iconName} size={24} />
        </View>
        <View style={[styles.content, { 
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1
        }]}>
          {valueArray.map((item) => {
            const isSelected = value === item;
            return (
              <View
                key={item}
                style={{
                  alignItems: 'center',
                  flex: 1,
                  marginHorizontal: 1
                }}
              >
                <IconButton
                  icon={isSelected ? "radiobox-marked" : "radiobox-blank"}
                  iconColor={isSelected ? theme.colors.primary : theme.colors.outline}
                  size={24}
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
    </View>
  );
}