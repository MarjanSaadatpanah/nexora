# app/config.py
import os


class Config:

    # mongoDB Atlas
    MONGO_URI = os.getenv("MONGOURL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
