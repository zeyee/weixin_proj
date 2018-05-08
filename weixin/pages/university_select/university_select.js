// university_select.js
var WxSearch = require('../../wxSearchView/wxSearchView.js');

Page({
  data:{
    university_list: []
  },

  onLoad: function(options){
    var that = this
    /*// 'GET’ 从服务器获得学校信息
    wx.request({
      url: 'http://127.0.0.1:5000/university_info',

      data: {

      },
    
      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function(res){
        that.setData({
          university_list: res.data
        })
      }
    })*/
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
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
    console.log(value)
    // 将选择的学校名称传回服务端
    wx.request({
      url: "https://printgo.xyz/university_info",

      method: "POST",

      data: {
        university: value
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