# 项目路线图 (Roadmap)

DocuMind-AI 旨在构建一个基于 RAG (检索增强生成) 技术的智能文档问答系统。本项目强调**数据隐私**和**多租户隔离**，确保每个用户拥有独立的知识库。

## 阶段一：基础设施与认证 (Infrastructure & Auth) - [当前阶段]
> 目标：搭建稳健的前后端框架，实现用户身份验证和数据隔离的基础。

- [x] **后端架构搭建**: Flask Application Factory, Blueprint, Config Management.
- [x] **数据库集成**: PostgreSQL, SQLAlchemy, Alembic (Migration).
- [x] **用户模型**: `User` 表设计与迁移.
- [ ] **认证模块**: 
    - 集成 JWT (JSON Web Tokens).
    - 注册/登录 API.
    - 密码加密存储 (Argon2/Bcrypt).
    - 认证中间件 (Authentication Middleware).
- [ ] **前端集成**: 登录/注册页面，Axios 拦截器处理 Token。

## 阶段二：文档处理流水线 (Document Pipeline)
> 目标：实现文档的安全上传、存储和预处理。

- [ ] **对象存储集成**: 接入 MinIO (本地兼容 S3) 存储原始文件。
- [ ] **文档数据模型**: 设计 `Documents` 表，关联 `user_id` 实现权限隔离。
- [ ] **文件解析服务**:
    - 支持 PDF, DOCX, TXT, MD 格式。
    - 文本提取与清洗。
- [ ] **文档切片 (Chunking)**: 实现基于字符或语义的文本分块策略。
- [ ] **异步任务队列**: 引入 Celery + Redis 处理耗时的解析任务。

## 阶段三：RAG 核心引擎 (RAG Engine)
> 目标：构建向量知识库，实现基于文档的智能问答。

- [ ] **向量数据库集成**: 部署并接入 ChromaDB 或 Elasticsearch。
- [ ] **Embedding 服务**: 集成 OpenAI Embedding API 或本地模型 (HuggingFace)。
- [ ] **索引构建**: 将文档切片向量化并存入向量库。
- [ ] **检索模块**: 实现语义搜索 (Semantic Search) 接口。
- [ ] **生成模块**: 
    - 集成 OpenAI GPT-4 或其它 LLM。
    - 构建 Prompt Template (提示词模板)。
    - 实现 "检索-增强-生成" 流程。

## 阶段四：生产化与优化 (Production & Optimization)
> 目标：提升系统性能、稳定性和用户体验。

- [ ] **对话历史管理**: 存储用户的对话上下文。
- [ ] **流式响应 (Streaming)**: 实现打字机效果的回复。
- [ ] **性能优化**: Redis 缓存常用查询。
- [ ] **部署运维**: Docker Compose 编排，Nginx 反向代理，CI/CD 流水线。
