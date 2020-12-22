// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const today = new Date();
  var review = 1;  // 0：待审核   1：审核通过   2：拒绝
  var second = _.gt(today.getTime());
  // 筛选所有活动，待审核活动
  if (event.all) {
    review= {}
    second = {}
  } else if (event.review){
    review= 0
  } 
  // 从数据库中获得未过期的活动，并按时间排列
  let res = await db.collection('activity')
                    .where({
                      second: second,
                      review: review
                    })
                    .orderBy('second', 'asc')
                    .limit(event.limit)
                    .get()
  console.log(res)
  return {
    res
  }
}