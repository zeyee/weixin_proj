const app = getApp()
Page({
  data: {
    fileNameList: [],
    fileNumberList: [],
    fileOwnerOpenId: [],
    length: ''
  },

  // 搜索页面跳回
  onLoad: function (options) {
    var that = this

    wx.request({
      //url: 'https://printgo.xyz/getShareFile',
      //url: 'http://127.0.0.1:5000/getShareFile',
      url: app.globalData.url + '/getShareFile',

      data: {

      },

      method: 'GET',

      header: {
        'content-type': 'application/json' // 默认值
      },

      success: function (res) {
        that.setData({
          fileNameList: res.data.fileShareNameList,
          length: res.data.length,
          fileNumberList: res.data.fileNumberList,
          fileOwnerOpenId: res.data.fileOwnerOpenId
        })
      },

      fail: function (res) {
        console.log("获取失败!")
      }
    })
  },

  // 搜索入口  
  wxSearchTab: function () {
    var fileNameList = JSON.stringify(this.data.fileNameList)
    wx.redirectTo({
      url: '../ziliao/ziliao?fileNameList=' + fileNameList,
    })
  },

  checkDetail: function (e) {
    // console.log(e.currentTarget.dataset['id'])
    var that = this
    var id = e.currentTarget.dataset['id']
    console.log(id)
    wx.request({
      //url: 'https://www.printgo.xyz/downLoad',
      //url: 'http://127.0.0.1:5000/downLoad',
      url: app.globalData.url + '/downLoad',

      data: {
        openId: that.data.fileOwnerOpenId[id - 1],
        fileNumber: that.data.fileNumberList[id - 1],
        fileName: that.data.fileNameList[id - 1]
      },

      success: function (res) {
        //console.log("访问dowload成功")
        console.log("dsadasda")
        console.log(res.data.Path)

        wx.downloadFile({
          url: res.data.Path,
          //url: res.data.Path,

          success: function (res) {
            console.log(res.tempFilePath)
            /*wx.previewImage({
              urls: [res.tempFilePath],
            })*/
            // 浏览文件的功能
            wx.openDocument({
              filePath: res.tempFilePath,
            })

            /*wx.saveFile({
              tempFilePath: res.tempFilePath,
              success: function (res) {
                console.log(res.savedFilePath)
                var savedFilePath = res.savedFilePath
              }
            })*/
          },
          fail: function (res){
            console.log(res)
            console.log("下载失败")
          }
        })
      },
    })
  },


  // 获取下载链接
  downLoad: function(e){
    var that = this
    var id = e.currentTarget.dataset['id']
    console.log(e)
    wx.request({
      //url: 'https://www.printgo.xyz/downLoad',
      //url: 'http://127.0.0.1:5000/downLoad',
      url: app.globalData.url + '/downLoad',

      data: {
        openId: that.data.fileOwnerOpenId[id - 1],
        fileNumber: that.data.fileNumberList[id - 1],
        fileName: that.data.fileNameList[id - 1]
      },

      success: function (res) {
        console.log("访问dowload成功")
        console.log(res.data.Path)
        wx.showModal({
          title: "文件下载链接",
          content: res.data.Path,
          showCancel: false,
          confirmText: "确定",
          // 成功则跳转至首页
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../share/share',
              })
            }
            else {

            }
          }
        })
      }
    })
  },
})