import { ModelConfig } from './types';
// Temporarily disabled ONNX Runtime
// import { InferenceSession, Tensor } from 'onnxruntime-react-native';
// import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

export class ModelLoader {
  private static instance: ModelLoader;
  private config: ModelConfig | null = null;
  private onnxSession: any | null = null;

  private constructor() {}

  static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  async loadConfig(): Promise<ModelConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // Load the mobile config JSON
      const configModule = require('../../../ai/models/json/mobile_config.json');
      this.config = configModule as ModelConfig;
      
      console.log('✅ AI Model config loaded successfully');
      console.log(`📊 Model: ${this.config.model_info.name} v${this.config.model_info.version}`);
      console.log(`🎯 Classes: ${this.config.class_names.join(', ')}`);
      
      return this.config;
    } catch (error) {
      console.error('❌ Failed to load model config:', error);
      throw new Error('Failed to load AI model configuration');
    }
  }

  async loadONNXModel(): Promise<any> {
    if (this.onnxSession) {
      return this.onnxSession;
    }

    try {
      console.log('🔄 Loading ONNX model...');
      
      // For now, skip the actual ONNX model loading to get app working
      console.log('⚠️ ONNX model loading temporarily disabled for debugging');
      
      // The ObjectDetector will use fallback mock results
      this.onnxSession = null;
      
      console.log('✅ ONNX fallback mode enabled (will use mock results)');
      
      return null; // Return null to indicate fallback mode
    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      throw new Error('Failed to load ONNX model');
    }
  }

  getONNXSession(): any | null {
    return this.onnxSession;
  }

  getConfig(): ModelConfig | null {
    return this.config;
  }

  getClassNames(): string[] {
    return this.config?.class_names || [];
  }

  getClassName(classIndex: number): string {
    return this.config?.classes[classIndex.toString()] || 'unknown';
  }

  isValidClass(className: string): boolean {
    return this.config?.carb_categories.includes(className) || false;
  }

  getCarbCategories(): string[] {
    return this.config?.carb_categories || [];
  }
}