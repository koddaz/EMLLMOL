import { useAppTheme } from "@/app/constants/UI/theme";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

export function useNavBar() {
     const [isMenuVisible, setIsMenuVisible] = useState(false)


     return {

          setIsMenuVisible,
          isMenuVisible
     }
}

export function BottomNavBar({ insets, navigation, route, statsHook, navBarHook }: { insets: any, navigation: any, route: string, statsHook: any, navBarHook: any }) {

     const { theme, styles } = useAppTheme();
     const { currentSection, setCurrentSection } = statsHook
     const {isMenuVisible, setIsMenuVisible, toggleMenu} = navBarHook
     const slideAnim = useRef(new Animated.Value(0)).current


     useEffect(() => {
          Animated.timing(slideAnim, {
               toValue: isMenuVisible ? 1 : 0,
               duration: 300,
               useNativeDriver: true,
          }).start();
     }, [isMenuVisible, slideAnim])

     const button = (title: string, section: string, icon: string, nav?: boolean,) => {
          const isActive = nav ? false : currentSection === section;
          return (
               <Pressable disabled={isActive ? true : false} style={{
                    
                    justifyContent: 'center',
                    backgroundColor: theme.colors.surface,

  
               }} onPress={() => {
                    if (nav) {
                         if (section === 'input') {
                              setIsMenuVisible(!isMenuVisible)
                              navigation.navigate('diary', { screen: 'input' });
                         } else {
                              setIsMenuVisible(!isMenuVisible)
                              navigation.navigate(section);
                         }
                    } else {
                         setCurrentSection(section);
                    }
               }}>
                    <View style={{
                         alignItems: 'center',
                         justifyContent: 'center',
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
                         <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                              {button(/* title */ 'Summary', /* section */ 'summary', /* icon */ 'chart-box-outline')}
                              {button(/* title */ 'Carbs', /* section */ 'carbs', /* icon */ 'bread-slice-outline')}
                              {button(/* title */ 'Glucose', /* section */ 'glucose', /* icon */ 'water-outline')}
                         </View>
                    );
               case 'main':
                    return (
                         <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1}}>
                              {button(/* title */ 'Stats', /* section */ 'stats', /* icon */ 'chart-bar', /* nav? */ true)}
                              {button(/* title */ 'New', /* section */ 'input', /* icon */ 'note-plus-outline', /* nav? */ true)}
                        </View>
                    );
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
               <View style={{flex: route === 'main' ? 2 : 1}}></View>
               
                    <Animated.View style={{
                         justifyContent: 'center',
                         height: 50,
                         flex: 1,
                         
                         marginRight: 8,
                         backgroundColor: theme.colors.surface,
                         borderRadius: 8,
                         elevation: 4,
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