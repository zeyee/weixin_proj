var WxSearch = require('../../wxFileSearch/wxFileSearch.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileNameList: [],
    length: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从网上下载文件的示例
    /*wx.downloadFile({
      url: 'http://127.0.0.1:5000/static/network_answer.pdf', //仅为示例，并非真实的资源
      success: function (res) {
        console.log("asdasda")
        console.log(res)
        var filePath = res.tempFilePath
        console.log("asd")
        wx.getFileInfo({
          filePath: filePath,
          digestAlgorithm: 'sha1',
          success(res) {
            console.log(res)
            console.log(res.size)
            console.log(res.digest)
          }
        })
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            console.log(res)
          },
          fail: function(res){
            console.log(res)

          }
        })
      },
      fail: function(res){
        console.log("文件打开失败")
      }
    })*/
    // 像后端请求显示可以共享的资料信息
    var that = this
    // console.log("运行至if")
    if (options && options.fileNameList) {
      var fileList = JSON.parse(options.fileNameList)
      console.log(fileList)
      that.setData({
        fileNameList: fileList
      })
      //console.log(that.data.[5])
    }

    WxSearch.init(
      that,  // 本页面一个引用
      [], // 热点搜索推荐，[]表示不使用
      that.data.fileNameList,// 搜索匹配，[]表示不使用
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
    /*wx.request({
      url: "http://127.0.0.1:5000/university_info",

      method: "POST",

      data: {
        university: value
      },

      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res)
      },

      fail: function (res) {
        console.log("返回学校信息失败.")
      }
    })
    // do your job here
    // 跳转
    wx.redirectTo({
      url: '../phoneNumber/phoneNumber'
    })*/
  },

  //返回回调函数
  myGobackFunction: function () {
    wx.redirectTo({
      url: '../ziliao_select/ziliao_select',
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },


})