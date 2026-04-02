import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# MongoDB connection with safe fallback
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URL)

# database name (your existing one)
DB_NAME = os.getenv("DB_NAME", "mask_detection_db")
db = client[DB_NAME]

# collections
logs_collection = db["logs"]
users_collection = db["users"]
refresh_tokens_collection = db["refresh_tokens"]
