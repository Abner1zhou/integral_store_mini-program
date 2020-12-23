// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
// 审批活动
exports.main = async (event, context) => {
  const db = cloud.database();
  if (event.review) {
    db.collection('activity')
      .doc(event.id)
      .update({
        data: {
          review: event.review
        }
      })
  } else if (event.quit) {
    let res = await db.collection('activity')
      .doc(event.id)
      .get()
      .then(res => {
        var index = res.data.members_openid.indexOf(event.openid)
        res.data.members_openid.splice(index, 1)
        var members_openid = res.data.members_openid
        let res_return = res.data
        db.collection('activity')
          .doc(event.id)
          .update({
            data: {
              members_openid: members_openid
            }
          })
        return res_return
      })
    return res
  }
}