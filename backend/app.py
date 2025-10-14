import os
import io
from typing import List, Tuple

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
import numpy as np
import pandas as pd

try:
    from catboost import CatBoostRegressor
except ImportError:  # pragma: no cover
    CatBoostRegressor = None

try:
    from tensorflow.keras.models import load_model
except ImportError:  # pragma: no cover
    load_model = None


CROP_MODEL_PATH = "/Users/girijeshs/Downloads/Brave/crop_yield_model.cbm"
DISEASE_MODEL_PATH = os.path.join(os.path.dirname(__file__), "disease_model.h5")

RECOMMENDED_CROPS_BY_SOIL = {
    "clay": ["Rice", "Wheat"],
    "sandy": ["Millet", "Groundnut"],
    "loamy": ["Maize", "Soybean"],
    "peaty": ["Sugarcane", "Potato"],
}


def _load_crop_model():
    if CatBoostRegressor is None:
        raise RuntimeError("CatBoost is not installed. Please install dependencies from requirements.txt.")
    if not os.path.exists(CROP_MODEL_PATH):
        raise FileNotFoundError(
            f"Crop yield model not found at '{CROP_MODEL_PATH}'. Please place the trained .cbm file at the expected path."
        )
    model = CatBoostRegressor()
    model.load_model(CROP_MODEL_PATH)
    return model


def _load_disease_model():
    if load_model is None:
        raise RuntimeError("TensorFlow is not installed. Please install dependencies from requirements.txt.")
    if not os.path.exists(DISEASE_MODEL_PATH):
        raise FileNotFoundError(
            "Disease detection model not found. Place 'disease_model.h5' inside the backend directory."
        )
    return load_model(DISEASE_MODEL_PATH)


def _preprocess_features(payload: dict) -> Tuple[List[str], pd.DataFrame]:
    # Map frontend fields to model's expected features
    # Model expects: Region, Soil_Type, Crop, Rainfall_mm, Temperature_Celsius, 
    #                Fertilizer_Used, Irrigation_Used, Weather_Condition, Days_to_Harvest
    
    required = [
        "temperature",
        "humidity",
        "soil_type",
        "crop_type",
        "water_flow",
        "latitude",
        "longitude",
    ]
    missing = [field for field in required if field not in payload]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

    # Create DataFrame with the EXACT feature order the model was trained with
    features_df = pd.DataFrame([{
        "Region": f"Lat{payload['latitude']}_Lon{payload['longitude']}",  # Derive region from coordinates
        "Soil_Type": str(payload["soil_type"]).title(),  # Clay, Sandy, Loamy, Peaty
        "Crop": str(payload["crop_type"]).title(),  # Wheat, Rice, Maize, Soybean
        "Rainfall_mm": float(payload["water_flow"]) * 1.5,  # Approximate rainfall from water flow
        "Temperature_Celsius": float(payload["temperature"]),
        "Fertilizer_Used": 1,  # Default: assume fertilizer is used
        "Irrigation_Used": 1,  # Default: assume irrigation is used
        "Weather_Condition": "Normal" if 20 <= float(payload["temperature"]) <= 30 else "Extreme",
        "Days_to_Harvest": int(100 + float(payload["humidity"]) * 0.5),  # Estimate based on humidity
    }])

    categorical_values = [
        str(payload["soil_type"]).lower(),
        str(payload["crop_type"]).lower(),
    ]

    return categorical_values, features_df


def _recommend_crops(soil_type: str, base_crop: str) -> List[str]:
    soil_key = soil_type.lower()
    base = base_crop.title()
    suggestions = RECOMMENDED_CROPS_BY_SOIL.get(soil_key, [])
    if base in suggestions:
        return suggestions
    return [base] + suggestions


def _prepare_image(file_storage) -> np.ndarray:
    image_bytes = file_storage.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    data = np.array(image, dtype=np.float32) / 255.0
    return np.expand_dims(data, axis=0)


app = Flask(__name__)
CORS(app)

try:
    crop_model = _load_crop_model()
except Exception as exc:  # pragma: no cover - handled at runtime
    crop_model = None
    crop_model_error = str(exc)
else:
    crop_model_error = None

try:
    disease_model = _load_disease_model()
except Exception as exc:  # pragma: no cover - handled at runtime
    disease_model = None
    disease_model_error = str(exc)
else:
    disease_model_error = None


@app.route("/health", methods=["GET"])
def health():
    model_info = {}
    if crop_model:
        try:
            model_info["feature_count"] = crop_model.feature_count_
            model_info["feature_names"] = crop_model.feature_names_ if hasattr(crop_model, 'feature_names_') else "Not available"
            model_info["cat_features"] = list(crop_model.get_cat_feature_indices()) if hasattr(crop_model, 'get_cat_feature_indices') else "Not available"
        except Exception as e:
            model_info["error"] = str(e)
    
    return jsonify(
        {
            "status": "ok",
            "crop_model": "ready" if crop_model else f"unavailable: {crop_model_error}",
            "disease_model": "ready" if disease_model else f"unavailable: {disease_model_error}",
            "model_info": model_info,
        }
    )


@app.route("/predict", methods=["POST"])
def predict():
    if crop_model is None:
        return jsonify({"error": f"Crop model unavailable: {crop_model_error}"}), 503

    payload = request.get_json()
    if payload is None:
        return jsonify({"error": "Request must include JSON body."}), 400

    try:
        categorical, features_df = _preprocess_features(payload)
        prediction = crop_model.predict(features_df)
    except ValueError as value_error:
        return jsonify({"error": str(value_error)}), 400
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to generate prediction: {exc}"}), 500

    soil_type, crop_type = categorical
    recommendations = _recommend_crops(soil_type, crop_type)

    return jsonify(
        {
            "predicted_yield": float(prediction[0]),
            "recommended_crops": recommendations,
        }
    )


@app.route("/disease", methods=["POST"])
def disease_detection():
    if disease_model is None:
        return jsonify({"error": f"Disease model unavailable: {disease_model_error}"}), 503

    if "image" not in request.files:
        return jsonify({"error": "Image file with field name 'image' is required."}), 400

    file_storage = request.files["image"]
    if file_storage.filename == "":
        return jsonify({"error": "No file selected."}), 400

    try:
        image_tensor = _prepare_image(file_storage)
        prediction = disease_model.predict(image_tensor)
        predicted_index = int(np.argmax(prediction, axis=1)[0])
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Failed to process image: {exc}"}), 500

    disease_labels = getattr(disease_model, "class_names", None)
    if disease_labels and 0 <= predicted_index < len(disease_labels):
        disease_name = disease_labels[predicted_index]
    else:
        disease_name = f"Class-{predicted_index}"

    pesticide_suggestions = {
        "Blight": "Use copper-based fungicide and remove infected leaves.",
        "Rust": "Apply sulfur fungicide and ensure proper aeration.",
        "Mildew": "Use potassium bicarbonate spray and improve ventilation.",
    }
    pesticide = pesticide_suggestions.get(disease_name, "Consult local agronomist for treatment plan.")

    return jsonify(
        {
            "disease": disease_name,
            "recommended_pesticide": pesticide,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
