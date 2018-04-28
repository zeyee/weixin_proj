const app = getApp()

Page({
  data: {
    imageSrc: null,
    FileDescribe: '',
    nickName: '',
    print_door: ''
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

  DescribeInput: function (e) {
    this.setData({
      FileDescribe: e.detail.value
    })
    //console.log(this.FileDescribe)
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
  
  check: function (e) {  // 绑定的check button
    var that = this
    //console.log(that)
    //console.log(that.imageSrc)
    wx.uploadFile({  // 上传图片
      url: 'http://127.0.0.1:5000/upload',
      name: 'picture',
      filePath: that.data.imageSrc,
      formData: {
        'user': 'test',
        'FileDescribe': that.data.FileDescribe,
        'print_door': that.data.print_door
      },
      success: function (res) {
        console.log('imageSrc is:', that.data.imageSrc)
        console.log('uploadImage success, res is:', res)
        wx.showModal({
          title: "图片详情",
          content: res.data,
          showCancel: false,
          confirmText: "确定"
        })
        that.setData({
          imageSrc: null
        })
      },
      fail: function ({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
      }
    })
  },

  reload: function (e) {  // 绑定的reload button
    this.setData({
      imageSrc: null
    })
  },

  print_change: function(e){
    this.setData({
      print_door: e.detail.value
    })
  }
})