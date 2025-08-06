import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Button, Card, IconButton, Surface, useTheme } from 'react-native-paper';
import { LoadingScreen } from '../../components/loadingScreen';
import { CLARIFAI_CONFIG, CLARIFAI_FOOD_MAPPING, DetectedFood } from '../../constants/AI/clarifAI';
import { customStyles } from '../../constants/UI/styles';



export default function CameraScreen() {
  const [isClarifaiReady, setIsClarifaiReady] = useState(false);
  const theme = useTheme();
  const styles = customStyles(theme);

  const {
    permission,
    requestPermission,
    isCameraReady,
    setIsCameraReady,
    ref,
    uri,
    detectedItems,
    isAnalyzing,
    totalCarbs,
    allDetections,
    showAllDetections,
    takePicture,
    resetToCamera,
    findFoodMatch,
    toggleDetectionView,
  } = useCamera();

  useEffect(() => {
    const initClarifai = async () => {
      try {
        console.log('Initializing Clarifai API for food recognition...');

        if (CLARIFAI_CONFIG.PAT === 'YOUR_CLARIFAI_PAT_HERE') {
          console.warn('⚠️ Clarifai PAT not configured. Please set your Personal Access Token.');
        }

        setIsClarifaiReady(true);
      } catch (error) {
        console.error('Error initializing Clarifai:', error);
        setIsClarifaiReady(true);
      }
    };

    initClarifai();
  }, []);

  const renderAllDetections = () => {
    if (allDetections.length === 0) return null;

    const foodDetections = allDetections.filter((d: any) => {
      const className = d.class.toLowerCase();
      const match = findFoodMatch(className);
      return match !== null && !match.ignore;
    });

    const otherDetections = allDetections.filter((d: any) => {
      const className = d.class.toLowerCase();
      const match = findFoodMatch(className);
      return match === null || match.ignore;
    });

    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4CAF50' }}>
              🍕 Detected Food Items ({foodDetections.length})
            </Text>
          </Card.Content>
        </Card>

        {foodDetections.map((detection: any, index: number) => {
          const foodData = findFoodMatch(detection.class.toLowerCase());
          return (
            <Card key={`food-${index}`} style={{ marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#4CAF50' }}>
              <Card.Content>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                  {foodData?.name || detection.class}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  COCO class: {detection.class}
                </Text>
                <Text style={{ color: '#4CAF50' }}>
                  Confidence: {Math.round(detection.score * 100)}%
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  Bounding box: [{detection.bbox.map((n: number) => Math.round(n)).join(', ')}]
                </Text>
                {foodData && (
                  <Text style={{ fontSize: 12, color: '#2196F3' }}>
                    {foodData.carbsPer100g}g carbs/100g
                  </Text>
                )}
              </Card.Content>
            </Card>
          );
        })}

        {otherDetections.length > 0 && (
          <>
            <Card style={{ marginBottom: 16, marginTop: 16 }}>
              <Card.Content>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#9E9E9E' }}>
                  ❓ Other Detections ({otherDetections.length})
                </Text>
              </Card.Content>
            </Card>

            {otherDetections.map((detection: any, index: number) => (
              <Card key={`other-${index}`} style={{ marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#9E9E9E' }}>
                <Card.Content>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>
                    {detection.class}
                  </Text>
                  <Text style={{ color: '#9E9E9E' }}>
                    Confidence: {Math.round(detection.score * 100)}%
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    Bounding box: [{detection.bbox.map((n: number) => Math.round(n)).join(', ')}]
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  const renderFoodAnalysis = () => {
    if (detectedItems.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No carb-containing foods detected in this image.
            {'\n\n'}Try taking a photo of:
            {'\n'}• Pizza, hamburgers, or hot dogs
            {'\n'}• Cakes, donuts, or ice cream
            {'\n'}• Pasta, rice dishes, or bread
            {'\n'}• French fries or nachos
          </Text>

          {allDetections.length > 0 && (
            <Text style={{ fontSize: 14, color: '#999', marginTop: 16, textAlign: 'center' }}>
              ({allDetections.length} objects detected - check "All Detections" tab)
            </Text>
          )}
        </View>
      );
    }

    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2196F3' }}>
              Total Carbohydrates: {totalCarbs}g
            </Text>
          </Card.Content>
        </Card>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Detected Food Items:
        </Text>

        {detectedItems.map((food: DetectedFood, index: number) => (
          <Card key={index} style={{ marginBottom: 8 }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {food.item}
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                COCO class: {food.originalClassName}
              </Text>
              <Text style={{ color: '#666' }}>
                Confidence: {Math.round(food.confidence * 100)}%
              </Text>
              <Text style={{ color: '#666' }}>
                Estimated Weight: {food.estimatedWeight}g
              </Text>
              <Text style={{ color: '#E91E63', fontWeight: '500' }}>
                Carbs: {food.carbContent}g
              </Text>
              <Text style={{ fontSize: 12, color: '#666' }}>
                Weight: {food.estimatedWeight}g | Category: {food.category}
              </Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={{ fontSize: 12, color: '#999', marginTop: 16, textAlign: 'center' }}>
          *Based on COCO-SSD object detection
          {'\n'}Weight estimates are approximations based on bounding box size
        </Text>
      </ScrollView>
    );
  };

  const renderPicture = () => {
    if (!uri) return null;
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: uri }}
          style={{ width: '100%', height: '30%' }}
          resizeMode="contain"
        />

        {isAnalyzing ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>Detecting food items with COCO-SSD...</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', padding: 16 }}>
              <Button
                mode={!showAllDetections ? "contained" : "outlined"}
                onPress={() => toggleDetectionView()}
                style={{ marginRight: 8, flex: 1 }}
              >
                Food Only
              </Button>
              <Button
                mode={showAllDetections ? "contained" : "outlined"}
                onPress={() => toggleDetectionView()}
                style={{ flex: 1 }}
              >
                All Detections ({allDetections.length})
              </Button>
            </View>

            {showAllDetections ? renderAllDetections() : renderFoodAnalysis()}
          </View>
        )}

        <Button
          icon="camera"
          mode="contained"
          onPress={resetToCamera}
          style={{ margin: 16 }}
          disabled={isAnalyzing}
        >
          Take another picture
        </Button>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <>
        <Surface style={[styles.container, {flex: 1}]} elevation={4}>
        <CameraView
          ref={ref}
          style={{width: '100%', flex: 1}}
          facing="back"
          onCameraReady={() => {
            console.log('Camera is ready!');
            setIsCameraReady(true);
          }}
        />
        </Surface>

        
          <View style={styles.buttonContainer}>
            <IconButton
              icon="camera"
              mode="outlined"
              size={32}
              iconColor={theme.colors.primary}
              containerColor={theme.colors.primaryContainer}
              onPress={takePicture}
              style={styles.iconButton}
              disabled={!isCameraReady}
            />
          </View>
      </>
    );
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button icon="camera" mode="contained" onPress={requestPermission}>
          Grant permission
        </Button>
      </View>
    );
  }

  return isClarifaiReady ? (
    <View style={styles.background}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  ) : (
    <LoadingScreen />
  );
}





export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedFood[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [allDetections, setAllDetections] = useState<Array<{ class: string, score: number, bbox: number[] }>>([]);
  const [showAllDetections, setShowAllDetections] = useState(false);

  const ref = useRef<any>(null);

  const findFoodMatch = (className: string): { name: string, carbsPer100g: number, weight: number, category: string, ignore?: boolean } | null => {
    const lowerClassName = className.toLowerCase();

    // Direct match with Clarifai food mapping
    if (CLARIFAI_FOOD_MAPPING[lowerClassName]) {
      console.log(`✅ Direct Clarifai food match: "${className}" → ${CLARIFAI_FOOD_MAPPING[lowerClassName].name}`);
      return CLARIFAI_FOOD_MAPPING[lowerClassName];
    }

    // Check for partial matches within the food name
    for (const [foodKey, foodData] of Object.entries(CLARIFAI_FOOD_MAPPING)) {
      if (foodKey === '_estimates') continue;

      if (lowerClassName.includes(foodKey) || foodKey.includes(lowerClassName)) {
        console.log(`✅ Partial Clarifai food match: "${className}" → ${foodData.name}`);
        return foodData;
      }
    }

    console.log(`❌ No food match found for: "${className}"`);
    return null;
  };

  const detectFoodItems = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);
      console.log('Detecting food items with Clarifai API...');

      const startTime = Date.now();
      console.log('📷 Processing image for Clarifai food recognition...');

      if (CLARIFAI_CONFIG.PAT === 'YOUR_CLARIFAI_PAT_HERE') {
        throw new Error('Clarifai PAT not configured. Please set your Personal Access Token in CLARIFAI_CONFIG.');
      }

      // Process image for Clarifai
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 512 } }, // Good size for Clarifai
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (!manipResult.base64) {
        throw new Error('Failed to get base64 image data');
      }

      console.log(`⚡ Image processed in ${Date.now() - startTime}ms`);

      // Call Clarifai API
      const predictStart = Date.now();

      const requestBody = {
        "user_app_id": {
          "user_id": CLARIFAI_CONFIG.USER_ID,
          "app_id": CLARIFAI_CONFIG.APP_ID
        },
        "inputs": [
          {
            "data": {
              "image": {
                "base64": manipResult.base64
              }
            }
          }
        ]
      };

      const response = await fetch(
        `https://api.clarifai.com/v2/models/${CLARIFAI_CONFIG.MODEL_ID}/versions/${CLARIFAI_CONFIG.MODEL_VERSION_ID}/outputs`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Key ${CLARIFAI_CONFIG.PAT}`
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`Clarifai API error: ${response.status} ${response.statusText}`);
      }

      const predictions = await response.json();
      console.log(`⚡ Clarifai prediction completed in ${Date.now() - predictStart}ms`);

      const concepts = predictions.outputs?.[0]?.data?.concepts || [];
      console.log(`🎯 Found ${concepts.length} food concepts`);

      // Log all predictions for debugging
      console.log('=== CLARIFAI PREDICTIONS ===');
      concepts.forEach((concept: any, index: number) => {
        console.log(`${index + 1}. "${concept.name}": ${Math.round(concept.value * 100)}% confidence`);
      });

      // Filter concepts with confidence > 0.5
      const highConfidenceConcepts = concepts.filter((concept: any) => concept.value > 0.5);
      console.log(`🎯 High confidence concepts (>50%): ${highConfidenceConcepts.length}`);

      // Process predictions for food items and carb content
      const processStart = Date.now();
      const detectedFoods: DetectedFood[] = [];
      let totalCarbContent = 0;

      highConfidenceConcepts.forEach((concept: any) => {
        const conceptName = concept.name;
        console.log(`🔍 Checking Clarifai concept: "${conceptName}" with ${Math.round(concept.value * 100)}% confidence`);

        const foodData = findFoodMatch(conceptName);
        if (foodData && !foodData.ignore) {
          console.log(`  ✅ Food item found: "${conceptName}" → ${foodData.name}`);
          console.log(`  📊 Carbs: ${foodData.carbsPer100g}g/100g, Weight: ${foodData.weight}g`);

          const estimatedWeight = foodData.weight;
          const carbsPer100g = foodData.carbsPer100g;
          const carbContent = (estimatedWeight / 100) * carbsPer100g;

          detectedFoods.push({
            item: foodData.name,
            confidence: concept.value,
            estimatedWeight: estimatedWeight,
            carbContent: Math.round(carbContent * 10) / 10,
            originalClassName: conceptName,
            category: foodData.category,
          });

          totalCarbContent += carbContent;
          console.log(`  ➕ Added: ${carbContent.toFixed(1)}g carbs (${estimatedWeight}g estimated weight)`);
        } else if (foodData?.ignore) {
          console.log(`  🍴 Ignoring utensil/container: "${conceptName}"`);
        } else {
          console.log(`  ❌ Not a recognized food item: "${conceptName}"`);
        }
      });

      console.log(`⚡ Processing completed in ${Date.now() - processStart}ms`);
      console.log(`🎉 Total analysis time: ${Date.now() - startTime}ms`);
      console.log(`📊 Final results: ${detectedFoods.length} food items, ${totalCarbContent.toFixed(1)}g total carbs`);

      setDetectedItems(detectedFoods);
      setTotalCarbs(Math.round(totalCarbContent * 10) / 10);

    } catch (error) {
      console.error('Error detecting food items:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePicture = async () => {
    try {
      console.log('Taking picture...');
      if (!ref.current) {
        console.log('Camera ref not available');
        return;
      }
      if (!isCameraReady) {
        console.log('Camera not ready yet');
        return;
      }

      const photo = await ref.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      console.log('Photo result:', photo);
      if (photo?.uri) {
        console.log('Setting URI:', photo.uri);
        setUri(photo.uri);
        await detectFoodItems(photo.uri);
      } else {
        console.log('No URI received from camera');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const resetToCamera = () => {
    try {
      console.log('Resetting to camera...');
      setUri(null);
      setDetectedItems([]);
      setTotalCarbs(0);
      setAllDetections([]);
      setShowAllDetections(false);
      setIsAnalyzing(false);

      setTimeout(() => {
        console.log('Reset complete');
      }, 100);
    } catch (error) {
      console.error('Error resetting state:', error);
    }
  };

  const toggleDetectionView = () => {
    setShowAllDetections(!showAllDetections);
  };

  return {
    // Camera state
    permission,
    requestPermission,
    facing,
    setFacing,
    isCameraReady,
    setIsCameraReady,
    ref,

    // Image and analysis state
    uri,
    detectedItems,
    isAnalyzing,
    totalCarbs,
    allDetections,
    showAllDetections,

    // Functions
    takePicture,
    resetToCamera,
    findFoodMatch,
    toggleDetectionView,
  };
};