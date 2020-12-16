// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  balance = 0;
  db.collection('customer_inf').where({
    _openid: event.openid
  }).get()
  .then(res => {
    this.setData({
      balance: res.data[0].balance
    })
  })
  if (balance >= event.total) {
    // TODO update balance
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}