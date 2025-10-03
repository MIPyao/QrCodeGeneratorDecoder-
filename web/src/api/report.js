import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const message = error.response.data?.message || '服务器错误'
      throw new Error(message)
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误')
    }
  }
)

// 提交报告数据
export const submitReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData)
    return response.data
  } catch (error) {
    throw error
  }
}

// 获取报告详情
export const getReport = async (reportId) => {
  try {
    const response = await api.get(`/reports/${reportId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export default api
