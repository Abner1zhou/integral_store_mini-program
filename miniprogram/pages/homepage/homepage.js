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
        name: "美味鲜果"
      },
      {
        id: 1,
        name: "新鲜上架"
      },
      {
        id: 2,
        name: "小易推荐"
      },
    ],
    activeTypeId: 0,
    isShow: true,
    openid: '',
    offLine: null, //是否维护
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
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openid);
        var openid = res.result.openid;
        that.setData({
          openid: openid
        })
        wx.setStorage({
          data: openid,
          key: 'openid',
        })
        // 从数据库获取用户信息
        db.collection('customer_inf')
          .where({
            _openid: openid,
          })
          .get({
            success: (res) => {
              console.log(res);
              var {  _id, _openid, balance, group, name, phone } = res.data[0];
              var tmp = {
                name,
                group,
                phone,
                balance
              };
              this.setData({
                address: tmp
              })
              wx.setStorage({
                data: tmp,
                key: 'address'
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
        // 今日特惠
      case '1':
        app.getInfoWhere('fruit-board', {
            myClass: '1'
          },
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
        // 销量排行
      case '2':
        app.getInfoByOrder('fruit-board', 'time', 'desc',
          e => {
            getCurrentPages()["0"].setData({
              fruitInfo: e.data
            })
          }
        )
        break;
        // 店主推荐
      case '3':
        app.getInfoWhere('fruit-board', {
            recommend: '1'
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
      title: '生活要领鲜',
    })
    that.setData({
      isShow: false
    })
    // 获取openId
    this.getOpenidAndUserInfo();
  },

  onReady: function () {
    // console.log(getCurrentPages()["0"].data)
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
    // console.log(app.globalData.offLine)
    // 是否下线
    app.getInfoWhere('setting', {
        "option": "offLine"
      },
      e => {
        that.setData({
          offLine: e.data["0"].offLine
        })
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