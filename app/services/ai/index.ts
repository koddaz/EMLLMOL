import { AICameraService } from './aiCameraService';

// AI Services Exports
export { AICameraService } from './aiCameraService';
export { ObjectDetector } from './objectDetector';
export { WeightEstimator } from './weightEstimator';
export { ModelLoader } from './modelLoader';
export { ImageProcessor } from './imageProcessor';

// Types
export type {
  DetectedObject,
  BoundingBox,
  ModelConfig,
  ProcessedImage,
  WeightEstimationParams,
} from './types';

// Hooks
export { useAICamera } from '../../hooks/useAICamera';

// Easy access to singleton service
export const aiCamera = AICameraService.getInstance();