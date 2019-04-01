// import wxService from 'common/WxService'
var util = require('common/util.js');
App({
  //开发者可以添加任意的函数或数据到 Object 参数中，用 this 可以访问
  globalData: {
    hasLogin: false,
    openid: null,
    userInfo: undefined
  },
  onLaunch: function (options) {
    // Do something initial when launch.
    //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    console.log("onLaunch");
    this.globalData.hasLogin = true
    var that = this;

    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log("session_key 未过期，并且在本生命周期一直有效");
    //     that.globalData.hasLogin = true;
    //     // that.globalData.openid = "oxiEr5Ox2L7goNZTKGY5IRGIl0sI";
    //     // app.globalData.hasLogin = true
    //     wx.getStorage({
    //       key: 'localOpenID',
    //       success: function (res) {
    //         console.log("getStorage" + res.data);
    //         var json = JSON.parse(res.data);
    //         console.log(json['openid']);
    //         that.globalData.openid = json['openid'];
    //         that.updateUserInfo();
    //       },
    //       fail: function (res) {
    //         //{"session_key":"cdAwOIaaXNBty+nGlOyrPQ==","openid":"oxiEr5Ox2L7goNZTKGY5IRGIl0sI"}
    //         console.log("本地获取openid失败");
    //         that.login();
    //       }
    //     });
    //   },
    //   fail: function () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     console.log("session_key 已经失效，需要重新执行登录流程");
    //     //重新登录
    //     this.login();
    //   }
    // })
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
  },
  login: function () {
    var that = this;
    this.wxService.login({
    // wx.login({
      success: function (res) {
        console.log("wx.login code:" + res.code);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: util.sessionurl(),
            data: {
              code: res.code
            },
            success: function (res) {
              console.log("从自己服务器获取openid: " + res.data);
              var json = JSON.parse(res.data.data);
              console.log(json['openid']);
              that.globalData.openid = json['openid'];
              if (200 == res.data.statusCode) {
                wx.setStorage({
                  key: "localOpenID",
                  data: res.data.data
                });
                that.updateUserInfo();
              }
              else {
                console.log("获取openid失败");
              }
            }
          })
        } 
        else {
          console.log('登录失败！' + res.errMsg)
        }
        that.globalData.hasLogin = true
        // that.setData({
        //   hasLogin: true
        // })
        // that.update()
      }
    })
  },
  userlogin: function () {
    var that = this;
    return new Promise(
      (resolve, reject) => {
        console.log('---------------userlogin')
        wx.showLoading({
          title: '登陆中',
        })
        wx.login({
          success: function (res) {
            console.log("wx.login code:" + res.code);
            wx.request({
              url: util.sessionurl(),
              data: {
                code: res.code
              },
              success(res) {
                console.log("从自己服务器获取openid: " + res.data);
                var json = JSON.parse(res.data.data);
                console.log(json['openid']);
                that.globalData.openid = json['openid'];
                if (200 == res.data.statusCode) {
                  wx.setStorage({
                    key: "localOpenID",
                    data: res.data.data
                  });
                  return resolve('app.js login success')
                  // that.updateUserInfo();
                }
                else {
                  console.log("获取openid失败");
                  reject('app.js login failed')
                }
              },
              fail: function () {
                wx.showToast({
                  title: '登陆异常'
                })
                reject('app.js login failed')
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '登陆异常'
            })
            reject('app.js login failed')
          },
        })
      }
    )
  },
  usercheckSession: function () {
    var that = this;
    return new Promise(
      (resolve, reject) => {
        console.log('---------------usercheckSession')
        wx.showLoading({
          title: 'usercheckSession',
        })
        wx.checkSession({
          success: function (res) {
            console.log("session_key 未过期，并且在本生命周期一直有效");
            that.globalData.hasLogin = true;
            return resolve('app.js login success')
          },
          fail: function () {
            console.log("session_key 已经失效，需要重新执行登录流程");
            reject('app.js login failed')
          },
        })
      }
    )
  },
  usergetStorage: function (){
    var that = this;
    return new Promise(
      (resolve, reject) => {
        console.log('---------------usergetStorage')
        wx.showLoading({
          title: 'usergetStorage',
        })
        wx.getStorage({
          key: 'localOpenID',
          success: function (res) {
            console.log("getStorage" + res.data);
            var json = JSON.parse(res.data);
            console.log(json['openIDKey']);
            that.globalData.openid = json['openIDKey'];
            return resolve('app.js login success')
          },
          fail: function () {
            console.log("本地获取openid失败");
            reject('app.js login failed')
          },
        })
      }
    )
  }
})