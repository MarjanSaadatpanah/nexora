from flask import Flask
from .extensions import db
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from app.routes.projects import projects_bp
    from app.routes.organizations import organizations_bp

    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(organizations_bp, url_prefix="/api/organizations")

    return app
