# app/routes/projects.py
from flask import Blueprint, jsonify, request
from app.models.project import Project
from app.models.project_organization import ProjectOrganization
from app.models.organization import Organization
from app.extensions import db
from datetime import date
from sqlalchemy.orm import aliased
from sqlalchemy import func


projects_bp = Blueprint('projects', __name__)


# 1. All Projects (existing)
@projects_bp.route("/", methods=["GET"])
def get_all_projects():
    projects = Project.query.limit(15).all()  # Add pagination later
    return jsonify([{
        "id": p.project_id,
        "acronym": p.acronym,
        "topic": p.project_topic,
        "start_date": p.start_date,
        "end_date": p.end_date,
        "eu_contribution": p.eu_contribution
    } for p in projects])

# 2. Recently Added (by start_date DESC)


@projects_bp.route("/recent", methods=["GET"])
def get_recent_projects():
    projects = Project.query.order_by(
        Project.start_date.desc()).limit(9).all()
    return jsonify([{
        "id": p.project_id,
        "acronym": p.acronym,
        "topic": p.project_topic,
        "start_date": p.start_date,
        "end_date": p.end_date,
        "eu_contribution": p.eu_contribution
    } for p in projects])

# 3. Expiring Soon (by end_date ASC)


@projects_bp.route("/expiring", methods=["GET"])
def get_expiring_projects():
    projects = Project.query.order_by(Project.end_date.asc()).limit(9).all()
    return jsonify([{
        "id": p.project_id,
        "acronym": p.acronym,
        "topic": p.project_topic,
        "start_date": p.start_date,
        "end_date": p.end_date,
        "eu_contribution": p.eu_contribution
    } for p in projects])

# 4. Top Projects (by eu_contribution DESC)


@projects_bp.route("/top", methods=["GET"])
def get_top_projects():
    projects = Project.query.order_by(
        Project.eu_contribution.desc()).limit(9).all()
    return jsonify([{
        "id": p.project_id,
        "acronym": p.acronym,
        "topic": p.project_topic,
        "eu_contribution": p.eu_contribution,
        "start_date": p.start_date,
        "end_date": p.end_date,
        "eu_contribution": p.eu_contribution
    } for p in projects])


# 5. Serach and Filter (search_projects)
# 5. Search and Filter (search_projects)
@projects_bp.route("/search", methods=["GET"])
def search_projects():
    from sqlalchemy import or_, and_
    from datetime import date

    # --- Query & Pagination ---
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"error": "Missing search term"}), 400

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    # --- Filters ---
    programme = request.args.get("programme")
    min_contribution = request.args.get("min_contribution", type=float)
    max_contribution = request.args.get("max_contribution", type=float)
    status = request.args.get("status")  # "ongoing" or "expired"
    start_date = request.args.get("start_date")  # YYYY-MM-DD
    end_date = request.args.get("end_date")      # YYYY-MM-DD
    countries_param = request.args.get("countries")  # comma-separated

    # --- Base Query ---
    projects_query = (
        db.session.query(Project)
        .outerjoin(ProjectOrganization, Project.project_id == ProjectOrganization.project_id)
        .outerjoin(Organization, ProjectOrganization.organization_id == Organization.id)
        .filter(
            or_(
                Project.project_topic.ilike(f"%{query}%"),
                Project.acronym.ilike(f"%{query}%"),
                Organization.organization_name.ilike(f"%{query}%"),
                Organization.acronym.ilike(f"%{query}%")
            )
        )
    )

    # --- Apply Filters ---
    conditions = []
    if programme:
        conditions.append(Project.programme == programme)
    if min_contribution is not None:
        conditions.append(Project.eu_contribution >= min_contribution)
    if max_contribution is not None:
        conditions.append(Project.eu_contribution <= max_contribution)

    today = date.today()
    if status == "ongoing":
        conditions.append(and_(Project.start_date <= today,
                          Project.end_date >= today))
    elif status == "expired":
        conditions.append(Project.end_date < today)
    if start_date:
        conditions.append(Project.start_date >= start_date)
    if end_date:
        conditions.append(Project.end_date <= end_date)

    # Countries filter
    if countries_param:
        countries = [c.strip()
                     for c in countries_param.split(",") if c.strip()]
        if countries:
            conditions.append(Organization.country.in_(countries))

    if conditions:
        projects_query = projects_query.filter(and_(*conditions))

    projects_query = projects_query.distinct()

    # --- Pagination ---
    paginated = projects_query.paginate(
        page=page, per_page=per_page, error_out=False)

    # --- Format Results ---
    results = []
    for p in paginated.items:
        # Fetch participants only
        participants = []
        project_orgs = (
            db.session.query(ProjectOrganization, Organization)
            .join(Organization, ProjectOrganization.organization_id == Organization.id)
            .filter(ProjectOrganization.project_id == p.project_id)
            .all()
        )
        for po, org in project_orgs:
            # skip coordinator
            if p.coordinator_id == org.id:
                continue
            participants.append({
                "id": org.id,
                "acronym": org.acronym,
                "name": org.organization_name,
                "country": org.country,
                "linkedin": org.linkedin,
                "role": po.organization_role,
                "correct_contribution": str(po.correct_contribution),
                "net_eu_contribution": str(po.net_eu_contribution),
                "project_or_organ_linkedin": po.project_or_organ_linkedin
            })

        # Fetch coordinator info
        coordinator_info = None
        if p.coordinator_id:
            coordinator_org = Organization.query.get(p.coordinator_id)
            if coordinator_org:
                coordinator_info = {
                    "id": coordinator_org.id,
                    "acronym": coordinator_org.acronym,
                    "name": coordinator_org.organization_name,
                    "country": coordinator_org.country,
                    "linkedin": coordinator_org.linkedin,
                    "role": "coordinator"
                }

        status_value = "ongoing" if (
            p.start_date <= today <= p.end_date) else "expired"
        remaining_days = (p.end_date - today).days if p.end_date else None

        results.append({
            "id": p.project_id,
            "topic": p.project_topic,
            "acronym": p.acronym,
            "start_date": p.start_date,
            "end_date": p.end_date,
            "status": status_value,
            "remaining_days": remaining_days,
            "total_cost": str(p.total_cost),
            "eu_contribution": str(p.eu_contribution),
            "objective": p.objective,
            "funded_under": p.funded_under,
            "programme": p.programme,
            "call_topic": p.call_topic,
            "call_for_proposal": p.call_for_proposal,
            "source": p.source,
            "coordinator": coordinator_info,
            "participants": participants
        })

    return jsonify({
        "projects": results,
        "total": paginated.total,
        "page": page,
        "pages": paginated.pages,
        "per_page": per_page
    })


# 6. Single project

@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)

    # --- Fetch Coordinator ---
    coordinator = None
    if project.coordinator_id:
        org = Organization.query.get(project.coordinator_id)
        if org:
            project_count = (
                db.session.query(func.count(ProjectOrganization.project_id))
                .filter(ProjectOrganization.organization_id == org.id)
                .scalar()
            )
            coordinator = {
                "id": org.id,
                "acronym": org.acronym,
                "name": org.organization_name,
                "country": org.country,
                "linkedin": org.linkedin,
                "project_count": project_count,
                "role": "coordinator"
            }

    # --- Fetch Participants (excluding coordinator) ---
    participants = []
    project_orgs = (
        db.session.query(ProjectOrganization, Organization)
        .join(Organization, ProjectOrganization.organization_id == Organization.id)
        .filter(ProjectOrganization.project_id == project.project_id)
        .filter(ProjectOrganization.organization_id != project.coordinator_id)
        .all()
    )

    for po, org in project_orgs:
        project_count = (
            db.session.query(func.count(ProjectOrganization.project_id))
            .filter(ProjectOrganization.organization_id == org.id)
            .scalar()
        )
        participants.append({
            "id": org.id,
            "acronym": org.acronym,
            "name": org.organization_name,
            "country": org.country,
            "linkedin": org.linkedin,
            "role": po.organization_role,
            "correct_contribution": str(po.correct_contribution),
            "net_eu_contribution": str(po.net_eu_contribution),
            "project_or_organ_linkedin": po.project_or_organ_linkedin,
            "project_count": project_count
        })

    # --- Calculate status and remaining days ---
    today = date.today()
    status = None
    remaining_days = None

    if project.start_date and project.end_date:
        if project.start_date <= today <= project.end_date:
            status = "ongoing"
        elif today > project.end_date:
            status = "expired"
        else:
            status = "not started"
        remaining_days = (project.end_date - today).days

    # --- Build Response ---
    result = {
        "id": project.project_id,
        "topic": project.project_topic,
        "acronym": project.acronym,
        "start_date": project.start_date,
        "end_date": project.end_date,
        "status": status,
        "remaining_days": remaining_days,
        "total_cost": str(project.total_cost),
        "eu_contribution": str(project.eu_contribution),
        "objective": project.objective,
        "funded_under": project.funded_under,
        "programme": project.programme,
        "call_topic": project.call_topic,
        "call_for_proposal": project.call_for_proposal,
        "source": project.source,
        "coordinator": coordinator,
        "participants": participants
    }

    return jsonify(result)
