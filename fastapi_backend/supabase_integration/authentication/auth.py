import os
from supabase import create_client, Client
from supabase_auth.errors import AuthApiError
from dotenv import load_dotenv
import logging
from supabase_auth.errors import AuthApiError
import logging

load_dotenv()

url:str = os.getenv("SUPABASE_PROJECT_URL")
key:str = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)



def execute_auth_action(action_func):
    try:
        result = action_func()
        logging.info("Auth action successful")
        logging.info("Auth action executed successfully!")
        # return (result)
        print(result)
    except AuthApiError as e:
        logging.error(f"Auth error: {e}")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
    