// var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data: {
    statusType: ["未入库", "已改期", "已入库", "总订单"],
    currentType: 0,
    tabClass: ["", "", "", ""],
    packageID: "",
    storeID: "",
    packageNumber: "",
    orderList: undefined
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.id;
    console.log("orderID: " + orderId);
    wx.navigateTo({
      url: "/pages/package/order/orderDetail?orderID=" + orderId
    })
  },
  addNewOrder: function (e){
    console.log("addNewOrder: " + this.data.packageID);
    wx.navigateTo({
      url: "/pages/package/order/addOrder?packageID=" + this.data.packageID
    });
  },
  changeOrder: function (e) {
    console.log("changeOrder");
  },
  // cancelOrderTap: function (e) {
  //   var that = this;
  //   var orderId = e.currentTarget.dataset.id;
  //   wx.showModal({
  //     title: '确定要取消该订单吗？',
  //     content: '',
  //     success: function (res) {
  //       if (res.confirm) {
  //         wx.showLoading();
  //         wx.request({
  //           url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
  //           data: {
  //             token: wx.getStorageSync('token'),
  //             orderId: orderId
  //           },
  //           success: (res) => {
  //             wx.hideLoading();
  //             if (res.data.code == 0) {
  //               that.onShow();
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // toPayTap: function (e) {
  //   var that = this;
  //   var orderId = e.currentTarget.dataset.id;
  //   var money = e.currentTarget.dataset.money;
  //   var needScore = e.currentTarget.dataset.score;
  //   wx.request({
  //     url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
  //     data: {
  //       token: wx.getStorageSync('token')
  //     },
  //     success: function (res) {
  //       if (res.data.code == 0) {
  //         // res.data.data.balance
  //         money = money - res.data.data.balance;
  //         if (res.data.data.score < needScore) {
  //           wx.showModal({
  //             title: '错误',
  //             content: '您的积分不足，无法支付',
  //             showCancel: false
  //           })
  //           return;
  //         }
  //         if (money <= 0) {
  //           // 直接使用余额支付
  //           wx.request({
  //             url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
  //             method: 'POST',
  //             header: {
  //               'content-type': 'application/x-www-form-urlencoded'
  //             },
  //             data: {
  //               token: wx.getStorageSync('token'),
  //               orderId: orderId
  //             },
  //             success: function (res2) {
  //               that.onShow();
  //             }
  //           })
  //         } else {
  //           // wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
  //         }
  //       } else {
  //         wx.showModal({
  //           title: '错误',
  //           content: '无法获取用户资金信息',
  //           showCancel: false
  //         })
  //       }
  //     }
  //   })
  // },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log("onLoad: " + options.packageID);
    console.log("onLoad: " + options.storeID);
    console.log("onLoad: " + options.packageNumber);
    this.data.packageID = options.packageID;
    this.data.storeID = options.storeID;
    this.data.packageNumber = options.packageNumber;
    this.setData({
      storeID: this.data.storeID,
      packageNumber: this.data.packageNumber
    });
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 获取订单列表
    // wx.showLoading();
    var that = this;
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.currentType;

    wx.request({
      url: 'http://192.168.127.100:8086/order/find',
      data: {
        packageID: that.data.packageID
      },
      success: function (res) {
        console.log("/order/find:" + res.data);
        if (200 == res.data.statusCode) {
          that.data.orderList = res.data.data.data;
          var unarrived = [];
          var modify = [];
          var arrived = [];
          var totalOrder = that.data.orderList;
          for (var i = 0; i < totalOrder.length; i++) {
            console.log(totalOrder[i]);
            if (0 == totalOrder[i].orderstatus){
              var orderUnarrived = totalOrder[i];
              orderUnarrived['orderstatustext'] = "等待厂家配货";
              unarrived.splice(0, 0, orderUnarrived);
            }
            else if (1 == totalOrder[i].orderstatus) {
              var orderModify = totalOrder[i];
              orderModify['orderstatustext'] = "该订单已改期";
              modify.splice(0, 0, orderModify);
            }
            else if (2 == totalOrder[i].orderstatus) {
              var orderArrived = totalOrder[i];
              orderArrived['orderstatustext'] = "配货中心已入库";
              arrived.splice(0, 0, orderArrived);
            }
          }
          switch (that.data.currentType){
            case(0):{
              that.setData({
                orderList: unarrived
              });
            }
              break;
            case (1): {
              that.setData({
                orderList: modify
              });
            }
              break;
            case (2): {
              that.setData({
                orderList: arrived
              });
            }
              break;
            case (3): {
              that.setData({
                orderList: that.data.orderList
              });
            }
              break;
            default:
              break;
          }
        }
        console.log("/order/find: " + res.data.statusCode);
      }
    });

    console.log("currentType:" + that.data.currentType);
    if (0 == that.data.currentType) {
      this.setData({
        orderList: []
      });
    }
    else {
      this.setData({
        orderList: []
      });
    }
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  /** 
   * 页面相关事件处理函数--监听用户下拉动作 
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    console.log("onPullDownRefresh");
  }
})
