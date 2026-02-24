from auth import execute_auth_action
from auth import supabase
def signup_user(signup_email: str, signup_password: str):
    return execute_auth_action(
        lambda: supabase.auth.sign_up({
            "email" : signup_email,
            "password": signup_password
        })
    )
    

def signout_user():
    return execute_auth_action(
        lambda: supabase.auth.sign_out() 
    )

signout_user()
