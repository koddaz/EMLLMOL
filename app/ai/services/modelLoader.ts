import { ModelConfig } from './types';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export class ModelLoader {
  private static instance: ModelLoader;
  private config: ModelConfig | null = null;
  private model: any | null = null;
  private modelPath: string | null = null;

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

  async loadPyTorchModel(): Promise<string> {
    if (this.modelPath) {
      return this.modelPath;
    }

    try {
      console.log('🔄 Loading PyTorch model...');
      
      // Load the .ptl model file
      const modelAsset = Asset.fromModule(require('../../../ai/models/ptl/carb_classifier.ptl'));
      await modelAsset.downloadAsync();
      
      if (!modelAsset.localUri) {
        throw new Error('Failed to download PyTorch model asset');
      }

      // Copy to app's document directory for ExecuTorch access
      const documentsDir = FileSystem.documentDirectory!;
      const modelFileName = 'carb_classifier.ptl';
      const modelPath = documentsDir + modelFileName;

      // Copy the model file
      await FileSystem.copyAsync({
        from: modelAsset.localUri,
        to: modelPath,
      });

      this.modelPath = modelPath;
      
      console.log('✅ PyTorch model loaded successfully');
      console.log(`📁 Model path: ${modelPath}`);
      
      return modelPath;
    } catch (error) {
      console.error('❌ Failed to load PyTorch model:', error);
      throw new Error(`Failed to load PyTorch model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getModelPath(): string | null {
    return this.modelPath;
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

  // Note: ExecuTorch integration will be handled at the component level
  // since React hooks cannot be used in class components

  /**
   * Reset the model loader
   */
  reset(): void {
    this.modelPath = null;
    this.model = null;
    console.log('🔄 ModelLoader reset');
  }
}