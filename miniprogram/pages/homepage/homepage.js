// miniprogram/pages/homepage/homepage.js


const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    swiperImgNo: 1,
    imgSwiperUrl: '',
    fruitInfo: [],
    typeCat: [{
        id: 0,
        name: "精美礼品"
      },
      {
        id: 1,
        name: "新品上架"
      },
      {
        id: 2,
        name: "小易推荐"
      },
    ],
    activeTypeId: 0,
    isShow: true,
    openid: '',
    address: {
      name: '',
      phone: '',
      group: '',
      balance: 0
    }
  },

  // 获取用户openid
  getOpenidAndUserInfo() {
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: res => {
        that.setData({
          openid: res.data
        })
        wx.cloud.callFunction({
          name: 'userInfo',
          data: {
            openid: res.data
          },
          success: res => {
            if (res.result.data[0]) {
              var tmp = {
                name: res.result.data[0].name,
                group: res.result.data[0].group,
                phone: res.result.data[0].phone,
                balance: res.result.data[0].balance
              }
            } else {
              var tmp = {
                name: '',
                group: '',
                phone: '',
                balance: 0
            }
            console.log(tmp)
            app.addRowToSet('customer_inf', tmp, e=>{})
          }
            that.setData({
              address: tmp
            })
        }
      })
    }
  })
  },

  // ------------加入购物车------------
  addCartByHome: function (e) {
    // console.log(e.currentTarget.dataset._id)
    var self = this
    let newItem = {}
    app.getInfoWhere('fruit-board', {
        _id: e.currentTarget.dataset._id
      },
      e => {
        // console.log(e.data["0"])
        var newCartItem = e.data["0"]
        newCartItem.num = 1
        app.isNotRepeteToCart(newCartItem)
        wx.showToast({
          title: '已添加至购物车',
        })
      }
    )
  },


  // ------------分类展示切换---------
  typeSwitch: function (e) {
    // console.log(e.currentTarget.id)
    getCurrentPages()["0"].setData({
      activeTypeId: parseInt(e.currentTarget.id)
    })
    switch (e.currentTarget.id) {
      // 全部展示
      case '0':
        app.getInfoByOrder('fruit-board', 'time', 'desc',
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;

        // 新品上架
      case '1':
        db.collection('fruit-board')
          .where({
            // 一个月内上架的商品为新品
            time: db.command.gt(parseInt(app.CurrentTime(true)))
          })
          .orderBy('time', 'desc')
          .get()
          .then(e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          })
        break;
        // 店主推荐
      case '2':
        app.getInfoWhere('fruit-board', {
            recommend: 1
          },
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
    }
  },


  // ---------点击跳转至详情页面-------------
  tapToDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.currentTarget.dataset.fid,
    })
  },


  // ------------生命周期函数------------
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '北大欢迎你',
    })
    that.setData({
      isShow: false
    })
  },

  onReady: function () {
    this.getOpenidAndUserInfo()
  },

  onShow: function () {
    var that = this

    app.getInfoByOrder('fruit-board', 'time', 'desc',
      e => {
        getCurrentPages()["0"].setData({
          fruitInfo: e.data,
          isShow: true
        })
        wx.hideLoading()
      }
    )
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {
    return {
      title: 'AIIT活动中心',
      imageUrl: '../../images/icon/fruit.jpg',
      path: '/pages/homepage/homepage'
    }
  }

})