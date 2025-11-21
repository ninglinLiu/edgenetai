# GitHub 上传指南

## 步骤 1: 在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `edgenetai` (或你喜欢的名称)
   - **Description**: `EdgeNet.AI - PoI (Proof-of-Inference) DePIN MVP`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
3. 点击 "Create repository"

## 步骤 2: 连接本地仓库到 GitHub

在项目根目录执行以下命令（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/edgenetai.git

# 或者使用 SSH（如果你配置了 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/edgenetai.git

# 查看远程仓库配置
git remote -v
```

## 步骤 3: 推送代码到 GitHub

```bash
# 推送主分支
git branch -M main
git push -u origin main
```

## 步骤 4: 验证

访问你的 GitHub 仓库页面，确认所有文件都已上传。

## 可选：设置 GitHub Actions Secrets

如果你要使用 CI/CD，需要在 GitHub 仓库设置中添加 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 添加以下 secrets（如果需要）：
   - `PRIVATE_KEY` - 用于合约部署
   - `VERIFIER_ADDRESS` - 验证器地址
   - `CONTRACT_ADDRESS` - 合约地址（部署后）

## 可选：添加 GitHub Topics

在仓库页面点击 ⚙️ Settings → Topics，添加：
- `depin`
- `proof-of-inference`
- `blockchain`
- `ai-inference`
- `solidity`
- `nextjs`
- `typescript`

## 可选：创建 Release

1. 进入仓库的 Releases 页面
2. 点击 "Create a new release"
3. 填写版本号（如 `v0.1.0`）
4. 添加发布说明
5. 发布

## 推送更新

以后每次更新代码后：

```bash
git add .
git commit -m "描述你的更改"
git push
```

## 分支策略建议

```bash
# 创建开发分支
git checkout -b develop

# 创建功能分支
git checkout -b feature/your-feature-name

# 推送分支
git push -u origin feature/your-feature-name
```

