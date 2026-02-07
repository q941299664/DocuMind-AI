import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
# 加载 .env 文件中的环境变量
load_dotenv(os.path.join(basedir, '../.env'))

class Config:
    # 密钥配置，优先从环境变量获取
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 数据库配置
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("未配置 DATABASE_URL 环境变量。请在 .env 文件中配置 PostgreSQL 数据库连接。")
    
    # Redis 配置
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True

class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
