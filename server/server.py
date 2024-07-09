
from flask import Flask, jsonify
from flask_cors import CORS
from flask import current_app, request
from app.controllers.user_controller import signup, login, getStarted, getAccountDetails, editAccount, getInitialExpense, getInitialIncome, getLifeExpectancy, getBasicInformation
from app.controllers.transaction_controller import newTransaction, editTransaction, getTransactions,deleteTransaction, categorizeTransactions, getMonthlyExpense
from app.controllers.liability_controller import newLiability, getLiabilities, getPaymentDates, newPaymentUpdate, editLiability, deletePaymentUpdate, deleteLiability
from app.controllers.scenario_controller import newGoal, getGoal, editGoal, myGoal, deleteGoal
from app.controllers.machine_learning_controller import classifyCategory, predictSalary, predictExpense
from app.db import get_db
from app import create_app

app = create_app()
CORS(app)
app.secret_key = 'your_secret_key_here'

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
    db = get_db()  # Get the database connection
    data = request.json  # Access JSON data from request body
    return login(db)

@app.route('/getStarted', methods=['POST'])
def getStarted_route():
    db = get_db()  # Get the database connection
    return getStarted(db)

@app.route('/newTransaction', methods=['POST'])
def create_transaction():
    data = request.json
    db = get_db()
    return newTransaction(db)

@app.route('/editTransaction', methods=['POST'])
def update_transaction():
    print("EDITING")
    data = request.json
    db = get_db()
    return editTransaction(db)

@app.route('/transactions', methods=['GET'])
def get_transactions():
    print("getting transaction")
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
    data = request.json
    db = get_db()
    return newPaymentUpdate(db)

@app.route('/editLiability', methods=['POST'])
def edit_liability():
    print("EDITING")
    data = request.json
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
    data = request.json
    db = get_db()
    return editGoal(db)

# @app.route('/goal/<goal_id>', methods=['PUT'])
# def update_goal(goal_id):
#     try:
#         updated_goal = request.json['updatedGoal']
#         result = goals_collection.update_one(
#             {"_id": ObjectId(goal_id)},
#             {"$set": updated_goal}
#         )
#         if result.matched_count:
#             return jsonify({"message": "Goal updated successfully"}), 200
#         else:
#             return jsonify({"error": "Goal not found"}), 404
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

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
    db = get_db()  # Replace with your method of obtaining the database connection
    return categorizeTransactions(db)    

@app.route('/predictSalary', methods=['GET'])
def predict_salary_endpoint():
    # data = request.get_json()
    # if not data:
    #     return jsonify({'error': 'Invalid input data'}), 400
    
    current_salary = request.args.get('activeIncome')
    # get retirement age here
    # future_years = 30
    future_years = request.args.get('futureYears')

    # current_salary = 36000
    if not current_salary:
        # HAVENT TEST
        current_salary = [getInitialIncome()] * 12
    

    if current_salary is None or future_years is None:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        current_salary = float(current_salary)
        future_years = int(future_years)
    except ValueError:
        return jsonify({'error': 'Invalid parameter types'}), 400

    result = predictSalary(current_salary, future_years)
    # if 'error' in result:
    #     return jsonify(result), 500
    
    return jsonify({'future_salaries': result})
    # return result

@app.route('/predictExpense', methods=['GET'])
def predict_expense_endpoint():
    use_history_data = request.args.get('useHistoricalDataForIncome', False)  # Default to False if not provided
    expense_initial = request.args.get('totalSpending', 0)  # Default to 0 if not provided
    
    if use_history_data:
        # Assuming getMonthlyExpense returns a list of monthly expenses
        db = get_db()
        expense_history = getMonthlyExpense(db)
        # if expense_history is empty, call getInitialExpense function
        if not expense_history:
            # HAVENT TEST
            expense_history = [getInitialExpense(db)] * 12
    else:
        expense_history = [expense_initial] * 12  # Initialize with expense_initial repeated 12 times

    # get life expectancy
    months_to_predict = getLifeExpectancy(db)
    
    future_expenses = predictExpense(expense_history, months_to_predict=12)
    
    # Prepare response
    response = {
        'predictions': future_expenses.flatten().tolist()  # Convert NumPy array to list
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)