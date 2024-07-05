import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from joblib import dump, load

# Load the dataset
df = pd.read_csv("../dataset/Salary Data.csv")

# Prepare the Dataset
df['NextYearSalary'] = df['Salary'].shift(-1)
df.dropna(inplace=True)

# Split Dataset
X = df[['Salary']]
y = df['NextYearSalary']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Model
model = LinearRegression()
model.fit(X_train, y_train)

# Export the Model
dump(model, 'salary_prediction_model.joblib')
print("Model saved as 'salary_prediction_model.joblib'")
