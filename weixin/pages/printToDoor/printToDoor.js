var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number: '',
    address: '',
    // isReceive 标识是否被接单。
    isReceive: false,
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
      url: 'https://printgo.xyz/order_info',
      //url: 'http://127.0.0.1:5000/order_info',
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
  }
})