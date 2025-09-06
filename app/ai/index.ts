// AI Module - Centralized exports for all AI functionality
// This module contains image classification services for the EMI-SENSE app

// Hooks
export { useONNX } from './hooks/useONNX';
export type { ClassificationResult } from './hooks/useONNX';

// Services  
export { ONNXService } from './services/onnxService';
export { ModelLoader } from './services/modelLoader';
export { ImagePreprocessor } from './services/imagePreprocessor';

// Types
export type {
  DetectedObject,
  BoundingBox,
  ModelConfig,
  ProcessedImage,
} from './services/types';

// Screens
export { AICameraScreen } from './screens/aiCameraScreen';