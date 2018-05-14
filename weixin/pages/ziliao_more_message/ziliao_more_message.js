Page({
  data:{

  },

  onLoad: function(){
    wx.downloadFile({
      url: '',

      success: function(res){
        console.log(res.tempFilePath)
        /*wx.previewImage({
          urls: [res.tempFilePath],
        })*/
        wx.getImageInfo({
          src: res.tempFilePath,

          success: function(res){
            console.log(res)
          }
        })
      }
    })
  }
})