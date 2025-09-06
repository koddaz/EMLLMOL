import React, { useState } from 'react';
import { View, Dimensions, Alert, ScrollView } from 'react-native';
import { IconButton, Card, Text, Button, Chip, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { AppData } from '@/app/constants/interface/appData';
import { useAppTheme } from '@/app/constants/UI/theme';
import { useONNX } from '@/app/hooks/useONNX';

// Import existing camera components
import { CameraScreen } from './cameraScreen';

interface AnalysisResultsProps {
  analysisResult: any;
  onApprove: () => void;
  onRetry: () => void;
}

function ClassificationResults({ analysisResult, onApprove, onRetry }: AnalysisResultsProps) {
  const { theme, styles } = useAppTheme();
  
  if (!analysisResult.classificationResult) {
    return null;
  }

  const { classificationResult } = analysisResult;

  return (
    <Card style={{ margin: 16, padding: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.primary }}>
        Food Classification Results
      </Text>
      
      {/* ONNX Model Indicator */}
      <View style={{ 
        backgroundColor: theme.colors.primaryContainer,
        padding: 8,
        borderRadius: 6,
        marginBottom: 16
      }}>
        <Text variant="bodySmall" style={{ 
          color: theme.colors.onPrimaryContainer,
          textAlign: 'center',
          fontWeight: '500'
        }}>
          🚀 Powered by ONNX Runtime Carb Classifier
        </Text>
      </View>
      
      {/* Main Classification Result */}
      {classificationResult.predictedClass !== 'unknown' ? (
        <View style={{ 
          backgroundColor: theme.colors.secondaryContainer,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Text variant="headlineMedium" style={{ 
            color: theme.colors.primary,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {classificationResult.predictedClass.charAt(0).toUpperCase() + classificationResult.predictedClass.slice(1)}
          </Text>
          <Text variant="bodyLarge" style={{ 
            color: theme.colors.onSecondaryContainer,
            marginTop: 4
          }}>
            {(classificationResult.confidence * 100).toFixed(1)}% confidence
          </Text>
        </View>
      ) : (
        <View style={{ 
          backgroundColor: theme.colors.errorContainer,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Text variant="headlineSmall" style={{ 
            color: theme.colors.onErrorContainer,
            textAlign: 'center'
          }}>
            Unknown Food
          </Text>
          <Text variant="bodyMedium" style={{ 
            color: theme.colors.onErrorContainer,
            marginTop: 4,
            textAlign: 'center'
          }}>
            Try: beans, bread, corn, grains, pancakes, pasta, pizza, potato, or rice
          </Text>
        </View>
      )}

      {/* Top Predictions */}
      <View style={{ marginBottom: 16 }}>
        <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
          Top Predictions:
        </Text>
        {classificationResult.allPredictions.slice(0, 3).map((prediction, index) => (
          <View
            key={prediction.className}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: index === 0 ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Text variant="bodyMedium" style={{ 
              flex: 1,
              fontWeight: index === 0 ? 'bold' : 'normal',
              color: index === 0 ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant
            }}>
              {prediction.className.charAt(0).toUpperCase() + prediction.className.slice(1)}
            </Text>
            <Text variant="bodyMedium" style={{ 
              fontWeight: 'bold',
              color: index === 0 ? theme.colors.primary : theme.colors.onSurfaceVariant
            }}>
              {(prediction.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

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
    clearResults,
    hasResults,
    hasError,
    isONNXReady,
    isUsingRealInference,
    getModelInfo
  } = useONNX();

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

      console.log('📸 Photo captured, starting ONNX Runtime analysis...');
      
      // Analyze the captured photo
      const result = await analyzeImage(photo.uri);
      
      if (result) {
        setShowAnalysis(true);
        console.log('✅ ONNX Runtime analysis completed, showing results');
      }
      
    } catch (error) {
      console.error('❌ ONNX Runtime capture failed:', error);
      Alert.alert('Error', 'Failed to analyze photo with ONNX Runtime');
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Handle approval of classification results
   */
  const handleApproveResults = () => {
    if (!analysisResult.classificationResult) {
      return;
    }

    const { predictedClass, confidence } = analysisResult.classificationResult;
    
    if (predictedClass === 'unknown') {
      Alert.alert('Unknown Food', 'Cannot add unknown food to diary. Please try again with a clearer image.');
      return;
    }

    Alert.alert(
      'Add to Diary',
      `Add "${predictedClass}" (${(confidence * 100).toFixed(1)}% confidence) to your diary?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Diary',
          onPress: () => {
            // Here you would integrate with your diary/database system
            console.log('📝 Adding classification result to diary:', { food: predictedClass, confidence });
            
            // Clear analysis and go back
            clearResults();
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
    clearResults();
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
              <ClassificationResults
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
              {isCapturing ? '📸 Capturing...' : '🚀 Analyzing with ONNX Runtime...'}
            </Text>
            <ProgressBar
              indeterminate
              style={{ width: 200, marginBottom: 8 }}
            />
            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
              {isCapturing ? 'Taking photo' : `ONNX Runtime: ${isUsingRealInference() ? 'Real inference' : 'Mock mode'}`}
            </Text>
            {!isCapturing && (
              <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
                Classifying carb foods with mobile AI
              </Text>
            )}
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
          
          {/* ONNX Runtime AI Capture Button */}
          <Button
            mode="contained"
            onPress={handleAICapture}
            disabled={isCapturing || isAnalyzing || !isONNXReady()}
            style={{ 
              backgroundColor: isONNXReady() ? theme.colors.primary : theme.colors.outline
            }}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            {isONNXReady() ? '🚀 ONNX Runtime' : '⏳ Loading...'}
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