// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init()

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  var nameList = [];
  for ( var index in event.openid) {
    db.collection('customer_inf').where({
      _openid: event.openid[index]
    }).get()
    .then(res => {
          console.log(res)
          nameList.push(res.data[0].name)
        }
    )
  }
  nameList.reverse();
  

  return {
    nameList
  }
}