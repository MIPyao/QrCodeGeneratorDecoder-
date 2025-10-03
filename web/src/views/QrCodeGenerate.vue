<template>
  <div class="qrcode-generator">
    <el-card class="header-card" shadow="never">
      <div class="header">
        <h1>审计报告二维码生成器</h1>
        <p class="description">输入报告信息，提交到后端获取ID，生成包含报告ID的二维码</p>
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
              <h3>报告信息</h3>
              <el-form-item label="被审计单位">
                <el-input
                    v-model="formData.auditedUnit"
                    placeholder="请输入被审计单位"
                    clearable
                />
              </el-form-item>
              <el-form-item label="项目名称">
                <el-input
                    v-model="formData.projectName"
                    placeholder="请输入项目名称"
                    clearable
                />
              </el-form-item>
              <el-form-item label="报告文号">
                <el-input
                    v-model="formData.reportNumber"
                    placeholder="请输入报告文号"
                    clearable
                />
              </el-form-item>
              <el-form-item label="审计单位">
                <el-input
                    v-model="formData.auditUnit"
                    placeholder="请输入审计单位"
                    clearable
                />
              </el-form-item>
              <el-form-item label="签字注册会计师">
                <el-input
                    v-model="formData.certifiedAccountant"
                    placeholder="请输入签字注册会计师"
                    clearable
                />
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="8">
                  <el-button
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
              <el-collapse-item title="使用说明" name="example">
                <el-card class="example-card" shadow="never">
                  <div class="example-content">
                    <p><strong>填写说明：</strong></p>
                    <ul>
                      <li>被审计单位：必填</li>
                      <li>项目名称：必填</li>
                      <li>报告文号：选填</li>
                      <li>审计单位：选填</li>
                      <li>签字注册会计师：选填</li>
                    </ul>
                    <p><strong>操作流程：</strong></p>
                    <ol>
                      <li>填写报告信息</li>
                      <li>点击"生成二维码"按钮</li>
                      <li>系统将数据提交到后端并获取ID</li>
                      <li>生成包含ID的二维码</li>
                    </ol>
                  </div>
                </el-card>
              </el-collapse-item>

              <el-collapse-item title="技术说明" name="encoding">
                <el-alert
                    title="技术说明"
                    type="info"
                    :closable="false"
                    show-icon
                >
                  <p>数据将通过API提交到后端服务器，后端返回唯一ID</p>
                  <p>生成的URL格式: <code>{{ baseUrl }}/report?id=REPORT_ID</code></p>
                  <p>二维码包含的是报告ID，而不是原始数据</p>
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
                  复制
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
import QRCode from 'qrcode'
import { submitReport } from '@/api/report'

const formData = ref({
  auditedUnit: '',
  projectName: '',
  reportNumber: '',
  auditUnit: '',
  certifiedAccountant: ''
})

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


const generateQRCode = async () => {
  // 验证表单数据
  if (!formData.value.auditedUnit.trim() || !formData.value.projectName.trim()) {
    ElMessage.warning('请至少填写被审计单位和项目名称')
    return
  }

  try {
    isGenerating.value = true

    // 调用后端API提交报告数据
    const response = await submitReport({
      auditedUnit: formData.value.auditedUnit,
      projectName: formData.value.projectName,
      reportNumber: formData.value.reportNumber,
      auditUnit: formData.value.auditUnit,
      certifiedAccountant: formData.value.certifiedAccountant
    })

    // 从响应中获取ID
    const reportId = response.id
    generatedUrl.value = `${baseUrl.value}/report?id=${reportId}`

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
  formData.value = {
    auditedUnit: '',
    projectName: '',
    reportNumber: '',
    auditUnit: '',
    certifiedAccountant: ''
  }
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
  // 可以在这里设置默认值或加载数据
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

.example-content {
  font-family: 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #606266;
}

.example-content ul, .example-content ol {
  margin: 10px 0;
  padding-left: 20px;
}

.example-content li {
  margin: 5px 0;
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
  right: 20px;
  z-index: 1;
  background: #eee;
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
