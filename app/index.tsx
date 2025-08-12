import AuthScreen from '@/db/supabase/auth/authScreen';
import { supabase } from '@/db/supabase/supabase';
import React, { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { PaperProvider, useTheme } from 'react-native-paper';
import { RootNavigation } from './tabs/rootNavigation';
import { customStyles } from './constants/UI/styles';
import { LoadingScreen } from './components/loadingScreen';
import { AppData } from './constants/interface/appData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import { SafeAreaProvider } from 'react-native-safe-area-context';


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Index() {
  const theme = useTheme();
  const styles = customStyles(theme);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing application...');
        setIsLoading(true);
        setError(null);

        // 1. Get session
        console.log('📱 Checking authentication session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        let profileData = null;
        let diaryEntries = [];

        // 2. If user is logged in, fetch their profile AND diary entries
        if (session?.user?.id) {
          console.log('👤 Fetching user profile and diary entries...');

          try {
            // Fetch profile
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select(`username, full_name, avatar_url`)
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Profile error:', profileError);
            } else if (data) {
              profileData = {
                username: data.username,
                fullName: data.full_name,
                avatarUrl: data.avatar_url
              };
              console.log('✅ Profile loaded');
            }

            // Fetch diary entries
            console.log('📔 Loading diary entries...');
            const { data: entriesData, error: entriesError } = await supabase
              .from('entries')
              .select('*')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false });

            if (entriesError) {
              console.error('❌ Failed to load diary entries:', entriesError);
            } else {
              diaryEntries = entriesData || [];
              console.log(`✅ Loaded ${diaryEntries.length} diary entries`);
            }

          } catch (error) {
            console.warn('Profile/entries fetch failed:', error);
          }
        }

        // 3. Load AsyncStorage settings
        console.log('⚙️ Loading local settings...');
        const [savedWeight, savedGlucose] = await Promise.all([
          AsyncStorage.getItem('weight'),
          AsyncStorage.getItem('glucose')
        ]);

        const settings = {
          weight: savedWeight || 'kg',
          glucose: savedGlucose || 'mmol'
        };

        console.log('✅ Settings loaded:', settings);

        // 4. Set all app data at once - including diary entries
        setAppData({
          session,
          permission: cameraPermission,
          requestCameraPermission,
          profile: profileData,
          settings,
          diaryEntries, // Add diary entries to initial app data
          isEntriesLoaded: true // Flag to indicate entries are loaded
        });

        setIsInitialized(true);
        console.log('✅ Application initialized successfully');

      } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        // Update appData but keep permission and requestCameraPermission
        setAppData(prev => prev ? {
          ...prev,
          session: null,
          profile: null,
          diaryEntries: [],
          isEntriesLoaded: false
        } : null);
        setIsInitialized(false);
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        setIsInitialized(false);
        initializeApp();
      }
    });

    // Only initialize if not already done
    if (!isInitialized) {
      initializeApp();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [cameraPermission, isInitialized]);

  useEffect(() => {
    if (appData) {
      setAppData(prev => prev ? {
        ...prev,
        permission: cameraPermission,
        requestCameraPermission
      } : null);
    }
  }, [cameraPermission, requestCameraPermission]);

  // Show loading screen until everything is ready
  if (isLoading || !isInitialized) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <View style={styles.background}>
            <LoadingScreen />
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
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

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={styles.background}>
          {appData?.session && appData.session.user ? (
            <RootNavigation appData={appData} />
          ) : (
            <AuthScreen />
          )}
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}










