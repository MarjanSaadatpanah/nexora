# app/routes/projects.py
from bson import ObjectId
from flask import Blueprint, jsonify, request
from pymongo import MongoClient, ASCENDING, DESCENDING
import os
from datetime import datetime

# expiring-soon
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

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


def serialize_doc(doc):
    """Convert ObjectId to string for JSON."""
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def convert_objectid(doc):
    """Convert all ObjectId fields in a document to strings."""
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
    return doc


def enrich_project_with_organizations(project_doc):
    """Add organization data to a project document, excluding the coordinator from organizations list."""
    project_id = project_doc["id"]

    # Fetch related organizations
    organizations = []
    coordinator = None

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

        # Check if this is the coordinator
        if org_data.get("role", "").lower() == "coordinator":
            coordinator = org_data
        else:
            organizations.append(org_data)

    # Create a copy of the project document and add organization data
    enriched_project = project_doc.copy()
    enriched_project["coordinator"] = coordinator
    enriched_project["organizations"] = organizations

    return enriched_project


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
    """Return projects sorted by start date descending with organization data."""
    cursor = projects_collection.find({}).sort(
        "startDate", DESCENDING).limit(15)

    projects = []
    for doc in cursor:
        normalized = normalize_project(doc)
        enriched = enrich_project_with_organizations(normalized)
        projects.append(enriched)

    return jsonify(projects)


@projects_bp.route("/closed", methods=["GET"])
def get_closed_projects():
    """Return projects sorted by end date ascending (closest to expiry) with organization data."""
    cursor = projects_collection.find(
        {"endDate": {"$ne": None}}).sort("endDate", ASCENDING).limit(15)

    projects = []
    for doc in cursor:
        normalized = normalize_project(doc)
        enriched = enrich_project_with_organizations(normalized)
        projects.append(enriched)

    return jsonify(projects)


@projects_bp.route("/expiring_soon", methods=["GET"])
def get_expiring_soon_projects():
    """Return projects that are expiring within the next 2 months."""
    today = datetime.now().date()
    two_months_later = today + relativedelta(months=2)

    # Format dates as strings for MongoDB comparison
    today_str = today.isoformat()
    two_months_later_str = two_months_later.isoformat()

    # Query for projects ending within the next 2 months
    query = {
        "endDate": {
            "$gte": today_str,
            "$lte": two_months_later_str
        }
    }

    cursor = projects_collection.find(query).sort(
        "endDate", ASCENDING).limit(15)

    projects = []
    for doc in cursor:
        normalized = normalize_project(doc)
        enriched = enrich_project_with_organizations(normalized)
        projects.append(enriched)

    return jsonify(projects)


# Add this to your projects.py routes
@projects_bp.route("/statistics/summary", methods=["GET"])
def get_project_statistics():
    """Return summary statistics for the projects database."""
    try:
        # Total projects count
        total_projects = projects_collection.count_documents({})

        # Count by status
        status_counts = {}
        statuses = ["SIGNED", "CLOSED", "TERMINATED", "ONGOING"]

        for status in statuses:
            count = projects_collection.count_documents({"status": status})
            status_counts[status.lower()] = count

        # Total EU contribution
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_contribution": {
                        "$sum": {
                            "$convert": {
                                "input": "$ecMaxContribution",
                                "to": "double",
                                "onError": 0,
                                "onNull": 0
                            }
                        }
                    }
                }
            }
        ]

        contribution_result = list(projects_collection.aggregate(pipeline))
        total_contribution = contribution_result[0]["total_contribution"] if contribution_result else 0

        # Count of participating countries (from organizations)
        country_count = len(organizations_collection.distinct("country"))

        # Count of participating organizations
        org_count = organizations_collection.count_documents({})

        return jsonify({
            "total_projects": total_projects,
            "status_counts": status_counts,
            "total_contribution": total_contribution,
            "countries_involved": country_count,
            "organizations_count": org_count
        })

    except Exception as e:
        print(f"Error generating statistics: {str(e)}")
        return jsonify({"error": "Could not generate statistics"}), 500


# search and filter result
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
            {"id": {"$regex": q, "$options": "i"}},
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
@projects_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id):
    """Return a single project with its organizations and coordinator."""
    project = db.projects.find_one({"id": project_id})
    if not project:
        return jsonify({"error": "Project not found"}), 404

    project = convert_objectid(project)
    enriched = enrich_project_with_organizations(project)

    return jsonify(enriched)
