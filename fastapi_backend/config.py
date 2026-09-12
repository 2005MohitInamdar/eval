# config.py
import os

ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")  

IS_PRODUCTION = ENVIRONMENT == "production"

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": IS_PRODUCTION,                         
    "samesite": "none" if IS_PRODUCTION else "lax",
    "path": "/",
}