from flask import Flask, request, jsonify
import joblib
import os

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