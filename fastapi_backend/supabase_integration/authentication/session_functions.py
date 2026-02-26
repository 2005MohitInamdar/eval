from .auth import supabase, execute_auth_action

def get_session():
    return execute_auth_action(
        lambda: supabase.auth.get_session()
    )

def retrieve_user():
    return execute_auth_action(
        lambda: supabase.auth.get_user()
    )
