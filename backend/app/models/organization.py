# app/models/organization.py
from app.extensions import db


class Organization(db.Model):
    __tablename__ = 'organizations'
    id = db.Column(db.Integer, primary_key=True)
    acronym = db.Column(db.String(255))
    organization_name = db.Column(db.String(255))
    country = db.Column(db.String(100))
    linkedin = db.Column(db.String(500))

    project_links = db.relationship(
        'ProjectOrganization', back_populates='organization')
