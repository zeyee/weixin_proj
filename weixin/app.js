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
  globalData: {
    userInfo: null,
    //url: "https://www.printgo.xyz"
    url: "http://127.0.0.1:5000"
  },
  onLaunch: function () {
    var that = this
    console.log("出问题了")
    wx.login({
      success: res => {
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
            console.log("没出问题")
            console.log(res)
            console.log(that.globalData.url)
            wx.setStorageSync('openId', res.data.openid)
            wx.request({
              //url: "https://www.printgo.xyz/login",
              //url: 'http://127.0.0.1:5000/login',
              url: that.globalData.url + '/login',

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
          },
          fail: function(res){
            console.log(res)
            console.log("出问题s了")
          }
        })
      }
    })
  }
})






// javascript 语言中 this关键字的用法了。在javascript语言中，this代表着当前的对象，它在程序中随着执行的上下文随时会变化。