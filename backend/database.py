from pymongo import MongoClient
import os

# 🔒 MongoDB connection (Strictly Loaded)
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise RuntimeError("CRITICAL ERROR: 'MONGO_URL' or 'DB_NAME' is missing from .env!")

client = MongoClient(MONGO_URL)

# database name
db = client[DB_NAME]

# collections
logs_collection = db["logs"]
users_collection = db["users"]
refresh_tokens_collection = db["refresh_tokens"]
