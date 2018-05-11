//university_select_back.js
Page({
  data: {
    fileNameList: [],
    length: ''
  },

  // 搜索页面跳回
  onLoad: function (options) {
    var that = this

    wx.request({
      url: 'https://printgo.xyz/getShareFile',
      //url: 'http://127.0.0.1:5000/getShareFile',
      data: {

      },

      method: 'GET',

      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function (res) {
        that.setData({
          fileNameList: res.data.fileShareNameList,
          length: res.data.length
        })
      },

      fail: function (res) {
        console.log("获取失败!")
      }
    })
  },

  // 搜索入口  
  wxSearchTab: function () {
    var fileNameList = JSON.stringify(this.data.fileNameList)
    wx.redirectTo({
      url: '../ziliao/ziliao?fileNameList=' + fileNameList,
    })
  }
})
