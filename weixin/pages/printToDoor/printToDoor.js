var utils = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number: '',
    address: '',
    // isReceive 标识是否被接单。
    isReceive: false,
    userName:'',
    provinceName: '',
    cityName: '',
    countyName: '',
    detailInfo: '',
    nationalCode: '',
    telNumber: '',
    time: '',
  },

  
// 获取输入的订单编号
  order_get: function(e){
    this.setData({
      order_number: e.detail.value
    })
  },
// 获取输入的地址
  address_get: function(e){
    this.setData({
      address: e.detail.value
    })
  },
// 确认信息,将订单编号和地址传回后端
  confirm_info: function(){
    var openId = wx.getStorageSync('openId')
    var that = this
    wx.request({
      //url: 'https://printgo.xyz/order_info',
      //url: 'http://127.0.0.1:5000/order_info',
      url: app.globalData.url + '/order_info',
      
      method: 'POST',

      data: {
        order_number: that.data.order_number,
        address_info: that.data.address,
        isReceive: that.data.isReceive,
        openId: openId,
        time: utils.formatTime(new Date())
      },

      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function(res){
        // 成功后reset输入框的内容
        that.setData({
          order_number: '',
          address: ''
        }),
        console.log(res)
        // 显示返回的信息
        wx.showModal({
          title: "消息",
          content: res.data.info,
          showCancel: false,
          confirmText: "确定",

          success: function(res){
            wx.redirectTo({
              url: '../share/share',
            })
          }
        })
      },

      fail: function(res){
        console.log("失败!")
      }
    })
  },
  
  chooseAddress: function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        that.setData({
          userName: res.userName,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countyName: res.countyName,
          detailInfo: res.detailInfo,
          nationalCode: res.nationalCode,
          telNumber: res.telNumber,
          address:res.provinceName+res.cityName+res.countyName+res.detailInfo
        })
      }
    })
  }
})