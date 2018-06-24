// pages/new/new.js
var app = getApp();
var util = require('../../common/util.js');
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
    bWaitingAddress: false,
    factoryList: undefined,
    packageID: undefined,
    resultList: undefined
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      resultList: ""
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      resultList: ""
    });
  },
  inputTyping: function (e) {
    console.log("input: " + e.detail.value);
    var inputStr = e.detail.value;
    var that = this;
    // debugger
    if (inputStr.length > 0) {
      wx.request({
        url: util.factorysearch(),
        data: {
          factoryName: inputStr
        },
        success: function (res) {
          console.log(res.data);
          if (200 == res.data.statusCode) {
            that.setData({
              inputVal: e.detail.value,
              resultList: res.data.data.data
            });
          }
          console.log("factory/search: " + res.data.statusCode);
        }
      });
    }
    else {
      wx.request({
        url: util.factorysearch(),
        success: function (res) {
          console.log(res.data);
          if (200 == res.data.statusCode) {
            // debugger
            that.setData({
              inputVal: e.detail.value,
              resultList: res.data.data.data
            });
          }
          console.log("factory/search: " + res.data.statusCode);
        }
      });
    }
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  searchResultTap: function (e){
    console.log("searchResultTap:" + e.currentTarget.id);
    var index = e.currentTarget.id;
  },
  newOrderTap: function (e){
    console.log("newOrderTap:" + e.currentTarget.id);
    var index = e.currentTarget.id;
    if (undefined != this.data.packageID) {
      wx.navigateTo({
        url: 'order/newOrder?factoryID=' + this.data.factoryList[index].factoryid + '&factoryName=' + this.data.factoryList[index].factoryname + '&contactName=' + this.data.factoryList[index].contactname + '&contactAddress=' + this.data.factoryList[index].contactaddress + '&phoneNumber=' + this.data.factoryList[index].phonenumber + '&packageID=' + this.data.packageID
      });
    }
    else {
      wx.navigateTo({
        url: 'order/newOrder?factoryID=' + this.data.factoryList[index].factoryid + '&factoryName=' + this.data.factoryList[index].factoryname + '&contactName=' + this.data.factoryList[index].contactname + '&contactAddress=' + this.data.factoryList[index].contactaddress + '&phoneNumber=' + this.data.factoryList[index].phonenumber
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (undefined != options.packageID) {
      this.data.packageID = options.packageID;
    }
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
    if (undefined == app.globalData.userInfo.rphonenumber && false == this.bWaitingAddress) {
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
      wx.request({
        url: util.factoryfind(),
        data: {
          
        },
        success: function (res) {
          console.log(res.data);
          if (200 == res.data.statusCode) {
            that.data.factoryList = res.data.data;
            that.setData({
              factoryList: that.data.factoryList
            });
          }
          console.log("/factory/find: " + res.data.statusCode);
        }
      });
    }
    else {
      wx.request({
        url: util.factoryfind(),
        data: {

        },
        success: function (res) {
          console.log(res.data);
          if (200 == res.data.statusCode) {
            that.data.factoryList = res.data.data;
            that.setData({
              factoryList: that.data.factoryList
            });
          }
          console.log("/factory/find: " + res.data.statusCode);
        }
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