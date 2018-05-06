//app.js
var AppID = "wxc569075677853df8";
var AppSecret = "5ef647ec79390dd69cffc6f7f43e0231";
var code = "";
var userInfo = ""
var nickName = ""
var avatarUrl = ""
var gender = "" //性别 0：未知、1：男、2：女
var province = ""
var city = ""
var country = "" 
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 获取用户信息
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            userInfo = res.userInfo
            nickName = userInfo.nickName
            avatarUrl = userInfo.avatarUrl
            gender = userInfo.gender //性别 0：未知、1：男、2：女
            province = userInfo.province
            city = userInfo.city
            country = userInfo.country
          }
        })
        // 发送 res.code 到微信服务器后台换取 openId, sessionKey, unionId
        console.log(res.code)
        wx.request({
          url: "https://api.weixin.qq.com/sns/jscode2session?appid=" + AppID +"&secret=" + AppSecret  + "&js_code=" + res.code +"&grant_type=authorization_code",
          data: {
            x: '',
            y: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          // 将获得的openId， session_key发送到服务器。
          success: function(res){
            console.log(res)
            wx.request({
              url: "http://149.28.29.169/login",
              method: "POST",
              data: {
                user_name: nickName,
                openid: res.data.openid,
                session_key: res.data.session_key
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(res){
                console.log(res)
              }
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})






// javascript 语言中 this关键字的用法了。在javascript语言中，this代表着当前的对象，它在程序中随着执行的上下文随时会变化。