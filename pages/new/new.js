// pages/new/new.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    realWindowWidth: 0,
    realWindowHeight: 0,
    inputVal: "",
    statusType: ["路段", "品牌"],
    currentType: 0,
    tabClass: ["什么", "测试"],
    bWaitingAddress: false
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    console.log("input: " + e.detail.value);
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  newOrderTap: function (e){
    console.log("newOrderTap" + e.target.id);
    wx.navigateTo({
      url: 'order/newOrder',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.bWaitingAddress = false;
    wx.getSystemInfo({
      success: function (res) {
        that.realWindowWidth = res.windowWidth
        that.realWindowHeight = res.windowHeight
        console.log("height: " + that.realWindowHeight);
        var height = res.windowHeight - 48;
        that.setData({
          resultHeight: height
        });
      }
    });
    // console.log("getSetting call");
    // wx.getSetting({
    //   success: function (res) {
    //     console.log("getSetting success: " + res.authSetting['scope.address']);
    //     if (res.authSetting['scope.address']) {
    //       // chooseAddress已经授权
    //       console.log("chooseAddress已经授权");
    //     }
    //     else {
    //       console.log("chooseAddress未授权");
    //       wx.chooseAddress({
    //         success: function (res) {
    //           console.log(res.userName)
    //           console.log(res.postalCode)
    //           console.log(res.provinceName)
    //           console.log(res.cityName)
    //           console.log(res.countyName)
    //           console.log(res.detailInfo)
    //           console.log(res.nationalCode)
    //           console.log(res.telNumber)
    //         }
    //       });
    //     }
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady " + this.realWindowHeight);
    var rHeight = this.realWindowHeight - 48;
    var sHeight = this.realWindowHeight - 48 - 48 - 44;
    this.setData({
      resultHeight: rHeight,
      scrollHeight: sHeight
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
    var that = this;
    if (undefined == app.globalData.userInfo.rPhoneNumber && false == this.bWaitingAddress) {
      this.bWaitingAddress = true;
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
          app.globalData.userInfo.rPhonenumber = res.telNumber;
          app.globalData.userInfo.recipientaddress = res.provinceName + res.cityName + res.countyName + res.detailInfo;
          that.bWaitingAddress = false;
          debugger
          wx.request({
            url: 'http://192.168.127.104:8086/user/update/recipient',
            data: {
              userID: app.globalData.userInfo.userid,
              recipientName: app.globalData.userInfo.recipientname,
              recipientAddress: app.globalData.userInfo.userecipientaddressr,
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
        complete: function (){
          console.log("chooseAddress complete");
          that.bWaitingAddress = false;
        }
      });
    }
    else {
      console.log("already had address || waiting...");
    }
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.currentType;
    // this.getOrderStatistics();
    console.log("currentType:" + that.data.currentType);
    if (0 == that.data.currentType) {
      this.setData({
        orderList: [{ "dateAdd": 2018, "statusStr": "2018060911101"},
          { "dateAdd": 2019, "statusStr": "2018060911101" },
          { "dateAdd": 2020, "statusStr": "2018060911101" }],
        logisticsMap: {},
        goodsMap: {}
      });
    }
    else {
      this.setData({
        orderList: [{ "dateAdd": 1990, "statusStr": "2018060911100"},
          { "dateAdd": 1991, "statusStr": "2018060911100"},
          { "dateAdd": 1992, "statusStr": "2018060911100" },
          { "dateAdd": 1993, "statusStr": "2018060911100"},
          { "dateAdd": 1994, "statusStr": "2018060911100"},
          { "dateAdd": 1995, "statusStr": "2018060911100"},
          { "dateAdd": 1996, "statusStr": "2018060911100" },
          { "dateAdd": 1997, "statusStr": "2018060911100"},
          { "dateAdd": 1998, "statusStr": "2018060911100" },
          { "dateAdd": 1999, "statusStr": "2018060911100" },
          { "dateAdd": 2000, "statusStr": "2018060911100" },
          { "dateAdd": 2001, "statusStr": "2018060911100" }],
        logisticsMap: {},
        goodsMap: {}
      });
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
  
  },
  newCompany: function () {
    wx.navigateTo({
      url: 'addCompany/newCompany',
    });
  }
})