from flask import Flask
from app.config import config
from app.extensions import cors, db, migrate

def create_app(config_name='default'):
    """
    应用工厂函数
    :param config_name: 配置名称 (development, production, default)
    :return: Flask 应用实例
    """
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # 解决中文乱码问题
    app.json.ensure_ascii = False

    # 初始化扩展
    cors.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # 导入模型以确保迁移工具能检测到
    from app import models

    # 注册蓝图
    from app.api.routes import main_bp
    app.register_blueprint(main_bp)

    return app
