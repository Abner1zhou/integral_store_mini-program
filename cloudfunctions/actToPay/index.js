// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let res = db.collection('customer_inf')
    .where({
      _openid: event.openid,
      balance: _.gte(event.totalPrice)
    })
    .update({
      data: {
        // 扣款
        balance: _.inc(-event.totalPrice)
      }
    })
    .then(res => { 
      if (res.stats.updated == 1) {
        // 生成订单
        let order_tmp = {
          _openid: event.openid,
          goodList: event.tmpList,
          orderTime: CurrentTime_show(),
          orderSuccess: true,
          finished: false
        }
        db.collection('order_master')
          .add({
            data: order_tmp
          })

      } else if (res.stats.updated == 0) {
        throw Error()
      }
    })
    .then( () => {
      return 200
    })
    .catch( err => {
      throw Error("余额不足")
    })
  
  return res
}

CurrentTime_show = function () {
  var now = new Date();
  var year = now.getFullYear(); //年
  var month = now.getMonth() + 1; //月
  var day = now.getDate(); //日
  var hh = now.getHours(); //时
  var mm = now.getMinutes(); //分
  var ss = now.getSeconds(); //秒

  var clock = year.toString() + "-";
  if (month < 10) clock += "0";
  clock += month + "-";
  if (day < 10) clock += "0";
  clock += day + " ";
  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (mm < 10) clock += '0';
  clock += mm + ":";
  if (ss < 10) clock += '0';
  clock += ss;

  return (clock);
}