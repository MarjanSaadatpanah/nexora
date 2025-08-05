# app/models/project_organization.py
from app.extensions import db


class ProjectOrganization(db.Model):
    __tablename__ = 'project_organizations'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))

    organization_role = db.Column(db.String(100))
    correct_contribution = db.Column(db.Numeric(15, 2))
    net_eu_contribution = db.Column(db.Numeric(15, 2))
    project_or_organ_linkedin = db.Column(db.String(500))
    project_web_or_linkedin = db.Column(db.String(500))
    contact = db.Column(db.String(100))
    role = db.Column(db.String(100))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(100))
    contact_linkedin = db.Column(db.String(500))
    contact_web_found = db.Column(db.String(500))
    note = db.Column(db.Text)

    project = db.relationship('Project', back_populates='organizations')
    organization = db.relationship(
        'Organization', back_populates='project_links')
