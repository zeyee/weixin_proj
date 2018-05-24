const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    file_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var openId = wx.getStorageSync('openId')
    wx.request({
      //url: 'https://printgo.xyz/personal_order', //仅为示例，并非真实的接口地址
      //url: 'http://127.0.0.1:5000/personal_order',
      url: app.globalData.url + '/personal_order',

      data:{
        openId: openId
      },
      
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          file_list: res.data
        })
       
      }
    })
  },

 


})