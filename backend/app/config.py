# app/config.py
class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:@localhost/eufunded"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
