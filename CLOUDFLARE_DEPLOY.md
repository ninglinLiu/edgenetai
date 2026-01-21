# Cloudflare Pages 部署指南

本指南将帮助你在 Cloudflare Pages 上部署 EdgeNet.AI Dashboard。

## 前置要求

1. 一个 Cloudflare 账户（免费账户即可）
2. GitHub 仓库已推送代码
3. 确保 `main` 分支包含所有最新更改

## 部署步骤

### 方法 1: 通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账户

2. **创建新 Pages 项目**
   - 在左侧菜单选择 "Workers & Pages"
   - 点击 "Create application"
   - 选择 "Pages" 标签
   - 点击 "Connect to Git"

3. **连接 GitHub 仓库**
   - 选择你的 GitHub 账户
   - 选择 `edgenetai` 仓库
   - 点击 "Begin setup"

4. **配置构建设置**
   
   在 "Build configuration" 部分，设置以下内容：

   - **Project name**: `edgenetai-dashboard`（或你喜欢的名称）
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`（Cloudflare 会自动检测）
   - **Root directory**: 留空（使用仓库根目录）
   - **Framework preset**: `None` 或留空（不要选择 Next.js，因为我们完全自定义构建）
   - **Install command**: 留空（在构建命令中处理）
   - **Build command**: 
     ```bash
     rm -rf apps/router-api apps/verifier && echo 'packages:\n  - "apps/dashboard"\n  - "packages/*"' > pnpm-workspace.yaml && pnpm install --no-frozen-lockfile && cd apps/dashboard && pnpm build
     ```
   - **Build output directory**: `apps/dashboard/.next`
   - **Node version**: `20`
   - **Package manager**: `pnpm`
   - **PNPM version**: `10.28.1`

5. **环境变量（可选）**
   
   在 "Environment variables" 部分，如果需要，可以添加：
   - `NEXT_PUBLIC_EDGE_API_MODE=mock`（用于 MOCK 模式）
   - 其他必要的环境变量

6. **保存并部署**
   - 点击 "Save and Deploy"
   - Cloudflare 将开始构建和部署

### 方法 2: 使用 Wrangler CLI

如果你更喜欢使用命令行：

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **创建 Pages 项目**
   ```bash
   wrangler pages project create edgenetai-dashboard
   ```

4. **部署**
   ```bash
   # 先构建
   bash cloudflare-build.sh
   
   # 然后部署
   wrangler pages deploy apps/dashboard/.next --project-name=edgenetai-dashboard
   ```

## 构建配置说明

由于这是一个 monorepo 项目，构建过程需要：

1. **移除有问题的包**: `apps/router-api` 和 `apps/verifier` 包含有问题的依赖
2. **更新 workspace 配置**: 只包含 `apps/dashboard` 和 `packages/*`
3. **安装依赖**: 使用 pnpm 安装
4. **构建 Dashboard**: 在 `apps/dashboard` 目录执行 `pnpm build`

## 常见问题

### 1. 构建失败：找不到 Next.js

**问题**: `No Next.js version detected`

**解决**: 
- 确保 "Build output directory" 设置为 `apps/dashboard/.next`
- 确保 "Root directory" 留空或设置为 `.`
- 检查构建命令是否正确执行了 `cd apps/dashboard && pnpm build`

### 2. 依赖安装失败

**问题**: `ERR_PNPM_FETCH_405` 或其他依赖错误

**解决**:
- 确保构建命令中包含了 `rm -rf apps/router-api apps/verifier`
- 确保 `pnpm-workspace.yaml` 被正确更新
- 检查 Node.js 版本是否为 20

### 3. 类型检查失败

**问题**: TypeScript 或 ESLint 错误

**解决**:
- 确保所有代码已通过本地类型检查
- 如果只是警告，可以在 `next.config.js` 中禁用类型检查（不推荐）

## 自动部署

Cloudflare Pages 会在以下情况自动重新部署：

- 推送到 `main` 分支
- 创建 Pull Request（预览部署）
- 手动触发部署

## 自定义域名

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 "Custom domains"
3. 添加你的域名
4. 按照提示配置 DNS 记录

## 性能优化

Cloudflare Pages 自动提供：
- 全球 CDN 加速
- 自动 HTTPS
- 边缘计算支持（如果使用 Cloudflare Workers）

## 监控和日志

- 在 Cloudflare Dashboard 中查看构建日志
- 使用 Cloudflare Analytics 查看访问统计
- 通过 Wrangler CLI 查看实时日志

## 相关文件

- `wrangler.toml`: Cloudflare Workers/Pages 配置文件（可选）
- `cloudflare-build.sh`: 构建脚本（可用于 CI/CD）
- `netlify.toml`: Netlify 配置（参考）
- `vercel.json`: Vercel 配置（参考）

## 支持

如果遇到问题，请检查：
1. Cloudflare 构建日志
2. GitHub Actions（如果使用）
3. 本地构建是否成功：`cd apps/dashboard && pnpm build`
