// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [
      'cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/fruitSwiper/swiper_1.jpg',
      'cloud://pig-1-2gykytc24ac43904.7069-pig-1-2gykytc24ac43904-1304113058/fruitSwiper/swiper_2.png'
      ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPoster: function(e) {
      wx.navigateTo({
        url: '../posterDetail/posterDetail?_id=' + e.currentTarget.dataset.fid, 
      })
    }
  }
})
