# app/routes/projects.py
from bson import ObjectId
from flask import Blueprint, jsonify, request
from pymongo import MongoClient, ASCENDING, DESCENDING
import os
from datetime import datetime

projects_bp = Blueprint("projects", __name__)

# --- MongoDB Setup ---
mongo_client = MongoClient(os.getenv("MONGOURL"))
db = mongo_client["cordis_db"]
projects_collection = db["projects"]
organizations_collection = db["organizations"]


def normalize_project(doc):
    """Convert MongoDB document to API response format with correct types."""
    return {
        "id": doc.get("id"),
        "acronym": doc.get("acronym"),
        "title": doc.get("title"),
        "status": doc.get("status"),
        "start_date": _parse_date(doc.get("startDate")),
        "end_date": _parse_date(doc.get("endDate")),
        "total_cost": _parse_float(doc.get("totalCost")),
        "eu_contribution": _parse_float(doc.get("ecMaxContribution")),
        "legal_basis": doc.get("legalBasis"),
        "topics": doc.get("topics"),
        "programme": doc.get("frameworkProgramme"),
        "objective": doc.get("objective"),
        "signature_date": doc.get("ecSignatureDate")
    }


def _parse_float(val):
    try:
        return float(str(val).replace(",", "").strip()) if val not in (None, "") else 0.0
    except Exception:
        return 0.0


def _parse_date(val):
    if not val:
        return None
    try:
        # Normalize YYYY-MM-DD format
        return datetime.strptime(val, "%Y-%m-%d").date().isoformat()
    except Exception:
        return None

# --- ROUTES ---


@projects_bp.route("/", methods=["GET"])
def list_projects():
    """Return first N projects with pagination."""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("limit", 20))
    skip = (page - 1) * per_page

    cursor = projects_collection.find({}).skip(skip).limit(per_page)
    projects = [normalize_project(doc) for doc in cursor]
    total_count = projects_collection.estimated_document_count()

    return jsonify({
        "page": page,
        "limit": per_page,
        "total": total_count,
        "results": projects
    })


@projects_bp.route("/recent", methods=["GET"])
def get_recent_projects():
    """Return projects sorted by start date descending."""
    cursor = projects_collection.find({}).sort(
        "startDate", DESCENDING).limit(9)
    projects = [normalize_project(doc) for doc in cursor]
    return jsonify(projects)


@projects_bp.route("/expiring", methods=["GET"])
def get_expiring_projects():
    """Return projects sorted by end date ascending (closest to expiry)."""
    cursor = projects_collection.find(
        {"endDate": {"$ne": None}}).sort("endDate", ASCENDING).limit(9)
    projects = [normalize_project(doc) for doc in cursor]
    return jsonify(projects)


@projects_bp.route("/top", methods=["GET"])
def get_top_projects():
    """Return projects with highest EU contribution."""
    cursor = projects_collection.find({}).sort(
        "ecMaxContribution", DESCENDING).limit(9)
    projects = [normalize_project(doc) for doc in cursor]
    return jsonify(projects)


# # for collection the topics of projects to craete a filter on topics
# @projects_bp.route("/topics", methods=["GET"])
# def get_topics():
#     topics = projects_collection.distinct("topics")
#     topics = [t for t in topics if t]
#     topics.sort()
#     return jsonify({"topics": topics})


# search and filter result
def serialize_doc(doc):
    """Convert ObjectId to string for JSON."""
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


@projects_bp.route("/search", methods=["GET"])
def search_projects():
    """Search projects with optional filters and include organizations + coordinator."""

    q = request.args.get("q", "").strip()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    skip = (page - 1) * per_page

    query = {}

    # --- Free text search ---
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"acronym": {"$regex": q, "$options": "i"}},
            {"keywords": {"$regex": q, "$options": "i"}},
        ]

    # --- Filters ---
    status = request.args.get("status")
    if status:
        query["status"] = status

    programme = request.args.get("programme")
    if programme:
        query["frameworkProgramme"] = programme

    # --- Date filters (string comparison) ---
    start_date = request.args.get("start_date")
    if start_date:
        query["startDate"] = {"$gte": start_date}

    end_date = request.args.get("end_date")
    if end_date:
        query.setdefault("endDate", {})
        query["endDate"]["$lte"] = end_date

    # --- Contribution ranges ---

    min_contribution = request.args.get("min_contribution")
    max_contribution = request.args.get("max_contribution")
    if min_contribution or max_contribution:
        try:
            query["ecMaxContribution"] = {}
            if min_contribution:
                query["ecMaxContribution"]["$gte"] = float(min_contribution)
            if max_contribution:
                query["ecMaxContribution"]["$lte"] = float(max_contribution)
        except ValueError:
            pass

    # --- Find matching projects ---
    cursor = projects_collection.find(query).skip(skip).limit(per_page)
    results = []

    for doc in cursor:
        doc = serialize_doc(doc)
        project_id = doc["id"]

        # Fetch related organizations
        organizations = []
        for org in organizations_collection.find({"projectID": project_id}):
            org_data = serialize_doc(org)

            # Count how many projects this organization participates in
            org_data["project_count"] = organizations_collection.count_documents({
                "organisationID": org_data["organisationID"]
            })

            # Count how many projects this organization coordinates
            org_data["coordinator_count"] = organizations_collection.count_documents({
                "organisationID": org_data["organisationID"],
                "role": {"$regex": "^coordinator$", "$options": "i"}
            })

            organizations.append(org_data)

        # Filter by countries if provided
        countries = request.args.get("countries")
        if countries:
            allowed_countries = set(countries.split(","))
            org_countries = {org.get("country") for org in organizations}
            if org_countries.isdisjoint(allowed_countries):
                continue  # Skip project if no matching country

        # Find coordinator
        coordinator = next(
            (org for org in organizations if org.get(
                "role", "").lower() == "coordinator"),
            None
        )

        # Attach coordinator + organizations
        doc["coordinator"] = coordinator
        doc["organizations"] = organizations

        results.append(doc)

    total_count = projects_collection.count_documents(query)

    return jsonify({
        "projects": results,
        "total": total_count,
        "page": page,
        "pages": (total_count + per_page - 1) // per_page,
        "per_page": per_page
    })


# single project
def convert_objectid(doc):
    """Convert all ObjectId fields in a document to strings."""
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
    return doc


@projects_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id):
    """Return a single project with its organizations and coordinator."""
    project = db.projects.find_one({"id": project_id})
    if not project:
        return jsonify({"error": "Project not found"}), 404

    project = convert_objectid(project)

    organizations = list(db.organizations.find({"projectID": project_id}))
    organizations = [convert_objectid(org) for org in organizations]

    # Find coordinator
    coordinator = next(
        (org for org in organizations if org.get(
            "role", "").lower() == "coordinator"),
        None
    )

    project_data = {
        **project,
        "coordinator": coordinator
    }

    return jsonify({
        "project": project_data,
        "organizations": organizations
    })
