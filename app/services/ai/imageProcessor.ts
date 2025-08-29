import { ModelConfig } from './types';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// Temporarily disabled ONNX Runtime
// import { Tensor } from 'onnxruntime-react-native';

export class ImageProcessor {
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  /**
   * Preprocesses image data according to model requirements
   * Converts image to tensor format expected by the ONNX model
   */
  async preprocessImage(imageUri: string): Promise<any> {
    try {
      console.log('🔄 Preprocessing image:', imageUri);
      console.log(`📐 Target size: ${this.config.model_info.input_size.join('x')}`);
      
      const [height, width] = this.config.model_info.input_size;
      
      // 1. Resize and crop image to model input size
      const processedImage = await this.resizeAndCropImage(imageUri, width, height);
      
      // 2. Convert image to RGB pixel data
      const imageData = await this.getImagePixelData(processedImage.uri, width, height);
      
      // 3. Normalize pixel values according to model configuration
      const normalizedData = this.normalizePixels(imageData, width, height);
      
      // 4. Return normalized data (ONNX disabled)
      console.log('✅ Image preprocessed (ONNX disabled, returning mock data)');
      return normalizedData;
    } catch (error) {
      console.error('❌ Failed to preprocess image:', error);
      throw new Error('Image preprocessing failed');
    }
  }

  /**
   * Resizes image to model input dimensions using center crop
   */
  private async resizeAndCropImage(imageUri: string, targetWidth: number, targetHeight: number) {
    try {
      console.log(`📐 Resizing image to ${targetWidth}x${targetHeight}`);
      
      const processedImage = await manipulateAsync(
        imageUri,
        [
          { resize: { width: targetWidth, height: targetHeight } }
        ],
        { 
          compress: 1,
          format: SaveFormat.JPEG,
          base64: false
        }
      );
      
      return processedImage;
    } catch (error) {
      console.error('❌ Failed to resize image:', error);
      throw error;
    }
  }

  /**
   * Extract pixel data from image (placeholder implementation)
   * In production, you'd use a proper image decoding library
   */
  private async getImagePixelData(imageUri: string, width: number, height: number): Promise<Uint8Array> {
    try {
      // Placeholder: In a real implementation, you would:
      // 1. Load the image using a library like react-native-image-picker
      // 2. Decode to raw pixel data 
      // 3. Extract RGB values
      
      console.log('📊 Extracting pixel data from processed image');
      
      // For now, create synthetic RGB data that varies based on image URI
      // This simulates real pixel data while we don't have full image decoding
      const pixelCount = width * height * 3; // RGB
      const pixelData = new Uint8Array(pixelCount);
      
      // Generate pseudo-realistic pixel values based on image URI
      const seed = this.hashString(imageUri);
      let randomState = seed;
      
      for (let i = 0; i < pixelCount; i += 3) {
        // Simple pseudo-random RGB values
        randomState = (randomState * 1103515245 + 12345) & 0x7fffffff;
        const r = (randomState % 256);
        
        randomState = (randomState * 1103515245 + 12345) & 0x7fffffff;
        const g = (randomState % 256);
        
        randomState = (randomState * 1103515245 + 12345) & 0x7fffffff;
        const b = (randomState % 256);
        
        pixelData[i] = r;     // R
        pixelData[i + 1] = g; // G  
        pixelData[i + 2] = b; // B
      }
      
      return pixelData;
    } catch (error) {
      console.error('❌ Failed to extract pixel data:', error);
      throw error;
    }
  }

  /**
   * Normalize pixel values according to model configuration
   */
  private normalizePixels(pixelData: Uint8Array, width: number, height: number): Float32Array {
    const { mean, std } = this.config.preprocessing;
    const normalizedData = new Float32Array(width * height * 3);
    
    console.log('🎨 Normalizing pixel values with mean/std from config');
    
    for (let i = 0; i < pixelData.length; i += 3) {
      // Convert from [0, 255] to [0, 1] then normalize with mean/std
      const r = (pixelData[i] / 255.0 - mean[0]) / std[0];
      const g = (pixelData[i + 1] / 255.0 - mean[1]) / std[1];
      const b = (pixelData[i + 2] / 255.0 - mean[2]) / std[2];
      
      normalizedData[i] = r;
      normalizedData[i + 1] = g;
      normalizedData[i + 2] = b;
    }
    
    return normalizedData;
  }

  /**
   * Simple string hash function for consistent synthetic data
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Resizes image to model input dimensions
   */
  private async resizeImage(imageUri: string, targetWidth: number, targetHeight: number): Promise<string> {
    // Placeholder for image resizing logic
    // Use expo-image-manipulator for actual implementation
    console.log(`📐 Resizing image to ${targetWidth}x${targetHeight}`);
    return imageUri;
  }

  /**
   * Converts image to RGB format if needed
   */
  private async convertToRGB(imageUri: string): Promise<string> {
    // Placeholder for RGB conversion
    console.log('🎨 Converting image to RGB format');
    return imageUri;
  }

  /**
   * Applies center crop resize mode
   */
  private applyCenterCrop(imageData: any, targetWidth: number, targetHeight: number): any {
    // Placeholder for center crop implementation
    console.log('✂️ Applying center crop');
    return imageData;
  }
}