Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.downloadFile({
      url: 'http://127.0.0.1:5000/static/network_answer.pdf', //仅为示例，并非真实的资源
      success: function (res) {
        console.log("asdasda")
        console.log(res)
        var filePath = res.tempFilePath
        console.log("asd")
        wx.getFileInfo({
          filePath: filePath,
          digestAlgorithm: 'sha1',
          success(res) {
            console.log(res)
            console.log(res.size)
            console.log(res.digest)
          }
        })
        /*wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            console.log(res)
          },
          fail: function(res){
            console.log(res)

          }
        })*/
      },
      fail: function(res){
        console.log("文件打开失败")
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