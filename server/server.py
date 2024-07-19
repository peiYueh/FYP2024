
from flask import Flask, jsonify
from flask_cors import CORS
from flask import current_app, request
from app.controllers.user_controller import signup, login, getStarted, getAccountDetails, editAccount, getInitialExpense, getInitialIncome, getLifeExpectancy, getBasicInformation, getUserAge, forgotPassword,resetPassword
from app.controllers.transaction_controller import newTransaction, editTransaction, getTransactions,deleteTransaction, categorizeTransactions, getMonthlyExpense
from app.controllers.liability_controller import newLiability, getLiabilities, getPaymentDates, newPaymentUpdate, editLiability, deletePaymentUpdate, deleteLiability
from app.controllers.scenario_controller import newGoal, getGoal, editGoal, myGoal, deleteGoal
from app.controllers.machine_learning_controller import classifyCategory, predictSalary, predictExpense
from app.db import get_db
from app import create_app
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

app = create_app()
CORS(app)
app.secret_key = '1111'
mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# members API route
@app.route("/members")
def members():
    return {"my words": ["This", "Is", "My", "words"]}

@app.route('/signup', methods=['POST'])
def signup_route():
    db = get_db()  # Get the database connection
    data = request.json  # Access JSON data from request body
    return signup(db)

@app.route('/userAccount', methods=['GET'])
def account_route():
    db = get_db()  # Get the database connection
    return getAccountDetails(db)

@app.route('/editAccount', methods=['POST'])
def update_account():
    print("EDITING")
    data = request.json
    db = get_db()
    return editAccount(db)

@app.route('/login', methods=['POST'])
def login_route():
    print("Login Action Called")
    db = get_db()  # Get the database hi
    return login(db)

@app.route('/getStarted', methods=['POST'])
def getStarted_route():
    db = get_db()  # Get the database hi
    return getStarted(db)

@app.route('/newTransaction', methods=['POST'])
def create_transaction():
    db = get_db()
    return newTransaction(db)

@app.route('/editTransaction', methods=['POST'])
def update_transaction():
    print("EDITING")
    db = get_db()
    return editTransaction(db)

@app.route('/transactions', methods=['GET'])
def get_transactions():
    print("Login Action Called")
    db = get_db()
    return getTransactions(db)


@app.route('/newLiability', methods=['POST'])
def add_liability():
    print("Adding Liability")
    db = get_db()
    return newLiability(db)

@app.route('/liabilities', methods=['GET'])
def get_liability():
    print("getting Liability")
    db = get_db()
    return getLiabilities(db)

@app.route('/paymentDates', methods=['GET'])
def get_payment_date():
    print("HELLOO")
    db = get_db()
    return getPaymentDates(db)

@app.route('/basicInformation', methods=['GET'])
def get_basic_information():
    print("HELLOO")
    db = get_db()
    return getBasicInformation(db)


@app.route('/updatePayment', methods=['POST'])
def new_payment_update():
    db = get_db()
    return newPaymentUpdate(db)

@app.route('/editLiability', methods=['POST'])
def edit_liability():
    print("EDITING")
    db = get_db()
    return editLiability(db)

@app.route('/transactions/<string:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    db = get_db()
    return deleteTransaction(db, transaction_id)

@app.route('/deletePaymentUpdate/<string:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    db = get_db()
    return deletePaymentUpdate(db, payment_id)

@app.route('/deleteLiability/<string:liability_id>', methods=['DELETE'])
def delete_liability(liability_id):
    db = get_db()
    return deleteLiability(db, liability_id)

@app.route('/myGoals', methods=['GET'])
def get_all_goals():
    db = get_db()
    return myGoal(db)

@app.route('/userAge', methods=['GET'])
def get_user_age():
    db = get_db()
    return str(getUserAge(db))

@app.route('/newGoal', methods=['POST'])
def add_goal():
    print("Adding Goal")
    db = get_db()
    return newGoal(db)

@app.route('/goal/<goal_id>', methods=['GET'])
def get_goal(goal_id):
    db = get_db()
    return getGoal(db, goal_id)

@app.route('/editGoal', methods=['POST'])
def edit_goal():
    print("EDITING")
    db = get_db()
    return editGoal(db)

@app.route('/goal/<goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    db = get_db()
    return deleteGoal(db, goal_id)

@app.route('/classify', methods=['POST'])
def classify_category():
    if request.is_json:
        print("HII")
        data = request.get_json()
        description = data.get('transactionDescription', '')
        return classifyCategory(description)
    else:
        return jsonify({'error': 'Request content type must be application/json'}), 415

@app.route('/categorizeTransaction', methods=['GET'])
def categorize_transactions():
    db = get_db()  # Replace with your method of obtaining the database hi
    return categorizeTransactions(db)    

@app.route('/initialIncome', methods=['GET'])
def initial_income():
    db = get_db()  # Replace with your method of obtaining the database hi
    return getInitialIncome(db)    

@app.route('/predictSalary', methods=['GET'])
def predict_salary_endpoint():
    retirement_age = int(request.args.get('retirementAge')) + 1
    current_salary = float(request.args.get('activeIncome'))

    # get current age from user data
    db = get_db()
    current_age = getUserAge(db)
    years_to_predict = (retirement_age - current_age)

    result = predictSalary(current_salary * 12, years_to_predict)
    if 'error' in result:
        return jsonify(result), 500
    return jsonify({'future_salaries': result})
    # return result

@app.route('/predictExpense', methods=['GET'])
def predict_expense_endpoint():
    use_history_data = request.args.get('useHistoricalDataForExpenses', 'false').lower() == 'true'
    expense_initial = float(request.args.get('totalSpending', 0))  # Default to 0 if not provided
    life_expectancy = int(request.args.get('lifeExpectancy', 0)) + 1
    db = get_db()
    current_age = getUserAge(db)

    # Calculate the number of years to predict
    years_to_predict = (life_expectancy - current_age)

    SEQUENCE_LENGTH = 12  # Sequence length expected by the model
    
    if use_history_data:
        # Assuming getMonthlyExpense returns a list of monthly expenses
        expense_history = getMonthlyExpense(db)
        # If expense_history is empty, call getInitialExpense function
        if not expense_history:
            expense_history = [getInitialExpense(db)] * SEQUENCE_LENGTH
        elif len(expense_history) < SEQUENCE_LENGTH:
            expense_history = (expense_history * (SEQUENCE_LENGTH // len(expense_history) + 1))[:SEQUENCE_LENGTH]
    else:
        expense_history = [expense_initial] * SEQUENCE_LENGTH  # Repeat expense_initial to fill the sequence

    future_expenses = predictExpense(expense_history, years_to_predict=years_to_predict)
    print(future_expenses)
    # Prepare response
    response = {
        'predictions': future_expenses.flatten().tolist()  # Convert NumPy array to list
    }

    return jsonify(response)

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    # serializer = URLSafeTimedSerializer(app.config['1111'])
    db = get_db()
    data = request.json
    email = data.get('email')
    return forgotPassword(db, email, serializer, mail)

@app.route('/reset-password', methods=['POST'])
def reset_password():
    db = get_db()
    return resetPassword(db)


if __name__ == "__main__":
    app.run(debug=True)