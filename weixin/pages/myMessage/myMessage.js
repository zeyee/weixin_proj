Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    length: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:5000/myMessage', //仅为示例，并非真实的接口地址
      data: {

      },
      method: 'GET',
      success: function (res) {
        // console.log(res.data.file_name)
        // console.log(typeof that.data.file_name)
        // var tem_file_list = []
        that.setData({
          messageList: res.data.messageList,
          length: res.data.messageList.length
        })
        console.log(typeof length)
        /*for (var i = 0; i < res.data.file_name.length; i++){
          tem_file_list[res.data.file_name[i]] = res.data.file_number[i]
        }
        console.log(tem_file_list)
        that.setData({
          file_name: tem_file_list,
          file_number: res.data.file_number,
          file_list: ['1', '2']
        })*/
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


})