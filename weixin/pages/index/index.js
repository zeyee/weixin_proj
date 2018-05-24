
const app = getApp()
var utils = require('../../utils/util.js');

Page({
  onShareAppMessage: function () {
    return { title: "共享印" }
  },
  data: {
    motto: '欢迎来到共享印',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: ''
  },
 
  onLoad: function () {
    var a = utils.formatTime(new Date())
    console.log(typeof a)
    console.log(wx.getStorageSync('openId'))
  },
  
  bindGetUserInfo: function (e) {
    var that = this
    // console.log(e)
    that.setData({
      userInfo: e.detail.userInfo
    })
    wx.setStorageSync('userInfo', this.data.userInfo)
    var openid = wx.getStorageSync('openId')
    console.log(typeof openid)
    wx.request({
      //url: 'https://www.printgo.xyz/getUserInfo',
      //url: 'http://127.0.0.1:5000/getUserInfo',
      url: app.globalData.url + '/getUserInfo',

      data:{
        nickName: that.data.userInfo['nickName'],
        openId: openid
      },

      method: 'POST',

      header: {
        'content-type': 'application/json'
      },

      success: function(res){
        console.log(res)
      }

    })
    wx.request({
      //url: 'https://www.printgo.xyz/check_university',
      //url: 'http://127.0.0.1:5000/check_university',
      url: app.globalData.url + '/check_university',

      data: {
        openId: openid
      },

      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res)
        if (res.data.universityResp) {
          if (res.data.phoneNumberResp)
            wx.navigateTo({
              url: '../share/share',
            })
          else {
            wx.navigateTo({
              url: '../phoneNumber/phoneNumber',
            })
          }
        }
        else {
          wx.navigateTo({
            url: '../university_select_back/university_select_back'
          })
        }
      },
      fail: function(res){
        console.log("检查错误")
        // console.log(res)
      }
    })
  }
})
