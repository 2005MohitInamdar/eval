# auth.py

import os
from supabase import create_client, Client
from supabase_auth.errors import AuthApiError
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
url:str = os.getenv("SUPABASE_PROJECT_URL")
publishable_key:str = os.getenv("SUPABASE_PUBLISHABLE_KEY")


if not url or not publishable_key:
    raise EnvironmentError("Supabase Service role or Key not found in .env")

supabase: Client = create_client(url, publishable_key)


def execute_auth_action(action_func, success_msg=None):
    try:
        result = action_func()
        display_message = success_msg if success_msg else "Auth action executed successfully"
        user = getattr(result, "user", None)
        session = getattr(result, "session", None)
        return {
            "success": True,
            "message": display_message,
            "data": {
                "user": {
                    "id": getattr(user, "id", None),
                    "email": getattr(user, "email", None),
                    "created_at": getattr(user, "created_at", None),
                    "last_sign_in_at": getattr(user, "last_sign_in_at", None),
                    "role": getattr(user, "role", None)
                } if user else None,
                "session": {
                    "access_token": getattr(session, "access_token", None),
                    "expires_in": getattr(session, "expires_in", None),
                    "expires_at": getattr(session, "expires_at", None)
                } if session else None,
                "raw_response": result
            },
            "error": None
        } 
    except AuthApiError as e:
        logging.error(f"Auth error: {e}")
        return {
            "success": False,
            "message": "Supabase auth API error",
            "data": None,
            "error": str(e)
        }
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return {
            "success": False,
            "message": "Unexpected error during auth action",
            "data": None,
            "error": str(e)
        }

# def get_scoped_client(access_token: str) -> Client:
#     client = create_client(url, publishable_key)
#     client.postgrest.auth(access_token)
#     client.storage._client.headers["Authorization"] = f"Bearer {access_token}"
#     return client



def get_scoped_client(access_token: str):
    client = create_client(url, publishable_key)
    client.postgrest.auth(access_token)

    storage_client = client.storage  # build ONCE
    storage_client._client.headers["Authorization"] = f"Bearer {access_token}"

    return client, storage_client