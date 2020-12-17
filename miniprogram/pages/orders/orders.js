const app = getApp()
const md5 = require("../../utils/md5.js")

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: [],
    myList: [],
    openid: '',
    nonce_str: ''
  },

  onReady() {
    const self = this;
    // console.log(app.globalData.carts)

    // 32位随机字符串
    var nonce_str = app.RndNum()

    // // 获取ip地址
    // wx.cloud.callFunction({
    //   name: 'getIP'
    // }).then(e=>{
    //   if(e){
    //     let spbill_create_ip = e.result.body.split("query\"\:\"")[1].split("\"\,\"")[0]
    //     console.log("IP地址为：" + spbill_create_ip)
    //     self.setData({
    //       spbill_create_ip: spbill_create_ip
    //     })
    //   }
    // }).catch(err=>{
    //   if (err) {
    //     wx.showModal({
    //       title: '错误',
    //       content: '请您重新下单~',
    //     })
    //   }
    // })

    // 获取总价和openid
    self.setData({
      orders: app.globalData.carts,
      nonce_str: nonce_str
    })
    wx.getStorage({
      key: 'openid',
      success: res => {
        self.setData({
          openid: res.data
        })
      }
    })
    this.getTotalPrice();
  },
  // onReady↑

  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
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
    console.log(that)
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
        console.log("订单状态已修改：【订单生成】" + e)
      })
    })
    .catch(err => {
      console.log(err)
    })


    // wx.cloud.callFunction({
    //   name: 'pay_balance',
    //   data: {
    //     openid: that.__data__.openid,
    //     total: that.__data__.total
    //   },
    //   complete: (res) => {
    //     console.log(res)
    //     if (res.result.balanceEnough) {
    //       that.data.address.balance = res.result.balance
    //       that.setData({
    //         address: that.data.address
    //       })
    //       // ------生成订单信息-------
    //       let tmp = that.data.address
    //       tmp['orderTime'] = app.CurrentTime_show()
    //       tmp['orderSuccess'] = true
    //       tmp['finished'] = false

    //       const order_master = tmp;
    //       var tmpList = []
    //       that.data.orders.forEach((val, idx, obj) => {
    //         tmpList.push([val.name, val.num, val.price])
    //       })
    //       order_master['fruitList'] = tmpList
    //       order_master['total'] = that.data.total

    //       app.addRowToSet('order_master', order_master, e => {
    //         console.log("订单状态已修改：【订单生成】" + e)
    //       })

    //     } else {
    //       wx.showModal({
    //         title: '余额不足',
    //         content: '请您多参加活动哦~',
    //       })
    //     }
    //   }
    // })
  },


  // 支付后的订单信息
  getListAfterPay: function (that) {
    var p = new Promise((resolve, reject) => {
      let theList = []
      that.data.orders.forEach((val, idx, obj) => {
        var {
          name,
          num,
          price
        } = val
        var tmpInfo = {
          name,
          num,
          price
        }
        theList.push(tmpInfo)
      })
      resolve(theList)
    }).then(res => {
      // console.log(res)
      that.setData({
        myList: res
      })
    })
  },
})