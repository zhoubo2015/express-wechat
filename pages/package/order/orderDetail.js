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
    tabClass: ["什么", "测试"],
    orderID: "",
    orderInfo: undefined,
    infoList: []
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    console.log("currentType:" + this.data.currentType);
    this.data.infoList = [];
    if (0 == this.data.currentType) {
      this.data.infoList.splice(0, 0, this.data.orderInfo.ordernote);
      this.setData({
        infoList: this.data.infoList,
        currentType: curType
      });
    }
    else {
      var changeInfo = this.data.orderInfo.orderchanges;
      changeInfo = changeInfo.replace(",", "\n");
      this.data.infoList.splice(0, 0, changeInfo);
      this.setData({
        infoList: this.data.infoList,
        currentType: curType
      });
    }
    // this.onShow();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("orderID: " + options.orderID);
    this.data.orderID = options.orderID;
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
      scrollHeight: height
    });

    var that = this;
    wx.request({
      url: 'http://192.168.127.100:8086/order/findbyid',
      data: {
        orderID: that.data.orderID
      },
      success: function (res) {
        console.log("/order/findbyid:" + res.data);
        if (200 == res.data.statusCode) {
          that.data.orderInfo = res.data.data.data;
          console.log(that.data.orderInfo);
          var orderstatustext = "";
          if (0 == that.data.orderInfo.orderstatus) {
            orderstatustext = "等待厂家配货";
          }
          else if (1 == that.data.orderInfo.orderstatus) {
            orderstatustext = "该订单已改期";
          }
          else if (2 == that.data.orderInfo.orderstatus) {
            orderstatustext = "配货中心已入库";
          }
          that.setData({
            orderstatustext: orderstatustext,
            ordernumber: that.data.orderInfo.ordernumber,
            createdate: that.data.orderInfo.createdate,
            companyName: that.data.orderInfo.factoryInfo.factoryname,
            contactName: that.data.orderInfo.factoryInfo.contactname,
            phoneNumber: that.data.orderInfo.factoryInfo.phonenumber,
            companyAddress: that.data.orderInfo.factoryInfo.contactaddress,
            orderCount: that.data.orderInfo.ordercount,
            orderWeight: that.data.orderInfo.orderweight,
            orderMoney: that.data.orderInfo.ordermoney,
            orderDeadline: that.data.orderInfo.deadlinedate,
            orderPicCount: "0"
          });

          //处理首次刷新时的备注栏和状态栏
          console.log("currentType:" + that.data.currentType);
          that.data.infoList = [];
          if (0 == that.data.currentType) {
            that.data.infoList.splice(0, 0, that.data.orderInfo.ordernote);
            that.setData({
              infoList: that.data.infoList,
              currentType: that.data.currentType
            });
          }
          else {
            var changeInfo = that.data.orderInfo.orderchanges;
            changeInfo = changeInfo.replace(",", "\n");
            that.data.infoList.splice(0, 0, changeInfo);
            that.setData({
              infoList: that.data.infoList,
              currentType: that.data.currentType
            });
          }
        }
        console.log("/order/findbyid: " + res.data.statusCode);
      }
    });
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