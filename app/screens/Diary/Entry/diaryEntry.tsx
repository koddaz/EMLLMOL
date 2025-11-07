import { DiaryData } from "@/app/constants/interface/diaryData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Dimensions, FlatList, Image, ScrollView, View } from "react-native";
import { Card, Icon, IconButton, Text } from "react-native-paper";


// Reusable diary entry content preview
export function DiaryEntryContent({
  diaryData,
  appData,
  calendarHook,

}: {
  diaryData: DiaryData | undefined;
  appData: any;
  calendarHook: any;

}) {
  const { theme } = useAppTheme();



  const getActivityIcon = (activity: any) => {
    switch (activity?.toLowerCase()) {
      case 'none': return <Icon source={'sofa-outline'} size={45} color={theme.colors.onSurfaceVariant} />
      case 'low': return <Icon source={'walk'} size={45} color={theme.colors.customBlue} />
      case 'medium': return <Icon source={'run'} size={45} color={theme.colors.customTeal} />
      case 'high': return <Icon source={'run-fast'} size={45} color={theme.colors.primary} />
    }
  }

  const getActivityColors = (activityLevel: any) => {
    switch (activityLevel?.toLowerCase()) {
      case 'none': return theme.colors.surface;
      case 'low': return theme.colors.low;
      case 'medium': return theme.colors.medium;
      case 'high': return theme.colors.high;
      default: return theme.colors.surfaceVariant;

    }
  }

  return (
    <View style={{ gap: 8 }}>
      {/* Date/Time Header */}
      <View style={{
        flexDirection: 'row',

        gap: 8,
        backgroundColor: theme.colors.primaryContainer,
        padding: 12,
        borderRadius: 8
      }}>
        <Icon source="clock" size={20} color={theme.colors.onPrimaryContainer} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
          {calendarHook.formatTime(diaryData?.created_at || new Date())}
        </Text>

        <Icon source="calendar" size={20} color={theme.colors.onPrimaryContainer} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
          {calendarHook.formatDate(diaryData?.created_at || new Date())}
        </Text>
      </View>

      <PhotoScroll diaryData={diaryData} />

      {/* Metrics Section */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 2, gap: 8 }}>
          {/* Glucose */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            backgroundColor: theme.colors.secondaryContainer,
            padding: 12,
            borderRadius: 8,
          }}>
            <Icon source="diabetes" color={theme.colors.onSecondaryContainer} size={20} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}>
              {diaryData?.glucose} {appData?.settings.glucose === 'mmol' ? 'mmol/L' : 'mg/dL'}
            </Text>
          </View>

          {/* Insulin */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            backgroundColor: theme.colors.secondaryContainer,
            padding: 12,
            borderRadius: 8
          }}>
            <Icon source="needle" color={theme.colors.onSecondaryContainer} size={20} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}>
              {diaryData?.insulin || 0} units
            </Text>
          </View>

          {/* Carbs */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            backgroundColor: theme.colors.secondaryContainer,
            padding: 12,
            borderRadius: 8
          }}>
            <Icon source="bread-slice-outline" color={theme.colors.onSecondaryContainer} size={20} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}>
              {diaryData?.carbs || 0} grams
            </Text>
          </View>
        </View>

        {/* Activity Level */}
        <View style={{
          flex: 1,
          backgroundColor: getActivityColors(diaryData?.activity_level),
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.colors.outline
        }}>
          <Text variant="labelMedium" style={{ color: theme.colors.onSurface }}>
            Activity
          </Text>
          {getActivityIcon(diaryData?.activity_level)}
          <Text variant="labelSmall" style={{ textTransform: 'capitalize', color: theme.colors.onSurface }}>
            {diaryData?.activity_level}
          </Text>
        </View>
      </View>

      {/* Notes Section - Only show if note exists */}
      {diaryData?.note && diaryData.note.trim() !== '' && (
        <View style={{
          flexDirection: 'row',
          gap: 8,
          backgroundColor: theme.colors.tertiaryContainer,
          padding: 12,
          borderRadius: 8
        }}>
          <Icon source="note-outline" color={theme.colors.onTertiaryContainer} size={20} />
          <Text variant="bodyMedium" style={{
            color: theme.colors.onTertiaryContainer,
            textAlign: 'justify',
            flex: 1
          }}>
            {diaryData.note}
          </Text>
        </View>
      )}
    </View>
  );
}

export function PhotoScroll({ diaryData }: { diaryData: DiaryData | undefined }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const { theme, styles } = useAppTheme();

  // Prepare data: if no images, show placeholder
  const images = (!diaryData?.uri_array || diaryData.uri_array.length === 0)
    ? [{ uri: null, isPlaceholder: true }]
    : diaryData.uri_array.map(uri => ({ uri, isPlaceholder: false }));

  const renderImageItem = ({ item, index }: { item: { uri: string | null, isPlaceholder: boolean }, index: number }) => {
    if (item.isPlaceholder) {
      return (
        <View style={{ height: 200, borderWidth: 1, borderRadius: 8, width: containerWidth, justifyContent: 'center', alignItems: 'center', borderColor: theme.colors.outline }}>
          <MaterialCommunityIcons name="image-off" size={48} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
            No image available
          </Text>
        </View>
      );
    }

    return (
      <View style={{ width: containerWidth, borderWidth: 1, borderRadius: 8, overflow: 'hidden', borderColor: theme.colors.outline }}>
        <Image
          source={{ uri: item.uri || 'https://via.placeholder.com/150' }}
          style={{ height: 200, width: containerWidth }}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View
      style={{ height: 200, position: 'relative' }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      {containerWidth > 0 && (
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
            setCurrentImageIndex(index);
          }}
        />
      )}

      {/* Only show indicators if there are real images */}
      {images.length > 1 && !images[0].isPlaceholder && (
        <>
          {/* Image indicator dots */}
          <View style={[styles.imageOverlay, {
            bottom: 8,
            right: 8,
            flexDirection: 'row'
          }]}>
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: index === currentImageIndex ? theme.colors.onPrimary : theme.colors.backdrop.replace('0.4', '0.6'),
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
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export function DiaryEntry({
  appData,
  diaryData,
  calendarHook,
  dbHook,
  navigation
}: NavData & HookData) {
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
            await dbHook.removeEntry(diaryData?.id?.toString());
            await dbHook.refreshEntries();
            dbHook.toggleEntry;
          }
        }
      ]
    );
  };


  return (
    <View style={styles.container}>
      <Card mode="elevated" elevation={3} style={{ marginVertical: 0, borderRadius: 12 }}>
        <Card.Title
          title={diaryData?.meal_type?.charAt(0).toUpperCase() + diaryData!.meal_type?.slice(1)}
          titleVariant="titleLarge"
          left={(props) => <Icon {...props} source={getMealIcon(diaryData?.meal_type || '')} size={28} color={theme.colors.secondary} />}
          right={(props) => (
            <IconButton
              {...props}
              icon="close"
              size={24}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={() => {
                dbHook.toggleEntry()
              }}
            />
          )}
        />
        <Card.Content style={{ paddingHorizontal: 16 }}>
          <DiaryEntryContent
            diaryData={diaryData}
            appData={appData}
            calendarHook={calendarHook}
          />
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'flex-end', gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}>
          <IconButton
            icon="delete"
            size={22}
            iconColor={theme.colors.onError}
            style={[styles.iconButton, { backgroundColor: theme.colors.error }]}
            onPress={handleDelete}
            disabled={dbHook.isLoading}
          />
          <IconButton
            icon="pencil"
            size={22}
            iconColor={theme.colors.onSecondaryContainer}
            style={[styles.iconButton, { backgroundColor: theme.colors.secondaryContainer }]}
            onPress={handleEdit}
          />
        </Card.Actions>
      </Card>
    </View>
  );
}