from auth import execute_auth_action, supabase


def login_user(login_email:str, login_password:str):
    return execute_auth_action(
        lambda: supabase.auth.sign_in_with_password({
            "email" : login_email,
            "password": login_password
        }),
        success_msg="User Logged In Successful"
    )
