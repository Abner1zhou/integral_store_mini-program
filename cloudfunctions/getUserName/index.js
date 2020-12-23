// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  var nameList = [];
  for ( var index in event.openid) {
    await db.collection('customer_inf').where({
      _openid: event.openid[index]
    }).get()
    .then(res => {
          nameList.push(res.data[0].name)
        }
    )
  }
  
  console.log(nameList)
  return {
    nameList,
  }
}