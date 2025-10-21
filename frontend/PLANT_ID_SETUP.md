# Plant Disease Detection Setup

## Enable Real AI-Powered Plant Disease Detection

The app currently runs in **demo mode** with simulated disease detection. To enable **real plant disease detection** using AI:

### 🔑 Get Your Free API Key

1. **Visit** [Plant.id](https://web.plant.id/)
2. **Sign up** for a free account
3. **Get your API key** from the dashboard
   - Free tier includes: **500 requests/month**
   - No credit card required

### ⚙️ Configure Your App

1. **Create a `.env` file** in the `frontend` folder:
   ```bash
   cd frontend
   touch .env
   ```

2. **Add your API key** to the `.env` file:
   ```env
   REACT_APP_PLANT_ID_API_KEY=your_actual_api_key_here
   ```

3. **Restart the development server**:
   ```bash
   npm start
   ```

### ✅ That's It!

Now when you upload a plant image:
- ✨ Real AI computer vision analyzes the image
- 🔬 Detects actual plant diseases, pests, and health issues
- 💊 Provides specific treatment recommendations
- 📊 Shows accurate confidence scores

### 🌿 What It Detects

- **Fungal diseases**: Early blight, late blight, powdery mildew, rust, etc.
- **Bacterial diseases**: Bacterial spot, bacterial wilt, fire blight, etc.
- **Viral diseases**: Mosaic virus, leaf curl, etc.
- **Pest damage**: Aphids, caterpillars, mites, etc.
- **Nutrient deficiencies**: Nitrogen, phosphorus, potassium, etc.
- **Healthy plants**: Confirms when plants are disease-free

### 🛠️ Troubleshooting

**Still seeing "offline analysis mode"?**
1. Make sure the `.env` file is in the `frontend` folder (not root)
2. Check that the API key has no extra spaces or quotes
3. Restart the dev server completely (Ctrl+C then `npm start`)
4. Check browser console for detailed error messages

**API errors?**
- Verify your API key is valid at https://web.plant.id/
- Check if you've exceeded the 500 requests/month limit
- Ensure you have an active internet connection

### 📝 Note

Without an API key, the app works in **demo mode** with simulated results. This is fine for testing the UI, but real disease detection requires the API key.
