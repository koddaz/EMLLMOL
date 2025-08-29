# AI Camera System

This AI Camera system provides intelligent food recognition and weight estimation for the EMLLMOL diabetes tracking app.

## Features

- **Object Detection**: Uses YOLOv8-based ONNX model to detect food items in photos
- **Weight Estimation**: Calculates estimated weight in grams for detected food items  
- **Carb Calculation**: Estimates carbohydrate content based on food type and weight
- **Clean Architecture**: Modular design with separate services for different concerns

## Architecture

```
AI Camera System
├── Types (types.ts) - TypeScript interfaces
├── Model Loader (modelLoader.ts) - Loads AI model configuration
├── Image Processor (imageProcessor.ts) - Image preprocessing
├── Object Detector (objectDetector.ts) - YOLO model inference
├── Weight Estimator (weightEstimator.ts) - Weight & carb estimation
├── AI Camera Service (aiCameraService.ts) - Main orchestrator
└── React Hook (useAICamera.tsx) - React integration
```

## Supported Foods

The system currently recognizes these carb-rich foods:
- Beans
- Bread  
- Corn
- Grains
- Pancakes
- Pasta
- Pizza
- Potato
- Rice

## Usage

### Basic Implementation

```typescript
import { useAICamera } from '@/app/hooks/useAICamera';

function MyComponent() {
  const { analyzeImage, analysisResult, isAnalyzing } = useAICamera();
  
  const handleAnalyze = async (imageUri: string) => {
    const result = await analyzeImage(imageUri);
    console.log('Detected objects:', result?.detectedObjects);
  };
}
```

### Using the AI Camera Screen

```typescript
import { AICameraScreen } from '@/app/screens/Camera/aiCameraScreen';

// Use as replacement for regular camera screen
<AICameraScreen 
  cameraHook={cameraHook}
  dbHook={dbHook}
  appData={appData}
  navigation={navigation}
/>
```

### Using Individual Services

```typescript
import { AICameraService } from '@/app/services/ai';

const aiService = AICameraService.getInstance();
await aiService.initialize();

const processedImage = await aiService.processImage(imageUri);
console.log('Total weight:', processedImage.totalEstimatedWeight);
console.log('Total carbs:', processedImage.totalEstimatedCarbs);
```

## Configuration

The AI model configuration is loaded from:
`ai/models/json/mobile_config.json`

This includes:
- Model metadata
- Class names and mappings
- Preprocessing parameters
- Input dimensions

## Weight Estimation

Weight estimation uses several factors:

1. **Bounding Box Size**: Relative area of detected object
2. **Food Density**: Predefined density values per food type
3. **Confidence Level**: Adjusts estimate based on detection confidence
4. **Portion Limits**: Applies realistic min/max bounds per food type

### Example Weight Calculations

- **Bread slice**: 15-60g typical range
- **Potato**: 40-350g typical range  
- **Rice serving**: 60-250g typical range
- **Pizza slice**: 80-250g typical range

## Carb Content Estimation

Carbohydrate content is calculated using:
```
carbs = (weight × carb_percentage) / 100
```

### Carb Percentages (per 100g)
- Bread: 45%
- Potato: 17%  
- Rice: 28%
- Pasta: 25%
- Pizza: 30%
- Pancakes: 50%
- Beans: 20%
- Corn: 19%
- Grains: 30%

## Error Handling

The system includes comprehensive error handling:

- **Model Loading Errors**: Failed config/model loading
- **Image Processing Errors**: Invalid image format or processing failures
- **Detection Errors**: ONNX inference failures
- **Estimation Errors**: Weight/carb calculation failures

All errors are logged and user-friendly messages are provided.

## Performance Considerations

- **Initialization**: Models are loaded once and cached
- **Singleton Pattern**: Single AI service instance across app
- **Lazy Loading**: Services initialize only when needed
- **Error Recovery**: Graceful degradation on failures

## Dependencies Required

To fully implement this system, you'll need:

```bash
# ONNX Runtime for React Native
npm install onnxruntime-react-native

# Image processing
npm install expo-image-manipulator

# Optional: Additional image utilities
npm install react-native-image-size
```

## Testing

Use the demo component to test the AI system:

```typescript
import { AICameraDemo } from '@/app/components/aiCameraDemo';

<AICameraDemo testImageUri="path/to/test/image.jpg" />
```

## Model Update Process

To update the AI model:

1. Replace `ai/models/onnx/carb_classifier.onnx`
2. Update `ai/models/json/mobile_config.json` 
3. Test with the demo component
4. Update class mappings if needed

## Debugging

Enable detailed logging by checking console output:
- ✅ Success messages  
- ❌ Error messages
- 🔄 Processing status
- 📊 Analysis results

## Future Enhancements

Potential improvements:
- Support for more food types
- Better weight estimation with reference objects
- Real-time camera overlay
- Batch processing optimization
- Model performance metrics
- Custom portion size calibration