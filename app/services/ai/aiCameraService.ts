import { DetectedObject, ProcessedImage, WeightEstimationParams } from './types';
import { ObjectDetector } from './objectDetector';
import { WeightEstimator } from './weightEstimator';
import * as FileSystem from 'expo-file-system';

export class AICameraService {
  private static instance: AICameraService;
  private objectDetector: ObjectDetector;
  private isInitialized = false;

  private constructor() {
    this.objectDetector = new ObjectDetector();
  }

  static getInstance(): AICameraService {
    if (!AICameraService.instance) {
      AICameraService.instance = new AICameraService();
    }
    return AICameraService.instance;
  }

  /**
   * Initialize the AI camera service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('🚀 Initializing AI Camera Service...');
      await this.objectDetector.initialize();
      this.isInitialized = true;
      console.log('✅ AI Camera Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Camera Service:', error);
      throw error;
    }
  }

  /**
   * Process a captured image to detect food items and estimate weights
   */
  async processImage(imageUri: string): Promise<ProcessedImage> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('📸 Processing image with AI:', imageUri);
      
      // Get image dimensions
      const imageInfo = await this.getImageInfo(imageUri);
      
      // Detect objects in the image
      const detectedObjects = await this.detectAndAnalyzeObjects(
        imageUri,
        imageInfo.width,
        imageInfo.height
      );

      // Calculate totals
      const totalEstimatedWeight = this.calculateTotalWeight(detectedObjects);
      const totalEstimatedCarbs = this.calculateTotalCarbs(detectedObjects);

      const processedImage: ProcessedImage = {
        uri: imageUri,
        width: imageInfo.width,
        height: imageInfo.height,
        detectedObjects,
        totalEstimatedWeight,
        totalEstimatedCarbs
      };

      console.log('✅ Image processing completed:');
      console.log(`   - Objects detected: ${detectedObjects.length}`);
      console.log(`   - Total weight: ${totalEstimatedWeight}g`);
      console.log(`   - Total carbs: ${totalEstimatedCarbs}g`);

      return processedImage;
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw error;
    }
  }

  /**
   * Detect objects and analyze their properties
   */
  private async detectAndAnalyzeObjects(
    imageUri: string,
    imageWidth: number,
    imageHeight: number
  ): Promise<DetectedObject[]> {
    // Detect objects using YOLO model
    const detections = await this.objectDetector.detectObjects(imageUri);

    // Enhance detections with weight and carb estimates
    const analyzedObjects = detections.map(detection => {
      const boundingBoxArea = detection.boundingBox.width * detection.boundingBox.height;
      
      const weightParams: WeightEstimationParams = {
        objectType: detection.className,
        boundingBoxArea,
        imageWidth,
        imageHeight,
        confidence: detection.confidence
      };

      const estimatedWeight = WeightEstimator.estimateWeight(weightParams);
      const carbContent = WeightEstimator.estimateCarbContent(detection.className, estimatedWeight);

      return {
        ...detection,
        estimatedWeight,
        carbContent
      };
    });

    return analyzedObjects;
  }

  /**
   * Get image dimensions and metadata
   */
  private async getImageInfo(imageUri: string): Promise<{ width: number; height: number }> {
    try {
      // For now, return default dimensions
      // In production, you'd use expo-image-manipulator or similar to get actual dimensions
      return { width: 1080, height: 1920 }; // Typical phone camera resolution
    } catch (error) {
      console.error('❌ Failed to get image info:', error);
      return { width: 1080, height: 1920 }; // Fallback
    }
  }

  /**
   * Calculate total estimated weight from all detected objects
   */
  private calculateTotalWeight(detectedObjects: DetectedObject[]): number {
    return detectedObjects.reduce((total, obj) => {
      return total + (obj.estimatedWeight || 0);
    }, 0);
  }

  /**
   * Calculate total estimated carbohydrates from all detected objects
   */
  private calculateTotalCarbs(detectedObjects: DetectedObject[]): number {
    return Math.round(
      detectedObjects.reduce((total, obj) => {
        return total + (obj.carbContent || 0);
      }, 0) * 10
    ) / 10; // Round to 1 decimal place
  }

  /**
   * Filter detections by confidence threshold
   */
  filterByConfidence(
    detectedObjects: DetectedObject[],
    minConfidence: number = 0.5
  ): DetectedObject[] {
    return detectedObjects.filter(obj => obj.confidence >= minConfidence);
  }

  /**
   * Group detections by food type
   */
  groupByFoodType(detectedObjects: DetectedObject[]): Record<string, DetectedObject[]> {
    return detectedObjects.reduce((groups, obj) => {
      const className = obj.className;
      if (!groups[className]) {
        groups[className] = [];
      }
      groups[className].push(obj);
      return groups;
    }, {} as Record<string, DetectedObject[]>);
  }

  /**
   * Get summary statistics for processed image
   */
  getImageSummary(processedImage: ProcessedImage): {
    totalObjects: number;
    foodTypes: string[];
    averageConfidence: number;
    totalWeight: number;
    totalCarbs: number;
  } {
    const objects = processedImage.detectedObjects;
    const foodTypes = [...new Set(objects.map(obj => obj.className))];
    const averageConfidence = objects.length > 0 
      ? objects.reduce((sum, obj) => sum + obj.confidence, 0) / objects.length 
      : 0;

    return {
      totalObjects: objects.length,
      foodTypes,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      totalWeight: processedImage.totalEstimatedWeight,
      totalCarbs: processedImage.totalEstimatedCarbs
    };
  }

  /**
   * Check if the service is ready to process images
   */
  isReady(): boolean {
    return this.isInitialized && this.objectDetector.isReady();
  }

  /**
   * Reset the service (useful for testing or error recovery)
   */
  reset(): void {
    this.isInitialized = false;
    console.log('🔄 AI Camera Service reset');
  }
}