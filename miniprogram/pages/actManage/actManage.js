// miniprogram/pages/actManage/actManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewList: [],
    cardNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getReviewActivitives()
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

  // 获取待审核活动
  getReviewActivitives: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getActivities',
      data: {
        limit: 99999,
        review: true
      }
    }).then( res => {
      that.setData({
        reviewList: res.result.res.data
      })
    })
  },

  // 审核通过
  reviewPass: function(e) {
    console.log(e.target.id)
    wx.cloud.callFunction({
      name: "updateActivities",
      data: {
        id: e.target.id,
        review: 1
      }
    })
  }
})