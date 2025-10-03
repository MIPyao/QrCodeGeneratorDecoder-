const cloud = require('@cloudbase/node-sdk');

// 初始化云开发环境
const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV
});
const db = app.database();

// 云函数入口：接收表单数据，写入 reports 集合
exports.main = async (event, context) => {
  try {
    const { 
      auditedUnit, 
      projectName, 
      reportNumber, 
      auditUnit, 
      certifiedAccountant 
    } = event;

    // 参数校验（简单版，实际可更严谨）
    if (!auditedUnit || !projectName || !reportNumber || !auditUnit || !certifiedAccountant) {
      return {
        success: false,
        error: '缺少必填字段，请检查表单数据'
      };
    }

    // 写入数据库：手动加入创建时间 createdAt
    const result = await db.collection('reports').add({
      data: {
        auditedUnit,
        projectName,
        reportNumber,
        auditUnit,
        certifiedAccountant,
        createdAt: new Date()  // ✅ 手动添加创建时间
      }
    });

    // 返回写入成功信息和记录的 _id
    return {
      success: true,
      id: result._id  // 返回新插入记录的 _id，用于生成二维码或查询
    };

  } catch (error) {
    console.error('提交报告失败：', error);
    return {
      success: false,
      error: '服务器错误：' + error.message
    };
  }
};
