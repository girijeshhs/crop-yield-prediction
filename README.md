# Crop Yield Prediction and Disease Detection

Full-stack web application that combines a Flask backend with a React + Tailwind CSS frontend to predict crop yield and detect plant diseases.

## Project Structure

```
backend/
  app.py
  requirements.txt
  disease_model.h5        # place trained CNN here (ignored by git)
frontend/
  package.json
  src/
    components/
    pages/
    App.js
    index.js
```

## Getting Started

### Backend (port 5000)
1. Navigate to `backend/` and create a virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Place your trained CatBoost model at `/Users/girijeshs/Downloads/Brave/crop_yield_model.cbm`.
3. Place your disease detection Keras model as `backend/disease_model.h5`.
4. Run the Flask app:
   ```bash
   flask --app app run --host 0.0.0.0 --port 5000 --debug
   ```

### Frontend (port 3000)
1. Navigate to `frontend/` and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```

Set `REACT_APP_API_URL` in a `.env` file inside `frontend/` if the backend runs on a different host or port.
