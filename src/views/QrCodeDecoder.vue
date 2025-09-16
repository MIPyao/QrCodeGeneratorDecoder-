<template>
  <div class="qrcode-decoder">
    <el-card class="header-card" shadow="never">
      <div class="header">
        <h1>查验结果</h1>
        <p class="description">审计报告信息查验与展示</p>
      </div>
    </el-card>

    <div class="content">
      <el-row :gutter="20" justify="center">
        <el-col :xs="24" :lg="16">
          <el-card class="result-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>报告信息</span>
              </div>
            </template>

            <div v-if="decodedData" class="decoded-content">
              <el-descriptions :column="1" border>
                <el-descriptions-item
                    v-for="(item, index) in parsedData"
                    :key="index"
                    :label="item.label"
                    label-align="right"
                    class-name="description-item"
                >
                  <el-tag v-if="item.label === '审计单位'" type="primary" size="large">
                    {{ item.value }}
                  </el-tag>
                  <el-tag v-else-if="item.label === '被审计单位'" type="success" size="large">
                    {{ item.value }}
                  </el-tag>
                  <el-tag v-else-if="item.label === '报告文号'" type="warning" size="large">
                    {{ item.value }}
                  </el-tag>
                  <span v-else class="item-value">{{ item.value }}</span>
                </el-descriptions-item>
              </el-descriptions>

              <el-divider />

              <el-card class="raw-data-card" shadow="never">
                <template #header>
                  <div class="card-header">
                    <el-icon><View /></el-icon>
                    <span>原始数据</span>
                  </div>
                </template>
                <pre class="raw-data-pre">{{ decodedData }}</pre>
              </el-card>

              <div class="action-buttons">
                <el-button type="primary" @click="printReport" size="large">
                  <el-icon><Printer /></el-icon>
                  打印报告
                </el-button>
                <el-button type="success" @click="copyData" size="large">
                  <el-icon><CopyDocument /></el-icon>
                  复制数据
                </el-button>
              </div>
            </div>

            <el-empty
                v-else-if="!loading && !decodedData"
                description="未找到有效的报告数据"
                :image-size="120"
            >
            </el-empty>

            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="6" animated />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
const decodedData = ref('')
const loading = ref(true)

const getUrlParams = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('data')
  }
  return null
}

const decodeReportData = () => {
  try {
    const encodedData = getUrlParams()
    if (!encodedData) {
      ElMessage.warning('未找到报告数据参数')
      return
    }

    decodedData.value = decodeURIComponent(encodedData)
    ElMessage.success('报告数据加载成功')
  } catch (error) {
    console.error('解码数据时出错:', error)
    ElMessage.error('解码报告数据失败')
  } finally {
    loading.value = false
  }
}

const parsedData = computed(() => {
  if (!decodedData.value) return []

  const lines = decodedData.value.split('\n').filter(line => line.trim())
  return lines.map(line => {
    const colonIndex = line.indexOf('：') !== -1 ? line.indexOf('：') : line.indexOf(':')
    if (colonIndex > 0) {
      return {
        label: line.substring(0, colonIndex).trim(),
        value: line.substring(colonIndex + 1).trim()
      }
    }
    return {
      label: '信息',
      value: line.trim()
    }
  })
})

const printReport = () => {
  window.print()
  ElMessage.success('正在准备打印...')
}

const copyData = async () => {
  try {
    await navigator.clipboard.writeText(decodedData.value)
    ElMessage.success('报告数据已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

onMounted(() => {
  decodeReportData()
})
</script>

<style lang="less" scoped>
.qrcode-decoder {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #67c23a, #409eff);
  border: none;
}

.header-card :deep(.el-card__body) {
  padding: 30px;
}

.header {
  text-align: center;
  color: white;
}

.header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.description {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #409eff;
}

.result-section {
  min-height: 400px;
}

.decoded-content {
  padding: 10px 0;
}

.description-item :deep(.el-descriptions__label) {
  font-weight: 600;
  color: #303133;
  width: 120px;
}

.item-value {
  font-size: 15px;
  color: #606266;
  font-weight: 500;
}

.raw-data-card {
  margin: 20px 0;
  background: #fafafa;
}

.raw-data-pre {
  white-space: pre-wrap;
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  margin: 0;
  color: #606266;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.loading-container {
  padding: 20px;
}

@media (max-width: 768px) {
  .qrcode-decoder {
    padding: 10px;
  }

  .header h1 {
    font-size: 24px;
  }

  .description {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  .description-item :deep(.el-descriptions__label) {
    width: 100px;
  }
}

@media (max-width: 480px) {
  .header-card :deep(.el-card__body) {
    padding: 20px;
  }

  .header h1 {
    font-size: 20px;
  }

  .description-item :deep(.el-descriptions__label) {
    width: 80px;
    font-size: 13px;
  }
}

:deep(.el-card) {
  border-radius: 12px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-descriptions) {
  border-radius: 8px;
}

:deep(.el-descriptions__body) {
  background: #fafbfc;
}

:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
}

@media print {
  .action-buttons {
    display: none;
  }

  .header-card {
    background: white !important;
    color: black !important;
  }

  .header {
    color: black !important;
  }
}
</style>
