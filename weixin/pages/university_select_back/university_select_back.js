//university_select_back.js
Page({
  data: {
    university_list: []
  },

  // 搜索页面跳回
  onLoad: function (options) {
    var that = this
    // 'GET’ 从服务器获得学校信息
    wx.request({
      url: 'https://printgo.xyz/university_info',

      data: {

      },

      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function (res) {
        console.log(res)
        console.log(typeof that.data.university_list)
        // console.log(res.university_info)
        that.setData({
          university_list: res.data.university_info
        })
        // console.log(typeof that.data.university_list[1])
      },
      
      fail: function(res){
        console.log("数据获取失败。")
      }
    })
  },

  // 搜索入口  
  wxSearchTab: function () {
    var university_info = JSON.stringify(this.data.university_list)
    wx.redirectTo({
      url: '../university_select/university_select?university_info=' + university_info
    })
  }
})
