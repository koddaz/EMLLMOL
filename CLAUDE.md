# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMLLMOL is a React Native Expo app for diabetes management with AI-powered food classification. The app uses Supabase for authentication and data storage, ONNX Runtime for machine learning inference, and React Native Paper for UI components.

## Development Commands

### Core Commands
- `npm install` - Install dependencies
- `npx expo start` - Start development server
- `expo run:android` - Run on Android emulator/device
- `expo run:ios` - Run on iOS simulator/device
- `expo run:web` - Run web version
- `expo lint` - Run ESLint

### Custom Scripts
- `npm run copy-model` - Copy ONNX model from Python project (requires path argument)
- `npm run reset-project` - Reset to starter template

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
- `app/ai/` - AI/ML functionality with ONNX Runtime integration
- `app/constants/` - TypeScript interfaces and UI constants
- `app/navigation/` - Navigation configuration
- `app/api/supabase/` - Supabase client and authentication

### AI/ML Integration
- **ONNX Runtime**: Food classification using `onnxruntime-react-native`
- **Model Management**: Custom hooks (`useONNX`) and services for model loading
- **Image Processing**: Preprocessing pipeline for camera images
- **Model Location**: Models stored in `ai/models/onnx/` directory
- **Python Integration**: Script available to copy models from Python training project

### Data Flow
1. User authentication via Supabase
2. Profile and diary entries fetched on app initialization
3. Local settings stored in AsyncStorage
4. Real-time auth state changes handled automatically
5. Diary entries support image arrays and structured data

### Key Interfaces
- `AppData` - Main app state container with session, profile, settings, diary entries
- `DiaryData` - Diary entry structure with glucose, carbs, insulin, meal type, activity level, notes, and images
- `ClassificationResult` - AI model output structure

### Dependencies
- **Expo SDK 53** with new architecture enabled
- **React Native Paper** for Material Design components
- **Supabase** for backend services
- **ONNX Runtime** for AI inference
- **React Navigation 7** via Expo Router
- **Expo Camera** with permissions setup
- **TypeScript** with strict configuration

### Development Notes
- Uses file-based routing with Expo Router
- Custom theme system with automatic/manual switching
- Camera permissions configured for both platforms
- Gesture handling via react-native-gesture-handler
- Bundle identifier: `com.knoddaz.emllmol`