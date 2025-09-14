import os

# app/config.py


class Config:
    # mysql local
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/eufunded"

    # mongoDB Atlas
    MONGO_URI = os.getenv("MONGOURL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False


# eufunded_fake
