from flask import Blueprint, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from app.models.user import User
from app.extensions import db, mail, redis_client
from app.core.response import APIResponse, ErrorCode
from app.core.validator import validate_json
from app.schemas.auth import SendCodeRequest, RegisterRequest, LoginRequest
import random
import string

auth_bp = Blueprint('auth', __name__)

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

@auth_bp.route('/send-code', methods=['POST'])
@validate_json(SendCodeRequest)
def send_code(validated_data: SendCodeRequest):
    email = validated_data.email
    
    if User.query.filter_by(email=email).first():
        return APIResponse.error(ErrorCode.EMAIL_ALREADY_EXISTS)
        
    code = generate_verification_code()
    
    # 存储到 Redis，有效期 5 分钟
    redis_key = f"verify_code:{email}"
    redis_client.setex(redis_key, 300, code)
    
    # 发送邮件
    try:
        msg = Message("DocuMind AI - 注册验证码",
                      recipients=[email])
        msg.body = f"您的注册验证码是: {code}，有效期 5 分钟。"
        mail.send(msg)
        return APIResponse.success(message="验证码已发送")
    except Exception as e:
        current_app.logger.error(f"Failed to send email: {e}")
        return APIResponse.error(ErrorCode.INTERNAL_SERVER_ERROR, message="邮件发送失败，请稍后重试")

@auth_bp.route('/register', methods=['POST'])
@validate_json(RegisterRequest)
def register(validated_data: RegisterRequest):
    # 验证验证码
    redis_key = f"verify_code:{validated_data.email}"
    stored_code = redis_client.get(redis_key)
    
    if not stored_code:
        return APIResponse.error(ErrorCode.VERIFICATION_CODE_EXPIRED)
        
    if stored_code.decode('utf-8') != validated_data.code:
        return APIResponse.error(ErrorCode.INVALID_VERIFICATION_CODE)
        
    if User.query.filter_by(username=validated_data.username).first():
        return APIResponse.error(ErrorCode.USER_ALREADY_EXISTS)
        
    if User.query.filter_by(email=validated_data.email).first():
        return APIResponse.error(ErrorCode.EMAIL_ALREADY_EXISTS)
        
    new_user = User(username=validated_data.username, email=validated_data.email)
    new_user.set_password(validated_data.password)
    
    db.session.add(new_user)
    db.session.commit()
    
    # 注册成功后删除验证码
    redis_client.delete(redis_key)
    
    return APIResponse.success(message="注册成功")

@auth_bp.route('/login', methods=['POST'])
@validate_json(LoginRequest)
def login(validated_data: LoginRequest):
    user = User.query.filter_by(username=validated_data.username).first()
    
    if user is None:
        return APIResponse.error(ErrorCode.USER_NOT_FOUND)
        
    if not user.check_password(validated_data.password):
        return APIResponse.error(ErrorCode.PASSWORD_ERROR)
        
    access_token = create_access_token(identity=str(user.id))
    
    return APIResponse.success(data={
        "access_token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }, message="登录成功")

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return APIResponse.error(ErrorCode.USER_NOT_FOUND)
        
    return APIResponse.success(data={
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    })
