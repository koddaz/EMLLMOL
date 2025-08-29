import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { AICameraService } from '../services/ai/aiCameraService';
import { ProcessedImage, DetectedObject } from '../services/ai/types';

export interface AIAnalysisResult {
  isAnalyzing: boolean;
  processedImage: ProcessedImage | null;
  error: string | null;
  summary: {
    totalObjects: number;
    foodTypes: string[];
    averageConfidence: number;
    totalWeight: number;
    totalCarbs: number;
  } | null;
}

export function useAICamera() {
  const [aiService] = useState(() => AICameraService.getInstance());
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult>({
    isAnalyzing: false,
    processedImage: null,
    error: null,
    summary: null
  });

  // Initialize AI service on mount
  useEffect(() => {
    initializeAI();
  }, []);

  /**
   * Initialize the AI service
   */
  const initializeAI = useCallback(async () => {
    try {
      if (!aiService.isReady()) {
        console.log('🔄 Initializing AI Camera Service...');
        await aiService.initialize();
        console.log('✅ AI Camera Service ready');
      }
    } catch (error) {
      console.error('❌ Failed to initialize AI service:', error);
      setAnalysisResult(prev => ({
        ...prev,
        error: 'Failed to initialize AI service'
      }));
    }
  }, [aiService]);

  /**
   * Analyze a captured photo using AI
   */
  const analyzeImage = useCallback(async (imageUri: string): Promise<ProcessedImage | null> => {
    if (!imageUri) {
      console.warn('⚠️ No image URI provided for analysis');
      return null;
    }

    try {
      console.log('🔍 Starting AI analysis for image:', imageUri);
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null
      }));

      // Process the image with AI
      const processedImage = await aiService.processImage(imageUri);
      
      // Get summary statistics
      const summary = aiService.getImageSummary(processedImage);

      setAnalysisResult({
        isAnalyzing: false,
        processedImage,
        error: null,
        summary
      });

      console.log('✅ AI analysis completed successfully');
      return processedImage;

    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'AI analysis failed';
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      Alert.alert(
        'AI Analysis Error',
        'Failed to analyze the image. Please try again.',
        [{ text: 'OK' }]
      );

      return null;
    }
  }, [aiService]);

  /**
   * Analyze multiple images in batch
   */
  const analyzeImageBatch = useCallback(async (imageUris: string[]): Promise<ProcessedImage[]> => {
    if (!imageUris.length) {
      console.warn('⚠️ No images provided for batch analysis');
      return [];
    }

    try {
      console.log(`🔍 Starting batch AI analysis for ${imageUris.length} images`);
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null
      }));

      const processedImages: ProcessedImage[] = [];
      
      // Process images sequentially to avoid overwhelming the system
      for (const imageUri of imageUris) {
        try {
          const processed = await aiService.processImage(imageUri);
          processedImages.push(processed);
        } catch (error) {
          console.error(`❌ Failed to process image ${imageUri}:`, error);
          // Continue with other images
        }
      }

      // Calculate combined summary
      const combinedSummary = calculateCombinedSummary(processedImages);

      setAnalysisResult({
        isAnalyzing: false,
        processedImage: processedImages[0] || null, // Use first image as representative
        error: null,
        summary: combinedSummary
      });

      console.log(`✅ Batch AI analysis completed: ${processedImages.length}/${imageUris.length} successful`);
      return processedImages;

    } catch (error) {
      console.error('❌ Batch AI analysis failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Batch AI analysis failed';
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      return [];
    }
  }, [aiService]);

  /**
   * Get objects filtered by minimum confidence
   */
  const getFilteredObjects = useCallback((minConfidence: number = 0.6): DetectedObject[] => {
    if (!analysisResult.processedImage) {
      return [];
    }
    
    return aiService.filterByConfidence(
      analysisResult.processedImage.detectedObjects,
      minConfidence
    );
  }, [analysisResult.processedImage, aiService]);

  /**
   * Get objects grouped by food type
   */
  const getObjectsByType = useCallback((): Record<string, DetectedObject[]> => {
    if (!analysisResult.processedImage) {
      return {};
    }
    
    return aiService.groupByFoodType(analysisResult.processedImage.detectedObjects);
  }, [analysisResult.processedImage, aiService]);

  /**
   * Clear analysis results
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult({
      isAnalyzing: false,
      processedImage: null,
      error: null,
      summary: null
    });
  }, []);

  /**
   * Check if AI service is ready
   */
  const isAIReady = useCallback((): boolean => {
    return aiService.isReady();
  }, [aiService]);

  return {
    // Analysis functions
    analyzeImage,
    analyzeImageBatch,
    
    // Results and state
    analysisResult,
    isAnalyzing: analysisResult.isAnalyzing,
    
    // Utility functions
    getFilteredObjects,
    getObjectsByType,
    clearAnalysis,
    isAIReady,
    
    // Status
    hasResults: !!analysisResult.processedImage,
    hasError: !!analysisResult.error,
  };
}

/**
 * Helper function to calculate combined summary from multiple processed images
 */
function calculateCombinedSummary(processedImages: ProcessedImage[]): {
  totalObjects: number;
  foodTypes: string[];
  averageConfidence: number;
  totalWeight: number;
  totalCarbs: number;
} {
  if (!processedImages.length) {
    return {
      totalObjects: 0,
      foodTypes: [],
      averageConfidence: 0,
      totalWeight: 0,
      totalCarbs: 0
    };
  }

  const allObjects = processedImages.flatMap(img => img.detectedObjects);
  const foodTypes = [...new Set(allObjects.map(obj => obj.className))];
  const totalWeight = processedImages.reduce((sum, img) => sum + img.totalEstimatedWeight, 0);
  const totalCarbs = processedImages.reduce((sum, img) => sum + img.totalEstimatedCarbs, 0);
  
  const averageConfidence = allObjects.length > 0 
    ? allObjects.reduce((sum, obj) => sum + obj.confidence, 0) / allObjects.length 
    : 0;

  return {
    totalObjects: allObjects.length,
    foodTypes,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    totalWeight: Math.round(totalWeight),
    totalCarbs: Math.round(totalCarbs * 10) / 10
  };
}