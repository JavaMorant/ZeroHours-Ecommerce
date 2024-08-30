from dotenv import load_dotenv
import os

load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"

    # Flask-Login settings
    LOGIN_DISABLED = False
    USE_SESSION_FOR_NEXT = True
    REMEMBER_COOKIE_DURATION = 2592000  # 30 days in seconds

    # Session settings (using Flask's default session handling)
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = 2592000  # 30 days in seconds