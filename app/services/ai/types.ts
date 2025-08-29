export interface DetectedObject {
  id: string;
  className: string;
  confidence: number;
  boundingBox: BoundingBox;
  estimatedWeight?: number; // in grams
  carbContent?: number; // estimated carbs in grams
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ModelConfig {
  model_info: {
    name: string;
    version: string;
    input_size: [number, number];
    num_classes: number;
    model_accuracy: number;
  };
  preprocessing: {
    mean: [number, number, number];
    std: [number, number, number];
    input_format: string;
    resize_mode: string;
  };
  classes: Record<string, string>;
  class_names: string[];
  carb_categories: string[];
}

export interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
  detectedObjects: DetectedObject[];
  totalEstimatedWeight: number;
  totalEstimatedCarbs: number;
}

export interface WeightEstimationParams {
  objectType: string;
  boundingBoxArea: number;
  imageWidth: number;
  imageHeight: number;
  confidence: number;
}