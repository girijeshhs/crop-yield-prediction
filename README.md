# Crop Yield Prediction and Disease Detection Web App

## Project Overview

This is a full-stack web application designed for agricultural professionals to predict crop yields and detect plant diseases using machine learning models. The application features a modern, responsive interface built with React and Tailwind CSS, backed by a Flask API that integrates CatBoost for yield prediction and TensorFlow/Keras for disease detection.

## Features

- **Crop Yield Prediction**: Input environmental parameters to get yield estimates in tons per hectare
- **Disease Detection**: Upload plant images for disease identification (backend implemented, frontend in progress)
- **Modern UI**: Glassmorphism design with agricultural color palette and smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Results**: Instant predictions with visual feedback

## Tech Stack

### Backend
- **Flask**: Python web framework
- **CatBoost**: Machine learning model for yield prediction
- **TensorFlow/Keras**: Deep learning model for disease detection
- **NumPy & Pandas**: Data processing
- **Pillow**: Image processing for disease detection

### Frontend
- **React**: JavaScript library for UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Lucide React**: Icon library
- **Recharts**: Chart library for data visualization
- **React Router**: Client-side routing

## File Descriptions

### PredictYield.js (frontend/src/pages/PredictYield.js)

This is the main prediction interface component that handles crop yield prediction. Key features:

**State Management:**
- Form state for 7 input parameters: temperature, humidity, soil_type, crop_type, water_flow, latitude, longitude
- Result state for displaying predictions
- Error handling and loading states

**Form Components:**
- Temperature input (number, °C)
- Humidity input (number, %)
- Soil type dropdown (Clay, Sandy, Loamy, Peaty)
- Crop type dropdown (Wheat, Rice, Maize, Soybean)
- Water flow input (number, L/min)
- Latitude and longitude inputs (number, coordinates)

**UI Layout:**
- Two-column grid layout (form left, results right)
- Clean form design with focus states and validation
- Submit button with loading state
- Error display for API failures

**Results Display:**
- Large yield prediction card with gradient background
- Weather condition comparison bars showing:
  - Extreme weather impact (60% of normal)
  - Normal weather (current prediction)
  - Optimal weather (130% of normal)
- Visual progress bars with color coding

**Styling:**
- Uses Tailwind classes for responsive design
- Custom color scheme (primary/accent gradients)
- Shadow effects and rounded corners
- Mobile-first responsive breakpoints

## Website Appearance

The website features a modern agricultural aesthetic with nature-inspired colors and professional design elements:

### Color Scheme
- **Primary Colors**: Earth tones (browns, greens) with blue accents
- **Gradients**: From primary to accent colors for depth
- **Backgrounds**: White cards with subtle shadows, gradient overlays

### Layout Structure
- **Navigation**: Clean navbar with app branding
- **Main Content**: Two-column layout on desktop, stacked on mobile
- **Form Section**: Left side with input fields in a white card
- **Results Section**: Right side with prediction display and comparison charts

### Visual Elements
- **Yield Display**: Large, prominent number in a glassmorphism card with backdrop blur
- **Progress Bars**: Horizontal bars showing weather condition impacts with color gradients
- **Loading States**: Animated loader component during API calls
- **Empty State**: Dashed border placeholder when no results are shown

### Responsive Design
- **Desktop**: Side-by-side form and results
- **Mobile**: Stacked layout with full-width components
- **Tablet**: Adaptive grid system

### Animations & Interactions
- **Hover Effects**: Button hover states with opacity changes
- **Focus States**: Input field focus rings
- **Loading Animations**: Smooth transitions during data fetching

## Enhancement Suggestions for Claude

### UI/UX Improvements
1. **Add More Charts**: Implement Recharts for detailed yield vs. weather graphs, historical data visualization
2. **Animations**: Add entrance animations for results, micro-interactions on form elements
3. **Dark Mode**: Toggle between light and dark themes with agricultural night colors
4. **Advanced Form Features**: Auto-fill location from GPS, weather API integration

### Visual Enhancements
1. **Icons**: Add Lucide icons to form fields and results sections
2. **Background Patterns**: Subtle agricultural patterns (leaves, soil textures) as background
3. **Typography**: Better font hierarchy and spacing
4. **Color Palette**: Expand the earth-tone palette with more shades

### Functionality Additions
1. **Historical Data**: Save and display previous predictions
2. **Export Features**: PDF reports, CSV data export
3. **Comparison Tools**: Side-by-side prediction comparisons
4. **Recommendations**: AI-powered farming advice based on predictions

### Performance & Accessibility
1. **Loading States**: Skeleton screens instead of spinners
2. **Error Handling**: Better error messages with recovery suggestions
3. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
4. **Progressive Web App**: Offline capabilities, installable on mobile

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory
2. Create a Python 3.11 virtual environment: `python3.11 -m venv venv`
3. Activate the environment: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Ensure ML models are in place:
   - `crop_yield_model.cbm` (CatBoost model)
   - `disease_model.h5` (TensorFlow model)
6. Run the Flask app: `python app.py`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Environment Variables
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Set `REACT_APP_API_URL` for frontend API calls

## API Endpoints

- `POST /predict`: Crop yield prediction with environmental parameters
- `POST /disease`: Plant disease detection with image upload

## Model Details

### Yield Prediction Model
- **Algorithm**: CatBoost
- **Features**: 9 input parameters (4 categorical: Region, Soil_Type, Crop, Weather_Condition)
- **Output**: Predicted yield in tons per hectare

### Disease Detection Model
- **Algorithm**: TensorFlow/Keras CNN
- **Input**: Plant leaf images
- **Output**: Disease classification and confidence scores

This README provides a comprehensive overview of the current PredictYield.js component and the overall website design, giving Claude a solid foundation for implementing the suggested enhancements.
