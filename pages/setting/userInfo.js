// pages/setting/userInfo.js
var app = getApp();
var util = require('../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language:[
      "Java",
      "C",
      "C++",
      "Python",
      ".NET",
      "C#",
      "JavaScript", 
      "SQL",
      "PHP",
      "Java",
      "C",
      "C++",
      "Python",
      ".NET",
      "C#",
      "JavaScript", 
      "SQL",
      "PHP",
      // 更多数据...
    ],
    userData: undefined,
    userInfoCallback: undefined,
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo(undefined);
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
      this.userInfoCallback = res => {
          wx.stopPullDownRefresh();
      }
      this.getUserInfo(this.userInfoCallback);
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
  getUserInfo: function(callback) {
      var that = this;
      console.log("api :" + util.userfind());
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
                      console.log("updateUser");
                      that.data.userData = res.data.data.data[0];
                      that.setData({
                        userData: that.data.userData
                    })
                  }
              }
              console.log("/user/find: " + res.data.statusCode);
              wx.hideLoading();

              if (undefined != callback) {
                callback();
              }
          },
          fail: function(res) {
              console.log(res + res.errMsg);
              console.log("/user/find: api failed");
              wx.hideLoading();
              wx.showToast({
                title: '刷新失败',
              })

              if (undefined != callback) {
                callback();
              }
          }
      });
  }
})