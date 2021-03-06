// page/component/new-pages/user/user.js
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    orders: [],
    actList: [],
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    userInfo: {},
    hasUserInfo: false,
    goodsLimit: 3,
    activitiesLimit: 3,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 管理员openID
    adiminArr: [
      'ofDnu4s_Aio-eWGe7tYBKhPUhhec',
      ''
    ]
  },
  onLoad() {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },

  onShow() {
    var self = this;
    // console.log(self.data)
    /**
     * 获取本地缓存 地址信息
     */
    this.getUserAddress();
    this.getOpenidAndOrders();
    this.getActivities();
  },

  // 获取用户信息
  getUserAddress() {
    var that = this;
    var hasAddress = false;
    if (app.globalData.address.name) {
      hasAddress = true;
  } 
    that.setData({
      hasAddress: hasAddress,
      address: app.globalData.address
    }) 
  },


  getUserInfo: function(e) {
    var that = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    app.getUserOpenid();
    setTimeout(function () {
      that.getOpenidAndOrders();
    }, 750);
    
  },

  onPullDownRefresh: function () {
    this.getOpenidAndOrders();
    this.getUserAddress();
    this.getActivities();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500);
  },

  // 获取用户openid。 订单信息、活动信息
  getOpenidAndOrders() {
    var that = this;
    var openid = wx.getStorage({
      key: 'openid',
      success: res => {
        that.setData({
          openid: res.data,
          isAdmin: that.data.adiminArr.indexOf(res.data)
        })
        db.collection('order_master')
        .where({
          _openid: that.data.openid
        }).limit(that.data.goodsLimit)
        .get()
        .then(
          e=>{
            var tmp = []
            var len = e.data.length
            for (var i = 0; i < len;i++){
              tmp.push(e.data.pop())
            }
            that.setData({
              orders: tmp
            })
          })
      }
    })
  },

  // 获取活动列表
  getActivities: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getActivities',
      data: {
        limit: that.data.activitiesLimit,
        openid: that.data.openid
      },
    })
    .then( res => {
      that.setData({
        actList: res.result.res.data
      })
    })
  },

  

  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function () {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  },

  goToActManage: function () {
    wx.navigateTo({
      url: '/pages/actManage/actManage',
    })
  },

  goToDetail: function(e) {
    console.log(e)
    var index = parseInt(e.currentTarget.id)
    wx.navigateTo({
      url: '../posterDetail/posterDetail?objData=' + JSON.stringify(this.data.actList[index]),
    })
  },

  addActLimit: function () {
    this.setData({
      activitiesLimit: this.data.activitiesLimit + 3
    })
    this.getActivities();
  },

  addGoodsLimit: function () {
    this.setData({
      goodsLimit: this.data.goodsLimit + 3
    })
    this.getOpenidAndOrders();
  },

})