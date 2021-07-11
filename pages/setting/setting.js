// pages/setting/setting.js
var app = getApp();
var util = require('../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: undefined,
    canIUseGetUserProfile: false,
    hiddenLoginBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("setting.js");
    this.data.userInfo = app.globalData.userInfo;
    if (undefined == this.data.userInfo) {
      this.data.hiddenLoginBtn = false;
    }
    else {
      this.data.hiddenLoginBtn = true;
    }
    if (wx.getUserProfile) {
        this.setData({
            canIUseGetUserProfile: true,
            hiddenLoginBtn: that.data.hiddenLoginBtn
        })
    }
    else {
      this.setData({
        canIUseGetUserProfile: false,
        hiddenLoginBtn: that.data.hiddenLoginBtn
    })
    }
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (undefined == this.data.userInfo) {
        wx.showToast({
            title: '请先注册登录',
            icon: 'error',
            duration: 2000,
        })
    }
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
    return {
      title: '织里童装拼包行业开创者',
      path: '/page/user?id=123'
  }
  },
  addressManager: function(e){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log("userName" + res.userName);
        console.log("postalCode" + res.postalCode);
        console.log("provinceName" + res.provinceName);
        console.log("cityName" + res.cityName);
        console.log("countyName" + res.countyName);
        console.log("detailInfo" + res.detailInfo);
        console.log("nationalCode" + res.nationalCode);
        console.log("telNumber" + res.telNumber);
        app.globalData.userInfo.recipientname = res.userName;
        app.globalData.userInfo.rphonenumber = res.telNumber;
        app.globalData.userInfo.recipientaddress = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        that.bWaitingAddress = false;
        // debugger
        wx.request({
          url: util.updaterecipient(),
          data: {
            userID: app.globalData.userInfo.userid,
            recipientName: app.globalData.userInfo.recipientname,
            recipientAddress: app.globalData.userInfo.recipientaddress,
            rPhoneNumber: app.globalData.userInfo.rphonenumber
          },
          success: function (res) {
            console.log(res.data);
            if (200 == res.data.statusCode) {
              if (200 != res.data.data.code) {
                console.log("update address success.");
              }
            }
            console.log("user/update/recipient: " + res.data.statusCode);
          }
        });
      },
      complete: function () {
        console.log("chooseAddress complete");
        that.bWaitingAddress = false;
      }
    });
  },
  switchChange: function (e) {
    console.log('switch 发生 change 事件，携带值为', e.detail.value)
  },
  getUserProfile(e) {
      var that = this;
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          that.data.userInfo = app.globalData.userInfo;
          that.data.userInfo.nickname = app.globalData.userInfo.nickName;
          that.data.userInfo.avatarurl = app.globalData.userInfo.avatarUrl;
          that.setData({
            userInfo: app.globalData.userInfo
          })
          console.log("getUserProfile rawData: " + res.rawData);
          that.updateUserInfoNew();
          wx.hideLoading();
          // that.hideModal();
        },
        fail: (err) => {
            console.log("getUserProfile errMsg: " + err.errMsg)
            wx.hideLoading();
          //   that.hideModal();
        }
      })
  },
  updateUserInfoNew: function () {
      var that = this;
      //need uodate user info
      if (undefined == app.globalData.userInfo) {
          return;
      }
      wx.request({
          url: util.updateUser(),
          data: {
              nickName: app.globalData.userInfo.nickName,
              avatarUrl: app.globalData.userInfo.avatarUrl,
              phoneNumber: "000",
              gender: app.globalData.userInfo.gender,
              tokenKey: app.globalData.openid
          },
          success: function(res) {
              console.log(res.data);
              if (200 == res.data.statusCode) {
                  console.log("user update! " + res.data.data.retCode);
                  //更新成功
                  that.data.hiddenLoginBtn = true;
                  that.setData({
                      hiddenLoginBtn: that.data.hiddenLoginBtn
                  })
              }
              console.log("/user/new: " + res.data.statusCode);
          }
      });
  },
  checkoutUserInfoCompele: function () {
        var that = this;
        console.log("api :" + util.userfind());
        //查询是否存在
        wx.request({
            url: util.userfind(),
            data: {
                tokenKey: app.globalData.openid
            },
            success: function(res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                    if (40003 == res.data.data.retCode) {
                        //不存在，则创建新用户
                        
                    } else if (30000 == res.data.data.retCode) {
                        //key超时
                        that.login();
                    } else {
                        //存在用户
                        var test = (res.data.data.data[0]);
                        console.log("updateUser");
                        if (undefined == test.nickname || '' == test.nickname || '微信用户' == test.nickname ||
                        undefined == test.wxnickname || '' == test.wxnickname || '微信用户' == test.wxnickname) {
                            that.hiddenLoginBtn = false;
                            that.setData({
                                hiddenLoginBtn: false
                            })
                        }
                        else {
                            that.hiddenLoginBtn = true;
                            that.setData({
                                hiddenLoginBtn: true
                            });
                            app.globalData.userInfo = res.data.data.data[0];
                            that.updateOrderList();
                            that.updateStoreNumber();
                            that.updateWareHouse(undefined);
                        }
                    }
                }
                if (200 == res.data.statusCode) {

                }
                console.log("/user/find: " + res.data.statusCode);
                wx.hideLoading();
            },
            fail: function(res) {
                console.log(res + res.errMsg);
                console.log("/user/find: api failed");
                wx.hideLoading();
                wx.showToast({
                  title: '登录失败',
                })
            }
        });
    },
    showUserInfo: function() {
        wx.navigateTo({
            url: 'userInfo'
        });
    }
})