import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip, List, ProgressBar } from 'react-native-paper';
import { useAppTheme } from '../constants/UI/theme';
import { useAICamera } from '../hooks/useAICamera';

interface AICameraDemoProps {
  testImageUri?: string;
}

export function AICameraDemo({ testImageUri }: AICameraDemoProps) {
  const { theme, styles } = useAppTheme();
  const {
    analyzeImage,
    analysisResult,
    isAnalyzing,
    clearAnalysis,
    hasResults,
    hasError,
    isAIReady,
    getFilteredObjects,
    getObjectsByType,
  } = useAICamera();

  const [initializationStatus, setInitializationStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      // Give some time for AI service to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isAIReady()) {
        setInitializationStatus('ready');
      } else {
        setInitializationStatus('error');
      }
    } catch (error) {
      console.error('AI status check failed:', error);
      setInitializationStatus('error');
    }
  };

  const runTestAnalysis = async () => {
    if (!testImageUri) {
      Alert.alert(
        'No Test Image',
        'Please provide a test image URI to run the analysis.'
      );
      return;
    }

    try {
      console.log('🧪 Running test analysis...');
      await analyzeImage(testImageUri);
    } catch (error) {
      console.error('Test analysis failed:', error);
      Alert.alert('Test Failed', 'Failed to run AI analysis test');
    }
  };

  const runMockAnalysis = async () => {
    try {
      console.log('🧪 Running mock analysis...');
      // Simulate analysis with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Mock Analysis Complete',
        'Mock AI analysis completed successfully! In a real scenario, this would process an actual image.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Mock analysis failed:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Initialization Status */}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.primary }}>
          🧠 AI Service Status
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text variant="bodyMedium">Status: </Text>
          <Chip 
            mode="outlined"
            style={{ 
              backgroundColor: initializationStatus === 'ready' 
                ? theme.colors.primaryContainer 
                : initializationStatus === 'error'
                ? theme.colors.errorContainer
                : theme.colors.secondaryContainer
            }}
          >
            {initializationStatus === 'ready' ? '✅ Ready' : 
             initializationStatus === 'error' ? '❌ Error' : '⏳ Loading'}
          </Chip>
        </View>

        <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 12 }}>
          {initializationStatus === 'ready' 
            ? 'AI camera service is ready to analyze images'
            : initializationStatus === 'error'
            ? 'AI service failed to initialize. Check logs for details.'
            : 'Initializing AI models and services...'}
        </Text>

        <Button 
          mode="outlined" 
          onPress={checkAIStatus}
          disabled={initializationStatus === 'loading'}
        >
          Refresh Status
        </Button>
      </Card>

      {/* Test Controls */}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.primary }}>
          🧪 Test AI Analysis
        </Text>

        <View style={{ gap: 8 }}>
          <Button 
            mode="contained"
            onPress={runMockAnalysis}
            disabled={isAnalyzing || initializationStatus !== 'ready'}
            style={{ marginBottom: 8 }}
          >
            Run Mock Analysis
          </Button>

          {testImageUri && (
            <Button 
              mode="outlined"
              onPress={runTestAnalysis}
              disabled={isAnalyzing || initializationStatus !== 'ready'}
            >
              Analyze Test Image
            </Button>
          )}

          <Button 
            mode="text"
            onPress={clearAnalysis}
            disabled={!hasResults}
          >
            Clear Results
          </Button>
        </View>
      </Card>

      {/* Loading Indicator */}
      {isAnalyzing && (
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            🔄 Analyzing Image...
          </Text>
          <ProgressBar indeterminate style={{ marginBottom: 8 }} />
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            Detecting food items and estimating weights
          </Text>
        </Card>
      )}

      {/* Analysis Results */}
      {hasResults && analysisResult.summary && (
        <Card style={{ marginBottom: 16, padding: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.primary }}>
            📊 Analysis Results
          </Text>

          {/* Summary Stats */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            marginBottom: 16,
            padding: 12,
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 8 
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {analysisResult.summary.totalObjects}
              </Text>
              <Text variant="bodySmall">Items</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.secondary }}>
                {analysisResult.summary.totalWeight}g
              </Text>
              <Text variant="bodySmall">Weight</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.tertiary }}>
                {analysisResult.summary.totalCarbs}g
              </Text>
              <Text variant="bodySmall">Carbs</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                {(analysisResult.summary.averageConfidence * 100).toFixed(0)}%
              </Text>
              <Text variant="bodySmall">Confidence</Text>
            </View>
          </View>

          {/* Food Types */}
          {analysisResult.summary.foodTypes.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
                Detected Foods:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {analysisResult.summary.foodTypes.map((foodType: string) => (
                  <Chip key={foodType} compact mode="outlined">
                    {foodType}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {/* Detailed Results */}
          {analysisResult.processedImage?.detectedObjects && (
            <View>
              <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
                Detailed Breakdown:
              </Text>
              {analysisResult.processedImage.detectedObjects.map((obj: any, index: number) => (
                <List.Item
                  key={obj.id || index}
                  title={`${obj.className} (${(obj.confidence * 100).toFixed(0)}%)`}
                  description={`${obj.estimatedWeight}g • ${obj.carbContent}g carbs`}
                  left={props => <List.Icon {...props} icon="food" />}
                  style={{ paddingVertical: 4 }}
                />
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Error Display */}
      {hasError && (
        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: theme.colors.errorContainer }}>
          <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.error }}>
            ❌ Analysis Error
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
            {analysisResult.error}
          </Text>
        </Card>
      )}

      {/* Model Information */}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.primary }}>
          🤖 Model Information
        </Text>
        <List.Item
          title="Model Type"
          description="YOLOv8 + Carb Classifier"
          left={props => <List.Icon {...props} icon="brain" />}
        />
        <List.Item
          title="Supported Foods"
          description="9 carb-rich foods (bread, potato, rice, pasta, etc.)"
          left={props => <List.Icon {...props} icon="food-variant" />}
        />
        <List.Item
          title="Input Size"
          description="224x224 pixels"
          left={props => <List.Icon {...props} icon="image-size-select-actual" />}
        />
        <List.Item
          title="Model Accuracy"
          description="~76% classification accuracy"
          left={props => <List.Icon {...props} icon="target" />}
        />
      </Card>
    </ScrollView>
  );
}