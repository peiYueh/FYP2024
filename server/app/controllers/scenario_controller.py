from flask import request, jsonify, session
from app.models.scenario_model import Scenario
from bson import ObjectId

def newGoal(db):
    print("HI u are here")
    userID = "665094c0c1a89d9d19d13606"
    goalData = request.get_json().get('goalPayload')
    # separate based on goal type
    goalType = goalData.get('goal_type')
    targetAge = goalData.get('target_age')
    goalDescription = goalData.get('goal_description')
    if(goalType == 0):
        componentData = goalData.get('component_data')
        # property goal
        componentData = goalData.get('component_data')
        downPaymentAmount = componentData.get('downPaymentAmount')
        downPaymentPercentage = componentData.get('downPaymentPercentage')
        interestRate = componentData.get('interestRate')
        loanPeriod = componentData.get('loanPeriodYears')
        monthlyPayment = componentData.get('monthlyPayment')
        propertyPrice = componentData.get('propertyPrice')
        # vehicle goal
        goal = {
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
        print(goal)
    elif(goalType == 1):
        componentData = goalData.get('component_data')
        downPaymentAmount = componentData.get('downPaymentAmount')
        downPaymentPercentage = componentData.get('downPaymentPercentage')
        interestRate = componentData.get('interestRate')
        loanPeriod = componentData.get('loanPeriodYears')
        monthlyPayment = componentData.get('monthlyPayment')
        vehiclePrice = componentData.get('vehiclePrice')
        # vehicle goal
        goal = {
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
        # travel goal
        componentData = goalData.get('component_data')
        totalAmount = componentData.get('overallCost')
        detailedCosts = componentData.get('detailedCosts')
        accommodation = detailedCosts.get('accommodation') or "-"
        activities = detailedCosts.get('activities') or "-"
        food = detailedCosts.get('food') or "-"
        transport  = detailedCosts.get('transport') or "-"
        goal = {
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
        # custom goal
    else:
        totalAmount = goalData.get('component_data').get('goalCost')
        goal = {
            'user_id': userID,
            'goal_type': goalType,
            'target_age': targetAge,
            'goal_description': goalDescription,
            'total_amount': totalAmount
        }
    scenario_model = Scenario(db)
    inserted_id = scenario_model.insert_goal(goal)
    return jsonify({"message": "Data inserted successfully", "inserted_id": str(inserted_id)}), 201


    # print(data)