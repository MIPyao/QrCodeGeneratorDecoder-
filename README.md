# 项目总览

本仓库采用前后端分离目录结构：

- `web/` 前端应用（Vue 3 + Vite + Element Plus）
- `server/` 后端（腾讯云 SCF 云函数骨架）

## 快速开始

### 前端（web）

1) 进入目录并安装依赖

```bash
cd web
pnpm install
```

2) 本地开发

```bash
pnpm run dev
```

3) 构建与预览

```bash
pnpm run build:prod
pnpm run preview
```

配置 `VITE_API_BASE_URL` 指向后端 API 网关地址（腾讯云 API 网关到 SCF）。

### 后端（server）

`server/` 为腾讯云云函数最小骨架，可在腾讯云控制台创建函数并上传目录，或使用 Serverless Framework 部署。

## 环境变量

前端 `.env` 示例（位于 `web/` 目录内）：

```env
VITE_DEV=true
VITE_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3000
```

生产请将 `VITE_API_BASE_URL` 替换为 API 网关公网地址。

## 目录结构

```
root
├─ README.md            # 总览（本文件）
├─ web/                 # 前端代码
└─ server/              # 云函数代码
```

# 审计报告二维码生成器

一个基于Vue 3 + Element Plus的审计报告二维码生成系统，支持前后端分离架构。

## 功能特性

- 📝 多字段表单输入（被审计单位、项目名称、报告文号、审计单位、签字注册会计师）
- 🔗 前后端分离架构，通过API提交数据获取ID
- 📱 生成包含报告ID的二维码
- 💾 支持二维码保存和URL复制
- 🎨 现代化UI设计，响应式布局

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **UI框架**: Element Plus
- **HTTP客户端**: Axios
- **二维码生成**: qrcode.js
- **样式**: Less

## 项目结构

```
src/
├── api/                 # API接口封装
│   └── report.js       # 报告相关API
├── views/              # 页面组件
│   ├── QrCodeGenerate.vue  # 二维码生成页面
│   └── QrCodeDecoder.vue   # 二维码解码页面
├── config/             # 配置文件
└── assets/             # 静态资源
```

## 环境配置

创建 `.env` 文件配置环境变量：

```env
# 开发环境
VITE_DEV=true
VITE_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3000

# 生产环境
VITE_DEV=false
VITE_BASE_URL=https://your-domain.com
VITE_API_BASE_URL=https://api.your-domain.com
```

## 后端API要求

系统需要后端提供以下API接口：

### 1. 提交报告数据
- **接口**: `POST /api/reports`
- **参数**: 报告信息对象
- **返回**: 包含报告ID的响应

### 2. 获取报告详情
- **接口**: `GET /api/reports/{id}`
- **返回**: 报告详细信息

详细API规范请参考 [API_SPECIFICATION.md](./API_SPECIFICATION.md)

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建生产版本

```bash
pnpm run build:prod
```

### 预览生产版本

```bash
pnpm run preview
```

## 使用说明

1. **填写报告信息**: 在表单中输入被审计单位、项目名称等信息
2. **生成二维码**: 点击"生成二维码"按钮，系统将数据提交到后端
3. **获取ID**: 后端返回报告唯一ID
4. **生成二维码**: 使用包含ID的URL生成二维码
5. **保存或复制**: 可以保存二维码图片或复制URL链接

## 部署说明

1. 配置生产环境变量
2. 构建前端项目: `pnpm run build:prod`
3. 部署到Web服务器
4. 确保后端API服务正常运行

## 注意事项

- 确保后端API服务正常运行
- 检查网络连接和API地址配置
- 建议在生产环境中使用HTTPS

