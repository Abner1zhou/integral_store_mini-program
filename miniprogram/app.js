//app.js
App({
  onLaunch: function () {
    const scene_info = wx.getLaunchOptionsSync();
    if (!wx.cloud) {
      console.error('请使用 2.12.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'pig-1-2gykytc24ac43904',
        traceUser: true,
      })
    }

    this.globalData = {
      userInfo: null,
      cloudRoot: "7069-pig-1-2gykytc24ac43904-1304113058/",
      carts: [], //购物车
      tmpNum: 0,
      tempFilePaths: "",
      admin: ["周世聪"],
      openid: null,
      appid: 'wx0dd8c5c9ebe90a78',
      address: {
        name: '',
        phone: '',
        group: '',
        balance: 0
      },
      userInfo: null
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.getUserOpenid()

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: res => {
        console.log(res);
        console.log("没有登陆信息")
      }
    })
    
    // 二维码扫描……签到

    
    // console.log(scene_info)
    // if (scene_info.path == "pages/actCheckin/actCheckin") {
    //   wx.navigateTo({
    //     url: '/pages/actCheckin/actCheckin?objData=' + JSON.stringify(scene_info.query.scene),
    //   })
    // }
    



  },

  // 获取个人Openid 并获取个人信息
  getUserOpenid() {
    wx.cloud.callFunction({
      name: 'add',
      complete: res => {
        var openid = res.result.openid;
        this.globalData.openid = openid;
        wx.setStorage({
          data: this.globalData.openid,
          key: 'openid',
        })
        this.getUserAddress()
      }
    });
  },

  getUserAddress() {
    var that = this;
    wx.cloud.callFunction({
      name: 'userInfo',
      data: {
        openid: that.globalData.openid
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
          that.addRowToSet('customer_inf', tmp, e => {})
        }
        that.globalData.address = tmp
      }
    })
  },

  // --------------常用----------------

  // 判断购物车中是否有重复后添加购物车
  isNotRepeteToCart: function (newCartItem) {
    var self = this
    var isRepete = function () {
      var p = new Promise((resolve, reject) => {
        var flag = false
        self.globalData.carts.forEach((v) => {
          if (v._id === newCartItem._id) {
            flag = true
          }
        })
        resolve(flag)
      })
      return p
    }
    isRepete().then((flag) => {
      if (flag) {
        wx.showToast({
          title: '已经添加过了~',
        })
      } else {
        this.globalData.carts.push(newCartItem)
      }
    })
  },

  // 随机数生成函数
  RndNum: function () {
    return Math.random().toString(32).substr(2, 15);
  },

  // 获取时间戳
  CurrentTime: function (lastMonth = false) {
    var now = new Date();
    var year = now.getFullYear(); //年
    if (lastMonth) {
      var month = now.getMonth(); //月
    } else {
      var month = now.getMonth() + 1; //月
    }

    var day = now.getDate(); //日
    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒

    var clock = year.toString();
    if (month < 10) clock += "0";
    clock += month;
    if (day < 10) clock += "0";
    clock += day;
    if (hh < 10) clock += "0";
    clock += hh;
    if (mm < 10) clock += '0';
    clock += mm;
    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
  },

  CurrentTime_show: function () {
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒

    var clock = year.toString() + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day + " ";
    if (hh < 10) clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;

    return (clock);
  },


  // 获得n分钟前的时间戳
  beforeNowtimeByMin: function (beforetime) {
    var setFormat = function (x) {
      if (x < 10) x = "0" + x;
      return x;
    }
    var date = new Date();
    date.setMinutes(date.getMinutes() - beforetime);
    var now = "";
    now = date.getFullYear().toString();
    now = now + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    now = now + setFormat(date.getDate());
    now = now + setFormat(date.getHours());
    now = now + setFormat(date.getMinutes());
    now = now + setFormat(date.getSeconds());
    return now;
  },

  // --------------数据库操作----------------

  // 向集合内新增记录(集合名，要添加的数据对象，回调函数)
  addRowToSet: function (setName, infoObject, callback) {
    const db = wx.cloud.database()
    db.collection(setName).add({
      data: infoObject,
      success: callback,
      fail: console.error
    })
  },

  // 从集合中取出数据
  getInfoFromSet: function (setName, selectConditionSet, callBack) {
    const db = wx.cloud.database()
    db.collection(setName).where(selectConditionSet).get({
      success: callBack
    })
  },

  // 从集合中筛选数据
  getInfoWhere: function (setName, ruleObj, callback) {
    const db = wx.cloud.database()
    db.collection(setName).where(ruleObj)
      .get({
        success: callback,
        fail: console.error
      })
  },

  // 排序后取出数据
  getInfoByOrder: function (setName, ruleItem, orderFuc, callback) {
    const db = wx.cloud.database()
    db.collection(setName)
      .orderBy(ruleItem, orderFuc)
      .get()
      .then(callback)
      .catch(console.error)
  },

  // 删除集合中的数据
  deleteInfoFromSet: function (setName, fruitId) {
    const db = wx.cloud.database()
    db.collection(setName).doc(fruitId).remove({
      success: e => {
        wx.showToast({
          title: '删除成功',
        })
        console.log(e)
      },
      fail: console.error
    })
  },

  // 更新数据
  updateInfo: function (setName, _id, updateInfoObj, callback) {
    const db = wx.cloud.database()
    db.collection(setName).doc(_id).update({
      data: updateInfoObj,
      success: callback,
      fail: console.error
    })
  },

  // 选择本地图片上传至云端
  selectImgUpToC: function (imgName, tmpUrlCallback) {
    const self = this
    // 获取图片临时地址
    new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          resolve(res.tempFilePaths["0"])
        }
      })
    }).then(e => self.upToClound("imgSwiper", imgName, e, tmpUrlCallback))
  },

  // 上传图片到云端（云端文件夹，云端文件名，文件临时地址）
  upToClound: (imgFolder, imgName, myFilePath, fileIDCallback) => {
    wx.cloud.uploadFile({
      cloudPath: imgFolder + "/" + imgName, // 上传至云端的路径
      filePath: myFilePath, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        wx.showToast({
          title: '图片已上传',
        })
        fileIDCallback(res.fileID)

      },
      fail: console.error
    })
  },

  // 获取云端文件tmpUrl
  getTmpUrl: (imgFolder, imgName, currentData) => {
    wx.cloud.getTempFileURL({
      fileList: [getApp().globalData.cloudRoot + imgFolder + "/" + imgName],
      success: res => {
        // console.log(res.fileList["0"].tempFileURL)
        getCurrentPages().setData({
          currentData: res.fileList["0"].tempFileURL
        })
      },
      fail: console.error
    })
  }
})