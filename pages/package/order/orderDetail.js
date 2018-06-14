// pages/package/order/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realWindowWidth: 0,
    realWindowHeight: 0,
    statusType: ["备注", "状态"],
    currentType: 0,
    tabClass: ["什么", "测试"]
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
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
      }
    })
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
    var height = this.realWindowHeight - 53;
    this.setData({
      companyName: "huzhou",
      contactName: "damondamondamon",
      phoneNumber: "15867139686",
      companyAddress: "hangzhoujian",
      orderCount: "99",
      orderWeight: "100",
      orderMoney: "77",
      orderDeadline: "2018-07-07 00:00",
      orderPicCount: "2",
      scrollHeight: height
    });

    var that = this;
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.currentType;
    // this.getOrderStatistics();
    console.log("currentType:" + that.data.currentType);
    if (0 == that.data.currentType) {
      this.setData({
        orderList: [{ "dateAdd": 2018, "statusStr": "防水" },
        { "dateAdd": 2019, "statusStr": "小心轻放" }],
        logisticsMap: {},
        goodsMap: {}
      });
    }
    else {
      this.setData({
        orderList: [{ "dateAdd": 1990, "statusStr": "等待入库" },
        { "dateAdd": 1991, "statusStr": "等待库了" },
        { "dateAdd": 1992, "statusStr": "超时了" },
        { "dateAdd": 1993, "statusStr": "已入库" },
        { "dateAdd": 1994, "statusStr": "完成" },
        { "dateAdd": 1995, "statusStr": "2018060911100" },
        { "dateAdd": 1996, "statusStr": "2018060911100" },
        { "dateAdd": 1997, "statusStr": "2018060911100" },
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
  
  }
})