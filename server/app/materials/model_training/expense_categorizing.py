import pandas as pd
import warnings
warnings.filterwarnings('ignore')
from imblearn.under_sampling import RandomUnderSampler
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

sns.set(style="white", color_codes=True)

df = pd.read_csv("../dataset/Daily Household Transactions.csv")
# Keep only expense rows
expense_data_1 = df[df['Income/Expense'] == 'Expense']

# Dropping unwanted varibales
expense_data_1 = expense_data_1.drop(['Mode', 'Currency', 'Date', 'Note', 'Amount', 'Income/Expense'], axis = 1)
expense_data_1.rename(columns={'Subcategory': 'Description'}, inplace=True)
expense_data_1['Category'] = expense_data_1['Category'].str.strip()
expense_data_1['Category'] = expense_data_1['Category'].str.strip().str.lower()
# print(expense_data_1)

expense_data_2 = pd.read_csv("./allExpenses.csv")

# Dropping unwanted varibales
expense_data_2 = expense_data_2.drop(['Date', 'Amount'], axis = 1)
expense_data_2['Category'] = expense_data_2['Category'].str.strip()
expense_data_2['Category'] = expense_data_2['Category'].str.strip().str.lower()
# print(expense_data_2)

# Combine datasets
combined_dataset = pd.concat([expense_data_1, expense_data_2], axis=0)
# print(combined_dataset.head(10))

# Display summary statistics
# print(df.describe(include='all'))

# Drop null data row
combined_dataset.dropna(subset=['Description'], inplace=True)

# Class Balancing - Oversampling with SMOTE
from imblearn.over_sampling import SMOTE
from collections import Counter

# Clean the 'Description' column by filling missing values
combined_dataset['Description'].fillna('Unknown', inplace=True)

# Convert text data to TF-IDF features
tfidf = TfidfVectorizer(stop_words='english')
X = tfidf.fit_transform(combined_dataset['Description'])

# Apply SMOTE for class balancing
smote = SMOTE(sampling_strategy='auto', random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, combined_dataset['Category'])

# Create a new dataframe with the resampled data
df_resampled = pd.DataFrame(X_resampled.toarray(), columns=tfidf.get_feature_names_out())
df_resampled['Category'] = y_resampled

# To get the descriptions back (for inspection purposes, optional)
inverse_transform_descriptions = tfidf.inverse_transform(X_resampled)
df_resampled['Description'] = [' '.join(words) for words in inverse_transform_descriptions]

# Apply Random Under Sampler for class balancing
rus = RandomUnderSampler(sampling_strategy='auto', random_state=42)
X_resampled, y_resampled = rus.fit_resample(X, combined_dataset['Category'])

# Create a new dataframe with the resampled data
df_resampled = pd.DataFrame(X_resampled.toarray(), columns=tfidf.get_feature_names_out())
df_resampled['Category'] = y_resampled

# Print the balanced category distribution and the first 10 rows of the dataset
print(df_resampled['Category'].value_counts())
# print(df_resampled[['Category', 'Description']].head(10))

# To get the descriptions back (for inspection purposes, optional)
inverse_transform_descriptions = tfidf.inverse_transform(X_resampled)
df_resampled['Description'] = [' '.join(words) for words in inverse_transform_descriptions]

# Print the balanced category distribution and the first 10 rows of the dataset
# print(df_resampled['Category'].value_counts())
# print(df_resampled[['Category', 'Description']].head(10))

# Convert text data to TF-IDF features
tfidf = TfidfVectorizer(stop_words='english')
X = tfidf.fit_transform(df_resampled['Description'])

# Encode the target variable
y = df_resampled['Category']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')

# Print the classification report
print(classification_report(y_test, y_pred))

# Save the Model
# # Export the model
# model_filename = 'random_forest_model.joblib'
# joblib.dump(model, model_filename)

# # Export the TF-IDF vectorizer
# vectorizer_filename = 'tfidf_vectorizer.joblib'
# joblib.dump(tfidf, vectorizer_filename)
