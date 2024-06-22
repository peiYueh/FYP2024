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
