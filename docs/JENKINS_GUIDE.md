# Jenkins 配置指南

本文档详细说明了如何配置 Jenkins 以支持 DocuMind AI 项目的 CI/CD 流程。

## 1. 基础环境准备

在运行 Jenkins 的服务器（或 Agent 节点）上，必须安装以下基础工具，因为 `Jenkinsfile` 会直接调用它们：

*   **Docker**: 用于构建镜像和推送。确保 Jenkins 用户有权限执行 docker 命令（如 `usermod -aG docker jenkins`）。
*   **Java JDK 17+**: 用于运行 Jenkins Agent 和构建后端。
*   **Maven 3.9+**: 用于构建后端。
*   **Node.js 20+ & pnpm**: 用于构建前端。
*   **Python 3.12+**: 用于构建 AI 引擎。
*   **Kubectl**: 用于部署到 K8s 集群。

> **提示**: 如果不想在宿主机安装所有工具，可以修改 `Jenkinsfile` 使用 `agent { docker { ... } }` 模式，但这需要更复杂的 Docker-in-Docker 配置。当前方案假设宿主机已有环境。

## 2. 安装必要插件

进入 **Manage Jenkins -> Plugins -> Available plugins**，搜索并安装：

1.  **Pipeline**: 核心插件（通常默认已装）。
2.  **Multibranch Scan Webhook Trigger**: 用于多分支自动触发。
3.  **Docker Pipeline**: 支持在 Pipeline 中构建 Docker 镜像。
4.  **Kubernetes CLI**: 允许在 Pipeline 中使用 `withKubeConfig`。
5.  **NodeJS**: (可选) 如果希望 Jenkins 自动管理 Node 版本。
6.  **Blue Ocean**: (可选) 提供更美观的 UI。

## 3. 配置凭证 (Credentials)

进入 **Manage Jenkins -> Credentials -> System -> Global credentials -> Add Credentials**：

### 3.1. Kubernetes 配置文件 (Kubeconfig)
*   **Kind**: Secret file
*   **File**: 上传您的 K8s `config` 文件（通常位于 `~/.kube/config`）。
*   **ID**: `k8s-config` (**必须与 Jenkinsfile 中的 KUBECONFIG_ID 一致**)
*   **Description**: K8s Cluster Config

### 3.2. Git 仓库凭证 (如果仓库是私有的)
*   **Kind**: Username with password (HTTPS) 或 SSH Username with private key
*   **ID**: `git-auth` (自定义，创建任务时会用到)

### 3.3. Docker Registry 凭证 (如果是需要认证的私库)
*   **Kind**: Username with password
*   **ID**: `docker-registry-auth`
*   **注意**: 并在 `Jenkinsfile` 的 Docker Build 阶段使用 `docker.withRegistry` 包装。
    *   *当前 Jenkinsfile 假设宿主机已通过 `docker login` 登录了私库，未在 Pipeline 显式配置登录步骤。建议在 Jenkins 服务器上执行一次 `docker login demotao.top:5000`。*

## 4. 创建流水线任务

我们将创建一个 **Multibranch Pipeline** (多分支流水线)，它能自动发现 `develop`、`release/*` 等分支并分别构建。

1.  **新建 Item**:
    *   输入名称：`documind-pipeline`
    *   选择类型：**Multibranch Pipeline**
    *   点击 OK。

2.  **配置 Branch Sources**:
    *   点击 **Add source** -> **Git**。
    *   **Project Repository**: 输入项目的 Git 仓库地址。
    *   **Credentials**: 选择之前配置的 `git-auth`。
    *   **Behaviours**: 保持默认（Discover branches）。

3.  **Build Configuration**:
    *   **Mode**: by Jenkinsfile
    *   **Script Path**: `Jenkinsfile` (默认即可)

4.  **Scan Multibranch Pipeline Triggers**:
    *   勾选 **Periodically if not otherwise run**: 设置间隔（如 `1 minute`），或者配置 Webhook 触发。

5.  **保存**:
    *   点击 Save。Jenkins 会立即开始扫描仓库中的分支。
    *   如果扫描成功，您会在界面上看到 `develop` 或 `master` 等分支的任务已创建。

## 5. 常见问题排查

### Q1: Docker 推送失败 (http: server gave HTTP response to HTTPS client)
**原因**: 私有仓库未配置 HTTPS 证书。
**解决**: 在 Jenkins 服务器的 `/etc/docker/daemon.json` 中添加：
```json
{
  "insecure-registries": ["demotao.top:5000"]
}
```
然后重启 Docker: `systemctl restart docker`。

### Q2: 找不到 pnpm/mvn 命令
**原因**: 环境变量未生效。
**解决**: 
1. 确保在 Jenkins 节点上安装了这些工具。
2. 或者在 **Global Tool Configuration** 中配置自动安装。
3. 或者在 `Jenkinsfile` 的 `environment` 块中把工具路径加入 PATH：
   ```groovy
   environment {
       PATH = "/usr/local/node/bin:$PATH"
   }
   ```

### Q3: Kubectl 权限不足
**解决**: 确保上传的 `k8s-config` 文件对应的 User 在 K8s 集群中拥有 Deployment, Service, Ingress 的 CRUD 权限。
