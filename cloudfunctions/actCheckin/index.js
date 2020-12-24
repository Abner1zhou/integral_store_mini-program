// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  try {
  let res = await db.collection('activity')
    .doc(event.id)
    .get()
    .then( res => {
      if (!res.data.checkinList.includes(event.openid)) {
        db.collection('activity')
          .doc(event.id)
          .update({
              data: {
                checkinList: _.push(event.openid)
              }
            })
          .then( () => {
            db.collection('customer_inf')
              .where({
                _openid: event.openid
              })
              .update({
                data: {
                  balance: _.inc(event.coins)
                }
              })
          })
        return "签到成功"
      } else {
         throw Error()
      } 
    })
    return res
  } catch (e) {
    throw Error("已报名")
  }
    

}