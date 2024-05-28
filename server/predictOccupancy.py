import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Create a connection to the MongoDB database
client = MongoClient(os.getenv('MONGODB_URI'))

# Connect to the database
db = client['SmartParking']

# Fetch data from the collection
cursor = db['weeklydatas'].find()

# Convert data to pandas dataframe
data = pd.DataFrame(list(cursor))

# Reshape the data
data_melted = data.melt(id_vars=['_id','dayId'], var_name='hour', value_name='occupied_spots')
data_melted = data_melted.iloc[:-1]

# COnvert the hour column to numeric
data_melted['hour'] = pd.to_numeric(data_melted['hour'])

# Create a day_of_week column
data_melted['day_of_week'] = data_melted.index // 24

# Split the data into features and target
X = data_melted[['hour', 'day_of_week']]
y = data_melted['occupied_spots']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Get the model if it is saved already or create a new one
model_file = 'model.pkl'
if os.path.exists(model_file):
    model = joblib.load(model_file)
else:
    model = RandomForestRegressor(n_estimators=10, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Save the trained model to the model file
joblib.dump(model,model_file)

# Evaluate the model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f'Mean Absolute Error: {mae}')

future_predictions = []
# Use the model to make predictions for the next week
for i in range(0,7):
    for j in range(1,25):
        future_data = pd.DataFrame({'hour': [j], 'day_of_week': [i]})
        future_prediction = model.predict(future_data)
        future_predictions.append(future_prediction[0])
        j += 1
    i += 1

print(future_predictions)

with open('future_predictions.json','w') as f:
    json.dump(future_predictions, f)