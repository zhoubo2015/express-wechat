// pages/new/new.js
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
    tabClass: ["什么", "测试"]
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
    })
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