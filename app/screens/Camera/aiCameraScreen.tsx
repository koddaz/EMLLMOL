import React, { useState } from 'react';
import { View, Dimensions, Alert, ScrollView } from 'react-native';
import { IconButton, Card, Text, Button, Chip, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { AppData } from '@/app/constants/interface/appData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { useAICamera } from '@/app/hooks/useAICamera';
import { DetectedObject } from '@/app/services/ai/types';

// Import existing camera components
import { CameraScreen } from './cameraScreen';

interface AIDetectionOverlayProps {
  objects: DetectedObject[];
  imageWidth: number;
  imageHeight: number;
  displayWidth: number;
  displayHeight: number;
}

function AIDetectionOverlay({ objects, imageWidth, imageHeight, displayWidth, displayHeight }: AIDetectionOverlayProps) {
  const { theme } = useAppTheme();
  
  const scaleX = displayWidth / imageWidth;
  const scaleY = displayHeight / imageHeight;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {objects.map((obj) => (
        <View
          key={obj.id}
          style={{
            position: 'absolute',
            left: obj.boundingBox.x * scaleX,
            top: obj.boundingBox.y * scaleY,
            width: obj.boundingBox.width * scaleX,
            height: obj.boundingBox.height * scaleY,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
          }}
        >
          <Text
            style={{
              color: theme.colors.primary,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 2,
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {obj.className} ({(obj.confidence * 100).toFixed(0)}%)
          </Text>
        </View>
      ))}
    </View>
  );
}

interface AnalysisResultsProps {
  analysisResult: any;
  onApprove: () => void;
  onRetry: () => void;
}

function AnalysisResults({ analysisResult, onApprove, onRetry }: AnalysisResultsProps) {
  const { theme, styles } = useAppTheme();
  
  if (!analysisResult.summary || !analysisResult.processedImage) {
    return null;
  }

  const { summary, processedImage } = analysisResult;

  return (
    <Card style={{ margin: 16, padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
        AI Analysis Results
      </Text>
      
      {/* Real ONNX Model Indicator */}
      <View style={{ 
        backgroundColor: theme.colors.primaryContainer,
        padding: 8,
        borderRadius: 6,
        marginBottom: 12
      }}>
        <Text variant="bodySmall" style={{ 
          color: theme.colors.onPrimaryContainer,
          textAlign: 'center',
          fontWeight: '500'
        }}>
          🧠 Powered by ONNX Carb Classifier Model
        </Text>
      </View>
      
      {/* Summary Statistics */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
            {summary.totalObjects}
          </Text>
          <Text variant="bodySmall">Items</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: theme.colors.secondary }}>
            {summary.totalWeight}g
          </Text>
          <Text variant="bodySmall">Weight</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
            {summary.totalCarbs}g
          </Text>
          <Text variant="bodySmall">Carbs</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
            {(summary.averageConfidence * 100).toFixed(0)}%
          </Text>
          <Text variant="bodySmall">Confidence</Text>
        </View>
      </View>

      {/* Detected Food Types */}
      {summary.foodTypes.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
            Detected Foods:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {summary.foodTypes.map((foodType) => (
              <Chip key={foodType} compact mode="outlined">
                {foodType}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Detailed Objects */}
      {processedImage.detectedObjects.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
            Breakdown:
          </Text>
          <ScrollView style={{ maxHeight: 120 }}>
            {processedImage.detectedObjects.map((obj) => (
              <View
                key={obj.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.outline + '30',
                }}
              >
                <Text variant="bodySmall" style={{ flex: 1 }}>
                  {obj.className}
                </Text>
                <Text variant="bodySmall" style={{ marginHorizontal: 8 }}>
                  {obj.estimatedWeight}g
                </Text>
                <Text variant="bodySmall" style={{ marginHorizontal: 8 }}>
                  {obj.carbContent}g carbs
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                  {(obj.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <Button
          mode="outlined"
          onPress={onRetry}
          style={{ flex: 1 }}
          icon="refresh"
        >
          Retake
        </Button>
        <Button
          mode="contained"
          onPress={onApprove}
          style={{ flex: 1 }}
          icon="check"
        >
          Use Results
        </Button>
      </View>
    </Card>
  );
}

export function AICameraScreen({ 
  cameraHook, 
  dbHook, 
  appData, 
  navigation 
}: { 
  cameraHook: any;
  dbHook: any;
  appData: AppData;
  navigation: any;
}) {
  const { styles, theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const {
    analyzeImage,
    analysisResult,
    isAnalyzing,
    clearAnalysis,
    hasResults,
    hasError
  } = useAICamera();

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  /**
   * Capture photo and analyze it with AI
   */
  const handleAICapture = async () => {
    if (isCapturing || isAnalyzing) {
      return;
    }

    try {
      setIsCapturing(true);
      
      // Capture photo using existing camera hook
      const photo = await cameraHook.capturePhoto();
      
      if (!photo?.uri) {
        Alert.alert('Error', 'Failed to capture photo');
        return;
      }

      console.log('📸 Photo captured, starting AI analysis...');
      
      // Analyze the captured photo
      const result = await analyzeImage(photo.uri);
      
      if (result) {
        setShowAnalysis(true);
        console.log('✅ AI analysis completed, showing results');
      }
      
    } catch (error) {
      console.error('❌ AI capture failed:', error);
      Alert.alert('Error', 'Failed to analyze photo with AI');
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Handle approval of AI analysis results
   */
  const handleApproveResults = () => {
    if (!analysisResult.summary) {
      return;
    }

    Alert.alert(
      'Use AI Results',
      `Add ${analysisResult.summary.totalCarbs}g carbs to your diary?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Diary',
          onPress: () => {
            // Here you would integrate with your diary/database system
            console.log('📝 Adding AI results to diary:', analysisResult.summary);
            
            // Clear analysis and go back
            clearAnalysis();
            setShowAnalysis(false);
            navigation.goBack();
          }
        }
      ]
    );
  };

  /**
   * Handle retry (clear results and take new photo)
   */
  const handleRetry = () => {
    clearAnalysis();
    setShowAnalysis(false);
    cameraHook.clearPhotoURIs();
  };

  return (
    <View style={styles.background}>
      {/* Show analysis results overlay */}
      {showAnalysis && hasResults && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' }}>
            <SafeAreaView>
              <AnalysisResults
                analysisResult={analysisResult}
                onApprove={handleApproveResults}
                onRetry={handleRetry}
              />
            </SafeAreaView>
          </View>
        </View>
      )}

      {/* Original Camera Screen */}
      <CameraScreen
        cameraHook={cameraHook}
        dbHook={dbHook}
        appData={appData}
        navigation={navigation}
      />

      {/* AI Analysis Loading Overlay */}
      {(isAnalyzing || isCapturing) && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <Card style={{ padding: 24, margin: 20, alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ marginBottom: 16, color: theme.colors.primary }}>
              {isCapturing ? '📸 Capturing...' : '🧠 Analyzing with AI...'}
            </Text>
            <ProgressBar
              indeterminate
              style={{ width: 200, marginBottom: 8 }}
            />
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {isCapturing ? 'Taking photo' : 'Detecting food items and estimating weights'}
            </Text>
          </Card>
        </View>
      )}

      {/* Enhanced Camera Controls with AI Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          paddingBottom: 16,
          paddingTop: 8,
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.colors.primary,
        }}
      >
        {/* Close Button */}
        <IconButton
          iconColor={theme.colors.onSecondary}
          size={28}
          icon="close"
          mode="contained-tonal"
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 12,
          }}
        />

        {/* Regular Capture Button */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Button
            mode="contained-tonal"
            onPress={cameraHook.capturePhoto}
            disabled={isCapturing || isAnalyzing}
            style={{ backgroundColor: theme.colors.secondary }}
          >
            📷 Regular
          </Button>
          
          {/* AI Capture Button */}
          <Button
            mode="contained"
            onPress={handleAICapture}
            disabled={isCapturing || isAnalyzing}
            style={{ backgroundColor: theme.colors.primary }}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            🧠 AI Analyze
          </Button>
        </View>

        {/* Flash Button */}
        <IconButton
          iconColor={theme.colors.onSecondary}
          size={28}
          icon={cameraHook.getFlashIcon()}
          mode="contained-tonal"
          onPress={cameraHook.cycleFlash}
          style={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 12,
          }}
        />
      </View>
    </View>
  );
}