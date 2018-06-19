// pages/new/order/newOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realWindowWidth: 0,
    realWindowHeight: 0,
    factoryID:"",
    factoryName: "",
    contactName: "",
    phoneNumber: "",
    contactAddress: "",
    statusType: ["备注", "状态"],
    currentType: 0,
    tabClass: ["什么", "测试"],
    time: "19:55",
    date: "2018-06-12",
    orderCount: "0",
    orderWeight: "0",
    orderMoney: "0"
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  inputCountChange: function (e) {
    this.orderCount = e.detail.value;
    console.log("input count: " + e.detail.value);
  },
  inputWeightChange: function (e) {
    this.orderWeight = e.detail.value;
    console.log("input weight: " + e.detail.value);
  },
  inputMoneyChange: function (e) {
    this.orderMoney = e.detail.value;
    console.log("input money: " + e.detail.value);
  },
  chooseImage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })

  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          tempFilePaths: res.tempFilePaths[0],
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*options = {factoryID: "1", 
    factoryName: "杭州阿里巴巴有限公司", 
    contactName: "马云", 
    contactAddress: "杭州未来科技城", 
    phoneNumber: "15867139686"}*/
    console.log(options);
    var that = this;
    this.data.factoryID = options.factoryID;
    this.data.factoryName = options.factoryName;
    this.data.contactName = options.contactName;
    this.data.contactAddress = options.contactAddress;
    this.data.phoneNumber = options.phoneNumber;
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
      companyName: this.data.factoryName,
      contactName: this.data.contactName,
      phoneNumber: this.data.phoneNumber,
      companyAddress: this.data.contactAddress,
      // orderCount: "99",
      // orderWeight: "100",
      // orderMoney: "77",
      // orderDeadline: "2018-07-07 00:00",
      orderPicCount: "0",
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

  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  }
})