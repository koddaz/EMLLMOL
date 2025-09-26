import AuthScreen from '@/app/api/supabase/auth/authScreen';
import { supabase } from '@/app/api/supabase/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState, useCallback, useRef } from "react";
import { AppState, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LoadingScreen } from './components/loadingScreen';
import { AppData } from './constants/interface/appData';
import { DiaryData } from './constants/interface/diaryData';
import { customTheme, useAppTheme } from './constants/UI/theme';


import { DiaryNav } from './navigation/nestedNavigation';
import { RootNavigation } from './navigation/rootNav';
import { useDB } from './hooks/useDB';
import { useCalendar } from './hooks/useCalendar';





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

  // Separate function to fetch diary entries
  const fetchDiaryEntries = useCallback(async (userId: string): Promise<DiaryData[]> => {
    try {
      console.log('📔 Fetching diary entries for user:', userId);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)  // FIXED: Changed from 'user_id' to 'userId'
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to load diary entries:', error);
        return [];
      }

      // Transform the data to match DiaryData interface
      const transformedData: DiaryData[] = (data || []).map(item => ({
        id: item.id.toString(),
        created_at: new Date(item.created_at),
        glucose: item.glucose || 0,
        carbs: item.carbs || 0,
        insulin: item.insulin || 0,
        meal_type: item.meal_type || '',
        activity_level: item.activity_level || '',
        note: item.note || '',
        uri_array: item.uri_array || []
      }));

      console.log(`✅ Loaded ${transformedData.length} diary entries`);
      return transformedData;
    } catch (err) {
      console.error('❌ Error fetching diary entries:', err);
      return [];
    }
  }, []);

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
        dateFormat: savedDateFormat || 'DD/MM/YYYY'
      };
    };

    // Separate function to fetch profile
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`username, full_name, avatar_url`)
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Profile error:', error);
          return null;
        }

        if (data) {
          return {
            username: data.username,
            fullName: data.full_name,
            avatarUrl: data.avatar_url
          };
        }

        return null;
      } catch (err) {
        console.error('Profile fetch error:', err);
        return null;
      }
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

        // User is authenticated - fetch their data
        console.log('👤 User authenticated:', session.user.email);

        // Fetch profile and diary entries in parallel
        const [profile, diaryEntries] = await Promise.all([
          fetchProfile(session.user.id),
          fetchDiaryEntries(session.user.id)
        ]);

        // Set all data
        setAppData({
          session,
          profile,
          settings,
          diaryEntries,
          isEntriesLoaded: true
        });

        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }, [fetchDiaryEntries]);

    // Refresh entries function that can be passed down


    // Initial load
    useEffect(() => {
      initializeApp();
    }, []);

    // Auth state listener
    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);

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
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [initializeApp]);



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
              <AuthScreen />
            )}
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>

    );

  }