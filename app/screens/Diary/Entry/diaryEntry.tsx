import { AppData } from "@/app/constants/interface/appData";
import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Dimensions, ScrollView, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";


export function PhotoScroll({ diaryData }: { diaryData: DiaryData }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const { theme, styles } = useAppTheme();

  const renderImageCarousel = () => {
    if (!diaryData.uri_array || diaryData.uri_array.length === 0) {
      return (
        <View style={[styles.imageContainer, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
          <MaterialCommunityIcons name="image-off" size={48} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            No image available
          </Text>
        </View>
      );
    }

    if (diaryData.uri_array.length === 1) {
      return (
        <View style={styles.imageContainer}>
          <Card.Cover
            source={{ uri: diaryData.uri_array.at(0) || 'https://via.placeholder.com/150' }}
            style={{ height: 200 }}
          />
        </View>
      );
    }

    return (
      <View style={[styles.imageContainer, { height: 200, position: 'relative' }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event: any) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentImageIndex(index);
          }}
        >
          {diaryData.uri_array.map((uri, index) => (
            <Card.Cover
              key={index}
              source={{ uri }}
              style={{
                width: screenWidth - 16,
                height: 200
              }}
            />
          ))}
        </ScrollView>

        {/* Image indicator dots */}
        <View style={[styles.imageOverlay, {
          bottom: 8,
          right: 8,
          flexDirection: 'row'
        }]}>
          {diaryData.uri_array.map((_, index) => (
            <View
              key={index}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                marginHorizontal: 2,
              }}
            />
          ))}
        </View>

        {/* Image counter */}
        <View style={[styles.imageOverlay, {
          top: 8,
          right: 8,
        }]}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {currentImageIndex + 1} / {diaryData.uri_array.length}
          </Text>
        </View>
      </View>
    );
  };

  return renderImageCarousel();
}

export function DiaryEntry({
  appData,
  diaryData,
  calendarHook,
  dbHook,
  navigation
}: {
  appData: AppData,
  diaryData: DiaryData,
  calendarHook: any,
  dbHook: any,
  navigation: any
}) {
  const { theme, styles } = useAppTheme();




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

  const handleEdit = async () => {
    await dbHook.toggleEntry();
    navigation.navigate('DiaryInput', { diaryData });
  }

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
            await dbHook.removeEntry(diaryData.id.toString());
            await dbHook.refreshEntries();
            dbHook.toggleEntry;
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
      color={theme.colors.onPrimary}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.chip}>
            <MaterialCommunityIcons
              name={getMealIcon(diaryData.meal_type || '')}
              size={16}
              color={theme.colors.onSecondary}
            />
          </View>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {diaryData.meal_type?.charAt(0).toUpperCase() + diaryData.meal_type?.slice(1) || 'Meal'}
          </Text>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="clock" size={16} color={theme.colors.onSecondary} />
            <Text variant="bodySmall">
              {calendarHook.formatTime(diaryData.created_at)}
            </Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            iconColor={theme.colors.onSecondaryContainer}
            style={styles.iconButton}
            onPress={() => dbHook.toggleEntry()}
          />
        </View>

        {/* Photo Content */}
        <PhotoScroll diaryData={diaryData} />

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.row}>
            {/* Metrics */}
            <View style={{ flex: 1 }}>
              <View style={[styles.chip, { marginBottom: 4, marginRight: 0 }]}>
                <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.onSecondary} />
                <Text variant="bodySmall">
                  {diaryData.glucose || '0'} {appData.settings.glucose}
                </Text>
              </View>
              <View style={[styles.chip, { marginBottom: 4, marginRight: 0 }]}>
                <MaterialCommunityIcons name="food" size={16} color={theme.colors.onSecondary} />
                <Text variant="bodySmall">
                  {diaryData.carbs || '0'}g carbs
                </Text>
              </View>
              <View style={[styles.chip, { marginRight: 0 }]}>
                <MaterialCommunityIcons
                  name={getActivityIcon(diaryData.activity_level || '')}
                  size={16}
                  color={theme.colors.onSecondary}
                />
                <Text variant="bodySmall" style={{ textTransform: 'capitalize' }}>
                  {diaryData.activity_level || 'None'}
                </Text>
              </View>
            </View>

            {/* Note Content */}
            {diaryData.note && diaryData.note.trim() !== '' && (
              <View style={{ flex: 2, marginLeft: 8 }}>
                <View style={[styles.box, { marginBottom: 0 }]}>
                  <View style={[styles.content, { paddingVertical: 4 }]}>
                    <Text variant="bodyMedium" style={{
                      color: theme.colors.onSurface,
                      lineHeight: 20
                    }}>
                      {diaryData.note}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <View style={styles.actionContainer}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={theme.colors.onPrimary}
              style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleEdit}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.onError}
              style={[styles.iconButton, { backgroundColor: theme.colors.errorContainer }]}
              onPress={handleDelete}
              disabled={dbHook.isLoading}
            />
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer, flex: 1, textAlign: 'right' }}>
            {diaryData.created_at.toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
}