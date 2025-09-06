import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useExecutorch } from 'react-native-executorch';
import { ProcessedImage, DetectedObject } from '../services/types';

export interface PyTorchAnalysisResult {
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

export function usePyTorchCamera() {
  const [aiService] = useState(() => AICameraService.getInstance());
  const [analysisResult, setAnalysisResult] = useState<PyTorchAnalysisResult>({
    isAnalyzing: false,
    processedImage: null,
    error: null,
    summary: null
  });

  // ExecuTorch hook for PyTorch model
  const { 
    loadModel, 
    isReady: isModelReady, 
    forward, 
    unloadModel 
  } = useExecutorch();

  // Initialize AI service on mount
  useEffect(() => {
    initializeAI();
  }, []);

  /**
   * Initialize the AI service with PyTorch model
   */
  const initializeAI = useCallback(async () => {
    try {
      if (!aiService.isReady()) {
        console.log('🔄 Initializing PyTorch AI Camera Service...');
        await aiService.initialize();
        
        // Load the PyTorch model through ExecuTorch
        const modelPath = aiService.getModelPath();
        if (modelPath) {
          console.log('📱 Loading PyTorch model with ExecuTorch...');
          await loadModel(modelPath);
          console.log('✅ PyTorch model loaded successfully');
        }
        
        console.log('✅ PyTorch AI Camera Service ready');
      }
    } catch (error) {
      console.error('❌ Failed to initialize PyTorch AI service:', error);
      setAnalysisResult(prev => ({
        ...prev,
        error: 'Failed to initialize PyTorch AI service'
      }));
    }
  }, [aiService, loadModel]);

  /**
   * Analyze a captured photo using PyTorch model
   */
  const analyzeImageWithPyTorch = useCallback(async (imageUri: string): Promise<ProcessedImage | null> => {
    if (!imageUri) {
      console.warn('⚠️ No image URI provided for PyTorch analysis');
      return null;
    }

    try {
      console.log('🔍 Starting PyTorch AI analysis for image:', imageUri);
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null
      }));

      // Process the image with PyTorch AI
      const processedImage = await aiService.processImage(imageUri);
      
      // Get summary statistics
      const summary = aiService.getImageSummary(processedImage);

      setAnalysisResult({
        isAnalyzing: false,
        processedImage,
        error: null,
        summary
      });

      console.log('✅ PyTorch AI analysis completed successfully');
      return processedImage;

    } catch (error) {
      console.error('❌ PyTorch AI analysis failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'PyTorch AI analysis failed';
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      Alert.alert(
        'PyTorch AI Analysis Error',
        'Failed to analyze the image. Please try again.',
        [{ text: 'OK' }]
      );

      return null;
    }
  }, [aiService]);

  /**
   * Run direct PyTorch inference using ExecuTorch
   */
  const runPyTorchInference = useCallback(async (inputTensor: Float32Array): Promise<Float32Array | null> => {
    try {
      if (!isModelReady()) {
        console.warn('⚠️ PyTorch model not ready for inference');
        return null;
      }

      console.log('🧠 Running direct PyTorch inference...');
      const output = await forward(inputTensor);
      console.log('✅ PyTorch inference completed');
      
      return output as Float32Array;
    } catch (error) {
      console.error('❌ PyTorch inference failed:', error);
      return null;
    }
  }, [forward, isModelReady]);

  /**
   * Analyze multiple images in batch
   */
  const analyzeImageBatch = useCallback(async (imageUris: string[]): Promise<ProcessedImage[]> => {
    if (!imageUris.length) {
      console.warn('⚠️ No images provided for batch PyTorch analysis');
      return [];
    }

    try {
      console.log(`🔍 Starting batch PyTorch AI analysis for ${imageUris.length} images`);
      
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

      console.log(`✅ Batch PyTorch AI analysis completed: ${processedImages.length}/${imageUris.length} successful`);
      return processedImages;

    } catch (error) {
      console.error('❌ Batch PyTorch AI analysis failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Batch PyTorch AI analysis failed';
      
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
   * Check if PyTorch AI service is ready
   */
  const isPyTorchReady = useCallback((): boolean => {
    return aiService.isReady() && isModelReady();
  }, [aiService, isModelReady]);

  /**
   * Cleanup function to unload model
   */
  const cleanup = useCallback(async () => {
    try {
      await unloadModel();
      console.log('✅ PyTorch model unloaded');
    } catch (error) {
      console.error('❌ Failed to unload PyTorch model:', error);
    }
  }, [unloadModel]);

  return {
    // Analysis functions
    analyzeImage: analyzeImageWithPyTorch,
    analyzeImageBatch,
    runPyTorchInference,
    
    // Results and state
    analysisResult,
    isAnalyzing: analysisResult.isAnalyzing,
    
    // Utility functions
    getFilteredObjects,
    getObjectsByType,
    clearAnalysis,
    isPyTorchReady,
    cleanup,
    
    // Status
    hasResults: !!analysisResult.processedImage,
    hasError: !!analysisResult.error,
    isModelReady: isModelReady(),
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