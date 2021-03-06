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
    joined: false,
    isCreator: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date(JSON.parse(options.objData).time).toLocaleDateString()
    this.setData({
      activity: JSON.parse(options.objData),
      date: date
    })
    if (this.data.activity._openid == app.globalData.openid) {
      this.setData({
        isCreator: true
      })
    }
    this.getMembers();
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
  join: function () {
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
                if (res.data.members_openid.length == res.data.activity.peoples) {
                  wx.showToast({
                    title: '该活动人数已满',
                    icon: 'none'
                  })
                } else if (res.data.members_openid.includes(app.globalData.openid)) {
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
                            members_openid: db.command.push(app.globalData.openid)
                          }
                        })
                        .then(() => {
                          db.collection('activity')
                            .doc(that.data.activity._id)
                            .get()
                            .then(res => {
                              that.setData({
                                activity: res.data
                              })
                              that.getMembers();
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
  quitActivity: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要退出该活动吗？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updateActivities',
            data: {
              id: that.data.activity._id,
              quit: true,
              openid: app.globalData.openid
            }
          })
          .then( res => {
            that.setData({
              activity: res.result,
              joined: false
            })
            that.getMembers();
          })
        }
        
      }
    })

  },

  // 获取已报名人员名单
  getMembers: function () {
    var that = this;

    wx.cloud.callFunction({
      name: 'getUserName',
      data: {
        openid: that.data.activity.members_openid
      },
      success: res => {
        // console.log(res.result)
        that.setData({
          members: res.result.nameList
        })
        if (that.data.activity.members_openid.includes(app.globalData.openid)) {
          that.setData({
            joined: true
          })
        }
      }
    })
  },

  // 获取签到二维码
  getCheckinQRCode: function() {
    wx.cloud.callFunction({
      name: 'actGetQRCode',
      data: {
        activityInfo: this.data.activity,
      }
    })
    .then( res => {
      wx.previewImage({
        urls: ['cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/' + res.result],
      })
    })
  },


  // 没有使用   留言
  sendMsg: function (e) {
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