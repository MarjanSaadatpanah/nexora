from flask import Flask

from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from app.routes.projects import projects_bp
    from app.routes.organizations import organizations_bp
    from app.routes.stats import stats_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(organizations_bp, url_prefix="/api/organizations")
    app.register_blueprint(stats_bp, url_prefix="/api/stats")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    return app
