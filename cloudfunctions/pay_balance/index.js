// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  balance = 0;
  balanceEnough = true;
  const db = cloud.database();
  var p  = new Promise((resolve, reject) => {
    db.collection('customer_inf').where({
      _openid: event.openid
    })
    .get()
    .then(res => {
      console.log(res)
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
         reject(balanceEnough)
      }
      resolve({balance, balanceEnough})
    })
  })
  tmp = db.collection('customer_inf').where({
    _openid: event.openid
  })
  .get({
    success: res => {
      console.log(res)
      balance = res.data[0].balance
      return balance.data
    }
  })

  console.log(tmp)
  return {
    balance,
    balanceEnough
  }
}