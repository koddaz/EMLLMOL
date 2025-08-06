

import AuthScreen from '@/db/supabase/auth/authScreen';
import { supabase } from '@/db/supabase/supabase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from "react";
import { AppState, SafeAreaView, Text, View } from "react-native";
import { BottomNavigation, PaperProvider, useTheme } from 'react-native-paper';
import { RootNavigation } from './tabs/rootNavigation';
import { customStyles } from './constants/UI/styles';
import { LoadingScreen } from './components/loadingScreen';
import { AppData } from './constants/interface/appData';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // 2. If user is logged in, fetch their profile
        if (session?.user?.id) {
          console.log('👤 Fetching user profile...');
          try {
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
          } catch (profileError) {
            console.warn('Profile fetch failed:', profileError);
          }
        }

        // 3. Load AsyncStorage settings
        console.log('⚙️ Loading local settings...');
        const [savedWeight, savedGlucose] = await Promise.all([
          AsyncStorage.getItem('weight'),
          AsyncStorage.getItem('glucose')
        ]);

        const settings = {
          weight: savedWeight || 'kg', // Default to 'kg' if not found
          glucose: savedGlucose || 'mmol' // Default to 'mmol' if not found
        };

        console.log('✅ Settings loaded:', settings);

        // 4. Set all app data at once
        setAppData({
          session,
          profile: profileData,
          settings
        });

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
        setAppData(prev => prev ? { ...prev, session: null, profile: null } : null);
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        // Re-initialize app data when user signs in
        initializeApp();
      }
    });

    initializeApp();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.background}>
        <PaperProvider>
          <LoadingScreen />
        </PaperProvider>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.background}>
        <PaperProvider>
          <View style={styles.container}>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              Failed to initialize app: {error}
            </Text>
          </View>
        </PaperProvider>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <PaperProvider>
        {appData?.session && appData.session.user ? (
          <RootNavigation appData={appData} />
        ) : (
          <AuthScreen />
        )}
      </PaperProvider>
    </View>
  );
}










