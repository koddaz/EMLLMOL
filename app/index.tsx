import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import { useEffect, useState, useRef, useMemo } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from './components/loadingScreen';
import { AppData } from './constants/interface/appData';
import { customLightTheme, customDarkTheme, customTheme } from './constants/UI/theme';
import { RootNavigation } from './navigation/rootNav';
import { useDB } from './hooks/useDB';
import { useAuth } from './hooks/useAuth';

export default function Index() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>('Main');
  const [currentScreen, setCurrentScreen] = useState<string>('Main');

  // Select theme based on appData settings
  const activeTheme = useMemo(() => {
    if (!appData?.settings?.themeMode) return customLightTheme;
    return appData.settings.themeMode === 'dark' ? customDarkTheme : customLightTheme;
  }, [appData?.settings?.themeMode]);

  const authHook = useAuth(appData?.session, true, setAppData)

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      const initialData = await authHook.initializeApp();
      if (initialData) {
        setAppData(initialData);
      }
    };
    initialize();
  }, []);


  // Fetch profile once session is available (entries are fetched by DiaryScreen on focus)
  useEffect(() => {
    if (appData?.session?.user?.id) {
      const fetchProfile = async () => {
        try {
          await authHook.getProfile();
          console.log('✅ Profile fetched successfully');

          // Check if this is first login
          const isFirstLogin = await authHook.checkFirstLogin();
          console.log('🔍 First login check:', isFirstLogin);

          // Update appData with first login status
          setAppData((prev: AppData | null) => {
            if (!prev) return null;
            return {
              ...prev,
              isFirstLogin
            };
          });

          // Mark welcome as seen for future logins
          if (isFirstLogin) {
            await authHook.markWelcomeSeen();
          }
        } catch (error) {
          console.error('❌ Failed to fetch profile:', error);
        }
      };

      fetchProfile();
    }
  }, [appData?.session?.user?.id]); // Only run when session user ID changes

  // Error state
  // if (authHook.error) {
  //   return (
  //     <SafeAreaProvider>
  //       <PaperProvider theme={customTheme}>
  //         <View style={styles.background}>
  //           <View style={styles.container}>
  //             <Text style={{ color: 'red', textAlign: 'center' }}>
  //               Failed to initialize app: {authHook.error}
  //             </Text>
  //           </View>
  //         </View>
  //       </PaperProvider>
  //     </SafeAreaProvider>
  //   );
  // }

  // Main render
  return (



    <GestureHandlerRootView>
      <PaperProvider theme={activeTheme}>
        <SafeAreaProvider >
          <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.colors.primaryContainer }}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                const routeName = navigationRef.current?.getCurrentRoute()?.name;
                if (routeName) {
                  routeNameRef.current = routeName;
                  setCurrentScreen(routeName);
                }
              }}
              onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName && currentRouteName) {
                  // Screen changed
                  routeNameRef.current = currentRouteName;
                  setCurrentScreen(currentRouteName);
                  console.log('Screen changed from', previousRouteName, 'to', currentRouteName);
                }
              }}
            >

    
                <RootNavigation appData={appData} setAppData={setAppData} currentScreen={currentScreen} authHook={authHook} />

            </NavigationContainer>
          </SafeAreaView>

        </SafeAreaProvider>

      </PaperProvider>
    </GestureHandlerRootView>

  );

}