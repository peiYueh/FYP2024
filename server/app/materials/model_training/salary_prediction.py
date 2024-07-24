import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from joblib import dump, load
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
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

# Predict the salaries for the test set
y_pred = model.predict(X_test)

# Calculate evaluation metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error (MAE): {mae}")
print(f"Mean Squared Error (MSE): {mse}")
print(f"R-squared (R²) Score: {r2}")

# Scatter Plot of Actual vs. Predicted Values
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--', lw=2)
plt.xlabel('Actual Next Year Salary')
plt.ylabel('Predicted Next Year Salary')
plt.title('Actual vs Predicted Next Year Salary')
plt.show()


# Export the Model
# dump(model, 'salary_prediction_model.joblib')
# print("Model saved as 'salary_prediction_model.joblib'")
