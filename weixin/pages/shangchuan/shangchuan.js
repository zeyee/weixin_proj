const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    FileDescribe: '',
    nickName: '',
    ifShared: '',
    time: '',
    filename: '',
    paperType: '',
    sizePaper: '',
    bindingType: '',
    money: ''
  },
  
  onLoad: function () {
    // var userInfo = wx.getStorageInfoSync('userInfo')
    // var openId = wx.getStorageInfoSync('openId')
  },

  DescribeInput: function (e) {
    this.setData({
      FileDescribe: e.detail.value
    })
    //console.log(this.FileDescribe)
  },

  // 选择是否公开
  shareChange: function(e){
    console.log(e.detail.value)
    if (e.detail.value == 'radio1'){
      this.setData({
        ifShared: 'True'
      })
    }
    else{
      console.log("不公开")
      this.setData({
        ifShared: 'False'
      })
      console.log(this.data.ifShared)
    }
  },

  // 选择纸张类型
  paperChange: function(e){
    if (e.detail.value == 'radio1'){
      this.setData({
        paperType: "0"
      })
    }
    else{
      this.setData({
        paperType: "1"
      })
    }
  },

  // 选择纸张尺寸
  sizeChange: function(e){
    if (e.detail.value == 'radio1'){
      this.setData({
        sizePaper: '1'
      })
    }
    else if (e.detail.value == 'radio2'){
      this.setDate({
        sizePaper: '2'
      })
    }
    else{
      this.setData({
        sizePaper: '3'
      })
    }
  },

  // 选择装订方式
  bindingChange: function(e){
    if (e.detail.value == 'radio1'){
      this.setData({
        bindingType: '1'
      })
    }
    else if (e.detail.value == 'radio2'){
        bindingType: '2'
    }
    else{
        bindingType: '3'
    }
  },

  // 上传
  check: function (e) {  // 绑定的check button
    var that = this
    var openId = wx.getStorageSync('openId')
    wx.request({
      //url: 'http://127.0.0.1:5000/upload',
      url: app.globalData.url + '/upload',

      method: 'POST',

      data: {
        openId: openId,
        ifShared: that.data.ifShared,
        time: utils.formatTime(new Date()),
        folderNumber: that.data.FileDescribe,
        paperType: that.data.paperType,
        paperSize: that.data.sizePaper,
        bindingType: that.data.bindingType
      },
      success: function (res) {
        var moneyAll = res.data.money
        wx.showModal({
          title: "消息",
          content: res.data.message,
          showCancel: false,
          confirmText: "确定",
          // 成功则跳转至首页
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../pay/pay' + '?money='+ moneyAll
              })
            }
            else {

            }
          }
        })
      },
      fail: function (res) {
        console.log("下载失败")
      }
    })
  },

  print_change: function(e){
    this.setData({
      print_door: e.detail.value
    })
  }
})