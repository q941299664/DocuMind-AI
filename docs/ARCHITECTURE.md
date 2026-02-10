# 系统架构设计 (Architecture)

## 1. 架构概览

DocuMind AI 采用**前后端分离** + **微服务**的混合架构。

- **Frontend (React)**: 负责 UI 渲染和 PDF 交互。
- **Backend Service (Java Spring Boot)**: 核心业务网关，处理 CRUD、用户认证、权限管理。
- **AI Engine (Python Flask)**: 专注于 RAG（检索增强生成）、LLM 调用和向量计算。
- **Infrastructure**: MySQL (业务数据), Redis (缓存), RabbitMQ (异步通信), VectorDB (向量存储).

## 2. 服务职责

### 2.1 Backend Service (Java)

- **API Gateway**: 统一对外暴露 RESTful 接口。
- **User Center**: 用户注册、登录、JWT 签发与校验。
- **Document Management**: PDF 文件的上传元数据管理、CRUD 操作。
- **Task Dispatch**: 将耗时的 AI 任务（如 PDF 解析、摘要生成）发送至消息队列。

### 2.2 AI Engine (Python)

- **Worker Mode**: 监听 RabbitMQ 队列，处理异步任务。
- **RAG Service**:
  - 文档切片 (Chunking)
  - 向量化 (Embedding)
  - 向量检索 (Retrieval)
  - LLM 问答生成 (Generation)
- **Internal API**: 提供必要的内部同步接口（如实时对话流）。

## 3. 数据流 (Data Flow)

### 3.1 文档上传流程

1. 用户在 **Frontend** 上传 PDF。
2. **Java Backend** 接收文件，保存至 MinIO/本地存储，写入 MySQL 元数据。
3. **Java Backend** 发送 "Process Document" 消息到 **RabbitMQ**。
4. **Python AI Engine** 消费消息：
    - 下载 PDF。
    - 解析文本并进行切片。
    - 调用 Embedding 模型生成向量。
    - 存入向量数据库 (ChromaDB/Milvus)。
5. **AI Engine** 更新任务状态（通过 API 回调 Java Backend 或写入共享 Redis）。

### 3.2 智能问答流程

1. 用户在 **Frontend** 发起提问。
2. **Java Backend** 转发请求至 **Python AI Engine** (或前端直接连接 AI Engine 的 WebSocket/SSE，视具体实现而定；建议通过 Java 转发以统一鉴权)。
3. **AI Engine**:
    - 将问题向量化。
    - 在向量库中检索相关上下文。
    - 组装 Prompt (System + Context + User Question)。
    - 调用 LLM (OpenAI/Qwen) 生成回答。
4. 结果返回给前端。

## 4. 技术决策

- **为何引入 Java?**
  - 利用 Spring Boot 强大的生态处理复杂的企业级业务逻辑和高并发常规请求。
  - 团队技术栈统一或性能考量。
- **为何保留 Python?**
  - Python 在 AI/ML 领域的绝对优势（LangChain, PyTorch, HuggingFace）。
  - 仅作为计算节点，剥离通用业务逻辑，更轻量专注。
