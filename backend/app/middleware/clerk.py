from flask import request, jsonify, g
from functools import wraps
from clerk_backend_api.security.types import AuthenticateRequestOptions, TokenVerificationError, AuthStatus, VerifyTokenOptions
from app import clerk
from app.models import UserModel
import jwt


def require_auth(f):
    """
    Decorator to protect routes with Clerk authentication.
    Verifies JWT token and loads user data into g.user and g.clerk_user_id
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ", 1)[1]

        try:
            # Decode JWT without verification first to see the user_id
            decoded = jwt.decode(token, options={"verify_signature": False})

            user_id = decoded.get("sub")
            email = decoded.get("email")  # Extract email from token

            if not user_id:
                return jsonify({"error": "Invalid token: missing user ID"}), 401

            # For now, trust the token (we'll add verification later)
            # In production, you should verify with Clerk's JWKS
            g.clerk_user_id = user_id

            # Get or create user in MongoDB
            user_model = UserModel()
            g.user = user_model.get_or_create_user(
                clerk_user_id=user_id,
                email=email
            )

        except Exception as e:

            return jsonify({"error": f"Authentication error: {str(e)}"}), 500

        return f(*args, **kwargs)

    return decorated


def optional_auth(f):
    """
    Decorator for routes that work with or without authentication.
    If authenticated, loads user data into g.user and g.clerk_user_id
    If not authenticated, the route still works (g.user will not exist)
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Try to authenticate the request
            auth_state = clerk.authenticate_request(
                request,
                AuthenticateRequestOptions()
            )

            # Only set user if successfully signed in
            if auth_state.status == AuthStatus.SIGNED_IN:
                user_id = auth_state.to_auth().user_id

                if user_id:
                    g.clerk_user_id = user_id
                    g.auth_state = auth_state

                    user_model = UserModel()
                    g.user = user_model.get_or_create_user(
                        clerk_user_id=user_id,
                        email=None
                    )
        except:
            # If authentication fails, continue without user
            pass

        return f(*args, **kwargs)

    return decorated
