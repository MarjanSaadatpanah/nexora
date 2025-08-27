# app/models/project.py
from app.extensions import db


class Project(db.Model):
    __tablename__ = 'projects'
    project_id = db.Column(db.Integer, primary_key=True)
    acronym = db.Column(db.String(255))
    project_topic = db.Column(db.String(500))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    funded_under = db.Column(db.String(255))
    total_cost = db.Column(db.Numeric(15, 2))
    eu_contribution = db.Column(db.Numeric(15, 2))
    objective = db.Column(db.Text)
    programme = db.Column(db.String(255))
    call_topic = db.Column(db.String(255))
    call_for_proposal = db.Column(db.String(255))
    source = db.Column(db.String(255))

    # existing relationship
    organizations = db.relationship(
        'ProjectOrganization', back_populates='project')

    # NEW: coordinator_id column and relationship
    coordinator_id = db.Column(db.Integer, db.ForeignKey(
        'organizations.id'), nullable=True)
    coordinator = db.relationship(
        'Organization', foreign_keys=[coordinator_id])
