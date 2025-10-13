# Backend Setup

1. Create a Python virtual environment and install dependencies:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Place the trained crop yield CatBoost model at `/Users/girijeshs/Downloads/Brave/crop_yield_model.cbm`.
3. Copy the trained disease detection Keras model into this directory as `disease_model.h5`.
4. Run the API:
   ```bash
   flask --app app run --host 0.0.0.0 --port 5000 --debug
   ```
