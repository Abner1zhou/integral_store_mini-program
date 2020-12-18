// page/component/new-pages/user/user.js
const app = getApp();

Page({
  data: {
    orders: [],
    hasAddress: false,
    address: {},
    isAdmin: -1,
    openid: '',
    // 管理员openID
    adiminArr: [
      'ofDnu4s_Aio-eWGe7tYBKhPUhhec',
      ''
    ]
  },
  onLoad() {
    var that = this;
    that.getOpenidAndOrders();
  },

  onShow() {
    var self = this;
    // console.log(self.data)
    /**
     * 获取本地缓存 地址信息
     */
    this.getUserAddress();
  },

  // 获取用户信息
  getUserAddress() {
    wx.getStorage({
      key: 'address',
      success: res => {
        this.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },

  onPullDownRefresh: function () {
    this.getOpenidAndOrders();
    this.getUserAddress();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500);
  },

  // 获取用户openid
  getOpenidAndOrders() {
    var that = this;
    var openid = wx.getStorage({
      key: 'openid',
      success: res => {
        that.setData({
          openid: res.data,
          isAdmin: that.data.adiminArr.indexOf(res.data)
        })
        app.getInfoWhere('order_master',{
          _openid: openid
        },e=>{
          console.log(e.data)
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

  

  goToBgInfo: function() {
    wx.navigateTo({
      url: '/pages/bgInfo/bgInfo',
    })
  },

  goToBgManage: function () {
    wx.navigateTo({
      url: '/pages/bgManage/bgManage',
    })
  }

})