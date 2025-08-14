import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Avatar, Button, Card, IconButton, Surface, Text } from "react-native-paper";
import { useCalendar } from "../hooks/useCalendar";
import { useDB } from "../hooks/useDB";

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

  const { formatTime } = useCalendar(appData);
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
            await refreshEntries();
            setToggleEntry(false);
          }
        }
      ]
    );
  };

  const LeftContent = (props: any) => (
    <MaterialCommunityIcons
      {...props}
      name={getMealIcon(diaryData.meal_type || '')}
      size={40}
      color={theme.colors.primary}
    />
  );

  const RightContent = (props: any) => (
    <IconButton
      {...props}
      icon="close"
      size={24}
      onPress={() => setToggleEntry(false)}
    />
  );

  const renderMetricsContent = () => (
    <View>
      <View style={[styles.row]}>
        <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.primary} />

        <Text variant="titleMedium" style={{
          color: theme.colors.onPrimaryContainer,
          fontWeight: 'bold',
          marginLeft: 8,
        }}>
          {diaryData.glucose || '0'} {appData.settings.glucose}
        </Text>

      </View>

      <View style={[styles.row, { marginTop: 8 }]}>
        <MaterialCommunityIcons name="food" size={16} color={theme.colors.primary} />
        <Text variant="titleMedium" style={{
          color: theme.colors.onSurface,
          fontWeight: 'bold',
          marginLeft: 8,
          textAlign: 'center'
        }}>
          {diaryData.carbs || '0'} g
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 8 }]}>
        <MaterialCommunityIcons
          name={getActivityIcon(diaryData.activity_level || '')}
          size={16}
          color={getActivityColor(diaryData.activity_level || '')}
        />
        <Text variant="titleMedium" style={{
          color: getActivityColor(diaryData.activity_level || ''),
          fontWeight: 'bold',
          marginLeft: 8,
          textTransform: 'capitalize',
          textAlign: 'center'
        }}>
          {diaryData.activity_level || 'None'}
        </Text>
      </View>


    </View>
  );

  return (


      <Card style={[styles.card, { margin: 8 }]}>
        <Card.Title
          title={diaryData.meal_type?.charAt(0).toUpperCase() + diaryData.meal_type?.slice(1) || 'Meal'}
          subtitle={`${formatTime(diaryData.created_at)} • ${diaryData.created_at.toLocaleDateString()}`}
          left={LeftContent}
          right={RightContent}
        />
        <Card.Cover
          source={{ uri: diaryData.uri_array && diaryData.uri_array.length > 0 ? diaryData.uri_array[0] : 'https://via.placeholder.com/150' }}
        //style={styles.coverImage}
        />
        <Card.Content>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Metrics Content - Left Side */}
            <Surface style={{
              marginTop: 8,
              flex: 1,
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              padding: 8,
              borderWidth: 1,
              borderColor: theme.colors.outline,
            }}>
              {renderMetricsContent()}
            </Surface>

            {/* Note Content - Right Side */}
            {diaryData.note && diaryData.note.trim() !== '' && (
              <View style={{
                flex: 1,
                marginTop: 8,
              }}>
                <Surface style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 8,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                }}>
                  <Text variant="bodyMedium" style={{
                    color: theme.colors.onSurface,
                    lineHeight: 20
                  }}>
                    {diaryData.note}
                  </Text>
                </Surface>
              </View>
            )}
          </View>
        </Card.Content>

        <Card.Actions>

          <IconButton
            mode="contained"
            onPress={handleDelete}
            icon="delete"
            loading={isLoading}
          //buttonColor={theme.colors.error}
          />


        </Card.Actions>
      </Card>


  );
}