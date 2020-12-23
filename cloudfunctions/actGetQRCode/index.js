// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const title = event.activityInfo.activity.title;
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
        scene: event.activityInfo._id,
        page: 'pages/actCheckin/actCheckin',
      })

    cloud.uploadFile({
        cloudPath: 'activity_images/' + title + 'QRCode' + '.jpg',
        fileContent: result.buffer
    })
    // return result
  } catch (err) {
    return err
  }
}