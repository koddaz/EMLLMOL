import AuthScreen from '@/app/api/supabase/auth/authScreen';
import { supabase } from '@/app/api/supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import { useEffect, useState, useCallback, useRef } from "react";
import { AppState, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from './components/loadingScreen';
import { AppData } from './constants/interface/appData';
import { DiaryData } from './constants/interface/diaryData';
import { customTheme, useAppTheme } from './constants/UI/theme';
import { RootNavigation } from './navigation/rootNav';
import { useDB } from './hooks/useDB';
import { useCalendar } from './hooks/useCalendar';
import { useAuth } from './hooks/useAuth';





AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
// Navigation will be created dynamically with appData

export default function Index() {
  const { theme, styles } = useAppTheme();

  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>('Main');
  const [currentScreen, setCurrentScreen] = useState<string>('Main');

  const handleAuthStateChange = async (event: string, session: any) => {
    if (event === 'SIGNED_OUT') {
      // Clear user data but keep settings
      const settings = await loadSettings();
      setAppData({
        session: null,
        profile: null,
        settings,
        diaryEntries: [],
        isEntriesLoaded: false
      });
    } else if (event === 'SIGNED_IN' && session?.user?.id) {
      // Re-initialize when signing in
      await initializeApp();
    }
  };

  const authHook = useAuth(appData?.session, true, handleAuthStateChange)
  const dbHook = useDB(appData!, setAppData)


    // Separate function to load settings
    const loadSettings = async () => {
      const [savedWeight, savedGlucose, savedClockFormat, savedDateFormat] = await Promise.all([
        AsyncStorage.getItem('weight'),
        AsyncStorage.getItem('glucose'),
        AsyncStorage.getItem('clockformat'),
        AsyncStorage.getItem('dateformat')
      ]);

      return {
        weight: savedWeight || 'kg',
        glucose: savedGlucose || 'mmol',
        clockFormat: savedClockFormat || '24h',
        dateFormat: savedDateFormat || 'en'
      };
    };


    // Main initialization function
    const initializeApp = useCallback(async () => {
      console.log('🚀 Initializing app...');
      setIsLoading(true);
      setError(null);

      try {
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          return;
        }

        // Load settings (always needed)
        const settings = await loadSettings();
        console.log('✅ Settings loaded:', settings);

        // If no session, show auth screen
        if (!session?.user?.id) {
          console.log('No user session - showing auth screen');
          setAppData({
            session: null,
            profile: null,
            settings,
            diaryEntries: [],
            isEntriesLoaded: false
          });
          setIsLoading(false);
          return;
        }

        // User is authenticated - set session first
        console.log('👤 User authenticated:', session.user.email);

        // Set session in appData so hooks can use it
        setAppData({
          session,
          profile: null,
          settings,
          diaryEntries: [],
          isEntriesLoaded: false
        });

        // Allow React to re-render with the new session, then fetch data
        // This will be handled by a useEffect that watches for session changes

        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }, []);

    // Refresh entries function that can be passed down


    // Initial load
    useEffect(() => {
      initializeApp();
    }, []);


    // Fetch profile and entries once session is available
    useEffect(() => {
      if (appData?.session?.user?.id && !appData.isEntriesLoaded) {
        console.log('Session available, fetching profile and entries...');

        const fetchUserData = async () => {
          try {
            // Use authHook for profile (now it has the session)
            await authHook.getProfile();

            // Use dbHook for entries (now it has the session via appData)
            await dbHook.retrieveEntries();

            console.log('✅ User data fetched successfully');
          } catch (error) {
            console.error('❌ Failed to fetch user data:', error);
          }
        };

        fetchUserData();
      }
    }, [appData?.session?.user?.id, appData?.isEntriesLoaded]);



    // Loading state
    if (isLoading) {
      return (


        <SafeAreaProvider>
          <PaperProvider theme={customTheme}>
            <View style={styles.background}>
              <LoadingScreen />
            </View>
          </PaperProvider>
        </SafeAreaProvider>

      );
    }

    // Error state
    if (error) {
      return (
        <SafeAreaProvider>
          <PaperProvider theme={customTheme}>
            <View style={styles.background}>
              <View style={styles.container}>
                <Text style={{ color: 'red', textAlign: 'center' }}>
                  Failed to initialize app: {error}
                </Text>
              </View>
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      );
    }

    // Main render
    return (



      <GestureHandlerRootView>
        <PaperProvider theme={customTheme}>
          <SafeAreaProvider>
            {appData?.session && appData.session.user ? (

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

                <RootNavigation appData={appData} setAppData={setAppData} currentScreen={currentScreen} />

              </NavigationContainer>
            ) : (
              <AuthScreen  />
            )}
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>

    );

  }