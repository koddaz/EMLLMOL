import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { ONNXService } from '../services/onnxService';

export interface ClassificationResult {
  predictedClass: string;
  confidence: number;
  allPredictions: Array<{className: string, confidence: number}>;
}

export interface ONNXAnalysisResult {
  isAnalyzing: boolean;
  classificationResult: ClassificationResult | null;
  error: string | null;
}

export function useONNX() {
  const [service] = useState(() => ONNXService.getInstance());
  const [analysisResult, setAnalysisResult] = useState<ONNXAnalysisResult>({
    isAnalyzing: false,
    classificationResult: null,
    error: null
  });

  const [initStatus, setInitStatus] = useState<'idle' | 'initializing' | 'ready' | 'error'>('idle');

  // Initialize service on mount
  useEffect(() => {
    initializeService();
  }, []);

  /**
   * Initialize the ONNX Runtime service
   */
  const initializeService = useCallback(async () => {
    if (initStatus === 'ready' || initStatus === 'initializing') {
      return;
    }

    try {
      setInitStatus('initializing');
      console.log('🔄 Initializing ONNX Runtime service...');
      
      await service.initialize();
      
      setInitStatus('ready');
      console.log('✅ ONNX Runtime service ready');
      
    } catch (error) {
      console.error('❌ Failed to initialize ONNX Runtime service:', error);
      setInitStatus('error');
      
      setAnalysisResult(prev => ({
        ...prev,
        error: `ONNX Runtime initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [service, initStatus]);

  /**
   * Classify image using ONNX Runtime model
   */
  const classifyImage = useCallback(async (imageUri: string): Promise<ClassificationResult | null> => {
    if (!imageUri) {
      console.warn('⚠️ No image URI provided for ONNX classification');
      return null;
    }

    if (initStatus !== 'ready') {
      console.log('🔄 ONNX Runtime service not ready, initializing...');
      await initializeService();
    }

    try {
      console.log('🔍 Starting ONNX Runtime classification for image:', imageUri);
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: true,
        error: null
      }));

      // Classify the image with ONNX Runtime
      const classificationResult = await service.processImage(imageUri);

      setAnalysisResult({
        isAnalyzing: false,
        classificationResult,
        error: null
      });

      console.log('✅ ONNX Runtime classification completed successfully');
      console.log('📊 Results:', {
        predicted: classificationResult.predictedClass,
        confidence: `${(classificationResult.confidence * 100).toFixed(1)}%`
      });

      return classificationResult;

    } catch (error) {
      console.error('❌ ONNX Runtime classification failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'ONNX Runtime classification failed';
      
      setAnalysisResult(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      Alert.alert(
        'Classification Error',
        'Failed to classify the image with ONNX Runtime. Please try again.',
        [{ text: 'OK' }]
      );

      return null;
    }
  }, [service, initStatus, initializeService]);

  // Keep the old method name for backward compatibility
  const analyzeImage = classifyImage;

  /**
   * Get top N predictions
   */
  const getTopPredictions = useCallback((n: number = 3): Array<{className: string, confidence: number}> => {
    if (!analysisResult.classificationResult) {
      return [];
    }
    
    return analysisResult.classificationResult.allPredictions.slice(0, n);
  }, [analysisResult.classificationResult]);

  /**
   * Check if classification meets minimum confidence
   */
  const isHighConfidence = useCallback((minConfidence: number = 0.5): boolean => {
    if (!analysisResult.classificationResult) {
      return false;
    }
    
    return analysisResult.classificationResult.confidence >= minConfidence;
  }, [analysisResult.classificationResult]);

  /**
   * Clear classification results
   */
  const clearResults = useCallback(() => {
    setAnalysisResult({
      isAnalyzing: false,
      classificationResult: null,
      error: null
    });
  }, []);

  /**
   * Check if ONNX Runtime service is ready
   */
  const isONNXReady = useCallback((): boolean => {
    return initStatus === 'ready' && service.isReady();
  }, [service, initStatus]);

  /**
   * Check if using real ONNX inference
   */
  const isUsingRealInference = useCallback((): boolean => {
    return service.isUsingRealInference();
  }, [service]);

  /**
   * Get model information
   */
  const getModelInfo = useCallback(() => {
    const config = service.getConfig();
    return {
      isReady: service.isReady(),
      isUsingReal: service.isUsingRealInference(),
      config,
      numClasses: config?.model_info.num_classes || 0,
      classNames: config?.class_names || [],
      accuracy: config?.model_info.model_accuracy || 0,
      runtime: 'ONNX Runtime React Native'
    };
  }, [service]);

  /**
   * Retry initialization
   */
  const retryInitialization = useCallback(async () => {
    setInitStatus('idle');
    service.reset();
    await initializeService();
  }, [service, initializeService]);

  return {
    // Classification functions
    classifyImage,
    analyzeImage, // Backward compatibility
    
    // Results and state
    analysisResult,
    isAnalyzing: analysisResult.isAnalyzing,
    
    // Utility functions
    getTopPredictions,
    isHighConfidence,
    clearResults,
    
    // Status functions
    isONNXReady,
    isUsingRealInference,
    getModelInfo,
    retryInitialization,
    
    // Status properties
    hasResults: !!analysisResult.classificationResult,
    hasError: !!analysisResult.error,
    initStatus,
    
    // Service instance (for advanced usage)
    service
  };
}

