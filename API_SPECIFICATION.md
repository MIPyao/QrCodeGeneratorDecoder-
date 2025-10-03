# 后端API规范

## 报告管理API

### 1. 提交报告数据

**接口地址：** `POST /api/reports`

**请求参数：**
```json
{
  "auditedUnit": "被审计单位名称",
  "projectName": "项目名称",
  "reportNumber": "报告文号（可选）",
  "auditUnit": "审计单位（可选）",
  "certifiedAccountant": "签字注册会计师（可选）"
}
```

**响应格式：**
```json
{
  "id": "报告唯一ID",
  "auditedUnit": "被审计单位名称",
  "projectName": "项目名称",
  "reportNumber": "报告文号",
  "auditUnit": "审计单位",
  "certifiedAccountant": "签字注册会计师",
  "createdAt": "2025-01-27T10:00:00Z"
}
```

### 2. 获取报告详情

**接口地址：** `GET /api/reports/{id}`

**响应格式：**
```json
{
  "id": "报告唯一ID",
  "auditedUnit": "被审计单位名称",
  "projectName": "项目名称",
  "reportNumber": "报告文号",
  "auditUnit": "审计单位",
  "certifiedAccountant": "签字注册会计师",
  "createdAt": "2025-01-27T10:00:00Z"
}
```

## 环境变量配置

前端需要配置以下环境变量：

```env
# 开发环境
VITE_API_BASE_URL=http://localhost:3000

# 生产环境
VITE_API_BASE_URL=https://api.your-domain.com
```

## 错误处理

API应该返回标准的HTTP状态码和错误信息：

- `400` - 请求参数错误
- `500` - 服务器内部错误

错误响应格式：
```json
{
  "message": "错误描述信息"
}
```
