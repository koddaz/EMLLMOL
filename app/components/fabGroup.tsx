import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { useAppTheme } from "../constants/UI/theme";



export function FabContainer({ route, rootNavigation, handleSave } : any ) {
  const [open, setOpen] = useState(false);
  const isInputScreen = route.name === 'DiaryInput';

  if (route.name === 'DiaryCamera') {
    return null;
  }

  const actions = isInputScreen
    ? [
        {
          icon: 'camera',
          label: 'Take Photo',
          onPress: () => rootNavigation.navigate('Diary', { screen: 'DiaryCamera' })
        },

      ]
    : [
        {
          icon: 'cog',
          label: 'Settings',
          onPress: () => rootNavigation.navigate('Settings')
        },
        {
          icon: 'chart-line',
          label: 'Statistics',
          onPress: () => rootNavigation.navigate('Statistics')
        },
      ];

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible
        backdropColor={'transparent'}
        icon={open ? 'close' : isInputScreen ? 'content-save' : 'menu'}
        actions={actions}
        onStateChange={({open}) => setOpen(open)}
        onPress={() => {
          if (isInputScreen) {
            handleSave();
          } else {
            rootNavigation.navigate('Diary', { screen: 'DiaryInput' });
          }
        }}
      />
    </Portal>
  );
}