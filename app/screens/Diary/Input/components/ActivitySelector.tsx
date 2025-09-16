import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { FlatList, View } from "react-native";
import { Button, RadioButton, Text } from "react-native-paper";

interface ActivitySelectorProps {
  dbHook: any;
  diaryState: {
    activity: string;
    setActivity: (value: string) => void;
  };
  isSaving: boolean;
}

export const ActivitySelector = React.memo(function ActivitySelector({ dbHook, diaryState, isSaving }: ActivitySelectorProps) {
  const { theme, styles } = useAppTheme();
  
  return (
    <View style={[styles.box, { flex: 1, marginLeft: 4 }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="run-fast" size={20} color={theme.colors.onPrimaryContainer} />
        <Text variant="titleMedium" style={{ marginLeft: 8, color: theme.colors.onPrimaryContainer }}>
          Activity
        </Text>
      </View>
      <View style={styles.content}>
        <RadioButton.Group 
          onValueChange={newValue => diaryState.setActivity(newValue)} 
          value={diaryState.activity}
        >
          <FlatList
            data={dbHook.activityOptions}
            numColumns={2}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <RadioButton value={item} />
                <Text variant="labelSmall">
                  {item}
                </Text>
              </View>
            )}
            columnWrapperStyle={{ justifyContent: 'space-evenly' }}
            scrollEnabled={false}
          />
        </RadioButton.Group>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
});