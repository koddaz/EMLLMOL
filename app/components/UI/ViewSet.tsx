import { useAppTheme } from '@/app/constants/UI/theme';
import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text, Icon, IconButtonProps, IconButton } from 'react-native-paper';

interface setProps {
    
    // Optional: 
    headerBgColor?: any;
    headerTextColor?: any;
    contentBgColor?: any;
    headerButton?: boolean;
    headerButtonIcon?: any;
    onPress?: () => void;
    titleText?: string;
    footer?: ReactNode;
    iconColor?: any;
    titleSize?: any;
    iconSize?: number;
    topRadius?: number
    bottomRadius?: number

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
    iconColor,
    titleSize,
    iconSize,

    contentBgColor,
    content,
    footer,

    topRadius,
    bottomRadius

}: setProps) {

    const { theme } = useAppTheme()



    return (
        <View>
            <View style={{ backgroundColor: headerBgColor ? headerBgColor : theme.colors.primaryContainer, padding: 8, gap: 8, borderTopStartRadius: topRadius ? topRadius : 0, borderTopEndRadius: topRadius ? topRadius : 0 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', alignContent: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        
                            <Icon source={icon} size={iconSize? iconSize : 20} color={iconColor? iconColor : theme.colors.onPrimaryContainer} />
                        
                        
                            <Text variant={titleSize? titleSize : 'titleMedium'} style={{
                                color: headerTextColor ? headerTextColor : theme.colors.onPrimaryContainer
                            }}>{title}</Text>

                            {titleText && (
                                <Text>{titleText}</Text>
                            )}

                      
                    </View>
                    {headerButton && (
                        <Pressable onPress={onPress}>
                            <Icon source={headerButtonIcon} size={25} />
                        </Pressable>

                    )}

                </View>
            </View>
            <View style={{ backgroundColor: contentBgColor ? contentBgColor : theme.colors.surface, paddingHorizontal: 16, paddingVertical: 16, borderBottomStartRadius: bottomRadius && !footer ? bottomRadius : 0, borderBottomEndRadius: bottomRadius && !footer ? bottomRadius : 0 }}>
                {content}
            </View>

            {footer && (
                <View style={{backgroundColor: headerBgColor ? headerBgColor : theme.colors.primaryContainer, padding: 8, borderBottomStartRadius: bottomRadius && footer ? bottomRadius : 0, borderBottomEndRadius: bottomRadius && footer ? bottomRadius : 0}}>
                    {footer}
                </View>

            )}
        </View>
    );
}