from bson.objectid import ObjectId

class Liability:
    def __init__(self, db):
        self.collection = db['liability']
        self.payment_dates_collection = db['liability_payment']

    def insert_liability(self, data):
        print("liability model here")
        result = self.collection.insert_one(data)
        return result.inserted_id
    
    def get_liabilities(self, user_id):
        print("YOU SHOULDNT BE HERE")
        return list(self.collection.find({'user_id': user_id}))
    
    def get_liabilities_date(self, liability_id):
        print("gettttinggg")
        return list(self.payment_dates_collection.find({'liability_id': liability_id}))
    
    def insert_payment_update(self, payment_update):
        print("HI")
        result = self.payment_dates_collection.insert_one(payment_update)
        return result.inserted_id
    
    def update_liability(self, liability):
        liability_id = liability['_id']
        liability.pop('_id')
        result = self.collection.update_one({'_id': ObjectId(liability_id)}, {'$set': liability})

        if result.matched_count > 0:
            return {"message": "Transaction updated successfully"}, 200
        else:
            return {"error": "Transaction not found"}, 404
        
    def delete_payment_update(self, payment_id):
        try:
            obj_id = ObjectId(payment_id)
            result = self.payment_dates_collection.delete_one({'_id': obj_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting transaction: {e}")
            return False
    
    def delete_liability(self, liability_id):
        try:
            obj_id = ObjectId(liability_id)
            result = self.collection.delete_one({'_id': obj_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting transaction: {e}")
            return False
    
    def delete_payment_with_liability(self, liability_id):
        try:
            result = self.payment_dates_collection.delete_one({'liability_id': liability_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting transaction: {e}")
            return False

        