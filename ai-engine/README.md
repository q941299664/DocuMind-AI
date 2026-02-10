# 后端 API

本项目使用 Flask 框架，并采用了结构化的应用工厂模式（Application Factory Pattern）。

## 项目结构

- `run.py`: 应用程序的启动入口。
- `app/`: 主应用包。
  - `__init__.py`: 应用工厂函数 (`create_app`)。
  - `config.py`: 配置类（开发环境、生产环境等）。
  - `extensions.py`: Flask 扩展初始化（如 CORS 等）。
  - `api/`: API 蓝图（Blueprints）和路由。
  - `services/`: 业务逻辑和服务层。
  - `models/`: 数据库模型。
  - `core/`: 核心功能和工具类。

## 运行应用程序

1. 安装依赖:
   ```bash
   pip install -r requirements.txt
   ```

2. 运行应用:
   ```bash
   python run.py
   ```

## 配置

设置 `FLASK_CONFIG` 环境变量为 `development`（开发）、`production`（生产）或 `default`（默认）。
环境变量将从 `.env` 文件中加载。
