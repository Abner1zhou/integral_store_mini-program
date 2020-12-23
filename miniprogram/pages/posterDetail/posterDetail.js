// miniprogram/pages/actDetail/actDetail.js
/**
 * 为了随时能加入多个活动，所以暂时还没有管一个人只能加入一个活动一次，因为还要调试。
 */
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    joined: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date(JSON.parse(options.objData).time).toLocaleDateString()
    this.setData({
      activity: JSON.parse(options.objData),
      date: date
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  join: function() {
    var that = this
    var _ = db.command
    if (app.globalData.openid == undefined) {
      wx.showModal({
        title: '请先登陆',
        cancelColor: 'cancelColor',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../me/me',
            })
          }
        }
      })
    } else if (app.globalData.address.name == '') {
      wx.showModal({
        title: '请先完善个人信息',
        cancelColor: 'cancelColor',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../address/address',
            })
          }
        }
      })
    } else {
    wx.showModal({
      title: '提示',
      content: '你确定要加入该活动吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('activity').doc(that.data.activity._id)
          .get()
          .then(res => {
            if (res.data.members.length == res.data.activity.peoples) {
              wx.showToast({
                title: '该活动人数已满',
                icon: 'none'
              })
            } else if (res.data.members.includes(app.globalData.address.name) || res.data.members_openid.includes(app.globalData.openid)) {
              wx.showToast({
                title: '您已经加入了该活动',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '成功加入',
              })
              db.collection('activity').doc(that.data.activity._id)
              .get()
              .then(res => {
                db.collection('activity')
                .doc(that.data.activity._id)
                .update({
                  data: {
                    members: db.command.push(app.globalData.address.name),
                    members_openid: db.command.push(app.globalData.openid)
                  }
                })
                .then( () => {
                  db.collection('activity')
                  .doc(that.data.activity._id)
                  .get()
                  .then( res => {
                    that.setData({
                      activity: res.data
                    })
                  })
                })
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  },

  // 退出活动
  quitActivity: function(e) {

  },

  // 获取已报名人员名单
  getMembers: function(e) {
    var that = this;
    db.collection('activity').doc(that.data.activity._id)
          .get()
          .then( res => {
            that.setData({
              members_openid: res.data.members_openid
            })
          })
  },


  // 没有使用   留言
  sendMsg: function(e) {
    wx.showToast({
      title: '留言成功！',
    })
    var that = this
    let con = [e.detail.value, that.data.activity.creator, app.globalData.userInfo.nickName, that.data.activity.time]
    let bool = that.data.activity.comments == undefined ? '0' : Object.keys(that.data.activity.comments).length
    wx.cloud.callFunction({
      name: 'where_update',
      data: {
        collection: 'activity',
        key: 'time',
        value: that.data.activity.time,
        add_key: 'comments',
        add_value: {
          [app.globalData.userInfo.nickName + bool]: con
        }
      },
      success: res => {
        var pages = getCurrentPages()
        var now = pages[pages.length - 1]
        var pre = pages[pages.length - 2]
        db.collection('activity').where({
          time: that.data.activity.time
        }).get().then(res => {
          now.setData({
            activity: res.data[0]
          })
        })
        wx.cloud.callFunction({
          name: 'where_update',
          data: {
            collection: 'users',
            key: '_openid',
            value: app.globalData.openid,
            add_key: 'commented',
            add_value: that.data.activity.time,
            method: 'push'
          }
        })
        console.log(res)
        pre.onLoad()
      },
      fail: err => {
        console.log(err)
      },
      complete: res => {
        console.log(res)
      }
    })
  }
})