from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "Crime Prediction API is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    hour = data["hour"]
    day = data["day"]
    month = data["month"]
    year = data["year"]
    latitude = data["latitude"]
    longitude = data["longitude"]

    is_weekend = 1 if day >= 5 else 0
    lat_zone = int(latitude * 10)
    lon_zone = int(longitude * 10)

    prediction = model.predict([[
        hour, day, month, year, is_weekend,
        latitude, longitude, lat_zone, lon_zone
    ]])

    predicted_crime = prediction[0]

    if predicted_crime in ["BATTERY", "ASSAULT", "ROBBERY"]:
        risk = "High"
    elif predicted_crime in ["THEFT", "CRIMINAL DAMAGE"]:
        risk = "Medium"
    else:
        risk = "Low"

    return jsonify({
        "predicted_crime": predicted_crime,
        "risk_level": risk
    })

if __name__ == "__main__":
    app.run(debug=True)