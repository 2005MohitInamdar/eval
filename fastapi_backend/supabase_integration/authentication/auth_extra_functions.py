from auth import supabase, execute_auth_action

def reset_password_using_email(reset_user_password: str):
    return execute_auth_action(
        lambda: supabase.auth.reset_password_for_email( 
            reset_user_password,
            {"redirect_to": "https://example.com/update-password"}
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