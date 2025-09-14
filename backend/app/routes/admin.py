from flask import Blueprint, jsonify
from app.sync_cordis import sync_cordis

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/sync-data", methods=["POST"])
def sync_data():
    result = sync_cordis()
    return jsonify({
        "status": "success",
        "message": "CORDIS data synced successfully",
        "projects_inserted": result["projects_count"],
        "organizations_inserted": result["organizations_count"]
    })
