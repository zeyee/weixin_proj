

Page({
  data:{
    phoneNumber: ''
  },

  getPhoneNumber: function(e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  transPhoneNumber: function(e){
    var that = this
    var openId = wx.getStorageSync('openId')
    // 将用户手机号码传回后端存储
    wx.request({
      //url: 'https://printgo.xyz/phoneNumber',
      url: 'http://127.0.0.1:5000/phoneNumber',
      method: 'POST',

      data:{
        phoneNumber: that.data.phoneNumber,
        openId: openId
        
      },

      header:{
        'content-type': 'application/json' // 默认值
      },

      success: function(e){
        that.setData({
          phoneNumber: ''
        })
        
        wx.redirectTo({
          url: '../share/share',
        })
        console.log("success")
      },

      fail: function(e){
        console.log("fail")
      }

    })
  }
})