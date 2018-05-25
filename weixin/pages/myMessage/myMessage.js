const app =getApp()

Page({

  /**
   * 页面的初始数据
   */
  

  data: {
    fileNameList: [],
    orderNumberList: [],
    isReceiveList: [],
    timeList: [],
    length: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var openId = wx.getStorageSync('openId')
    var that = this
    console.log(openId)
    wx.request({
      //url: 'https://printgo.xyz/myMessage', //仅为示例，并非真实的接口地址
      //url: 'http://127.0.0.1:5000/myMessage',
      url: app.globalData.url + '/myMessage',

      data: {
        openId: openId
      },

      method: 'GET',

      success: function (res) {
        console.log(res)
        that.setData({
          fileNameList: res.data.fileNameList,
          orderNumberList: res.data.orderNumberList,
          isReceiveList: res.data.isReceiveList,
          timeList: res.data.timeList,
          length: res.data.fileNameList.length
        })
        console.log(typeof length)
      }
    })
  },

  showMessage: function(){
    wx.showModal({
      title: "消息",
      content: "因无法调用微信支付接口，此功能将在后期实现",
      showCancel: false,
      confirmText: "确定",
      // 成功则跳转至首页
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../share/share'
          })
        }
        else {

        }
      }
    })

  }

})