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
    coin: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   activities: [
    //     {
    //       act_id: 0,
    //       peoples: 10,
    //       date: "2020-12-21",
    //       clock: "12:30",
    //       title: "长标题测试,长标题测试,长标题测试,长标题测试",
    //       introduction: "测试ing.....测试ing.....测试ing.....测试ing.....测试ing.....测试ing.....",
    //       coin: 100,
    //       Expired: true,
    //       creatorUrl: "cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/fruitSwiper/swiper_1.jpg"
    //     },
    //     {
    //       act_id: 1,
    //       peoples: 10,
    //       date: "2020-12-24",
    //       clock: "12:30",
    //       title: "追“光”者",
    //       introduction: "光盘行动",
    //       coin: 10,
    //       creator: "curry",
    //       Expired: false,
    //       creatorUrl: "cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/imgSwiper/学习礼包0.8853592971035031",
    //       file_path: ["cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/imgSwiper/微信图片_20201221113721.jpg"],
    //     }
    //   ]
    // })
    this.getActivities()
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
    db.collection('activity').where({}).get({
      success: res => {
        console.log(res.data[0].activity)
        that.setData({
          activities: [res.data[2].activity]
          
        })
      }
    })
  },
})