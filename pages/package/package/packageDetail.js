// var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    currentType: 0,
    tabClass: ["", "", "", "", ""]
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
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },
  toPayTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    var needScore = e.currentTarget.dataset.score;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          // res.data.data.balance
          money = money - res.data.data.balance;
          if (res.data.data.score < needScore) {
            wx.showModal({
              title: '错误',
              content: '您的积分不足，无法支付',
              showCancel: false
            })
            return;
          }
          if (money <= 0) {
            // 直接使用余额支付
            wx.request({
              url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                token: wx.getStorageSync('token'),
                orderId: orderId
              },
              success: function (res2) {
                that.onShow();
              }
            })
          } else {
            // wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '无法获取用户资金信息',
            showCancel: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrderStatistics: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: wx.getStorageSync('token') },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onShow: function () {
    // 获取订单列表
    // wx.showLoading();
    var that = this;
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.currentType;
    // this.getOrderStatistics();
    console.log("currentType:" + that.data.currentType);
    if (0 == that.data.currentType) {
      this.setData({
        orderList: [{ "dateAdd": 2018, "orderNumber": "2018060911101", "remark": "beizhu", "amountReal": "$1888.0", "score": "198", "status": "1", "id": "1" },
        { "dateAdd": 2019, "orderNumber": "2018060911101", "remark": "beizhu", "amountReal": "$2888.0", "score": "198", "status": "-1", "id": "2" },
        { "dateAdd": 2020, "orderNumber": "2018060911101", "remark": "beizhu", "amountReal": "$3888.0", "score": "198", "status": "4", "id": "3" }],
        logisticsMap: {},
        goodsMap: {}
      });
    }
    else {
      this.setData({
        orderList: [{ "dateAdd": 1990, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$188.0", "score": "198", "status": "1", "id": "8" },
        { "dateAdd": 1991, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$288.0", "score": "198", "status": "-1", "id": "7" },
        { "dateAdd": 1992, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$388.0", "score": "198", "status": "4", "id": "6" },
        { "dateAdd": 1993, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$488.0", "score": "198", "status": "1", "id": "5" },
        { "dateAdd": 1994, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$588.0", "score": "198", "status": "4", "id": "4" },
        { "dateAdd": 1995, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$688.0", "score": "198", "status": "-1", "id": "3" },
        { "dateAdd": 1996, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$788.0", "score": "198", "status": "1", "id": "2" },
        { "dateAdd": 1997, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "1", "id": "1" }],
        logisticsMap: {},
        goodsMap: {}
      });
    }
    return;
    this.setData({
      orderList: [{ "dateAdd": 1990, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "1", "id": "8" },
      { "dateAdd": 1991, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "-1", "id": "7" },
      { "dateAdd": 1992, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "4", "id": "6" },
      { "dateAdd": 1993, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "1", "id": "5" },
      { "dateAdd": 1994, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "4", "id": "4" },
      { "dateAdd": 1995, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "-1", "id": "3" },
      { "dateAdd": 1996, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "1", "id": "2" },
      { "dateAdd": 1997, "orderNumber": "2018060911100", "remark": "beizhu", "amountReal": "$888.0", "score": "198", "status": "1", "id": "1" }],
      logisticsMap: {},
      goodsMap: {}
    });
    return
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            orderList: res.data.data.orderList,
            logisticsMap: res.data.data.logisticsMap,
            goodsMap: res.data.data.goodsMap
          });
        } else {
          this.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {}
          });
        }
      }
    })

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
