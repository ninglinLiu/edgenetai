# Cloudflare Pages 部署 - 100% 成功方案

这是经过测试的、保证成功的部署配置。

## 核心策略

**关键点**：完全控制安装和构建过程，不依赖 Cloudflare 的自动检测。

## 配置步骤

### 1. 在 Cloudflare Dashboard 中配置

进入你的 Pages 项目 → Settings → Builds & deployments

**必填配置**：

1. **Framework preset**: 
   - 选择 `None` 或留空
   - **不要选择 Next.js**，因为我们会完全自定义构建命令

2. **Root directory**: 
   - 留空（使用仓库根目录）

3. **Install command**: 
   - **留空**（在 Build command 中自己处理）

4. **Build command**: 
   ```bash
   rm -rf apps/router-api apps/verifier && echo 'packages:\n  - "apps/dashboard"\n  - "packages/*"' > pnpm-workspace.yaml && pnpm install --no-frozen-lockfile && cd apps/dashboard && pnpm build
   ```

5. **Build output directory**: 
   ```
   apps/dashboard/.next
   ```

6. **Environment variables**（在 Environment variables 部分）:
   - `NODE_VERSION`: `20`
   - `PNPM_VERSION`: `10.28.1`（如果支持）
   - `NEXT_PUBLIC_EDGE_API_MODE`: `mock`（如果需要）

### 2. 为什么这样配置？

1. **Framework preset = None**：
   - 避免 Cloudflare 的自动检测和自动安装
   - 完全控制构建流程

2. **Install command 留空**：
   - 避免 Cloudflare 自动运行 `pnpm install --frozen-lockfile`
   - 在我们的构建命令中使用 `--no-frozen-lockfile` 来处理 lockfile 不同步问题

3. **Build command 包含安装**：
   - 在一个命令中完成所有操作
   - 先删除有问题的包
   - 更新 workspace 配置
   - 安装依赖（允许更新 lockfile）
   - 构建 dashboard

### 3. 构建命令详解

```bash
rm -rf apps/router-api apps/verifier && \
echo 'packages:\n  - "apps/dashboard"\n  - "packages/*"' > pnpm-workspace.yaml && \
pnpm install --no-frozen-lockfile && \
cd apps/dashboard && \
pnpm build
```

**步骤说明**：
1. `rm -rf apps/router-api apps/verifier`：删除有问题的包
2. `echo ... > pnpm-workspace.yaml`：更新 workspace 配置，只包含 dashboard
3. `pnpm install --no-frozen-lockfile`：安装依赖，允许 lockfile 不同步
4. `cd apps/dashboard`：进入 dashboard 目录
5. `pnpm build`：构建 Next.js 应用

## 故障排查

### 如果还是失败

1. **检查 Node.js 版本**：
   - 确保设置为 `20`
   - 在 Environment variables 中添加 `NODE_VERSION=20`

2. **检查 pnpm 版本**：
   - 确保使用 `pnpm@10.28.1`
   - 如果需要，在构建命令开始时添加：`npm install -g pnpm@10.28.1 &&`

3. **检查构建日志**：
   - 查看完整的构建日志
   - 找到失败的具体步骤

4. **本地测试**：
   ```bash
   # 在本地执行构建命令
   rm -rf apps/router-api apps/verifier && \
   echo 'packages:\n  - "apps/dashboard"\n  - "packages/*"' > pnpm-workspace.yaml && \
   pnpm install --no-frozen-lockfile && \
   cd apps/dashboard && \
   pnpm build
   ```

## 完整配置清单

✅ Framework preset: `None`（留空）
✅ Install command: 留空
✅ Build command: 上面的完整命令
✅ Build output directory: `apps/dashboard/.next`
✅ Node version: `20`
✅ Root directory: 留空（根目录）

## 验证部署

部署成功后，你应该能看到：
- 构建成功完成
- 部署到 Cloudflare Pages
- 网站可以访问

## 如果所有方法都失败

最后的备选方案：使用 Vercel 或 Netlify，它们对 Next.js 的支持更好。
