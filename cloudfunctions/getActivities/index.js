// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command;
  const today = new Date();
  var checkList = {
    review: 1,
    second: _.gt(today.getTime()),
  }
  var sortBy = 'asc'
  // 筛选所有活动，待审核活动
  if (event.openid) {
    checkList = {
      review: 1,
      second: _.gt(today.getTime()),
      members_openid: _.in([event.openid])
    }
  }
  if (event.all) {
    checkList = {
    }
    sortBy = 'desc';
  } else if (event.review == 0) {
    checkList = {
      review: 0,
      second: _.gt(today.getTime()),
    }
  } else if (event.review == 1) {
    checkList = {
      review: 1,
      second: _.gt(today.getTime()),
    }
  }
  // 从数据库中获得未过期的活动，并按时间排列
  let res = await db.collection('activity')
                    .where(checkList)
                    .orderBy('second', sortBy)
                    .limit(event.limit)
                    .get()
  console.log(res)
  return {
    res
  }
}