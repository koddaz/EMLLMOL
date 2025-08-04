# Clarifai Setup Guide

## How to get your Clarifai Personal Access Token (PAT)

1. **Sign up for Clarifai**
   - Go to https://clarifai.com/
   - Create a free account

2. **Create a Personal Access Token (PAT)**
   - Log in to your Clarifai account
   - Go to https://clarifai.com/settings/security
   - Click "Create New Personal Access Token"
   - Give it a name like "EMLLMOL Food App"
   - Select scopes: `Predict` (required for making predictions)
   - Copy the generated PAT token

3. **Update the app configuration**
   - Open `/app/index.tsx`
   - Find the `CLARIFAI_CONFIG` object
   - Replace `'YOUR_CLARIFAI_PAT_HERE'` with your actual PAT token

```typescript
const CLARIFAI_CONFIG = {
  PAT: '75944bc5ff1c43b8a8945dbeee89cd37', // Replace this!
  USER_ID: 'baug1zchlvxx',
  APP_ID: 'emilieMol',
  MODEL_ID: 'food-item-recognition',
  MODEL_VERSION_ID: '1d5fd481e0cf4826aa72ec3ff049e044',
};
```

## Model Information

The app uses Clarifai's **food-item-recognition** model which can identify:
- Various fruits (apple, banana, orange, etc.)
- Vegetables (broccoli, carrot, potato, etc.)
- Grains and starches (bread, rice, pasta, etc.)
- Proteins (chicken, fish, beans, etc.)
- Dairy products (milk, cheese, yogurt, etc.)
- Desserts and snacks

## Testing

1. Make sure your PAT is configured
2. Run the app: `npx expo start`
3. Take a photo of food
4. The app will analyze the image and estimate carb content

## Troubleshooting

- **Error: Clarifai PAT not configured**: Make sure you've replaced the placeholder PAT with your actual token
- **API Error 401**: Your PAT might be invalid or expired
- **API Error 402**: You might have exceeded your free tier limits
- **No food detected**: Try taking clearer photos with good lighting

## Free Tier Limits

Clarifai's free tier includes:
- 1,000 operations per month
- Standard community models (including food-item-recognition)

For higher usage, consider upgrading to a paid plan.
