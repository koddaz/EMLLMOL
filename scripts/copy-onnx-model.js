#!/usr/bin/env node
/**
 * Utility script to copy ONNX model from Python project to React Native app
 * 
 * Usage: node scripts/copy-onnx-model.js [python-project-path]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PYTHON_PROJECT_PATH = process.argv[2] || 'C:\\Users\\alber\\Desktop\\PYTHON';
const MODEL_NAME = 'carb_classifier.onnx';
const TARGET_DIR = path.join(__dirname, '..', 'ai', 'models', 'onnx');

console.log('🔄 ONNX Model Copy Utility');
console.log('==========================');

function findModelInPythonProject(pythonPath) {
  const possiblePaths = [
    path.join(pythonPath, MODEL_NAME),
    path.join(pythonPath, 'models', MODEL_NAME),
    path.join(pythonPath, 'output', MODEL_NAME),
    path.join(pythonPath, 'exports', MODEL_NAME),
    path.join(pythonPath, 'onnx', MODEL_NAME),
  ];

  for (const modelPath of possiblePaths) {
    if (fs.existsSync(modelPath)) {
      console.log(`✅ Found model at: ${modelPath}`);
      return modelPath;
    }
  }

  return null;
}

function copyModel(sourcePath, targetPath) {
  try {
    // Ensure target directory exists
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📁 Created directory: ${targetDir}`);
    }

    // Copy the model file
    fs.copyFileSync(sourcePath, targetPath);
    
    // Get file size
    const stats = fs.statSync(targetPath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ Model copied successfully!`);
    console.log(`📄 Target: ${targetPath}`);
    console.log(`📊 Size: ${sizeInMB} MB`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to copy model:`, error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log(`🔍 Searching for ${MODEL_NAME} in Python project...`);
  console.log(`📂 Python project path: ${PYTHON_PROJECT_PATH}`);
  
  // Check if Python project exists
  if (!fs.existsSync(PYTHON_PROJECT_PATH)) {
    console.error(`❌ Python project directory not found: ${PYTHON_PROJECT_PATH}`);
    console.log(`💡 Usage: node scripts/copy-onnx-model.js [python-project-path]`);
    process.exit(1);
  }

  // Find the model file
  const sourceModelPath = findModelInPythonProject(PYTHON_PROJECT_PATH);
  
  if (!sourceModelPath) {
    console.error(`❌ Could not find ${MODEL_NAME} in Python project`);
    console.log(`💡 Searched in:`);
    [
      path.join(PYTHON_PROJECT_PATH, MODEL_NAME),
      path.join(PYTHON_PROJECT_PATH, 'models', MODEL_NAME),
      path.join(PYTHON_PROJECT_PATH, 'output', MODEL_NAME),
      path.join(PYTHON_PROJECT_PATH, 'exports', MODEL_NAME),
      path.join(PYTHON_PROJECT_PATH, 'onnx', MODEL_NAME),
    ].forEach(p => console.log(`   - ${p}`));
    process.exit(1);
  }

  // Copy the model
  const targetModelPath = path.join(TARGET_DIR, MODEL_NAME);
  const success = copyModel(sourceModelPath, targetModelPath);
  
  if (success) {
    console.log('');
    console.log('🎉 Model copy completed successfully!');
    console.log('💡 You can now run your React Native app with ONNX Runtime');
    console.log('🚀 Run: npx expo start');
  } else {
    console.log('');
    console.log('❌ Model copy failed');
    console.log('💡 You may need to copy the model manually');
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});