// miniprogram/pages/poster/poster.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    openid: '',
    exist: false,
    activities: [],
    teamName: '',
    coin: 0,
    limit: 5
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
    this.getActivities();
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
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      limit: this.data.limit + 5
    });
    this.getActivities();
    wx.hideLoading({
      success: (res) => {},
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 活动详情页
  goDetail: function(e) {
    var index = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../posterDetail/posterDetail?objData=' + JSON.stringify(this.data.activities[index]),
    })
  },

  // 创建活动
  createActivity: function() {
    wx.navigateTo({
      //跳转到创建活动页面上
      url: '../createAct/createAct',
    })
  },

  getActivities: function() {
    var that = this;
    db.collection('activity')
    .orderBy('time', 'asc')
    .limit(that.data.limit)
    .get({
      success: res => {
        that.setData({
          activities: res.data
        })
      }
    })
  },
})