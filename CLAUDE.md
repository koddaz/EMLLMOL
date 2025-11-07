# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMLLMOL is a React Native Expo app for diabetes management. The app uses Supabase for authentication and data storage, and React Native Paper for UI components.

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npx expo start` - Start development server with Metro bundler
- `npm run android` or `expo run:android` - Run on Android emulator/device
- `npm run ios` or `expo run:ios` - Run on iOS simulator/device
- `npm run web` or `expo start --web` - Run web version in browser
- `npm run lint` or `expo lint` - Run ESLint checks

### Custom Scripts
- `npm run reset-project` - Reset to starter template

### Environment Setup
- Create `.env` file with Supabase credentials:
  - `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (not the service role key)

## Architecture Overview

### App Structure
- **Entry Point**: `app/index.tsx` - Main app component with authentication and data initialization
- **Navigation**: Uses Expo Router with file-based routing, centralized in `app/navigation/`
- **State Management**: Props drilling with AppData interface, no global state management
- **Authentication**: Supabase Auth with session management and auto-refresh
- **Database**: Supabase for profiles and diary entries storage
- **UI**: React Native Paper with custom theming in `app/constants/UI/theme.ts`

### Key Directories
- `app/screens/` - All screen components organized by feature
- `app/components/` - Reusable UI components
- `app/hooks/` - Custom hooks for database, camera, calendar, auth
- `app/constants/` - TypeScript interfaces and UI constants
- `app/navigation/` - Navigation configuration
- `app/api/supabase/` - Supabase client and authentication


### Data Flow
1. **App Initialization** (`app/index.tsx`):
   - Calls `authHook.initializeApp()` to load session and settings
   - Sets up auth state change listeners
   - Fetches user profile once session is available
2. **Authentication Flow**:
   - Supabase Auth with deep link handling for email confirmations
   - Session stored in AsyncStorage and auto-refreshed
   - Auth state changes propagate through `useAuth` hook
3. **Data Management**:
   - Local settings (weight, glucose units, date/clock format) stored in AsyncStorage
   - Diary entries fetched on-demand via `dbHook.retrieveEntries()`
   - DiaryScreen uses `useFocusEffect` to refresh entries when screen comes into focus
4. **State Updates**:
   - **CRITICAL**: `useDB` hook must receive both `appData` AND `setAppData` parameters to properly update global state
   - When saving/updating/deleting entries, the hook automatically calls `retrieveEntries()` to refresh data
   - State flows down through props (no global state manager like Redux)

### Key Interfaces
- `AppData` (`app/constants/interface/appData.ts`) - Main app state container:
  - `session`: Supabase session object
  - `profile`: User profile (username, fullName, avatarUrl)
  - `settings`: App preferences (weight unit, glucose unit, date/clock format)
  - `diaryEntries`: Array of diary entries
  - `isEntriesLoaded`: Boolean flag for tracking entry load state
- `DiaryData` (`app/constants/interface/diaryData.ts`) - Diary entry structure:
  - `id`: Entry UUID
  - `created_at`: Timestamp
  - `glucose`: Blood glucose reading
  - `carbs`: Carbohydrate intake
  - `insulin`: Insulin dosage
  - `meal_type`: One of "snack", "breakfast", "lunch", "dinner"
  - `activity_level`: One of "none", "low", "medium", "high"
  - `note`: Optional text note
  - `uri_array`: Array of photo URIs
- `NavData` & `HookData` (`app/navigation/rootNav.tsx`) - Navigation and hook props passed to screens

### Dependencies
- **Expo SDK 53** with new architecture enabled
- **React Native Paper** for Material Design components
- **Supabase** for backend services
- **React Navigation 7** via Expo Router
- **Expo Camera** with permissions setup
- **TypeScript** with strict configuration

### Custom Hooks
- `useAuth` - Authentication, sign in/up/out, profile management, password/email changes
- `useDB` - Database operations for diary entries (CRUD operations, pagination)
- `useCalendar` - Calendar navigation and date formatting
- `useCamera` - Camera permissions and photo capture
- `useStatistics` - Statistical calculations on diary entries

### Navigation Structure
- **Root Navigation** (`app/navigation/rootNav.tsx`):
  - Bottom tab navigator with three main tabs: Diary, Statistics, Settings
  - Conditionally renders auth screen when user is not signed in
  - Header managed centrally with dynamic content based on current screen
- **Stack Navigation** (within Diary tab):
  - `main` - DiaryScreen with list/calendar view
  - `input` - InputScreen for creating/editing entries
  - `camera` - CameraScreen for capturing photos
- **Deep Linking**: Custom scheme `com.koddaz.emllmol://` for auth callbacks

### Development Notes
- File-based routing with Expo Router (though navigation is primarily imperative via React Navigation)
- Custom theme in `app/constants/UI/theme.ts` with teal/cyan color palette
- Camera permissions configured for both iOS and Android
- Gesture handling via react-native-gesture-handler
- Bundle identifier: `com.knoddaz.emllmol`
- TypeScript with strict mode enabled
- New React Native architecture enabled

### Common Patterns & Best Practices

#### When Creating New Screens
1. Accept `appData`, `setAppData`, and relevant hooks as props
2. Use `useFocusEffect` if the screen needs to refresh data when navigated to
3. Follow the existing pattern of passing hooks down rather than calling them directly in screens

#### When Modifying Database Operations
1. Always ensure `useDB` is called with both `appData` and `setAppData` parameters
2. Database operations (`saveDiaryEntry`, `updateDiaryEntry`, `removeEntry`) automatically refresh entries after completing
3. The hook returns `isLoading` and `error` states for UI feedback

#### When Working with Navigation
1. Navigation state is tracked in `app/index.tsx` via `currentScreen`
2. Bottom nav bar visibility is controlled by checking `currentScreen` value
3. Use `navigation.navigate()` to switch between screens, not direct route changes

### Recent Fixes & Known Issues
- **Diary List Refresh Issue** (FIXED): useDB hook in rootNav.tsx now properly receives `setAppData` parameter at line 50
- **Bottom Navigation Animation** (IMPLEMENTED): Slide-out animation using React Native Animated API
- **Image Rendering** (FIXED): Proper Image component imports and full-screen width horizontal scrolling