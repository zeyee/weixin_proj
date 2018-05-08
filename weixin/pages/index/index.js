//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    // 从服务端获取是否已经选择过学校信息。
    wx.request({
      url: 'https://printgo.xyz/check_university',

      data: {

      },
      
      header:{
        'content-type': 'application/json'
      },

      success: function(res){
        // 选择过则跳转至主页，否则选择学校信息。
        
        // console.log(typeof res.data.resp)
        // console.log(typeof 'true')
        if (res.data.universityResp){
            if (res.data.phoneNumberResp)
              wx.navigateTo({
                url: '../share/share',
            })
            else{
              wx.navigateTo({
                url: '../phoneNumber/phoneNumber',
              })
            }
        }
        else{
          wx.navigateTo({
            url: '../university_select_back/university_select_back'
          })
        }
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
