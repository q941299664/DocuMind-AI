-- DocuMind AI 初始化 SQL 脚本
-- 数据库: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `documind` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `documind`;

-- 1. 角色表 (Roles) - RBAC 核心
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    `name` VARCHAR(64) NOT NULL UNIQUE COMMENT '角色名称(如: 管理员)',
    `code` VARCHAR(64) NOT NULL UNIQUE COMMENT '角色编码(如: admin)',
    `description` VARCHAR(255) COMMENT '描述',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 2. 权限表 (Permissions) - RBAC 核心
CREATE TABLE IF NOT EXISTS `permissions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '权限ID',
    `name` VARCHAR(64) NOT NULL COMMENT '权限名称',
    `code` VARCHAR(64) NOT NULL UNIQUE COMMENT '权限编码(如: user:create)',
    `resource` VARCHAR(64) COMMENT '资源类型',
    `action` VARCHAR(64) COMMENT '操作类型',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- 3. 角色-权限关联表
CREATE TABLE IF NOT EXISTS `role_permissions` (
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `permission_id` BIGINT NOT NULL COMMENT '权限ID',
    PRIMARY KEY (`role_id`, `permission_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色-权限关联表';

-- 4. 用户表 (Users)
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(120) NOT NULL UNIQUE COMMENT '邮箱',
    `password` VARCHAR(128) NOT NULL COMMENT '加密密码',
    `actived` BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除',
    INDEX `idx_email` (`email`),
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 5. 用户-角色关联表
CREATE TABLE IF NOT EXISTS `user_roles` (
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    PRIMARY KEY (`user_id`, `role_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户-角色关联表';

-- 6. 文档表 (Documents)
CREATE TABLE IF NOT EXISTS `documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文档ID',
    `user_id` BIGINT NOT NULL COMMENT '所属用户ID',
    `filename` VARCHAR(255) NOT NULL COMMENT '原始文件名',
    `s3_key` VARCHAR(512) NOT NULL COMMENT '对象存储Key',
    `file_type` VARCHAR(20) NOT NULL COMMENT '文件类型(pdf, docx)',
    `status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT '处理状态',
    `error_msg` TEXT COMMENT '错误信息',
    `file_size` BIGINT COMMENT '文件大小(字节)',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除',
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_docs` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档表';

-- 7. 对话会话表 (Chats)
CREATE TABLE IF NOT EXISTS `chats` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '会话ID',
    `user_id` BIGINT NOT NULL COMMENT '所属用户ID',
    `title` VARCHAR(100) COMMENT '会话标题',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除',
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_chats` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话会话表';

-- 8. 消息记录表 (Messages)
CREATE TABLE IF NOT EXISTS `messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
    `chat_id` BIGINT NOT NULL COMMENT '所属会话ID',
    `role` ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
    `content` TEXT NOT NULL COMMENT '消息内容',
    -- 审计字段
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by` BIGINT DEFAULT 1 COMMENT '创建者ID',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by` BIGINT DEFAULT 1 COMMENT '更新者ID',
    `deleted` BOOLEAN DEFAULT FALSE COMMENT '是否逻辑删除',
    FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE CASCADE,
    INDEX `idx_chat_msgs` (`chat_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息记录表';

-- ==========================================
-- 初始数据插入
-- ==========================================

-- 1. 插入角色
INSERT INTO `roles` (`name`, `code`, `description`) VALUES 
('管理员', 'admin', '系统超级管理员，拥有所有权限'),
('普通用户', 'user', '注册用户，拥有基础文档操作权限');

-- 2. 插入管理员用户
-- 密码 hash 为 sha256(password+ email)
INSERT INTO `users` (`username`, `email`, `password`, `actived`) VALUES 
('管理员', '941299664@qq.com', 'dfe604b7b6853e5adbdc7e1470e2a95a861a453325250f15d97848410d6c98ba', TRUE);

-- 3. 关联用户与角色
INSERT INTO `user_roles` (`user_id`, `role_id`) 
SELECT u.id, r.id FROM `users` u, `roles` r 
WHERE r.code = 'admin';
