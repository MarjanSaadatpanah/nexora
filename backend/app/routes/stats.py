# app/routes/stats.py
from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.project import Project
from app.models.organization import Organization
from app.models.project_organization import ProjectOrganization
from sqlalchemy import func

stats_bp = Blueprint("stats", __name__)

# 1. Projects by country


@stats_bp.route("/projects_by_country", methods=["GET"])
def projects_by_country():
    results = (
        db.session.query(
            Organization.country,
            func.count(func.distinct(ProjectOrganization.project_id)
                       ).label("project_count")
        )
        .join(ProjectOrganization, Organization.id == ProjectOrganization.organization_id)
        .group_by(Organization.country)
        .order_by(func.count(func.distinct(ProjectOrganization.project_id)).desc())
        .limit(10)
        .all()
    )

    return jsonify([
        {"country": r[0], "project_count": r[1]} for r in results
    ])


@stats_bp.route("/projects_per_programme", methods=["GET"])
def projects_per_programme():
    results = (
        db.session.query(Project.programme, func.count(Project.project_id))
        .group_by(Project.programme)
        .all()
    )
    return jsonify([
        {"programme": r[0], "project_count": r[1]} for r in results
    ])


@stats_bp.route("/eu_contribution_per_country", methods=["GET"])
def eu_contribution_per_country():
    results = (
        db.session.query(
            Organization.country,
            func.sum(Project.eu_contribution).label("total_contribution")
        )
        .join(ProjectOrganization, ProjectOrganization.organization_id == Organization.id)
        .join(Project, Project.project_id == ProjectOrganization.project_id)
        .group_by(Organization.country)
        .order_by(func.sum(Project.eu_contribution).desc())  # ✅ order by sum
        .limit(12)
        .all()
    )

    return jsonify([
        {"country": r[0], "total_eu_contribution": float(r[1]) if r[1] else 0}
        for r in results
    ])


@stats_bp.route("/projects_over_time", methods=["GET"])
def projects_over_time():
    results = (
        db.session.query(func.year(Project.start_date),
                         func.count(Project.project_id))
        .group_by(func.year(Project.start_date))
        .order_by(func.year(Project.start_date))
        .all()
    )
    return jsonify([
        {"year": r[0], "project_count": r[1]} for r in results
    ])


@stats_bp.route("/top_organizations", methods=["GET"])
def top_organizations():
    limit = request.args.get("limit", 10, type=int)
    results = (
        db.session.query(Organization.organization_name,
                         func.count(ProjectOrganization.project_id))
        .join(ProjectOrganization, ProjectOrganization.organization_id == Organization.id)
        .group_by(Organization.id)
        .order_by(func.count(ProjectOrganization.project_id).desc())
        .limit(limit)
        .all()
    )
    return jsonify([
        {"organization": r[0], "project_count": r[1]} for r in results
    ])


@stats_bp.route("/top_projects_by_eu_contribution", methods=["GET"])
def top_projects_by_eu_contribution():
    results = (
        db.session.query(
            Project.acronym,
            Project.eu_contribution,
            Project.project_topic
        )
        .order_by(Project.eu_contribution.desc())  # sort by contribution
        .limit(15)  # top 15
        .all()
    )

    return jsonify([
        {
            "acronym": r[0] if r[0] else "N/A",
            "project_topic": r[2] if r[2] else "N/A",
            "eu_contribution": float(r[1]) if r[1] else 0
        }
        for r in results
    ])
