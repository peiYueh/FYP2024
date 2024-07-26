from flask import request, jsonify, session
from app.dao.liabilityDAO import Liability
from app.dao.transactionDAO import Transaction
from bson import ObjectId
from datetime import datetime, timezone

def newLiability(db):
    data = request.json

    liability_name = data.get('name')
    total_amount = data.get('total_amount')
    interest_rate = data.get('interest_rate')
    term = data.get('term')
    monthly_payment = data.get('monthly_payment')
    remaining_amount = data.get('remaining_amount')
    lender_info = data.get('lenderInfo')
    purpose = data.get('purpose')
    overall_amount = data.get('overall_amount')
    userID = session.get('user_id')

    liability = {
        'user_id' : userID,
        'liability_name': liability_name,
        'liability_amount': total_amount,
        'interest_rate': interest_rate,
        'term': term,
        'monthly_payment': monthly_payment,
        'remaining_amount': remaining_amount,
        'lender_info': lender_info,
        'purpose': purpose,
        'overall_amount': overall_amount
    }

    liability_DAO = Liability(db)
    liability_id = liability_DAO.insert_liability(liability)

    return jsonify(str(liability_id))

def getLiabilities(db):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    liability_DAO = Liability(db)
    
    liabilities = liability_DAO.get_liabilities(user_id)
    # Convert ObjectId to string
    for liability in liabilities:
        if '_id' in liability:
            liability['_id'] = str(liability['_id'])

    return jsonify(liabilities)

def getPaymentDates(db):
    liability_id = request.args.get('liability_id')
    print(liability_id)
    liability_DAO = Liability(db)
    payments = liability_DAO.get_liabilities_date(liability_id)

    for payment in payments:
        if '_id' in payment:
            payment['_id'] = str(payment['_id'])

    print(payments)
    return jsonify(payments)

def newPaymentUpdate(db):
    data = request.get_json()
    payment_amount = data.get('payment_amount')
    liability_id = data.get('liability_id')
    paymentUpdate = {
        'liability_id': liability_id,
        'payment_date':data.get('payment_date'),
        'payment_amount':payment_amount,
    }
    liability_DAO = Liability(db)
    # add to liability payment date
    inserted_id = liability_DAO.insert_payment_update(paymentUpdate)
    # update remaining payment to data
    liability_DAO.update_remaining_amount(liability_id, payment_amount)
    return jsonify(str(inserted_id))

def editLiability(db):
    data = request.get_json()
    liability_id = data.get('_id')

    if not liability_id:
        print("Liability ID not found")
        return jsonify({"error": "Liability ID is required"}), 400

    # Convert the liability_id to an ObjectId
    try:
        liability_id = ObjectId(liability_id)
    except Exception as e:
        return jsonify({"error": "Invalid Liability ID format"}), 400
    
    liability = {
        '_id': liability_id,
        'user_id' : data.get('user_id'),
        'liability_name': data.get('liability_name'),
        'liability_amount': data.get('liability_amount'),
        'interest_rate': data.get('interest_rate'),
        'term': data.get('term'),
        'monthly_payment': data.get('monthly_payment'),
        'due_date': data.get('due_date'),
        'lender_info': data.get('lender_info'),
        'purpose': data.get('purpose'),
        'overall_amount': data.get('overall_amount')
    }
    liability_DAO = Liability(db)
    liability_DAO.update_liability(liability)

    return jsonify({"message": "Data updated successfully"}), 200

def deletePaymentUpdate(db, payment_id):
    liability_DAO = Liability(db)
    try:
        if liability_DAO.delete_payment_update(payment_id):
            return jsonify({'message': 'Payment deleted successfully'}), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
def deleteLiability(db, liability_id):
    liability_DAO = Liability(db)
    try:
        if liability_DAO.delete_liability(liability_id):
            # delete its payment also
            liability_DAO.delete_payment_with_liability(liability_id)
            return jsonify({'message': 'Liability deleted successfully'}), 200
        else:
            return jsonify({'message': 'Liability not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500