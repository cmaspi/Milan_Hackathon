from google.auth.transport import requests
from google.oauth2 import id_token
from google.auth import exceptions
import os
from dotenv import load_dotenv

from typing import Tuple

load_dotenv()


def get_user_details(token) -> Tuple[str, str] | None:
    GSUITE_DOMAIN_NAME = "iith.ac.in"
    CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        # try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        email = idinfo["email"]
        name = idinfo["name"]

        # If auth request is from a G Suite domain:
        if idinfo["hd"] != GSUITE_DOMAIN_NAME and not idinfo["hd"].endswith(f".{GSUITE_DOMAIN_NAME}"):
            raise ValueError("Wrong hosted domain. Only IITH Users are allowed")

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo["sub"]  # noqa: F841

        return email, name
    except exceptions.InvalidValue :
        raise exceptions.InvalidValue("Token is invalid")
    except ValueError:
        # Invalid but not expired token
        return None
