const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    name: '',
    phone: '',
    group: '',
    balance: 0,
    openid: ''
  },


  onLoad() {
    var self = this;

    // 查找数据中已有的收货信息
    self.setData({
      openid: app.globalData.openId,
      name: app.globalData.address.name,
      group: app.globalData.address.group,
      phone: app.globalData.address.phone
    })
  },

  // 获取表单数据
  formSubmit(e) {
    const value = e.detail.value;
    const that = this;
    that.setData({
      name: value.name,
      phone: value.phone,
      group: value.group
    })
    app.globalData.address.name = value.name;
    app.globalData.address.group = value.group;
    app.globalData.address.phone = value.phone;
    if (value.name && value.phone.length === 11 && value.group) {
      const {
        name,
        phone,
        group,
        balance
      } = that.data
      const theInfo = {
        name,
        phone,
        group,
        balance
      }

      db.collection('customer_inf')
        .where({
          _openid: that.openid,
        })
        .update({
          data: theInfo,
          success: (res) => {
            wx.showToast({
              title: '更新成功',
              duration: 1500,
              success: e => {
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          }
        })
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查并填写正确信息',
        showCancel: false
      })
    }
  }
})