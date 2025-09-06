import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { useAppTheme } from "../constants/UI/theme";

interface FabAction {
     icon: string;
     label: string;
     onPress?: () => void;
}

interface FABProps {
     open: boolean;
     onPress: () => void;
     actions: FabAction[];
     navigation: any;
}

export function FabGroup({ open: initialOpen, onPress, actions, navigation }: FABProps) {
     const { theme, styles } = useAppTheme();

     const [state, setState] = useState({ open: initialOpen });

     const onStateChange = ({ open }: { open: boolean }) => setState({ open });

     const { open } = state;

     const allActions = [
          {
               icon: 'close',
               label: '',
               onPress: () => { setState({ open: false }) }
          },
          ...actions
     ];

     return (
          <Portal>
               <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'note-plus' : 'plus'}
                    actions={

                         allActions.map(action => ({
                              icon: action.icon,
                              label: action.label,
                              onPress: action.onPress || (() => console.log(`Pressed ${action.label}`)),
                         }))
                    }
                    onStateChange={onStateChange}
                    onPress={() => {
                         if (open) {
                              onPress();
                         } else {

                         }
                    }}
               />
          </Portal>
     );
}