from datetime import datetime
from pymongo import MongoClient
import os


class UserModel:
    """Handles all MongoDB operations for user data"""

    def __init__(self):
        mongo_client = MongoClient(os.getenv("MONGOURL"))
        db = mongo_client["cordis_db"]
        self.collection = db["users"]
        # Create index on clerkUserId for fast lookups
        self.collection.create_index("clerkUserId", unique=True)

    def get_or_create_user(self, clerk_user_id, email=None):
        """
        Get existing user or create a new one.
        Updates email if provided and different.
        Returns the user document.
        """
        user = self.collection.find_one({"clerkUserId": clerk_user_id})

        if not user:
            user_data = {
                "clerkUserId": clerk_user_id,
                "email": email,
                "favorites": [],
                "history": [],
                "preferences": {
                    "topics": [],
                    "funding_types": []
                },
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            result = self.collection.insert_one(user_data)
            user = self.collection.find_one({"_id": result.inserted_id})
        else:
            # Update email if provided and different
            if email and user.get('email') != email:
                self.collection.update_one(
                    {"clerkUserId": clerk_user_id},
                    {"$set": {"email": email, "updatedAt": datetime.utcnow()}}
                )
                user['email'] = email

        return user

    def get_user(self, clerk_user_id):
        """Get user by Clerk user ID"""
        return self.collection.find_one({"clerkUserId": clerk_user_id})

    def add_favorite(self, clerk_user_id, project_id):
        """Add a project to user's favorites"""
        return self.collection.update_one(
            {"clerkUserId": clerk_user_id},
            {
                "$addToSet": {"favorites": project_id},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

    def remove_favorite(self, clerk_user_id, project_id):
        """Remove a project from user's favorites"""
        return self.collection.update_one(
            {"clerkUserId": clerk_user_id},
            {
                "$pull": {"favorites": project_id},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

    def get_favorites(self, clerk_user_id):
        """Get user's favorite project IDs"""
        user = self.get_user(clerk_user_id)
        return user.get("favorites", []) if user else []

    def add_history(self, clerk_user_id, project_id):
        """Add a project to user's history (when user opens it)"""
        history_entry = {
            "projectId": project_id,
            "openedAt": datetime.utcnow()
        }
        return self.collection.update_one(
            {"clerkUserId": clerk_user_id},
            {
                "$push": {
                    "history": {
                        "$each": [history_entry],
                        "$position": 0,
                        "$slice": 50  # Keep only last 50 items
                    }
                },
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )

    def get_history(self, clerk_user_id, limit=20):
        """Get user's project history"""
        user = self.collection.find_one(
            {"clerkUserId": clerk_user_id},
            {"history": {"$slice": limit}}
        )
        return user.get("history", []) if user else []

    def update_preferences(self, clerk_user_id, preferences):
        """Update user preferences (topics, funding_types, etc.)"""
        return self.collection.update_one(
            {"clerkUserId": clerk_user_id},
            {
                "$set": {
                    "preferences": preferences,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

    def get_preferences(self, clerk_user_id):
        """Get user preferences"""
        user = self.get_user(clerk_user_id)
        return user.get("preferences", {}) if user else {}
