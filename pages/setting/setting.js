// pages/setting/setting.js
var app = getApp();
var util = require('../../common/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: undefined
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
  }
})