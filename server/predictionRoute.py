from flask import Flask, jsonify
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

app = Flask(__name__)

@app.route('/predictions', methods=['GET'])
def get_predictions():
    # This is where you would load your data and train your model
    # For simplicity, I'm just using a pre-trained model here
    model = RandomForestRegressor(n_estimators=100, random_state=42)

    # Use the model to make predictions
    future_data = pd.DataFrame({'hour': [10], 'day_of_week': [3]})
    future_prediction = model.predict(future_data)

    # Return the predictions as a JSON response
    return jsonify({'predictions': future_prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
