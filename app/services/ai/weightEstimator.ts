import { WeightEstimationParams } from './types';

export class WeightEstimator {
  // Average density and size references for food items (grams per cm²)
  private static readonly FOOD_DENSITY_MAP: Record<string, number> = {
    bread: 0.8,      // Slice of bread ~25g, area ~30cm²
    potato: 2.5,     // Medium potato ~150g, area ~60cm²
    rice: 1.2,       // Cooked rice portion
    pasta: 1.5,      // Cooked pasta portion  
    pizza: 2.8,      // Pizza slice with toppings
    pancakes: 1.8,   // Pancake stack
    beans: 1.4,      // Cooked beans
    corn: 1.1,       // Corn kernels/portion
    grains: 1.3,     // Various grain portions
  };

  // Portion size multipliers based on confidence
  private static readonly CONFIDENCE_MULTIPLIERS: Record<string, number> = {
    high: 1.0,    // confidence > 0.8
    medium: 0.85, // confidence 0.6-0.8
    low: 0.7,     // confidence < 0.6
  };

  /**
   * Estimate the weight of a detected food object in grams
   */
  static estimateWeight(params: WeightEstimationParams): number {
    const {
      objectType,
      boundingBoxArea,
      imageWidth,
      imageHeight,
      confidence
    } = params;

    try {
      console.log(`⚖️ Estimating weight for ${objectType}...`);

      // Calculate actual area in cm² (assuming standard phone camera distance)
      const actualArea = this.calculateActualArea(
        boundingBoxArea,
        imageWidth,
        imageHeight
      );

      // Get food density
      const density = this.FOOD_DENSITY_MAP[objectType] || 1.5; // Default density

      // Base weight calculation
      let estimatedWeight = actualArea * density;

      // Apply confidence adjustment
      const confidenceMultiplier = this.getConfidenceMultiplier(confidence);
      estimatedWeight *= confidenceMultiplier;

      // Apply food-specific adjustments
      estimatedWeight = this.applyFoodSpecificAdjustments(objectType, estimatedWeight);

      // Round to reasonable precision
      estimatedWeight = Math.round(estimatedWeight);

      console.log(`✅ Estimated weight: ${estimatedWeight}g (confidence: ${confidence.toFixed(2)})`);
      return Math.max(estimatedWeight, 5); // Minimum 5g
    } catch (error) {
      console.error('❌ Weight estimation failed:', error);
      return 50; // Fallback weight
    }
  }

  /**
   * Calculate actual area from bounding box pixels
   * Assumes standard smartphone camera at ~30cm distance from food
   */
  private static calculateActualArea(
    boundingBoxArea: number,
    imageWidth: number,
    imageHeight: number
  ): number {
    // Conversion factor: pixels to cm² at typical food photography distance
    // This is an approximation and could be calibrated with reference objects
    const pixelToCmRatio = 0.02; // ~0.2mm per pixel at 30cm distance
    
    const totalImagePixels = imageWidth * imageHeight;
    const areaRatio = boundingBoxArea / totalImagePixels;
    
    // Assume image covers ~20x15cm area at typical distance
    const imageAreaCm2 = 20 * 15; // 300 cm²
    const actualArea = areaRatio * imageAreaCm2 * pixelToCmRatio;
    
    return Math.max(actualArea, 1); // Minimum 1 cm²
  }

  /**
   * Get confidence multiplier for weight estimation
   */
  private static getConfidenceMultiplier(confidence: number): number {
    if (confidence >= 0.8) {
      return this.CONFIDENCE_MULTIPLIERS.high;
    } else if (confidence >= 0.6) {
      return this.CONFIDENCE_MULTIPLIERS.medium;
    } else {
      return this.CONFIDENCE_MULTIPLIERS.low;
    }
  }

  /**
   * Apply food-specific weight adjustments based on typical portion sizes
   */
  private static applyFoodSpecificAdjustments(objectType: string, baseWeight: number): number {
    switch (objectType) {
      case 'bread':
        // Bread slices typically 20-40g
        return Math.min(Math.max(baseWeight, 15), 60);
        
      case 'potato':
        // Potatoes vary widely: 50g (small) to 300g (large)
        return Math.min(Math.max(baseWeight, 40), 350);
        
      case 'rice':
        // Rice servings typically 80-200g
        return Math.min(Math.max(baseWeight, 60), 250);
        
      case 'pasta':
        // Pasta servings typically 100-200g
        return Math.min(Math.max(baseWeight, 80), 300);
        
      case 'pizza':
        // Pizza slices typically 100-200g
        return Math.min(Math.max(baseWeight, 80), 250);
        
      case 'pancakes':
        // Pancake serving typically 60-150g
        return Math.min(Math.max(baseWeight, 50), 200);
        
      case 'beans':
        // Bean servings typically 100-200g
        return Math.min(Math.max(baseWeight, 70), 250);
        
      case 'corn':
        // Corn servings typically 80-150g
        return Math.min(Math.max(baseWeight, 60), 200);
        
      case 'grains':
        // Grain servings typically 80-180g
        return Math.min(Math.max(baseWeight, 60), 220);
        
      default:
        // Generic portion size limits
        return Math.min(Math.max(baseWeight, 20), 300);
    }
  }

  /**
   * Estimate carbohydrate content based on food type and weight
   */
  static estimateCarbContent(objectType: string, weight: number): number {
    // Approximate carb content per 100g for different foods
    const carbPercentages: Record<string, number> = {
      bread: 45,      // ~45g carbs per 100g
      potato: 17,     // ~17g carbs per 100g
      rice: 28,       // ~28g carbs per 100g (cooked)
      pasta: 25,      // ~25g carbs per 100g (cooked)
      pizza: 30,      // ~30g carbs per 100g (average with crust)
      pancakes: 50,   // ~50g carbs per 100g
      beans: 20,      // ~20g carbs per 100g
      corn: 19,       // ~19g carbs per 100g
      grains: 30,     // ~30g carbs per 100g (average)
    };

    const carbPercentage = carbPercentages[objectType] || 25; // Default 25%
    const carbContent = (weight * carbPercentage) / 100;
    
    console.log(`🍞 Estimated carbs for ${objectType}: ${carbContent.toFixed(1)}g`);
    return Math.round(carbContent * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get portion size category based on estimated weight
   */
  static getPortionSize(objectType: string, weight: number): 'small' | 'medium' | 'large' {
    // Define portion thresholds per food type
    const portionThresholds: Record<string, { small: number; large: number }> = {
      bread: { small: 25, large: 50 },
      potato: { small: 100, large: 200 },
      rice: { small: 100, large: 180 },
      pasta: { small: 120, large: 200 },
      pizza: { small: 120, large: 180 },
      pancakes: { small: 80, large: 140 },
      beans: { small: 120, large: 200 },
      corn: { small: 100, large: 160 },
      grains: { small: 100, large: 180 },
    };

    const thresholds = portionThresholds[objectType] || { small: 80, large: 150 };
    
    if (weight <= thresholds.small) {
      return 'small';
    } else if (weight >= thresholds.large) {
      return 'large';
    } else {
      return 'medium';
    }
  }
}