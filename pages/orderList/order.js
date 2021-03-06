// pages/orderList/order.js
var inputinfo = "";  
var app = getApp();
var util = require('../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageMe: 'Hello MINA!',
    array: [1, 2, 3, 4, 5],
    packageList: [],  
    animationData: "",
    showModalStatus: false,
    address: ""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("packge onReady");
    //获得dialog组件
    // this.dialog = this.selectComponent("#dialog");
    // console.log("dialog: " + this.dialog);
    // this.dialog.showDialog();
  },
  // showDialog: function () {
  //   this.dialog.showDialog();
  // },

  // myConfirmEvent: function () {
  //   this.dialog.hideDialog();
  //   console.log("confirmEvent");
  // },
  // myBindGetUserInfo: function (e) {
  //   // bind:confirmEvent='confirmEvent'
  //   // bind: bindGetUserInfo = 'bindGetUserInfo'
  // // "usingComponents": {
  // //   "dialog": "../../components/dialog/dialog"
  // // }
  //   // 用户点击授权后，这里可以做一些登陆操作
  //   console.log("bindGetUserInfo");
  //   wx.showToast({
  //     title: 'hahaahha授权',
  //   })
  // },
  bindGetUserInfo: function(e){
    console.log("bindGetUserInfo errMsg: " + e.detail.errMsg)
    console.log("bindGetUserInfo userInfo: " + e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo;
    console.log("bindGetUserInfo rawData: " + e.detail.rawData);
    this.updateUserInfo();
  },
  confirmEvent: function(){
    console.log("confirmEvent");
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("package onShow");
    // this.showDialog();
    console.log(app.globalData.userInfo);
    this.updatePackageList();
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
    console.log("下拉");
 
    // wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("到底了");
  },
  onPageScroll: function (res) {
    console.log("scrolling..."+ res.scrollTop);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '织里童装拼包行业开创者',
      path: '/page/user?id=123'
    }
  },
  viewTapMe: function () {
    console.log('view tap me')
  },
  addNewList: function (e) {
    console.log("addNewList" + e.target.id);
    // wx.getUserInfo({
    //   success: function (res) {
    //     console(res.userInfo)
    //   }
    // })
  },
  closePackage: function (e) {
    console.log("closePackage" + e.target.id);
  },
  login: function () {
    var that = this;
    wx.login({
      // wx.login({
      success: function (res) {
        console.log("wx.login code:" + res.code);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: util.sessionurl(),
            data: {
              code: res.code,
              apptype: 1
            },
            success: function (res) {
              console.log("从自己服务器获取openid: " + res.data);
              var json = JSON.parse(res.data.data.data);
              console.log(json['openid']);
              app.globalData.openid = json['openid'];
              if (200 == res.data.statusCode) {
                wx.setStorage({
                  key: "localOpenID",
                  data: res.data.data,
                  success: function (res){
                    // wx.showToast({
                    //   title: 'Storage',
                    // })
                  },
                  fail: function (res){
                    console.log("setStorage failed");
                  }
                });
                wx.getSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                      console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称");
                      wx.getUserInfo({
                        success: function (res) {
                          console.log("getUserInfo errMsg: " + res.errMsg)
                          app.globalData.userInfo = res.userInfo;
                          console.log(res.userInfo);
                          console.log("getUserInfo rawData: " + res.rawData);
                          that.updateUserInfo();
                          wx.hideLoading();
                        }
                      });
                    }
                    else {
                      console.log("getUserInfo 未授权");
                      wx.hideLoading();
                      that.showModal();
                    }
                  },
                  fail: function(res){
                    wx.hideLoading();
                  }
                });
              }
              else {
                console.log("获取openid失败");
                wx.hideLoading()
              }
            },
            fail: function(res) {
              wx.hideLoading();
            }
          })
        }
        else {
          console.log('登录失败！' + res.errMsg)
          wx.hideLoading();
        }
        app.globalData.hasLogin = true
        // that.setData({
        //   hasLogin: true
        // })
        // that.update()
      },
      fail: function(res){
        wx.hideLoading()
      }
    })
  },
  updateUserInfo: function () {
    var that = this;
    console.log("api :" + util.userfind());
    //查询是否存在
    wx.request({
      url: util.userfind(),
      data: {
        openID: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data);
        if (200 == res.data.statusCode) {
          if (40003 == res.data.data.code) {
            //不存在，则创建新用户
            wx.request({
              url: util.usernew(),
              data: {
                nickName: app.globalData.userInfo.nickName,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                phoneNumber: "15867139686",
                gender: app.globalData.userInfo.gender,
                openID: app.globalData.openid
              },
              success: function (res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                  console.log("new user create! " + res.data.data.code);
                  //新建后，重新获取一次用户数据
                  wx.request({
                    url: util.userfind(),
                    data: {
                      openID: app.globalData.openid
                    },
                    success: function (res) {
                      console.log(res.data);
                      if (200 == res.data.statusCode) {
                        if (40003 != res.data.data.code) {
                          app.globalData.userInfo = res.data.data.data[0];
                          that.updatePackageList();
                        }
                      }
                      console.log("/user/new: " + res.data.statusCode);
                    }
                  });
                }
                console.log("/user/new: " + res.data.statusCode);
              }
            });
          }
          else {
            //存在用户
            var test = (res.data.data.data[0]);
            // debugger
            app.globalData.userInfo = res.data.data.data[0];
            that.updatePackageList();
          }
        }
        if (200 == res.data.statusCode) {

        }
        console.log("/user/find: " + res.data.statusCode);
      },
      fail: function (res) {
        console.log(res + res.errMsg);
        console.log("/user/find: api failed");
      }
    });
  },
  updatePackageList: function() {
    var that = this;
    if (undefined == app.globalData.userInfo) {
      console.log("-------undefined");
      // var testError = "naocanerror";
    }
    else {
      console.log("-------null");
      wx.request({
        url: util.packagefind(),
        data: {
          userID: app.globalData.userInfo.userid,
        },
        success: function (res) {
          console.log(res.data);
          if (200 == res.data.statusCode) {
            var list = res.data.data;
            console.log("packageList: " + list);
            for (var i = 0; i < list.length; i++) {
              console.log(list[i]);
              var unarrived = 0;
              var modify = 0;
              var arrived = 0;
              var totalOrder = list[i].orderList.length;
              var deadTime = list[i].orderList[0].deadlinedate;
              var totalTips = list[i].orderList.length;
              for (var j = 0; j < list[i].orderList.length; j++) {
                if (deadTime < list[i].orderList[j].deadlinedate) {
                  deadTime = list[i].orderList[j].deadlinedate;
                }
                switch (list[i].orderList[j].orderstatus) {
                  case 0: {
                    unarrived = unarrived + 1;
                  }
                    break;
                  case 1: {
                    modify = modify + 1;
                  }
                    break;
                  case 2: {
                    arrived = arrived + 1;
                  }
                    break;
                  default:
                    break;
                }
              }
              list[i]['unarrived'] = unarrived;
              list[i]['modify'] = modify;
              list[i]['arrived'] = arrived;
              list[i]['totalOrder'] = totalOrder;
              list[i]['totalTips'] = totalTips;
              list[i]['deadTime'] = deadTime;
            }
            console.log("changed list:" + list);
            that.data.packageList = list;
            that.setData({
              packageList: that.data.packageList
            });
          }
        }
      })
    }
  },
  showModal: function () {
    // 显示遮罩层    
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 20)
  },//myview 为点击控件的bindtap 应用时写在对应控件中就好  
  myview: function () {
    if (this.data.showModalStatus) {
      this.hideModal();
    } else {
      this.showModal();
    }
  },
  hideModal: function () {
    // 隐藏遮罩层    
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 20)
  },
  click_cancel: function () {
    console.log("点击取消");
    this.hideModal();
  },
  click_ok: function () {
    console.log("点击确定，输入的信息为为==", inputinfo);
    this.hideModal();
  },
  input_content: function (e) {
    console.log(e);
    inputinfo = e.detail.value;
  }
})