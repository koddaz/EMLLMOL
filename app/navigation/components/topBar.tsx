import { useAppTheme } from "@/app/constants/UI/theme";
import { Header } from "@react-navigation/elements";
import { Image, View } from "react-native";
import { IconButton } from "react-native-paper";

interface CustomHeaderProps {
  options: any;
  title?: string;
  showLogo?: boolean;
  leftButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
}

export function TopBar({
  options,
  title = '',
  showLogo = false,
  leftButton,
  rightButton
}: CustomHeaderProps) {
  const { theme } = useAppTheme();

  return (
    <View>
      <Header
        {...options}
        title={title}
        headerStyle={{
          backgroundColor: theme.colors.primary,

        }}
        headerTitleStyle={{
          fontWeight: 'bold',
          color: theme.colors.onPrimary
        }}
        headerLeft={leftButton ? () => (
          <IconButton
            iconColor={theme.colors.onSecondary}
            size={24}
            icon={leftButton.icon}
            mode="contained-tonal"
            onPress={leftButton.onPress}
            style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 12,
              margin: 0,
              marginLeft: 8,
              position: 'absolute',
              bottom: 4,
              left: 0,
            }}
          />
        ) : () => null}
        headerRight={rightButton ? () => (
          <IconButton
            iconColor={theme.colors.onSecondary}
            size={24}
            icon={rightButton.icon}
            mode="contained-tonal"
            onPress={rightButton.onPress}
            style={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 12,
              margin: 0,
              marginRight: 8,
              position: 'absolute',
              bottom: 4,
              right: 0,
            }}
          />
        ) : () => null}
      />
      {/* Logo extending below header */}
      {showLogo && (
        <View style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -30 }, { translateY: -20 }],
          zIndex: 10,
        }}>
          <Image
            source={require('../../../assets/images/logo-head.gif')}
            style={{
              width: 60,
              height: 60,
              resizeMode: 'contain',
            }}
          />
        </View>
      )}
    </View>
  );
}