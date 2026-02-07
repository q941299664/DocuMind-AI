# API 接口文档

## 概览 (Overview)
基础 URL: `http://localhost:5000`

## 接口列表 (Endpoints)

### 健康检查 (Health Check)
- **GET** `/`
- **功能**: 检查服务运行状态
- **响应示例**: 
  ```json
  {
    "message": "欢迎使用 DocuMind AI API",
    "status": "running"
  }
  ```
