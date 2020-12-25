const app = getApp()

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    myList: [],
    // nonce_str: ''
  },

  // 生命周期函数
  onReady() {
    const that = this;

    // 32位随机字符串
    // var nonce_str = app.RndNum()


    // 获取总价和openid
    that.setData({
      orders: app.globalData.carts,
      // nonce_str: nonce_str
    })
    this.getTotalPrice();
  },
  // onReady↑

  onShow: function () {
    this.getUserAddress();
  },

    // 获取用户信息
    getUserAddress() {
      var that = this;
      console.log(app.globalData.address.name)
      var hasAddress = false;
      if (app.globalData.address.name) {
        this.hasAddress = true;
    } 
      that.setData({
        hasAddress: this.hasAddress,
        address: app.globalData.address
      }) 
    },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total.toFixed(2)
    })
  },


  // -------------!! 支付！！------------------
  toPay() {
    var that = this;
    if (that.data.hasAddress) {
      var tmpList = [];
      that.data.orders.forEach((val, idx, obj) => {
        tmpList.push([val.name, val.num, val.price])
      })
      wx.cloud.callFunction({
        name: 'actToPay',
        data: {
          tmpList: tmpList,
          openid: app.globalData.openid,
          totalPrice: parseInt(that.data.total)
        }
      })
      .then( res => {
        wx.showToast({
          title: '兑换成功'
        })
        setTimeout( () => {
          wx.switchTab({
            url: '../homepage/homepage',
          })
      }, 1500)
      })
      .catch( err => {
        if ( err.errMsg.includes('余额不足') ) {
          wx.showToast({
            icon: 'none',
            title: '余额不足'
          })
        }
      })
    } else if (!app.globalData.openid) {
      wx.showModal({
        title: 'Oh No',
        content: '请先登陆',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../me/me',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: 'Oh No',
        content: '请填写个人信息~',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../address/address',
            })
          }
        }
      })
    }
  }

})