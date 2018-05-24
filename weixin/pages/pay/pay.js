Page({
  /*
  *初始数据
  */
  data:{
    money: ""    //根据后台返回支付数据
  },
  onLoad:function(options){
    this.setData({
      money: options.money
    })
  },
  /*
  *跳转
  */
    reshare : function () {
     wx.showModal({
        title: "消息",
        content: "支付成功",
        showCancel: false,
        confirmText: "确定",
        success : function(res){
          if(res.confirm){
            wx.redirectTo({
              url: '../share/share',
            })
          }
          else{
          }
        }
      }
    )
  }
})