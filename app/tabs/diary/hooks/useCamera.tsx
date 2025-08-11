import { AppData } from "@/app/constants/interface/appData";
import { CameraView } from "expo-camera";
import { useRef, useState } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export function useCamera(appData: AppData) {

  const theme = useTheme();

  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState<"on" | "off" | "auto">("off");
  const [zoom, setZoom] = useState(0);
  const [photoURIs, setPhotoURIs] = useState<string[]>([]);


  const renderCamera = () => {
    // Check if permission is still loading
    if (appData.permission === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading camera permissions...</Text>
        </View>
      );
    }

    if (!appData.permission?.granted) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Camera permission not granted</Text>
          <Button
            mode="contained"
            onPress={appData.requestCameraPermission}
          >
            Grant Camera Permission
          </Button>
        </View>
      );
    }

    return (
      <CameraView style={{ flex: 1 }} flash={flash} ref={cameraRef} />
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
      console.log('✅ Photo captured:', photo.uri);

      if (photo && photo.uri) {
        setPhotoURIs(prevURIs => [...prevURIs, photo.uri]);
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
        return theme.colors.primary;
      case "off":
        return theme.colors.onSurfaceVariant;
      case "auto":
        return theme.colors.secondary;
      default:
        return theme.colors.onSurfaceVariant;
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

  return {
    renderCamera,

    // handle photo capture
    capturePhoto,
    removePhotoURI,
    clearPhotoURIs,
    photoURIs,

    // Functions to toggle flash
    cycleFlash,
    flash,
    getFlashIcon,
    getFlashIconColor
  };

}