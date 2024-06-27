from bson.objectid import ObjectId

class Scenario:
    def __init__(self, db):
        self.goal_collection = db['goal']

    def insert_goal(self, data):
        result = self.goal_collection.insert_one(data)
        return result.inserted_id
