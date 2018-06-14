App({
  //开发者可以添加任意的函数或数据到 Object 参数中，用 this 可以访问
  globalData: {
    hasLogin: false,
    openid: null
  },
  onLaunch: function (options) {
    // Do something initial when launch.
    //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    console.log("onLaunch");
    this.globalData.hasLogin = true
    var that = this;
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("session_key 未过期，并且在本生命周期一直有效");
        that.globalData.hasLogin = true
        // app.globalData.hasLogin = true
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        //重新登录
        wx.login({
          success: function (res) {
            console.log("code:" + res.code);
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'http://192.168.127.94:8086/webChat/sessionKey',
                data: {
                  code: res.code
                },
                success: function (res) {
                  console.log(res.data)
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
            that.globalData.hasLogin = true
            that.setData({
              hasLogin: true
            })
            that.update()
          }
        })
      }
    })
  },
  onShow: function (options) {
    // Do something when show.
    //当小程序启动，或从后台进入前台显示，会触发 onShow
    console.log("onShow");
  },
  onHide: function () {
    // Do something when hide.
    //当小程序从前台进入后台，会触发 onHide
    console.log("onHide");
  },
  onError: function (msg) {
    //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息

    console.log("onError:" + msg)
  }
})