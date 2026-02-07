from flask import Blueprint, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def hello():
    return jsonify({
        "message": "欢迎使用 DocuMind AI API (Refactored)",
        "status": "running"
    })
