from flask import Blueprint, jsonify, request, current_app
from pymongo import MongoClient

stats_bp = Blueprint("stats", __name__)


def get_collections():
    client = MongoClient(current_app.config["MONGO_URI"])
    db = client["cordis_db"]
    return db["projects"], db["organizations"]

# 1. Projects by country


@stats_bp.route("/projects_by_country", methods=["GET"])
def projects_by_country():
    _, organizations_collection = get_collections()

    pipeline = [
        {"$group": {
            "_id": "$country",
            # unique projectIDs per country
            "project_count": {"$addToSet": "$projectID"}
        }},
        {"$project": {
            "country": "$_id",
            "project_count": {"$size": "$project_count"}
        }},
        {"$sort": {"project_count": -1}},
        {"$limit": 10}
    ]

    results = list(organizations_collection.aggregate(pipeline))
    return jsonify(results)


# 2. Projects per programme
@stats_bp.route("/projects_per_programme", methods=["GET"])
def projects_per_programme():
    projects_collection, _ = get_collections()

    pipeline = [
        {"$group": {
            "_id": "$frameworkProgramme",  # matches Project.programme from SQL
            "project_count": {"$sum": 1}
        }},
        {"$project": {"programme": "$_id", "project_count": 1}}
    ]

    results = list(projects_collection.aggregate(pipeline))
    return jsonify(results)


# 3. EU Contribution per country
@stats_bp.route("/eu_contribution_per_country", methods=["GET"])
def eu_contribution_per_country():
    projects_collection, organizations_collection = get_collections()

    # Join projects with organizations and sum ecMaxContribution
    pipeline = [
        {"$lookup": {
            "from": "projects",
            "localField": "projectID",
            "foreignField": "id",
            "as": "project"
        }},
        {"$unwind": "$project"},
        {"$group": {
            "_id": "$country",
            "total_contribution": {
                "$sum": {
                    "$convert": {
                        "input": "$project.ecMaxContribution",
                        "to": "double",
                        "onError": 0,
                        "onNull": 0
                    }
                }
            }
        }},
        {"$sort": {"total_contribution": -1}},
        {"$limit": 12},
        {"$project": {
            "country": "$_id",
            "total_eu_contribution": "$total_contribution"
        }}
    ]

    results = list(organizations_collection.aggregate(pipeline))
    return jsonify(results)


# 4. Projects over time (group by year)
@stats_bp.route("/projects_over_time", methods=["GET"])
def projects_over_time():
    projects_collection, _ = get_collections()

    pipeline = [
        {"$addFields": {
            # extract first 4 chars from string date
            "year": {"$substr": ["$startDate", 0, 4]}
        }},
        {"$group": {
            "_id": "$year",
            "project_count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}},
        {"$project": {"year": "$_id", "project_count": 1}}
    ]

    results = list(projects_collection.aggregate(pipeline))
    return jsonify(results)


# 5. Top organizations by number of projects
@stats_bp.route("/top_organizations", methods=["GET"])
def top_organizations():
    _, organizations_collection = get_collections()
    limit = request.args.get("limit", 10, type=int)

    pipeline = [
        {"$group": {
            "_id": "$organizationName",
            "project_count": {"$addToSet": "$projectID"}
        }},
        {"$project": {
            "organization": "$_id",
            "project_count": {"$size": "$project_count"}
        }},
        {"$sort": {"project_count": -1}},
        {"$limit": limit}
    ]

    results = list(organizations_collection.aggregate(pipeline))
    return jsonify(results)


# 6. Top projects by EU contribution
@stats_bp.route("/top_projects_by_eu_contribution", methods=["GET"])
def top_projects_by_eu_contribution():
    projects_collection, _ = get_collections()

    pipeline = [
        {"$addFields": {
            "ecMaxContributionNum": {
                "$convert": {
                    "input": "$ecMaxContribution",
                    "to": "double",
                    "onError": 0,
                    "onNull": 0
                }
            }
        }},
        {"$sort": {"ecMaxContributionNum": -1}},
        {"$limit": 15},
        {"$project": {
            "acronym": {"$ifNull": ["$acronym", "N/A"]},
            "project_topic": {"$ifNull": ["$topics", "N/A"]},
            "eu_contribution": "$ecMaxContributionNum"
        }}
    ]

    results = list(projects_collection.aggregate(pipeline))
    return jsonify(results)
