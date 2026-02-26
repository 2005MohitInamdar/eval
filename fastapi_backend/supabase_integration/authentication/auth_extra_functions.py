from .auth import supabase, execute_auth_action

def reset_password_using_email(email_for_passwordUpdation: str):
    return execute_auth_action(
        lambda: supabase.auth.reset_password_for_email( 
            email_for_passwordUpdation,
            {"redirect_to": "https://localhost:4200/update_password"}
        ),
        success_msg="Password reset successul!" 
    )

def update_user_email(updated_email: str):
    return execute_auth_action(
        lambda: supabase.auth.update_user(
            {"email": updated_email}
        ),
        success_msg="User Email updated successfully"
    )

def update_user_password(updated_password: str):
    return execute_auth_action(
        lambda: supabase.auth.update_user(
            {"password": updated_password}
        ),
        success_msg="User Password updated successfully"
    )