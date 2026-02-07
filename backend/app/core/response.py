from flask import jsonify

class APIResponse:
    @staticmethod
    def success(data=None, message="操作成功", code=200):
        """
        标准成功响应
        :param data: 响应数据
        :param message: 响应消息
        :param code: 业务状态码
        :return: JSON 响应
        """
        return jsonify({
            "code": code,
            "message": message,
            "data": data
        }), 200

    @staticmethod
    def error(message="操作失败", code=400, data=None, status_code=400):
        """
        标准错误响应
        :param message: 错误消息
        :param code: 业务状态码
        :param data: 错误详情数据
        :param status_code: HTTP 状态码
        :return: JSON 响应
        """
        return jsonify({
            "code": code,
            "message": message,
            "data": data
        }), status_code
