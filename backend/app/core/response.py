from flask import jsonify
from enum import Enum

class ErrorCode(Enum):
    # 通用错误
    SUCCESS = (200, "操作成功")
    BAD_REQUEST = (400, "请求参数错误")
    UNAUTHORIZED = (401, "未授权")
    FORBIDDEN = (403, "禁止访问")
    NOT_FOUND = (404, "资源不存在")
    INTERNAL_SERVER_ERROR = (500, "服务器内部错误")

    # 用户认证相关 (100xx)
    USER_NOT_FOUND = (10001, "用户不存在")
    PASSWORD_ERROR = (10002, "密码错误")
    USER_ALREADY_EXISTS = (10003, "用户已存在")
    EMAIL_ALREADY_EXISTS = (10004, "邮箱已被注册")
    INVALID_VERIFICATION_CODE = (10005, "验证码错误")
    VERIFICATION_CODE_EXPIRED = (10006, "验证码已过期")
    MISSING_PARAMETERS = (10007, "缺少必要参数")
    VALIDATION_ERROR = (10008, "数据校验失败")

    def __init__(self, code, message):
        self.code = code
        self.message = message

class APIResponse:
    @staticmethod
    def success(data=None, message=None):
        """
        标准成功响应
        :param data: 响应数据
        :param message: 自定义成功消息（可选）
        :return: JSON 响应
        """
        return jsonify({
            "code": ErrorCode.SUCCESS.code,
            "message": message or ErrorCode.SUCCESS.message,
            "data": data
        }), 200

    @staticmethod
    def error(error_enum: ErrorCode, message=None, data=None):
        """
        标准错误响应 (HTTP 状态码统一为 200)
        :param error_enum: ErrorCode 枚举成员
        :param message: 自定义错误消息（覆盖枚举默认消息）
        :param data: 错误详情数据
        :return: JSON 响应
        """
        return jsonify({
            "code": error_enum.code,
            "message": message or error_enum.message,
            "data": data
        }), 200
