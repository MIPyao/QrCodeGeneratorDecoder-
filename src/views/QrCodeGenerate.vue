<template>
  <div class="qrcode-generator">
    <el-card class="header-card" shadow="never">
      <div class="header">
        <h1>审计报告二维码生成器</h1>
        <p class="description">输入报告信息，生成包含URL编码参数的二维码</p>
      </div>
    </el-card>

    <div class="content">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="12">
          <el-card class="input-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>报告信息输入</span>
              </div>
            </template>

            <el-form @submit.prevent="generateQRCode">
              <h3>报告信息（每行一个字段，格式：字段名:值）</h3>
              <el-form-item>
                <el-input
                    v-model="inputText"
                    type="textarea"
                    placeholder="请输入报告信息"
                    :rows="8"
                    resize="vertical"
                    class="input-textarea"
                />
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="8">
                  <el-button
                      block
                      type="primary"
                      @click="generateQRCode"
                      :loading="isGenerating"
                      size="large"
                      class="action-btn"
                  >
                    <el-icon><Aim /></el-icon>
                    生成二维码
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button
                      block
                      type="success"
                      @click="saveQRCode"
                      :disabled="!qrcodeGenerated"
                      size="large"
                      class="action-btn"
                  >
                    <el-icon><Download /></el-icon>
                    保存二维码
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button
                      block
                      type="danger"
                      @click="clearAll"
                      size="large"
                      class="action-btn"
                  >
                    <el-icon><Delete /></el-icon>
                    清空
                  </el-button>
                </el-col>
              </el-row>
            </el-form>

            <el-divider />

            <el-collapse v-model="activeCollapse">
              <el-collapse-item title="示例格式" name="example">
                <el-card class="example-card" shadow="never">
                  <pre class="example-pre">{{ exampleText }}</pre>
                </el-card>
              </el-collapse-item>

              <el-collapse-item title="编码信息" name="encoding">
                <el-alert
                    title="编码说明"
                    type="info"
                    :closable="false"
                    show-icon
                >
                  <p>所有文本内容将进行URL编码，换行符会被正确编码为 <el-tag size="small">%0A</el-tag>。</p>
                  <p>生成的URL格式: <code>{{ baseUrl }}/report?data=URL_ENCODED_TEXT</code></p>
                </el-alert>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="12">
          <el-card class="preview-section" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><View /></el-icon>
                <span>二维码预览</span>
              </div>
            </template>

            <div class="qrcode-container">
              <canvas
                  ref="qrcodeCanvas"
                  v-show="qrcodeGenerated"
                  class="qrcode-canvas"
              ></canvas>
              <el-empty
                  v-show="!qrcodeGenerated"
                  description="二维码将在此处显示"
                  :image-size="120"
              />
            </div>

            <el-card v-if="generatedUrl" class="url-display" shadow="never">
              <template #header>
                <strong>生成的URL:</strong>
              </template>
              <div class="url-content">
                <el-input
                    v-model="generatedUrl"
                    type="textarea"
                    :rows="3"
                    readonly
                    resize="none"
                />
                <el-button
                    type="text"
                    @click="copyUrl"
                    class="copy-btn"
                    size="small"
                >
                  <el-icon><CopyDocument /></el-icon>
                  复制URL
                </el-button>
              </div>
            </el-card>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'
import {
  Document,
  Aim,
  Download,
  Delete,
  View,
  CopyDocument
} from '@element-plus/icons-vue'

const inputText = ref('')
const generatedUrl = ref('')
const qrcodeGenerated = ref(false)
const isGenerating = ref(false)
const activeCollapse = ref(['example'])
const qrcodeCanvas = ref(null)

const baseUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'https://audit.example.com'
})

const exampleText = `被审计单位：宁夏云雾山果品开发有限责任公司
项目名称：2024年度审计报告
报告文号：中财国信审字（2025）第1122号
审计单位：北京中财国信会计师事务所有限公司
签字注册会计师：张永贤 王文彦`

const generateQRCode = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入报告信息')
    return
  }

  try {
    isGenerating.value = true

    const encodedText = encodeURIComponent(inputText.value)
    generatedUrl.value = `${baseUrl.value}/report?data=${encodedText}`

    await nextTick()

    if (!qrcodeCanvas.value) {
      throw new Error('Canvas元素未找到')
    }

    await QRCode.toCanvas(qrcodeCanvas.value, generatedUrl.value, {
      width: 200,
      margin: 1,
      color: {
        dark: '#2c3e50',
        light: '#ffffff'
      }
    })

    qrcodeGenerated.value = true
    ElMessage.success('二维码生成成功！')
  } catch (error) {
    console.error('生成二维码时出错:', error)
    ElMessage.error('生成二维码时出错: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

const saveQRCode = async () => {
  if (!qrcodeGenerated.value) {
    ElMessage.warning('请先生成二维码')
    return
  }

  try {
    const canvas = qrcodeCanvas.value
    const link = document.createElement('a')
    link.download = `审计报告二维码_${new Date().getTime()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    ElMessage.success('二维码保存成功！')
  } catch (error) {
    console.error('保存二维码时出错:', error)
    ElMessage.error('保存二维码时出错: ' + error.message)
  }
}

const clearAll = () => {
  inputText.value = ''
  generatedUrl.value = ''
  qrcodeGenerated.value = false
  ElMessage.info('已清空所有内容')
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(generatedUrl.value)
    ElMessage.success('URL已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

onMounted(() => {
  inputText.value = exampleText
})
</script>

<style lang="less" scoped>
.qrcode-generator {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #409eff, #67c23a);
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

.input-section,
.preview-section {
  height: fit-content;
}

.input-textarea :deep(.el-textarea__inner) {
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
}

.example-card {
  background: #fafafa;
}

.example-pre {
  white-space: pre-wrap;
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  margin: 0;
  color: #606266;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  padding: 20px;
}

.qrcode-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.url-display {
  margin-top: 20px;
}

.url-content {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}

.action-btn {
  width: 100%;
}

@media (max-width: 768px) {
  .qrcode-generator {
    padding: 10px;
  }

  .header h1 {
    font-size: 24px;
  }

  .description {
    font-size: 14px;
  }

  .qrcode-container {
    min-height: 200px;
    padding: 15px;
  }

  .card-header {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-card :deep(.el-card__body) {
    padding: 20px;
  }

  .header h1 {
    font-size: 20px;
  }

  .qrcode-container {
    min-height: 180px;
    padding: 10px;
  }
}

:deep(.el-card) {
  border-radius: 12px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-textarea .el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-collapse-item__header) {
  font-weight: 500;
}

:deep(.el-alert) {
  border-radius: 8px;
}

:deep(.el-alert__content) {
  line-height: 1.6;
}

:deep(.el-empty__description) {
  color: #909399;
}
</style>
