from functools import wraps
from flask import request
from pydantic import ValidationError
from app.core.response import APIResponse, ErrorCode

def validate_json(schema_class):
    """
    JSON 请求体校验装饰器
    :param schema_class: Pydantic 模型类
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return APIResponse.error(ErrorCode.BAD_REQUEST, message="Content-Type must be application/json")
            
            try:
                # 实例化 Pydantic 模型进行校验
                data = schema_class(**request.get_json())
                # 将校验后的数据作为关键字参数传递给视图函数
                kwargs['validated_data'] = data
            except ValidationError as e:
                # 格式化错误信息
                error_messages = []
                for error in e.errors():
                    field = ".".join(str(x) for x in error['loc'])
                    msg = error['msg']
                    error_messages.append(f"{field}: {msg}")
                return APIResponse.error(ErrorCode.VALIDATION_ERROR, data=error_messages)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
