from pymongo import MongoClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URL)

# database name (your existing one)
db = client["mask_detection_db"]

# collections
logs_collection = db["logs"]
users_collection = db["users"]
