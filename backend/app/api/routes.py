from flask import Blueprint
from app.core.response import APIResponse

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def hello():
    return APIResponse.success(
        data={
            "status": "running",
            "version": "1.0.0"
        },
        message="欢迎使用 DocuMind AI API (结构已优化)"
    )
