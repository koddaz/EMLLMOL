import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { useAppTheme } from "../constants/UI/theme";
import { useNavigation } from '@react-navigation/native';

export function FabContainer({ route, handleSave, diaryState } : any ) {
  const { theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const isInputScreen = route?.name === 'DiaryInput';
  const editingEntryId = route?.params?.diaryData?.id;
  
  // Check if required fields are filled for save button
  const canSave = diaryState?.glucose?.trim() && diaryState?.carbs?.trim();

  if (route.name === 'DiaryCamera') {
    return null;
  }

  if (isInputScreen) {
    // Input screen: Large save button + small camera button (always open)
    return (
      <Portal>
        <FAB.Group
          open={true}
          visible
          backdropColor={'transparent'}
          icon={'content-save'}
          actions={[
            {
              icon: 'camera',
              label: 'Take Photo',
              onPress: () => navigation.navigate('Diary', { screen: 'DiaryCamera' })
            }
          ]}
          onStateChange={() => {}} // Prevent state changes
          onPress={() => {
            if (canSave) {
              handleSave(editingEntryId);
            }
          }}
          fabStyle={{
            opacity: canSave ? 1 : 0.5
          }}
        />
      </Portal>
    );
  } else {
    // Main screen: Menu button that only toggles + 3 action buttons
    return (
      <Portal>
        <FAB.Group
          open={open}
          visible
          backdropColor={'transparent'}
          icon={open ? 'close' : 'menu'}
          actions={[
            {
              icon: 'cog',
              label: 'Settings',
              onPress: () => {
                setOpen(false);
                navigation.navigate('Settings');
              }
            },
            {
              icon: 'chart-line',
              label: 'Statistics',
              onPress: () => {
                setOpen(false);
                navigation.navigate('Statistics');
              }
            },
            {
              icon: 'plus',
              label: 'Add Entry',
              onPress: () => {
                setOpen(false);
                navigation.navigate('Diary', { screen: 'DiaryInput' });
              }
            }
          ]}
          onStateChange={({open}) => setOpen(open)}
          onPress={() => {
            // Menu button only toggles the FAB group
            setOpen(!open);
          }}
        />
      </Portal>
    );
  }
}