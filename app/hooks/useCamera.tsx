import { AppData } from "@/app/constants/interface/appData";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import { useRef, useState, useCallback, useMemo } from "react";
import { Alert, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAppTheme } from "../constants/UI/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useCamera(appData: AppData | null) {

  const {theme} = useAppTheme();

  const [showCamera, setShowCamera] = useState(false);
      const insets = useSafeAreaInsets()

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  }

  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState<"on" | "off" | "auto">("off");
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [zoom, setZoom] = useState(0);
  const [photoURIs, setPhotoURIs] = useState<string[]>([]);

  const [permission, requestPermission] = useCameraPermissions();
  const createDiaryPhotosDirectory = useCallback(async () => {
    const diaryPhotosDir = `${FileSystem.documentDirectory}diary-photos/`;
    const dirInfo = await FileSystem.getInfoAsync(diaryPhotosDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(diaryPhotosDir, { intermediates: true });
    }

    return diaryPhotosDir;
  }, []);

  const savePhotoLocally = async (tempUri: string) => {
    try {
      // Create directory if it doesn't exist
      const diaryPhotosDir = await createDiaryPhotosDirectory();

      // Generate unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `diary-photo-${timestamp}.jpg`;
      const localUri = `${diaryPhotosDir}${filename}`;

      // Copy the temporary photo to permanent storage
      await FileSystem.copyAsync({
        from: tempUri,
        to: localUri
      });

      console.log('✅ Photo saved locally:', localUri);
      return localUri;
    } catch (error) {
      console.error('❌ Failed to save photo locally:', error);
      Alert.alert('Error', 'Failed to save photo locally');
      return tempUri; // Return original URI as fallback
    }
  };

  const renderCamera = () => {
    console.log('📷 renderCamera called, permission:', permission);

    if (permission === null) {
      console.log('📷 Permission is null - showing loading');
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
          <Text>Loading camera permissions...</Text>
        </View>
      );
    }

    if (!permission?.granted) {
      console.log('📷 Permission denied - showing grant button');
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
          <Text>Camera permission not granted</Text>
          <Button mode="contained" onPress={requestPermission}>
            Grant Camera Permission
          </Button>
        </View>
      );
    }

    
    return (
      <CameraView
        style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 20 }}
        flash={flash}
        facing={facing}
        ref={cameraRef}
      />
    );
  }

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        console.error("Camera reference is not set");
        return;
      }
      if (photoURIs.length >= 3) {
        console.warn("Maximum of 3 photos reached. Please remove a photo before capturing a new one.");
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
        skipProcessing: false,
      });
      console.log('✅ Photo captured (temp URI):', photo.uri);

      if (photo && photo.uri) {
        // Save photo locally to permanent storage
        const permanentUri = await savePhotoLocally(photo.uri);
        console.log('✅ Photo saved to permanent storage:', permanentUri);
        setPhotoURIs(prevURIs => [...prevURIs, permanentUri]);
      }
      return photo;
    } catch (error) {
      console.error('❌ Failed to capture photo:', error);
      return null;
    }
  };

  const removePhotoURI = (indexToRemove: number) => {
    setPhotoURIs(prevURIs => prevURIs.filter((_, index) => index !== indexToRemove));
  };

  const clearPhotoURIs = () => {
    setPhotoURIs([]);
  };

  // Get the icon based on the flash state
  const getFlashIcon = () => {
    switch (flash) {
      case "on":
        return "flash";
      case "off":
        return "flash-off";
      case "auto":
        return "flash-auto";
      default:
        return "flash-off";
    }
  };


  // Get the color for the flash icon based on the flash state
  const getFlashIconColor = () => {
    switch (flash) {
      case "on":
        return "#FFC107"; // Amber/yellow for flash on
      case "off":
        return "#FFFFFF"; // White for flash off
      case "auto":
        return theme.colors.secondary; // Secondary color for auto mode
      default:
        return "#FFFFFF";
    }
  };
  // Cycle through flash modes
  const cycleFlash = () => {
    if (flash === "off") {
      setFlash("on");
    } else if (flash === "on") {
      setFlash("auto");
    } else {
      setFlash("off");
    }
  };

  // Flip camera between front and back
  const flipCamera = () => {
    setFacing(current => current === "back" ? "front" : "back");
  };

  return useMemo(() => ({
    renderCamera,
    showCamera,
    toggleCamera,

    // handle photo capture
    capturePhoto,
    removePhotoURI,
    clearPhotoURIs,
    setPhotoURIs,
    photoURIs,

    // Functions to toggle flash and camera
    cycleFlash,
    flash,
    getFlashIcon,
    getFlashIconColor,
    flipCamera,
    facing,

    // Local storage functions
    savePhotoLocally,
    createDiaryPhotosDirectory,
  }), [
    renderCamera,
    showCamera,
    toggleCamera,
    capturePhoto,
    removePhotoURI,
    clearPhotoURIs,
    setPhotoURIs,
    photoURIs,
    cycleFlash,
    flash,
    getFlashIcon,
    getFlashIconColor,
    flipCamera,
    facing,
    savePhotoLocally,
    createDiaryPhotosDirectory,
  ]);

}