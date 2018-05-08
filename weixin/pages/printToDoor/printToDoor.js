Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_number: '',
    address: '',
    // isReceive 标识是否被接单。
    isReceive: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
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
    var that = this
    wx.request({
      url: 'https://printgo.xyz/order_info',

      method: 'POST',

      data: {
        order_number: that.data.order_number,
        address_info: that.data.address,
        isReceive: that.data.isReceive
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