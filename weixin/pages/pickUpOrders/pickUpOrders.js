const app = getApp()
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileNameList: [],
    fileNumberList: [],
    addressList: []  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var openId = wx.getStorageSync('openId')
    var that = this
    wx.request({
      //url: 'https://printgo.xyz/pickUpOrders',
      //url: 'http://127.0.0.1:5000/pickUpOrders',
      url: app.globalData.url + '/pickUpOrders',
      method: 'GET',

      data:{
        openId: openId
      },

      header:{
        
      },

      success: function(res){
        console.log(res)
        that.setData({
          fileNameList: res.data.fileNameList,
          fileNumberList: res.data.fileNumberList,
          addressList: res.data.addressList
        })
        console.log(res.data.fileNameList[0])
      },

      fail: function(res){

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  pickUp: function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    var openId = wx.getStorageSync('openId')
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: "文件名: " + that.data.fileNameList[id] + "\r\n" + "订单号: " + that.data.fileNumberList[id] + "\r\n" + "地址: " + that.data.addressList[id],
      confirmText: "确认接单",
      cancelText: "取消接单",
      success: function(res){
        console.log(res.confirm)
        if (res.confirm){
          wx.request({
            //url: 'https://printgo.xyz/pickUpOrders',
            //url: 'http://127.0.0.1:5000/pickUpOrders',
            url: app.globalData.url + '/pickUpOrders',
            
            method: 'POST',

            data: {
              fileNumber: that.data.fileNumberList[id],
              openId: openId,
              time: utils.formatTime(new Date()),
              isReceive: true
            },

            success: function(res){
              wx.redirectTo({
                url: '../share/share',
              })
            },

            fail: function(res){

            }
          })
        }
      }
    })
  },

  moreContent: function(e){
    console.log(e.currentTarget.dataset.id)
  }
})