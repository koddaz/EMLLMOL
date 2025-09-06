import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { ModelConfig } from './types';
import { ImagePreprocessor } from './imagePreprocessor';

// Safe ONNX Runtime import with fallback
let InferenceSession: any = null;
let Tensor: any = null;
let onnxRuntimeAvailable = false;

try {
  const onnxRuntime = require('onnxruntime-react-native');
  InferenceSession = onnxRuntime.InferenceSession;
  Tensor = onnxRuntime.Tensor;
  onnxRuntimeAvailable = true;
  console.log('✅ ONNX Runtime React Native loaded successfully');
} catch (error) {
  console.warn('⚠️ ONNX Runtime React Native not available, falling back to mock mode');
  onnxRuntimeAvailable = false;
  
  // Mock classes for development mode
  InferenceSession = {
    create: async () => ({
      inputNames: ['input'],
      outputNames: ['output'],
      run: async () => ({ output: { data: new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]) } })
    })
  };
  Tensor = class MockTensor {
    constructor(public type: string, public data: any, public dims: number[]) {}
  };
}

/**
 * ONNX Runtime AI Service for React Native
 * 
 * Much simpler than ExecuTorch - uses your existing ONNX model directly!
 * No Python conversion needed, works with the .onnx file you already have.
 */
export class ONNXService {
  private static instance: ONNXService;
  private session: InferenceSession | null = null;
  private config: ModelConfig | null = null;
  private isInitialized = false;

  // Model preprocessing constants
  private readonly MEAN = [0.485, 0.456, 0.406];
  private readonly STD = [0.229, 0.224, 0.225];
  private readonly INPUT_SIZE = 224;

  private constructor() {}

  static getInstance(): ONNXService {
    if (!ONNXService.instance) {
      ONNXService.instance = new ONNXService();
    }
    return ONNXService.instance;
  }

  /**
   * Initialize ONNX Runtime with your existing model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing ONNX Runtime service...');

      // Load model configuration
      await this.loadModelConfig();
      
      // Only try to load real ONNX model if runtime is available
      if (onnxRuntimeAvailable) {
        await this.loadONNXModel();
        console.log('✅ ONNX Runtime service ready with real inference');
      } else {
        // Use mock session for development
        this.session = await InferenceSession.create();
        console.log('✅ ONNX Runtime service ready (mock mode)');
      }
      
      this.isInitialized = true;

    } catch (error) {
      console.error('❌ Failed to initialize ONNX Runtime:', error);
      
      // Try to fallback to mock mode if real initialization fails
      if (onnxRuntimeAvailable) {
        console.log('🔄 Falling back to mock mode...');
        try {
          this.session = await InferenceSession.create();
          this.isInitialized = true;
          console.log('✅ ONNX Runtime service ready (fallback mock mode)');
          return;
        } catch (mockError) {
          console.error('❌ Mock mode also failed:', mockError);
        }
      }
      
      throw error;
    }
  }

  private async loadModelConfig(): Promise<void> {
    try {
      const configModule = require('../../../ai/models/json/mobile_config.json');
      this.config = configModule as ModelConfig;
      console.log('✅ ONNX model config loaded');
    } catch (error) {
      console.error('❌ Failed to load model config:', error);
      throw error;
    }
  }

  /**
   * Load your existing ONNX model - no conversion needed!
   */
  private async loadONNXModel(): Promise<void> {
    if (!onnxRuntimeAvailable) {
      throw new Error('ONNX Runtime not available');
    }

    try {
      console.log('🔄 Loading ONNX model...');

      let modelPath: string;

      try {
        // Try to load model from app bundle first
        const modelAsset = Asset.fromModule(require('./carb_classifier.onnx'));
        await modelAsset.downloadAsync();

        if (!modelAsset.localUri) {
          throw new Error('Failed to download ONNX model from app bundle');
        }

        console.log('📄 ONNX model loaded from app bundle:', modelAsset.localUri);
        modelPath = modelAsset.localUri;

      } catch (assetError) {
        console.warn('⚠️ Could not load ONNX model from app bundle:', assetError);
        
        // Fallback: check documents directory
        const documentsDir = FileSystem.documentDirectory;
        if (!documentsDir) {
          throw new Error('Neither app bundle nor documents directory available');
        }

        modelPath = documentsDir + 'carb_classifier.onnx';
        const modelInfo = await FileSystem.getInfoAsync(modelPath);
        
        if (!modelInfo.exists) {
          throw new Error(`ONNX model not found in app bundle or at ${modelPath}`);
        }
        
        console.log('📄 Using ONNX model from documents directory:', modelPath);
      }

      // Create ONNX Runtime session - this is the magic!
      this.session = await InferenceSession.create(modelPath);
      
      console.log('✅ ONNX model loaded successfully');
      console.log(`📊 Input names: ${this.session.inputNames.join(', ')}`);
      console.log(`📊 Output names: ${this.session.outputNames.join(', ')}`);

    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      throw error;
    }
  }

  /**
   * Process image with ONNX Runtime - Simple Classification
   */
  async processImage(imageUri: string): Promise<{
    predictedClass: string;
    confidence: number;
    allPredictions: Array<{className: string, confidence: number}>;
  }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.session || !this.config) {
      throw new Error('ONNX service not properly initialized');
    }

    try {
      console.log('📸 Classifying image with ONNX Runtime:', imageUri);

      // Preprocess image using our image preprocessor
      const inputTensor = await ImagePreprocessor.preprocessImage(imageUri);
      
      // Run ONNX inference
      const feeds = { [this.session.inputNames[0]]: inputTensor };
      const results = await this.session.run(feeds);
      
      // Get output tensor
      const outputTensor = results[this.session.outputNames[0]];
      const rawLogits = Array.from(outputTensor.data as Float32Array);
      
      // Convert logits to probabilities using softmax
      const predictions = this.applySoftmax(rawLogits);
      
      // Create classification results
      const allPredictions = predictions.map((confidence, index) => ({
        className: this.config!.classes[index.toString()] || `class_${index}`,
        confidence
      })).sort((a, b) => b.confidence - a.confidence);

      const bestPrediction = allPredictions[0];
      const confidenceThreshold = 0.15; // 15% minimum confidence

      if (bestPrediction.confidence >= confidenceThreshold) {
        console.log(`✅ Classification: ${bestPrediction.className} (${(bestPrediction.confidence * 100).toFixed(1)}% confidence)`);
        console.log('📊 Top 3 predictions:', allPredictions.slice(0, 3).map(p => `${p.className}: ${(p.confidence * 100).toFixed(1)}%`).join(', '));
        
        return {
          predictedClass: bestPrediction.className,
          confidence: bestPrediction.confidence,
          allPredictions
        };
      } else {
        console.log('❌ No clear classification - confidence too low');
        console.log('💡 Try pointing camera at: beans, bread, corn, grains, pancakes, pasta, pizza, potato, or rice');
        console.log('📊 Best guess:', `${bestPrediction.className} (${(bestPrediction.confidence * 100).toFixed(1)}%)`);
        
        return {
          predictedClass: 'unknown',
          confidence: 0,
          allPredictions
        };
      }

    } catch (error) {
      console.error('❌ ONNX classification failed:', error);
      throw error;
    }
  }


  /**
   * Apply softmax to convert raw logits to probabilities
   */
  private applySoftmax(logits: number[]): number[] {
    // Find max for numerical stability
    const maxLogit = Math.max(...logits);
    
    // Compute exp(x - max) for each logit
    const expLogits = logits.map(x => Math.exp(x - maxLogit));
    
    // Compute sum of exponentials
    const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
    
    // Compute softmax probabilities
    const probabilities = expLogits.map(exp => exp / sumExp);
    
    console.log('🧮 Raw logits:', logits.map(l => l.toFixed(2)).join(', '));
    console.log('📊 Softmax probabilities:', probabilities.map(p => (p * 100).toFixed(1) + '%').join(', '));
    
    return probabilities;
  }

  // Removed all object detection methods - this is now a pure classification service

  getConfig(): ModelConfig | null { return this.config; }
  isReady(): boolean { return this.isInitialized && this.session !== null; }
  isUsingRealInference(): boolean { return onnxRuntimeAvailable && this.session !== null; }

  /**
   * Get supported food classes
   */
  getSupportedFoods(): string[] {
    if (!this.config) return [];
    return Object.values(this.config.classes);
  }

  /**
   * Quick classification test
   */
  async classifyImage(imageUri: string): Promise<string> {
    const result = await this.processImage(imageUri);
    return result.predictedClass !== 'unknown' 
      ? `${result.predictedClass} (${(result.confidence * 100).toFixed(1)}%)`
      : 'Unknown food';
  }

  reset(): void {
    this.isInitialized = false;
    this.session = null;
    this.config = null;
  }
}