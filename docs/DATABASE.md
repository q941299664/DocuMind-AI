# 数据库设计 (Database Schema)

本项目主要使用 PostgreSQL 存储关系型数据。所有业务表均设计为**多租户模式**，通过 `user_id` 强关联用户，确保数据隔离。

## ER 图 (简述)

- `Users` (1) ---- (N) `Documents`
- `Documents` (1) ---- (N) `DocumentChunks` (可选，或仅存储在向量库)
- `Users` (1) ---- (N) `Chats`
- `Chats` (1) ---- (N) `Messages`

## 表结构详情

### 1. Users (用户表)
存储用户基本认证信息。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | 用户唯一标识 |
| `username` | String(64) | Unique, Not Null | 用户名 |
| `email` | String(120) | Unique, Not Null | 邮箱地址 |
| `password_hash` | String(128) | Not Null | 加密后的密码 |
| `created_at` | DateTime | Default Now | 注册时间 |
| `is_active` | Boolean | Default True | 账户状态 |

### 2. Documents (文档表)
存储文档的元数据和处理状态。**核心隔离点：`user_id`**。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK, Auto Increment | 文档 ID |
| `user_id` | Integer | **FK (Users.id)**, Index | **所属用户 (隔离关键)** |
| `filename` | String(255) | Not Null | 原始文件名 |
| `s3_key` | String(512) | Not Null | 对象存储中的路径 |
| `file_type` | String(20) | Not Null | 文件类型 (pdf, docx) |
| `status` | Enum | 'pending', 'processing', 'completed', 'failed' | 处理状态 |
| `error_msg` | Text | Nullable | 错误信息 (如果失败) |
| `created_at` | DateTime | Default Now | 上传时间 |

### 3. Chats (对话会话表)
存储用户的对话窗口/会话。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK | 会话 ID |
| `user_id` | Integer | **FK (Users.id)** | 所属用户 |
| `title` | String(100) | | 会话标题 (自动生成或自定义) |
| `created_at` | DateTime | | 创建时间 |

### 4. Messages (消息记录表)
存储具体的问答历史。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | Integer | PK | 消息 ID |
| `chat_id` | Integer | FK (Chats.id) | 所属会话 |
| `role` | Enum | 'user', 'assistant' | 发送者角色 |
| `content` | Text | Not Null | 消息内容 |
| `created_at` | DateTime | | 发送时间 |

---

## 向量数据库 Schema (ChromaDB)

虽然 ChromaDB 是 NoSQL，但也遵循特定的数据结构：

**Collection: `doc_chunks`**

| 字段 (Field) | 说明 |
| :--- | :--- |
| `id` | Chunk 的唯一标识 (通常 UUID) |
| `embedding` | 文本向量 (Float Array) |
| `document` | 原始文本内容 |
| `metadata` | 包含 `doc_id`, **`user_id`** (用于过滤), `page_num` 等 |

**检索策略**:
```python
# 伪代码示例
results = collection.query(
    query_embeddings=[query_vector],
    n_results=5,
    where={"user_id": current_user.id}  # 强制隔离
)
```
