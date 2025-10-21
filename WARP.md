# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with two apps:
  - backend: Flask API for crop yield prediction and disease detection.
  - frontend: React SPA (create-react-app) for UI, charts, and API integration.

Core commands
- Backend (Python/Flask)
  - Create venv and install deps:
    ```bash path=null start=null
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt
    ```
  - Required model files before running:
    - CatBoost model at /Users/girijeshs/Downloads/Brave/crop_yield_model.cbm (absolute path hardcoded in backend/app.py)
    - Keras model copied to backend/disease_model.h5
  - Run API (port 5000):
    ```bash path=null start=null
    cd backend
    flask --app app run --host 0.0.0.0 --port 5000 --debug
    ```
  - Health check:
    ```bash path=null start=null
    curl -s http://localhost:5000/health | jq .
    ```
  - Example prediction request:
    ```bash path=null start=null
    curl -s http://localhost:5000/predict \
      -H 'Content-Type: application/json' \
      -d '{
        "temperature": 26.5,
        "humidity": 65,
        "soil_type": "loamy",
        "crop_type": "wheat",
        "water_flow": 40,
        "latitude": 28.6,
        "longitude": 77.2
      }' | jq .
    ```
  - Example disease detection request (multipart file upload, field name image):
    ```bash path=null start=null
    curl -s -X POST http://localhost:5000/disease \
      -F image=@/absolute/path/to/leaf.jpg | jq .
    ```

- Frontend (React)
  - Install deps:
    ```bash path=null start=null
    cd frontend
    npm install
    ```
  - Run dev server (port 3000 by default):
    ```bash path=null start=null
    # Optionally point UI to a non-default API
    REACT_APP_API_URL=http://localhost:5000 npm start
    ```
  - Build production bundle:
    ```bash path=null start=null
    npm run build
    ```
  - Tests (Jest via react-scripts):
    ```bash path=null start=null
    npm test
    ```
  - Run a single test file/pattern:
    ```bash path=null start=null
    npm test -- src/path/to/Your.test.js -t "your test name"
    ```

High-level architecture
- Frontend
  - Routing: src/App.js defines routes for / (Home), /predict (PredictYield), /disease (DiseaseDetection). Navbar provides navigation.
  - Styling: Tailwind CSS (tailwind.config.js, postcss.config.js, index.css). Visuals use lucide-react icons and recharts for charts.
  - API integration: axios; base URL from REACT_APP_API_URL (defaults to http://localhost:5000). PredictYield posts JSON to /predict and renders yield, charts, and recommendations; also persists last inputs in localStorage and keeps a short prediction history.
  - DiseaseDetection currently performs a mocked, client-side analysis (no network call) but is designed to work with a backend /disease endpoint that accepts multipart file uploads (field image) and returns a diagnosis.

- Backend
  - Flask app (backend/app.py) with CORS enabled; endpoints:
    - GET /health: reports model availability and metadata when possible.
    - POST /predict: expects JSON with temperature, humidity, soil_type, crop_type, water_flow, latitude, longitude; internally maps to the CatBoost model’s feature schema, performs prediction, and returns { predicted_yield, recommended_crops }.
    - POST /disease: expects multipart file image; preprocesses to (224,224) RGB tensor and uses a Keras model to classify, returning { disease, recommended_pesticide }.
  - Models:
    - CatBoostRegressor loaded from absolute path CROP_MODEL_PATH; ensure the .cbm file exists before running or the API will start with crop_model unavailable.
    - TensorFlow Keras model loaded from backend/disease_model.h5; similar availability checks on startup.

Environment conventions
- Frontend-to-backend URL is controlled by REACT_APP_API_URL at build/runtime for CRA dev server. Default is http://localhost:5000.
- Ports: frontend 3000 (react-scripts), backend 5000 (Flask).
