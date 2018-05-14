const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    imageSrc: null,
    FileDescribe: '',
    nickName: '',
    ifShared: '',
    time: '',
    LinkDetail: ''
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

  linkInput: function (e) {
    //console.log(e.detail.value)
    this.setData({
      LinkDetail: e.detail.value
    })
    console.log(this.data.LinkDetail)
  },

  chooseImage: function () {  //绑定的chooseImage控件
    var that = this
    wx.chooseImage({ // 选定图片
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],  //这里选择压缩图片
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          imageSrc: res.tempFilePaths[0]
        })
      }
    })
  },
  
  // 选择是否公开
  radioChange: function(e){
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

  // 上传
  check: function (e) {  // 绑定的check button
    var that = this
    var openId = wx.getStorageSync('openId')
    //console.log(that)
    //console.log(that.imageSrc)
    console.log("adasdad")
    console.log(e)
    wx.downloadFile({
      url: that.data.LinkDetail,

      success: function(res){
        var filePath = res.tempFilePath
        console.log(filePath)
        wx.uploadFile({  // 上传图片
          url: 'https://printgo.xyz/upload',
          //url: 'http://127.0.0.1:5000/upload',

          name: 'picture',

          filePath: filePath,

          formData: {
            // 'FileDescribe': that.data.FileDescribe,
            'ifShared': that.data.ifShared,
            'openId': openId,
            'time': utils.formatTime(new Date()),
            'linkDetail': that.data.LinkDetail
          },

          success: function (res) {
            console.log('imageSrc is:', that.data.imageSrc)
            console.log('uploadImage success, res is:', res)
            wx.showModal({
              title: "消息",
              content: "上传成功",
              showCancel: false,
              confirmText: "确定",
              // 成功则跳转至首页
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../share/share',
                  })
                }
                else {

                }
              }
            })
            that.setData({
              imageSrc: null
            })
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      }
    })
    /*wx.uploadFile({  // 上传图片
      //url: 'https://printgo.xyz/upload',
      url: 'http://127.0.0.1:5000/upload',

      name: 'picture',

      filePath: that.data.imageSrc,

      formData: {
        'FileDescribe': that.data.FileDescribe,
        'ifShared': that.data.ifShared,
        'openId': openId,
        'time': utils.formatTime(new Date())
      },
      
      success: function (res) {
        console.log('imageSrc is:', that.data.imageSrc)
        console.log('uploadImage success, res is:', res)
        wx.showModal({
          title: "消息",
          content: "上传成功",
          showCancel: false,
          confirmText: "确定",
          // 成功则跳转至首页
          success: function(res){
            if (res.confirm){
              wx.redirectTo({
                url: '../share/share',
              })
            }
            else{

            }
          }
        })
        that.setData({
          imageSrc: null
        })
      },
      fail: function ({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
      }
    })*/
  },

  print_change: function(e){
    this.setData({
      print_door: e.detail.value
    })
  }
})