from flask import request, jsonify, session
from app.dao.scenarioDAO import Scenario
from bson import ObjectId

def newGoal(db):
    userID = session.get('user_id')
    goalData = request.get_json().get('goalPayload')
    
    if not goalData:
        return jsonify({"error": "Invalid input, missing goalPayload"}), 400

    goalType = goalData.get('goal_type')
    targetAge = goalData.get('target_age')
    goalDescription = goalData.get('goal_description')
    
    if goalType not in [0, 1, 2, 3]:
        return jsonify({"error": "Invalid goal type"}), 400

    goal = {
        'user_id': userID,
        'goal_type': goalType,
        'target_age': targetAge,
        'goal_description': goalDescription,
        'apply': False
    }

    if goalType in [0, 1]:
        componentData = goalData.get('component_data', {})
        goal.update({
            'total_amount': componentData.get('downPaymentAmount'),
            'down_payment_percentage': componentData.get('downPaymentPercentage'),
            'interest_rate': componentData.get('interestRate'),
            'loan_period': componentData.get('loanPeriodYears'),
            'monthly_payment': componentData.get('monthlyPayment'),
        })
        if goalType == 0:
            goal['property_price'] = componentData.get('propertyPrice')
        elif goalType == 1:
            goal['vehicle_price'] = componentData.get('vehiclePrice')
    elif goalType == 2:
        componentData = goalData.get('component_data', {})
        detailedCosts = componentData.get('detailedCosts', {})
        goal.update({
            'total_amount': componentData.get('overallCost'),
            'accommodation_cost': detailedCosts.get('accommodation', "-"),
            'activities_cost': detailedCosts.get('activities', "-"),
            'food_and_beverage': detailedCosts.get('food', "-"),
            'transport': detailedCosts.get('transport', "-"),
        })
    else:
        componentData = goalData.get('component_data', {})
        goal['total_amount'] = componentData.get('goalCost')

    try:
        scenario_DAO = Scenario(db)
        inserted_id = scenario_DAO.insert_goal(goal)
        return jsonify({"message": "Data inserted successfully", "inserted_id": str(inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def myGoal(db):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    scenario_DAO = Scenario(db)
    goals = scenario_DAO.get_all_goals(user_id)
    # Convert ObjectId to string
    for goal in goals:
        if '_id' in goal:
            goal['_id'] = str(goal['_id'])

    return jsonify(goals)
    
def getGoal(db, goal_id):
    scenario_DAO = Scenario(db)
    try:
        goal = scenario_DAO.get_goal_by_id(goal_id)
        print(goal)
        if goal:
            goal["_id"] = str(goal["_id"])
            return jsonify(goal), 200
        else:
            return jsonify({"error": "Goal not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # print(data)

def editGoal(db):
    userID = session.get('user_id')
    goalData = request.get_json()
    goal_id = goalData.get('_id')
    if not goal_id:
        print("Goal ID not found")
        return jsonify({"error": "Goal ID is required"}), 400

    # Convert the liability_id to an ObjectId
    try:
        goal_id = ObjectId(goal_id)
    except Exception as e:
        return jsonify({"error": "Invalid Goal ID format"}), 400
    
    goalType = goalData.get('goal_type')
    targetAge = goalData.get('target_age')
    goalDescription = goalData.get('goal_description')
    if(goalType == 0):
        componentData = goalData.get('component_data')
        downPaymentAmount = componentData.get('down_payment_amount')
        downPaymentPercentage = componentData.get('down_payment_percentage')
        interestRate = componentData.get('interest_rate')
        loanPeriod = componentData.get('loan_period')
        monthlyPayment = componentData.get('monthly_payment')
        propertyPrice = componentData.get('property_price')
        goal = {
            '_id': goal_id,
            'user_id': userID,
            'goal_type': goalType,
            'target_age': targetAge,
            'goal_description': goalDescription,
            'total_amount': downPaymentAmount,
            'property_price': propertyPrice,
            'down_payment_percentage': downPaymentPercentage,
            'interest_rate': interestRate,
            'loan_period': loanPeriod,
            'monthly_payment': monthlyPayment
        }
    elif(goalType == 1):
        componentData = goalData.get('component_data')
        downPaymentAmount = componentData.get('down_payment_amount')
        downPaymentPercentage = componentData.get('down_payment_percentage')
        interestRate = componentData.get('interest_rate')
        loanPeriod = componentData.get('loan_period')
        monthlyPayment = componentData.get('monthly_payment')
        vehiclePrice = componentData.get('vehicle_price')
        goal = {
            '_id': goal_id,
            'user_id': userID,
            'goal_type': goalType,
            'target_age': targetAge,
            'goal_description': goalDescription,
            'total_amount': downPaymentAmount,
            'vehicle_price': vehiclePrice,
            'down_payment_percentage': downPaymentPercentage,
            'interest_rate': interestRate,
            'loan_period': loanPeriod,
            'monthly_payment': monthlyPayment
        }
    elif(goalType == 2):
        componentData = goalData.get('component_data')
        totalAmount = componentData.get('overallCost')
        detailedCosts = componentData.get('detailedCosts')
        accommodation = detailedCosts.get('accommodation') or "-"
        activities = detailedCosts.get('activities') or "-"
        food = detailedCosts.get('food') or "-"
        transport  = detailedCosts.get('transport') or "-"
        goal = {
            '_id': goal_id,
            'user_id': userID,
            'goal_type': goalType,
            'target_age': targetAge,
            'goal_description': goalDescription,
            'total_amount': totalAmount,
            'accommodation_cost': accommodation,
            'activities_cost': activities,
            'food_and_beverage': food,
            'transport': transport
        }
    else:
        totalAmount = goalData.get('component_data').get('goalCost')
        goal = {
            '_id': goal_id,
            'user_id': userID,
            'goal_type': goalType,
            'target_age': targetAge,
            'goal_description': goalDescription,
            'total_amount': totalAmount
        }

    scenario_DAO = Scenario(db)
    scenario_DAO.update_goal(goal)
    return jsonify({"message": "Data updated successfully"}), 200

def deleteGoal(db, goal_id):
    print(goal_id)
    try:
        scenario_DAO = Scenario(db)
        result = scenario_DAO.delete_goal(goal_id)
        if result:
            return jsonify({"message": "Goal deleted successfully"}), 200
        else:
            return jsonify({"error": "Goal not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    