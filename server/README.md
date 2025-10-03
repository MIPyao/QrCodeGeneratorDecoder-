# 腾讯云云函数（SCF）

## 目录结构
- `index.js`: 云函数入口
- `package.json`: 依赖与启动脚本

## 本地调试
- 可使用 Serverless Framework 或腾讯云 SCF 控制台在线编辑/测试

## 部署
- 在腾讯云控制台创建函数并上传 `server` 目录
- 或使用 Serverless Framework：`sls deploy`

## 与前端联调
- 前端 `web/` 的 `VITE_API_BASE_URL` 指向 API 网关地址
- 建议通过 API 网关触发 SCF 并配置 CORS
