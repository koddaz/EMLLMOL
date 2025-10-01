import { useAppTheme } from '@/app/constants/UI/theme';
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text, Icon, IconButtonProps, IconButton } from 'react-native-paper';

interface setProps {

    // Optional: 
    headerBgColor?: any;
    headerTextColor?: any;
    contentBgColor?: any;
    headerButton?: any;
    headerButtonIcon?: any;
    onPress?: () => void;
    titleText?: string;
    footer?: ReactNode;

    // Needed
    title: string;
    icon: string;
    content: ReactNode;

}

export function ViewSet({
    title,
    titleText,
    headerBgColor,
    headerTextColor,
    headerButton,
    headerButtonIcon,
    onPress,
    icon,

    contentBgColor,
    content,
    footer,

}: setProps) {

    const { theme } = useAppTheme()
    return (
        <View>
            <View style={{ backgroundColor: headerBgColor ? headerBgColor : theme.colors.surfaceVariant, padding: 8, gap: 8 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center', alignContent: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 8, flex: 1, }}>
                        <View>
                            <Icon source={icon} size={25} />
                        </View>
                        <View>
                            <Text variant='titleLarge' style={{
                                color: headerTextColor ? headerTextColor : theme.colors.onSurfaceVariant
                            }}>{title}</Text>

                            {titleText && (
                                <Text>{titleText}</Text>
                            )}

                        </View>
                    </View>
                    {headerButton && (
                        <Pressable onPress={onPress}>
                            <Icon source={headerButtonIcon} size={25} />
                        </Pressable>

                    )}

                </View>
            </View>
            <View style={{ backgroundColor: contentBgColor ? contentBgColor : theme.colors.surface, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
                {content}
            </View>

            {footer && (
                <View style={{backgroundColor: headerBgColor ? headerBgColor : theme.colors.surfaceVariant, padding: 8}}>
                    {footer}
                </View>

            )}
        </View>
    );
}