// miniprogram/pages/actCheckin/actCheckin.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activityID = options.scene
    db.collection('activity')
      .doc(activityID)
      .get()
      .then(res => {
        console.log(res.data)
        this.setData({
          activity: res.data
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  checkin: function () {
    wx.cloud.callFunction({
        name: 'actCheckin',
        data: {
          id: this.data.activity._id,
          openid: app.globalData.openid,
          coins: this.data.activity.activity.coins
        }
      })
      .then(() => {
        wx.showToast({
          title: '签到成功~',
        })
      })
      .catch(err => {
        if (err.errMsg.includes("已报名")) {
          wx.showToast({
            icon: 'none',
            title: '您已经签到啦~',
          })
        }
      })
  }
})