// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  balance:0,
  balanceEnough:true
});

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  db.collection('customer_inf').where({
    _openid: event.openid
  })
  .get()
  .then(res => {
    balance = res.data[0].balance
  })
  .then(() => {
    // 余额足够则扣款，并更新数据库
    if (balance >= event.total) {
      balanceEnough = true;
      balance = balance - event.total;
      db.collection('customer_inf')
      .where({
        _openid: event.openid
      })
      .update({
        data: {
          balance: balance
        }
      })
    } else {
       balanceEnough = false
    }
  })

  return {
    balance,
    balanceEnough
  }
}