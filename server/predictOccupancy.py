import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# Load the data
data = pd.read_csv('parking_lot_data.csv')

# Preprocess the data
data['timestamp'] = pd.to_datetime(data['timestamp'])
data['hour'] = data['timestamp'].dt.hour
data['day_of_week'] = data['timestamp'].dt.dayofweek

# Split the data into features and target
X = data[['hour', 'day_of_week']]
y = data['occupied_spots']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f'Mean Absolute Error: {mae}')

# Use the model to make predictions
future_data = pd.DataFrame({'hour': [10], 'day_of_week': [3]})
future_prediction = model.predict(future_data)
print(f'Predicted occupied spots: {future_prediction[0]}')
