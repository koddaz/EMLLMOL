import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { customStyles } from "@/app/constants/UI/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Avatar, Button, IconButton, Surface, Text, useTheme } from "react-native-paper";
import { useCalendar } from "../hooks/useCalendar";
import { useDB } from "../hooks/useDB";
import { useAppTheme } from "@/app/constants/UI/theme";

export function DiaryEntry({ 
  appData, 
  setToggleEntry, 
  diaryData,
  refreshEntries
}: { 
  appData: AppData, 
  setToggleEntry: (state: boolean) => void,
  diaryData: DiaryData,
  refreshEntries: () => Promise<void>
}) {
  const { theme, styles } = useAppTheme();
  
  const { formatTime } = useCalendar();
  const { removeEntry, isLoading } = useDB(appData);
  const [savingPhotos, setSavingPhotos] = useState(false);

  const getMealIcon = (mealType: string) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return 'coffee';
      case 'lunch': return 'food';
      case 'dinner': return 'food-variant';
      case 'snack': return 'food-apple';
      default: return 'silverware';
    }
  };

  const getActivityIcon = (activityLevel: string) => {
    switch (activityLevel?.toLowerCase()) {
      case 'low': return 'walk';
      case 'medium': return 'run';
      case 'high': return 'run-fast';
      default: return 'sleep';
    }
  };

  const getActivityColor = (activityLevel: string) => {
    switch (activityLevel?.toLowerCase()) {
      case 'low': return theme.colors.secondary;
      case 'medium': return theme.colors.tertiary;
      case 'high': return theme.colors.error;
      default: return theme.colors.onSurfaceVariant;
    }
  };

  const savePhotoToGallery = async (uri: string, index: number) => {
    try {
      setSavingPhotos(true);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permissions are required to save photos.');
        return;
      }

      const timestamp = new Date(diaryData.created_at).toISOString().replace(/[:.]/g, '-');
      const filename = `diary-${timestamp}-${index + 1}.jpg`;
      const newPath = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: newPath
      });
      
      const asset = await MediaLibrary.createAssetAsync(newPath);
      Alert.alert('Success', 'Photo saved to your gallery!');
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo to gallery.');
    } finally {
      setSavingPhotos(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this diary entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await removeEntry(diaryData.id.toString());
            await refreshEntries(); // Refresh entries after deletion
            setToggleEntry(false);
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <MaterialCommunityIcons 
          name={getMealIcon(diaryData.meal_type || '')} 
          size={24} 
          color={theme.colors.primary} 
        />
        <View style={{ marginLeft: 12 }}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
            {diaryData.meal_type?.charAt(0).toUpperCase() + diaryData.meal_type?.slice(1) || 'Meal'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {formatTime(diaryData.created_at)} • {diaryData.created_at.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <IconButton
        icon="close"
        size={24}
        onPress={() => setToggleEntry(false)}
        style={styles.closeButton}
      />
    </View>
  );

  const renderMetricsCard = () => (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="chart-line" size={20} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>Metrics</Text>
      </View>
      
      <View style={styles.selectorRow}>
        {/* Glucose */}
        <View style={styles.selectorGroup}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.selectorLabel}>Blood Glucose</Text>
          </View>
          <View style={styles.glucoseBadge}>
            <Text variant="titleMedium" style={{ 
              color: theme.colors.onPrimaryContainer, 
              fontWeight: 'bold' 
            }}>
              {diaryData.glucose || '0'} {appData.settings.glucose}
            </Text>
          </View>
        </View>

        {/* Carbs */}
        <View style={styles.selectorGroup}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="food" size={16} color={theme.colors.primary} />
            <Text variant="labelMedium" style={styles.selectorLabel}>Carbohydrates</Text>
          </View>
          <Text variant="titleMedium" style={{ 
            color: theme.colors.onSurface, 
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {diaryData.carbs || '0'} g
          </Text>
        </View>
      </View>

      {/* Activity */}
      <View style={styles.selectorRow}>
        <View style={styles.selectorGroup}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons 
              name={getActivityIcon(diaryData.activity_level || '')} 
              size={16} 
              color={getActivityColor(diaryData.activity_level || '')} 
            />
            <Text variant="labelMedium" style={styles.selectorLabel}>Activity Level</Text>
          </View>
          <Text variant="titleMedium" style={{ 
            color: getActivityColor(diaryData.activity_level || ''),
            fontWeight: '500',
            textTransform: 'capitalize',
            textAlign: 'center'
          }}>
            {diaryData.activity_level || 'None'}
          </Text>
        </View>
      </View>
    </Surface>
  );

  const renderNotesCard = () => {
    if (!diaryData.note || diaryData.note.trim() === '') return null;
    
    return (
      <Surface style={styles.card} elevation={2}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="note-text" size={20} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>Notes</Text>
        </View>
        <Text variant="bodyMedium" style={{ 
          color: theme.colors.onSurface,
          lineHeight: 20
        }}>
          {diaryData.note}
        </Text>
      </Surface>
    );
  };

  const renderPhotosCard = () => {
    if (!diaryData.uri_array || diaryData.uri_array.length === 0) return null;

    return (
      <Surface style={styles.card} elevation={2}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="camera" size={20} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Photos ({diaryData.uri_array.length})
          </Text>
        </View>
        
        <ScrollView horizontal style={styles.photoScroll} showsHorizontalScrollIndicator={false}>
          {diaryData.uri_array.map((uri, index) => (
            <View key={index} style={styles.photoItem}>
              <Avatar.Image size={80} source={{ uri }} />
              <IconButton
                icon="download"
                size={16}
                onPress={() => savePhotoToGallery(uri, index)}
                style={[styles.photoDelete, { 
                  backgroundColor: theme.colors.primaryContainer,
                  top: -8,
                  right: -8
                }]}
                iconColor={theme.colors.onPrimaryContainer}
                disabled={savingPhotos}
              />
            </View>
          ))}
        </ScrollView>
      </Surface>
    );
  };

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <Button
        mode="outlined"
        onPress={() => setToggleEntry(false)}
        style={styles.cancelButton}
        icon="close"
      >
        Close
      </Button>
      <Button
        mode="contained"
        onPress={handleDelete}
        style={styles.saveButton}
        icon="delete"
        loading={isLoading}
        buttonColor={theme.colors.error}
      >
        Delete Entry
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        
        <View style={styles.content}>
          {renderMetricsCard()}
          {renderNotesCard()}
          {renderPhotosCard()}
        </View>

        {renderActionButtons()}
      </ScrollView>
    </View>
  );
}