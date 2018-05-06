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
    var that = this
    wx.request({
      url: 'http://149.28.29.169/pickUpOrders',

      method: 'GET',

      data:{

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

  pickUp: function(e){
    var that = this
    var id = e.currentTarget.dataset.id
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
            url: 'http://149.28.29.169/pickUpOrders',

            method: 'POST',

            data: {
              fileNumber: that.data.fileNumberList[id]
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