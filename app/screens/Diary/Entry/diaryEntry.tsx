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
        <Card.Cover
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={{ height: 200 }}
        />
      );
    }

    if (diaryData.uri_array.length === 1) {
      // Single image - use regular Card.Cover
      return (
        <Card.Cover
          source={{ uri: diaryData.uri_array.at(0) || 'https://via.placeholder.com/150' }}
          style={{ height: 200 }}
        />
      );
    }

    return (
      <View style={{ height: 200, position: 'relative' }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event: any) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentImageIndex(index);
          }}
          style={styles.container}
        >
          {diaryData.uri_array.map((uri, index) => (
            <Card.Cover
              key={index}
              source={{ uri }}
              style={{
                width: screenWidth - 16, // Account for card margins
                height: 200
              }}
            />
          ))}
        </ScrollView>

        {/* Image indicator dots */}
        <View style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
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
        <View style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
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

  const handleEdit = () => {
    dbHook.toggleEntry();
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

  const RightContent = (props: any) => (

    <IconButton
      iconColor={theme.colors.onSecondary}
      mode="contained-tonal"
      icon="close"
      size={28}
      onPress={() => { dbHook.toggleEntry() }}
      style={{
        backgroundColor: theme.colors.secondary,
        borderRadius: 12,
      }}
    />
  );

  const renderMetricsContent = () => (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <View style={styles.entryRow}>
        <MaterialCommunityIcons name="blood-bag" size={16} color={theme.colors.error} />
        <Text variant="titleMedium" style={{
          color: theme.colors.onSecondaryContainer,
          fontWeight: 'bold',
          marginLeft: 8,
        }}>
          {diaryData.glucose || '0'} {appData.settings.glucose}
        </Text>
      </View>

      <View style={styles.entryRow}>
        <MaterialCommunityIcons name="food" size={16} color={theme.colors.onSecondaryContainer} />
        <Text variant="titleMedium" style={{
          color: theme.colors.onSecondaryContainer,
          fontWeight: 'bold',
          marginLeft: 8,
          textAlign: 'center'
        }}>
          {diaryData.carbs || '0'} g
        </Text>
      </View>

      <View style={styles.entryRow}>
        <MaterialCommunityIcons
          name={getActivityIcon(diaryData.activity_level || '')}
          size={16}
          color={theme.colors.onSecondaryContainer}
        />
        <Text variant="titleMedium" style={{
          color: theme.colors.onSecondaryContainer,
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
        subtitle={`${calendarHook.formatTime(diaryData.created_at)} • ${diaryData.created_at.toLocaleDateString()}`}
        left={LeftContent}
        right={RightContent}
        style={{ backgroundColor: theme.colors.primary, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      />
      <PhotoScroll diaryData={diaryData} />
      <Card.Content style={{ paddingHorizontal: 0, paddingBottom: 8 }}>

        <View style={{ flexDirection: 'row', gap: 4 }}>

          {renderMetricsContent()}


          {/* Note Content - Right Side */}
          {diaryData.note && diaryData.note.trim() !== '' && (
            <View style={{
              flex: 1,
              marginTop: 8,
              borderWidth: 1,
              borderColor: theme.colors.tertiary,
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: 8,
              padding: 8
            }}>

              <Text variant="bodyMedium" style={{
                color: theme.colors.onSurface,
                lineHeight: 20
              }}>
                {diaryData.note}
              </Text>

            </View>
          )}
        </View>

      </Card.Content>

      <Card.Actions style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
      }}>
        <IconButton
          icon="edit"
          mode="contained-tonal"
          iconColor={theme.colors.onSecondary}
          style={{ backgroundColor: theme.colors.secondary }}
          size={24}
          onPress={() => {
            handleEdit();
          }}
        />
        <IconButton
          mode="contained-tonal"
          onPress={handleDelete}
          icon="delete"
          loading={dbHook.isLoading}
          iconColor={theme.colors.secondary}
          style={{ backgroundColor: theme.colors.onSecondary }}
        />
        <IconButton
          mode="contained"
          onPress={() => dbHook.toggleEntry()}
          icon="pencil"
          iconColor={theme.colors.onPrimary}
          style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.outline }}
        />
      </Card.Actions>
    </Card>


  );
}