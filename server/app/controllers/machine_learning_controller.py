from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import joblib
import os
from sklearn.preprocessing import StandardScaler
import numpy as np

    # Load the model and the TF-IDF vectorizer
def classifyCategory(description):
    try:
        model = joblib.load('./app/materials/random_forest_model.joblib')
        tfidf = joblib.load('./app/materials/tfidf_vectorizer.joblib')

        # Transform the input using the loaded TF-IDF vectorizer
        X_new = tfidf.transform([description])
            
        # Make predictions using the loaded model
        prediction = model.predict(X_new)
        return jsonify({'category': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def predictSalary(current_salary, future_years):
    try:
        model = joblib.load('./app/materials/salary_prediction_model.joblib')

        future_salaries = []
        for year in range(future_years):
            next_year_salary = model.predict([[current_salary]])[0]
            future_salaries.append(next_year_salary)
            current_salary = next_year_salary
        print(future_salaries)
        return future_salaries
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def predictExpense(expense_history, years_to_predict=12):
    # Load the saved model
    model = load_model('./app/materials/expense_prediction_model.h5')
    
    # Normalize the input data
    scaler = StandardScaler()
    expense_history_scaled = scaler.fit_transform(np.array(expense_history).reshape(-1, 1))
    
    # Create sequences from the input data
    SEQUENCE_LENGTH = 12
    def create_sequences(data, seq_length):
        xs = []
        for i in range(len(data) - seq_length):
            x = data[i:i + seq_length]
            xs.append(x)
        return np.array(xs)
    
    future_seq = expense_history_scaled[-SEQUENCE_LENGTH:].reshape((1, SEQUENCE_LENGTH, 1))  # Last sequence in the scaled data
    future_forecast = []
    for _ in range(years_to_predict):
        next_pred = model.predict(future_seq)[0]
        future_forecast.append(next_pred)
        future_seq = np.append(future_seq[:, 1:, :], [[next_pred]], axis=1)

    # Inverse transform forecasts to original scale
    future_forecast = scaler.inverse_transform(np.array(future_forecast).reshape(-1, 1))

    return future_forecast


