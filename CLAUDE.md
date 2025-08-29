# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Development:**
- `npm install` - Install dependencies
- `npx expo start` - Start development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

**Project Management:**
- `npm run reset-project` - Reset to clean project structure

## Project Architecture

This is a React Native Expo app built with TypeScript that serves as a diabetes/glucose monitoring diary application.

**Core Technology Stack:**
- React Native 0.79.5 with React 19.0.0
- Expo SDK ~53.0.20 with Expo Router for file-based routing
- TypeScript with strict mode enabled
- Supabase for backend/auth/database
- React Native Paper for UI components
- React Navigation for navigation
- D3 for data visualization

**Project Structure:**
- `/app` - Main application code using Expo Router file-based routing
  - `/api/supabase` - Supabase client configuration and auth
  - `/components` - Reusable UI components
  - `/constants` - App-wide constants, interfaces, and theme configuration
  - `/hooks` - Custom React hooks for business logic
  - `/navigation` - Navigation components and configuration
  - `/screens` - Main application screens organized by feature
- `/assets` - Static assets (images, fonts, docs)
- `/ai` - AI/ML models and configurations (ONNX models, JSON configs)
- Native platform directories: `/android`, `/ios`

**Key Architectural Patterns:**

1. **Single Source of Truth**: App state is centralized in `AppData` interface and managed through root navigation with hooks passed down as props.

2. **Custom Hooks Pattern**: Business logic is encapsulated in custom hooks:
   - `useDB` - Database operations and diary entry management
   - `useCalendar` - Calendar functionality for diary navigation
   - `useCamera` - Camera operations and image processing
   - `useAuth` - Authentication state management

3. **Navigation Architecture**: 
   - Expo Router for file-based routing at the root level
   - Nested stack navigators (rootNavigation.tsx, diaryNav.tsx) for feature-specific flows
   - Props drilling pattern for sharing hooks between screens

4. **Data Flow**: 
   - Supabase handles authentication and data persistence
   - Local state management through hooks and React state
   - Real-time data synchronization with Supabase

**Key Features:**
- Glucose/carb tracking with diary entries
- Camera integration for food image capture
- Calendar view for historical data
- Statistics and data visualization
- User authentication and profiles
- Cross-platform support (iOS, Android, Web)

**Environment Configuration:**
- Uses environment variables for Supabase configuration
- Supports automatic UI style (light/dark mode)
- Camera and audio permissions configured for both platforms

**AI Integration:**
- Contains ONNX models for carbohydrate classification
- Clarifai integration for image analysis
- Mobile AI configuration files for on-device processing