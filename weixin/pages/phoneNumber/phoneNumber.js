/*Page({
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  } 
})*/

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
    // 将用户手机号码传回后端存储
    wx.request({
      url: 'https://printgo.xyz/phoneNumber',

      method: 'POST',

      data:{
        phoneNumber: that.data.phoneNumber
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