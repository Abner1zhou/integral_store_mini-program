const app = getApp()

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    myList: [],
    openid: '',
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
    that.setData({
      openid: app.globalData.openId
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
      const db = wx.cloud.database();
      var balance = 0;
      db.collection('customer_inf').where({
          _openid: that.data.openid
        })
        .get()
        .then(res => {
          console.log(res)
          balance = res.data[0].balance
        })
        .then(() => {
          // 余额足够则扣款，并更新数据库
          if (balance >= that.data.total) {
            balance = balance - that.data.total;
            db.collection('customer_inf')
              .where({
                _openid: that.data.openid
              })
              .update({
                data: {
                  balance: balance
                }
              })
            return balance
          } else {
            wx.showModal({
              title: '余额不足',
              content: '请您多参加活动哦~',
            })
            throw Error("余额不足")
          }
        })
        .then(res => {
          that.data.address.balance = res
          that.setData({
            address: that.data.address
          })
          // ------生成订单信息-------
          let tmp = that.data.address
          tmp['orderTime'] = app.CurrentTime_show()
          tmp['orderSuccess'] = true
          tmp['finished'] = false

          const order_master = tmp;
          var tmpList = []
          that.data.orders.forEach((val, idx, obj) => {
            tmpList.push([val.name, val.num, val.price])
          })
          order_master['fruitList'] = tmpList
          order_master['total'] = that.data.total

          app.addRowToSet('order_master', order_master, e => {
            console.log("订单状态已修改：【订单生成】" + e);
            wx.showToast({
              title: '支付成功',
              duration: 2000,
            });
          })
          wx.setStorage({
            data: that.data.address,
            key: 'address',
          })
          setTimeout(wx.switchTab({
            url: '../me/me',
          }), 2000)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      wx.showModal({
        title: 'Oh No',
        content: '请填写个人信息~',
      })
    }
  }

})