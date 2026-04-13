import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Load dataset
df = pd.read_csv("chicago crimes.csv", low_memory=False)

# Select useful columns
df = df[['Date', 'Primary Type', 'Latitude', 'Longitude']]
df = df.dropna()

# Convert date
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
df = df.dropna()

# Feature engineering
df['hour'] = df['Date'].dt.hour
df['day'] = df['Date'].dt.dayofweek
df['month'] = df['Date'].dt.month
df['year'] = df['Date'].dt.year
df['is_weekend'] = df['day'].apply(lambda x: 1 if x >= 5 else 0)
df['lat_zone'] = (df['Latitude'] * 10).astype(int)
df['lon_zone'] = (df['Longitude'] * 10).astype(int)

# Top 5 crime types
top_crimes = df['Primary Type'].value_counts().nlargest(5).index
df = df[df['Primary Type'].isin(top_crimes)]

# Sample
df = df.sample(n=30000, random_state=42)

# Features and target
X = df[['hour', 'day', 'month', 'year', 'is_weekend',
        'Latitude', 'Longitude', 'lat_zone', 'lon_zone']]
y = df['Primary Type']

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    random_state=42
)
model.fit(X, y)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved as model.pkl")