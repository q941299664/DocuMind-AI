from flask import Blueprint, request
from app.core.response import APIResponse
import time

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def hello():
    return APIResponse.success(
        data={
            "status": "running",
            "service": "DocuMind AI Engine (Python)",
            "version": "2.0.0"
        },
        message="AI 引擎正常运行中"
    )

@main_bp.route('/api/ai/test', methods=['POST'])
def test_ai():
    """
    AI 连通性测试接口
    供 Java 后端调用，验证整个链路：Frontend -> Java Backend -> AI Engine
    """
    data = request.get_json() or {}
    message = data.get('message', 'No message provided')
    
    # 模拟 AI 处理耗时
    time.sleep(0.5)
    
    return APIResponse.success(
        data={
            "received_message": message,
            "ai_response": f"AI Engine 已收到消息: '{message}'。链路连通性测试通过！",
            "timestamp": time.time()
        },
        message="AI 处理成功"
    )
