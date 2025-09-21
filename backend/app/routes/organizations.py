# app/routes/organizations.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os

organizations_bp = Blueprint("organizations", __name__)

# MongoDB connection (reuse across requests)
mongo_client = MongoClient(os.getenv("MONGOURL"))
db = mongo_client["cordis_db"]
organizations_collection = db["organizations"]


@organizations_bp.route("/", methods=["GET"])
def list_organizations():
    """
    List organizations with optional filters, search, and pagination.
    Example: /api/organizations?country=DE&search=university&page=2&limit=10
    """

    search_query = request.args.get("search", "").strip()
    country = request.args.get("country", "").strip()
    activity_type = request.args.get("activityType", "").strip()
    sme = request.args.get("sme", "").strip().lower()  # "true" or "false"
    project_acronym = request.args.get("projectAcronym", "").strip()

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    skip = (page - 1) * limit

    query = {}
    if search_query:
        query["name"] = {"$regex": search_query, "$options": "i"}
    if country:
        query["country"] = country
    if activity_type:
        query["activityType"] = activity_type
    if sme in ["true", "false"]:
        query["SME"] = sme
    if project_acronym:
        query["projectAcronym"] = project_acronym

    total_count = organizations_collection.count_documents(query)
    cursor = organizations_collection.find(query).skip(skip).limit(limit)

    organizations = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        organizations.append(doc)

    return jsonify({
        "page": page,
        "limit": limit,
        "total": total_count,
        "results": organizations
    })


@organizations_bp.route("/<organization_id>", methods=["GET"])
def get_organization(organization_id):
    """
    Get a single organization by its organisationID (not _id).
    """
    org = organizations_collection.find_one(
        {"organisationID": organization_id})
    if not org:
        return jsonify({"error": "Organization not found"}), 404

    org["_id"] = str(org["_id"])
    return jsonify(org)
