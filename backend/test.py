# test.py
from clerk_backend_api.security import types
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()

clerk = Clerk(os.getenv('CLERK_SECRET_KEY'))

# Check what's in the types module
print("Checking types:")
print(f"AuthenticateRequestOptions: {AuthenticateRequestOptions}")

# Try to see what a Requestish object looks like
print("\nAvailable in security.types:")
print(dir(types))
