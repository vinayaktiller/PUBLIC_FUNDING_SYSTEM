import requests
import jwt
import urllib
import os
from dotenv import load_dotenv

load_dotenv()

def get_id_token_with_code_method_1(code):
    """
    Method 1: Get id token directly from code
    """
    redirect_uri = "postmessage"
    token_endpoint = "https://oauth2.googleapis.com/token"
    payload = {
        'code': code,
        'client_id': os.getenv('google_clientid'),
        'client_secret': os.getenv('google_client_secret'),
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }

    body = urllib.parse.urlencode(payload)
    headers = {
        'content-type': 'application/x-www-form-urlencoded',
    }

    response = requests.post(token_endpoint, data=body, headers=headers)
    if response.ok:
        id_token = response.json()['id_token']
        return jwt.decode(id_token, options={"verify_signature": False})
    else:
        print(response.json())
        return None
