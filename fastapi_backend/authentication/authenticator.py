# authenticator.py
from supabase_integration.auth import supabase
import os

FRONTEND_LOGIN_URL = os.environ.get("FRONTEND_LOGIN_URL", "http://localhost:4200/auth/login")


def create_supabase_user(name: str, email: str, password: str):
    """
    Signs up a user with Supabase Auth, saving the username in user_metadata.
    Email confirmation is required, so no session/tokens are issued at signup —
    the user must confirm via email, then log in separately.
    Raises an exception on failure — caller is responsible for handling it.
    """
    result = supabase.auth.sign_up({
        "email": email,
        "password": password,
        "options": {
            "data": {
                "username": name
            },
            "email_redirect_to": FRONTEND_LOGIN_URL
        }
    })

    user = result.user

    return {
        "message": "Signup successful. Please check your email to confirm your account.",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": name
        }
    }





def login_supabase_user(email: str, password: str):
    """
    Logs in a user with Supabase Auth using email and password.
    Raises an exception on failure — caller is responsible for handling it.
    """
    result = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    user = result.user
    session = result.session

    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.user_metadata.get("username")
        },
        "access_token": session.access_token,
        "refresh_token": session.refresh_token
    }




def get_supabase_user(access_token: str):
    """
    Validates an access token against Supabase and returns the user.
    Raises an exception if the token is missing, invalid, or expired.
    """
    user_response = supabase.auth.get_user(access_token)

    if user_response is None or user_response.user is None:
        raise ValueError("Invalid or expired session")

    user = user_response.user

    return {
        "id": user.id,
        "email": user.email,
        "username": user.user_metadata.get("username")
    }




def refresh_supabase_session(refresh_token: str):
    """
    Exchanges a refresh token for a new session (new access + refresh tokens).
    Raises an exception if the refresh token is invalid or expired.
    """
    result = supabase.auth.refresh_session(refresh_token)

    session = result.session

    if session is None:
        raise ValueError("Could not refresh session")

    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
    }