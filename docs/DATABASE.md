# 数据库设计 (Database Schema)

本项目使用 MySQL 8.0+ 存储关系型数据。所有业务表均设计为**多租户模式**，通过 `user_id` 强关联用户，确保数据隔离。
权限控制采用 **RBAC (Role-Based Access Control)** 模型。

## 通用字段规范 (Audit Fields)

除关联表外，所有实体表均包含以下审计字段：

- `created_at`: 创建时间
- `created_by`: 创建者 ID
- `updated_at`: 更新时间
- `updated_by`: 更新者 ID
- `deleted`: 逻辑删除标记 (默认 FALSE)

## ER 图 (简述)

- `Users` (M) <-> (N) `Roles` (通过 `UserRoles`)
- `Roles` (M) <-> (N) `Permissions` (通过 `RolePermissions`)
- `Users` (1) ---- (N) `Documents`
- `Users` (1) ---- (N) `Chats`
- `Chats` (1) ---- (N) `Messages`

## 表结构详情

### 1. RBAC 权限模块

#### 1.1 Users (用户表)

存储用户基本认证信息。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 用户唯一标识 |
| `username` | String(64) | Unique | 用户名 |
| `email` | String(120) | Unique | 邮箱地址 |
| `password` | String(128) | Not Null | 加密后的密码 |
| `actived` | Boolean | Default True | 是否激活 |
| *Audit* | | | *通用审计字段* |

#### 1.2 Roles (角色表)

定义系统中的角色（如：管理员、普通用户）。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 角色 ID |
| `name` | String(64) | Unique | 角色名称 |
| `code` | String(64) | Unique | 角色编码 (admin, user) |
| `description` | String(255) | | 描述 |
| *Audit* | | | *通用审计字段* |

#### 1.3 Permissions (权限表)

定义具体的资源操作权限。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 权限 ID |
| `name` | String(64) | | 权限名称 |
| `code` | String(64) | Unique | 权限编码 (user:create) |
| `resource` | String(64) | | 资源类型 |
| `action` | String(64) | | 操作类型 |
| *Audit* | | | *通用审计字段* |

#### 1.4 关联表

- `user_roles`: 用户与角色的多对多关系。
- `role_permissions`: 角色与权限的多对多关系。

### 2. 业务模块

#### 2.1 Documents (文档表)

存储文档的元数据和处理状态。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 文档 ID |
| `user_id` | BigInt | FK (Users) | **所属用户 (隔离关键)** |
| `filename` | String(255) | Not Null | 原始文件名 |
| `s3_key` | String(512) | Not Null | 对象存储 Key |
| `file_type` | String(20) | Not Null | 文件类型 |
| `status` | Enum | | 处理状态 (pending, processing...) |
| `file_size` | BigInt | | 文件大小 |
| *Audit* | | | *通用审计字段* |

#### 2.2 Chats (会话表)

存储用户的对话窗口。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 会话 ID |
| `user_id` | BigInt | FK (Users) | 所属用户 |
| `title` | String(100) | | 会话标题 |
| *Audit* | | | *通用审计字段* |

#### 2.3 Messages (消息表)

存储具体的问答历史。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | PK | 消息 ID |
| `chat_id` | BigInt | FK (Chats) | 所属会话 |
| `role` | Enum | | 角色 (user, assistant, system) |
| `content` | Text | Not Null | 消息内容 |
| *Audit* | | | *通用审计字段* |

---

## 向量数据库 Schema (ChromaDB)

**Collection: `doc_chunks`**

| 字段 | 说明 |
| :--- | :--- |
| `id` | Chunk UUID |
| `embedding` | Float Array |
| `document` | 原始文本内容 |
| `metadata` | `doc_id`, **`user_id`**, `page_num` |
