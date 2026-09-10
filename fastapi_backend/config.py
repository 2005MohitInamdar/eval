# config.py
import os

ENVIRONMENT = os.environ.get("ENVIRONMENT", "development")  # "development" or "production"

IS_PRODUCTION = ENVIRONMENT == "production"

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": IS_PRODUCTION,                          # True in prod (requires HTTPS)
    "samesite": "none" if IS_PRODUCTION else "lax",    # "none" needed if frontend/backend are cross-site
    "path": "/",
}