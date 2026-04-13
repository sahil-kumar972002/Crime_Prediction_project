import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function App() {
  const [formData, setFormData] = useState({
    hour: 22,
    day: 5,
    month: 3,
    year: 2024,
    latitude: 41.88,
    longitude: -87.63,
  });

  const [prediction, setPrediction] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handlePredict = async () => {
    try {
      setStatus("Predicting...");
      const res = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(res.data.predicted_crime);
      setRiskLevel(res.data.risk_level);
      setStatus("Prediction received successfully");
    } catch (error) {
      console.error(error);
      setStatus("Error connecting to backend");
      alert("Error connecting to backend");
    }
  };

  const riskColor =
    riskLevel === "High"
      ? "#d32f2f"
      : riskLevel === "Medium"
      ? "#f57c00"
      : "#388e3c";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "950px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#222" }}>
            Crime Prediction & Prevention System
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
              fontSize: "16px",
            }}
          >
            AI-powered crime type prediction using time and location data
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Hour</label>
              <input
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                style={inputStyle}
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Month</label>
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Latitude</label>
              <input
                type="number"
                step="0.00001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Longitude</label>
              <input
                type="number"
                step="0.00001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <button onClick={handlePredict} style={buttonStyle}>
            Predict Crime Type
          </button>

          {status && (
            <p
              style={{
                marginTop: "15px",
                textAlign: "center",
                color: status.includes("Error") ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {status}
            </p>
          )}

          {prediction && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              <h2 style={{ marginBottom: "10px", color: "#222" }}>Predicted Crime Type</h2>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#d32f2f",
                  margin: 0,
                }}
              >
                {prediction}
              </p>

              <p
                style={{
                  marginTop: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: riskColor,
                }}
              >
                Risk Level: {riskLevel}
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            padding: "20px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#222" }}>
            Crime Location Map
          </h2>

          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={11}
            style={{ height: "420px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CircleMarker
              center={[formData.latitude, formData.longitude]}
              radius={14}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <strong>Selected Location</strong>
                <br />
                Latitude: {formData.latitude}
                <br />
                Longitude: {formData.longitude}
                <br />
                Predicted Crime: {prediction || "Not predicted yet"}
                <br />
                Risk Level: {riskLevel || "Not available"}
              </Popup>
            </CircleMarker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  marginTop: "25px",
  padding: "14px",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default App;