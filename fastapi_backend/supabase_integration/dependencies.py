# dependencies.py
from fastapi import Request, HTTPException, status
from authentication.authenticator import get_supabase_user  # the function from earlier


def get_current_user(request: Request):
    """
    FastAPI dependency — extracts and validates the access_token cookie.
    Raises 401 if missing or invalid. Returns the user dict if valid.
    """
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        user = get_supabase_user(access_token)
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )