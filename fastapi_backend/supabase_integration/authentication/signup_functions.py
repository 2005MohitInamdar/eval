from auth import execute_auth_action, supabase

def signup_user(user_signup_name:str, signup_email: str, signup_password: str):
    return execute_auth_action(
        lambda: supabase.auth.sign_up({
            "email" : signup_email,
            "password": signup_password,
            "options": {
                "data":{
                    "user_name": user_signup_name, 
                }
            }
        }),
        success_msg="User signed up successfully"
        
    )
    

def signout_user():
    return execute_auth_action(
        lambda: supabase.auth.sign_out(),
        success_msg="Logout Successful" 
    )