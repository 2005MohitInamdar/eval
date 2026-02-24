from auth import execute_auth_action
from auth import supabase

def login_user(login_email, login_password):
    return execute_auth_action(
        lambda: supabase.auth.sign_in_with_password({
            "email" : login_email,
            "password": login_password
        }) 
    )

login_user("1970mohitinamdar@gmail.com", "1234567890")