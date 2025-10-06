import { useAppTheme } from "@/app/constants/UI/theme";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export function useNavBar() {
     const [isMenuVisible, setIsMenuVisible] = useState(false)

     const [settingsSection, setSettingsSection] = useState<"app" | "profile">("app")
     const [statsSection, setStatsSection] = useState<'summary' | 'carbs' | 'glucose'>('summary');


     return {
          statsSection, setStatsSection,

          settingsSection, setSettingsSection,

          setIsMenuVisible,
          isMenuVisible
     }
}

export function BottomNavBar({ insets, navigation, route, navBarHook }: { insets: any, navigation: any, route: string, statsHook: any, navBarHook: any }) {

     const { theme, styles } = useAppTheme();
     const {
          settingsSection,
          setSettingsSection,
          statsSection,
          setStatsSection,
     } = navBarHook


     const { isMenuVisible, setIsMenuVisible } = navBarHook

     const slideAnim = useRef(new Animated.Value(0)).current


     useEffect(() => {
          Animated.timing(slideAnim, {
               toValue: isMenuVisible ? 1 : 0,
               duration: 300,
               useNativeDriver: true,
          }).start();
     }, [isMenuVisible, slideAnim])

     const button = (title: string, section: string, icon: string, nav?: boolean,) => {
          const isActive = nav ? false : 
               route === 'stats' ? statsSection === section :
               route === 'settings' ? settingsSection === section :
               false;
          return (
               <Pressable disabled={isActive ? true : false} style={{

                    justifyContent: 'center',
                    backgroundColor: theme.colors.surface,
                    borderRadius: 8,
                    elevation: 4,
                    borderWidth: 1,
               }} onPress={() => {
                    if (nav) {
                         if (section === 'input') {
                              setIsMenuVisible(!isMenuVisible)
                              navigation.navigate('diary', { screen: 'input' });
                         } else {
                              setIsMenuVisible(!isMenuVisible)
                              navigation.navigate(section);
                         }
                    } else if (section === 'summary' || section === 'carbs' || section === 'glucose') {
                         setStatsSection(section);
                    } else {
                         setSettingsSection(section)
                    }
               }}>
                    <View style={{
                         alignItems: 'center',
                         justifyContent: 'center',
                         padding: 16,
                         minWidth: 75,
                    }}>
                         <Icon source={icon} size={20} color={isActive ? theme.colors.tertiary : theme.colors.onSurface} />
                         <Text
                              numberOfLines={1}
                              variant="labelSmall"
                              style={{ color: isActive ? theme.colors.tertiary : theme.colors.onSurface }}>
                              {title}
                         </Text>
                    </View>
               </Pressable>
          )
     }

     const renderButtons = (route: string) => {
          switch (route) {
               case 'stats':
                    return (
                         <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 }}>
                              {button(/* title */ 'Summary', /* section */ 'summary', /* icon */ 'chart-box-outline')}
                              {button(/* title */ 'Carbs', /* section */ 'carbs', /* icon */ 'bread-slice-outline')}
                              {button(/* title */ 'Glucose', /* section */ 'glucose', /* icon */ 'water-outline')}
                         </View>
                    );
               case 'main':
                    return (
                         <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 }}>
                              {button(/* title */ 'Stats', /* section */ 'stats', /* icon */ 'chart-bar', /* nav? */ true)}
                              {button(/* title */ 'New', /* section */ 'input', /* icon */ 'note-plus-outline', /* nav? */ true)}
                         </View>
                    );

               case 'settings':
                    return (
                         <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 }}>
                              {button(/* title */ 'App', /* section */ 'app', /* icon */ 'cog')}
                              {button(/* title */ 'New', /* section */ 'profile', /* icon */ 'account')}
                         </View>
                    )
               default:
                    return null;
          }
     }

     return (
          <View style={{
               position: 'absolute',
               bottom: insets.bottom + 32,
               right: insets.right + 16,
               flexDirection: 'row',

          }}>
             
               <View style={{flex:1}} />
               <Animated.View style={{
                    justifyContent: 'center',
                    height: 50,
                    

                    marginRight: 8,
                    backgroundColor: 'transparent',
                    borderRadius: 8,
                    opacity: slideAnim,
                    transform: [{
                         scaleX: slideAnim
                    }],
                    transformOrigin: 'right center',
               }}>
                    {renderButtons(route)}
               </Animated.View>

               <Pressable style={{
                    width: 50,
                    height: 50,
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: 8,
                    elevation: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
               }} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                    <Icon source={isMenuVisible ? "chevron-right" : "menu"} size={25} color={theme.colors.onPrimaryContainer} />
               </Pressable>








          </View>

     );
}