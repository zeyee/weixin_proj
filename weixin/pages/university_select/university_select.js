// university_select.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');

Page({
  data:{
    university_list: []
  },

  onLoad: function(options){
    var that = this
    
    if (options && options.university_info) {
      var university_info = JSON.parse(options.university_info)
      that.setData({
        university_list: university_info
      })
      console.log(that.data.university_list[5])
    }

    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      that.data.university_list,// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  
  wxSearchKeyTap: WxSearch.wxSearchKeyTap, 
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, 
  wxSearchConfirm: WxSearch.wxSearchConfirm,  
  wxSearchClear: WxSearch.wxSearchClear, 
  // 搜索回调函数  
  mySearchFunction: function (value) {
    console.log(value)
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: "https://www.printgo.xyz/university_info",
      //url: 'http://127.0.0.1:5000/university_info',

      method: "POST",

      data: {
        university: value,
        openId: openId
      },

      header:{
        'content-type': 'application/json'
      },

      success: function(res) {
        console.log(res)
      },

      fail: function(res) {
        console.log("返回学校信息失败.")
      }
    })
    // do your job here
    // 跳转
    wx.redirectTo({
      url: '../phoneNumber/phoneNumber'
    })
  },

  //返回回调函数
  myGobackFunction: function () {
    wx.redirectTo({
      url: '../university_select_back/university_select_back'
    })
  }
})