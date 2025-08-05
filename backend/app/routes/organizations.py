# app/routes/organizations.py
from flask import Blueprint, jsonify
from app.models.organization import Organization
from app.extensions import db

organizations_bp = Blueprint('organizations', __name__)


@organizations_bp.route("/", methods=["GET"])
def get_all_organizations():
    orgs = Organization.query.limit(50).all()
    result = []
    for o in orgs:
        result.append({
            "id": o.id,
            "name": o.organization_name,
            "country": o.country,
            "acronym": o.acronym
        })
    return jsonify(result)
