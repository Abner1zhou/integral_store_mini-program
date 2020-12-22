// miniprogram/pages/actManage/actManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewList: [],
    cardNum: 1,
    limit: 10,
    all: false,
    review: 0
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
    this.getReviewActivitives('Go')
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
  getReviewActivitives: function(e) {
    // console.log(e)
    var that = this;
    if (e == 'Go') {
      // 直接运行
    }else if (e.target.id == "1") {
      that.setData({
        cardNum: 1,
        all: false,
        review: 0
      })
    } else if (e.target.id == "2") {
      that.setData({
        cardNum: 2,
        all: false,
        review: 1
      }) 
    } else if (e.target.id == "3") {
      that.setData({
        cardNum: 3,
        all: true
      }) 
    }
    var that = this;
    wx.cloud.callFunction({
      name: 'getActivities',
      data: {
        limit: that.data.limit,
        all: that.data.all,
        review: that.data.review
      }
    }).then( res => {
      that.setData({
        reviewList: res.result.res.data
      })
    })
  },

  // 审核通过
  reviewPass: function(e) {
    var that = this;
    wx.cloud.callFunction({
      name: "updateActivities",
      data: {
        id: e.target.id,
        review: 1
      }
    }).then(()=>{
      that.getReviewActivitives('Go')
    })
  },

  // 活动打回
  reviewDeny: function(e) {
    var that = this;
    console.log(e.target.id)
    wx.cloud.callFunction({
      name: "updateActivities",
      data: {
        id: e.target.id,
        review: 2
      }
    }).then(()=>{
      that.getReviewActivitives('Go')
    })
  },

  goToDetail: function(e) {
    console.log(e)
    var index = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../posterDetail/posterDetail?objData=' + JSON.stringify(this.data.reviewList[index]),
    })
  },
})