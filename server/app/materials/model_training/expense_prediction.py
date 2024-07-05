import pandas as pd
import warnings
warnings.filterwarnings('ignore')
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.utils import resample
import numpy as np

sns.set(style="white", color_codes=True)

# Assuming df is already read from the CSV file
df = pd.read_csv("../dataset/Daily Household Transactions.csv")

# Keep only expense rows
expense_data = df[df['Income/Expense'] == 'Expense']

# Dropping unwanted variables
expense_data = expense_data.drop(['Subcategory', 'Category', 'Mode', 'Currency', 'Note', 'Income/Expense'], axis=1)

# Convert the 'Date' column to datetime
expense_data['Date'] = pd.to_datetime(expense_data['Date'], format='%d/%m/%Y %H:%M', errors='coerce')

# Drop rows with invalid datetime conversion
expense_data = expense_data.dropna(subset=['Date'])

# Sort by the 'Date' column
expense_data = expense_data.sort_values(by='Date')

# Example exchange rate (1 INR = 0.057 MYR)
exchange_rate = 0.057

# Function to convert INR to MYR
def convert_inr_to_myr(amount_in_inr, exchange_rate):
    return amount_in_inr * exchange_rate

# Apply conversion to 'Amount' column
expense_data['Amount'] = expense_data['Amount'].apply(lambda x: convert_inr_to_myr(x, exchange_rate))

#EXPAND DATA
# Set the desired number of rows
desired_row_count = 5000

# Perform random sampling with replacement
additional_data = expense_data.sample(n=desired_row_count - len(expense_data), replace=True)

# Combine the original and additional data
expanded_data = pd.concat([expense_data, additional_data])

# Reset index
expanded_data = expanded_data.reset_index(drop=True)
# expanded_data['Date'] = pd.to_datetime(expense_data['Date'], format='%d/%m/%Y %H:%M', errors='coerce')
expanded_data = expanded_data.sort_values(by='Date')

#GROUP BY MONTH
# Convert 'Date' column to datetime if it's not already
expanded_data['Date'] = pd.to_datetime(expanded_data['Date'])
# Create a new column 'Month-Year' containing month-year
expanded_data['Month-Year'] = expanded_data['Date'].dt.to_period('M')

# Group by month-year
df_grouped = expanded_data.groupby(expanded_data['Month-Year'])

#CLASS BALANCING
# Assuming df_grouped is your grouped DataFrame
# Calculate average data count per group
average_count = df_grouped.size().mean()

# Function to perform oversampling or undersampling
def balance_group(group):
    group_size = len(group)
    if group_size < average_count:
        # Oversample if group size is less than average
        return resample(group, replace=True, n_samples=int(average_count), random_state=42)
    elif group_size > average_count:
        # Undersample if group size is more than average
        return resample(group, replace=False, n_samples=int(average_count), random_state=42)
    else:
        return group

# Apply balancing to each group
balanced_data = pd.concat([balance_group(group) for _, group in df_grouped]).reset_index(drop=True)

# Reset index for the balanced DataFrame
balanced_data = balanced_data.reset_index(drop=True)


#SUM BY MONTH
# Assuming your data is in a DataFrame named expanded_data
summed_data = expanded_data.groupby('Month-Year')['Amount'].sum().reset_index()

#OUTLIER HANDLING
# Outlier handling: Removing outliers using IQR method
Q1 = summed_data['Amount'].quantile(0.25)
Q3 = summed_data['Amount'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
expense_data_no_outliers = summed_data[(summed_data['Amount'] >= lower_bound) & (summed_data['Amount'] <= upper_bound)]

# Alternatively, outlier handling: Capping outliers
lower_bound = summed_data['Amount'].quantile(0.05)
upper_bound = summed_data['Amount'].quantile(0.95)
expense_data_capped = summed_data.copy()
expense_data_capped['Amount'] = np.where(expense_data_capped['Amount'] > upper_bound, upper_bound,
                                         np.where(expense_data_capped['Amount'] < lower_bound, lower_bound, expense_data_capped['Amount']))

# INDEXING
expense_data_capped['Month-Year'] = expense_data_capped['Month-Year'].dt.to_timestamp()
# Ensure 'Date' column is datetime and set as index
expense_data_capped['Month-Year'] = pd.to_datetime(expense_data_capped['Month-Year'])
expense_data_capped.set_index('Month-Year', inplace=True)

# ML MODEL TRAINING
# Assuming you have preprocessed your data and handled outliers
# Your data should now be in `expense_data_capped`
# expense_data_capped['Month-Year'] = pd.to_datetime(expense_data_capped['Month-Year'], format='%Y-%m')


# Resample data to monthly frequency and sum amounts
monthly_data = expense_data_capped.resample('M').sum()

# Convert amount to numpy array and reshape for LSTM input
amount_values = monthly_data['Amount'].values.reshape(-1, 1)

# Function to create sequences for LSTM
def create_sequences(data, seq_length):
    xs, ys = [], []
    for i in range(len(data) - seq_length):
        x = data[i:i + seq_length]
        y = data[i + seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

# Normalize monthly_data (optional but recommended for LSTM)
scaler = StandardScaler()
amount_scaled = scaler.fit_transform(amount_values)

# Create sequences with a chosen sequence length
SEQUENCE_LENGTH = 12  # Example: Using 12 months as sequence length
X, y = create_sequences(amount_scaled, SEQUENCE_LENGTH)

# Split monthly_data into train and test sets
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# Reshape input to be 3-dimensional for LSTM [samples, time steps, features]
X_train = np.reshape(X_train, (X_train.shape[0], SEQUENCE_LENGTH, 1))
X_test = np.reshape(X_test, (X_test.shape[0], SEQUENCE_LENGTH, 1))

# Define your model (example)
model = Sequential([
    LSTM(units=50, activation='relu', input_shape=(SEQUENCE_LENGTH, 1)),
    Dropout(0.2),
    Dense(units=1)
])

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test), shuffle=False)

# Save the trained model
model.save('expense_prediction_model.h5')
print("saved")