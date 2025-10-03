const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV
});
const db = app.database();

// 云函数入口：根据 _id 查询某条报告详情
exports.main = async (event, context) => {
  try {
    const { id } = event;

    if (!id) {
      return {
        success: false,
        error: '缺少参数：id（报告唯一标识）'
      };
    }

    const result = await db.collection('reports').doc(id).get();

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        error: '未找到对应的报告信息'
      };
    }

    return {
      success: true,
      data: result.data[0]  // 返回查询到的报告详情
    };

  } catch (error) {
    console.error('查询报告失败：', error);
    return {
      success: false,
      error: '服务器错误：' + error.message
    };
  }
};
