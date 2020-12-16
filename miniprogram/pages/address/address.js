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
    wx.getStorage({
      key: 'openid',
      success: (res) => {
        self.setData({
          openid: this.openid
        })
      }
    })
    db.collection('customer_inf')
    .where({
      _openid: this.openid,
    })
    .get({
      success: (res) => {
        console.log(res)
        this.setData({
          name: res.data[0].name,
          group: res.data[0].group,
          phone: res.data[0].phone
        })
      }
    })
  },

  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openid);
        var openid = res.result.openid;
        that.setData({
          openid: openid
        })
      }
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
    if (value.name && value.phone.length === 11 && value.group) {
      const { name, phone, group, balance } = that.data
      const theInfo = { name, phone, group, balance }

      db.collection('customer_inf')
      .where({
        _openid:that.openid,
      })
      .update({
        data: theInfo,
        success: (res) => {
          console.log(res)
          // 如果有记录则更新，无则新增一条记录
          if (res.stats.updated==0) {
            app.addRowToSet('customer_inf', theInfo, e => {
              console.log(e)
              wx.showToast({
                title: '添加成功',
              })
            })
          } else {
            wx.showToast({
              title: '更新成功',
            })
          }
      },
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