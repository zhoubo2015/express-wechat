// pages/package/package.js
var inputinfo = "";  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageMe: 'Hello MINA!',
    array: [1, 2, 3, 4, 5],
    packageList: [],  
    animationData: "",
    showModalStatus: false,
    address: ""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //https://user-images.githubusercontent.com/2777305/40645613-759aaef4-6359-11e8-8b20-eff82b0355b1.png
    // 查看是否授权
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称");
          wx.getUserInfo({
            success: function (res) {
              console.log("getUserInfo errMsg: " + res.errMsg)
              app.globalData.userInfo = res.userInfo;
              console.log(res.userInfo);
              console.log("getUserInfo rawData: " + res.rawData);
              that.updateUserInfo();
            }
          })
        }
        else {
          console.log("getUserInfo 未授权"); 
          that.showModal();
        }
      }
    });
    // that.setData({
    //   packageList: [{ "time": 2018, "title": "damon", "address":"hang"},
    //     { "time": 2019, "title": "damon", "address": "hangzhou" },
    //     { "time": 2020, "title": "damon11", "address": "hang" },
    //     { "time": 2021, "title": "da", "address": "hangzhou" },
    //     { "time": 2022, "title": "damon", "address": "hangzhou" },
    //     { "time": 2023, "title": "damon", "address": "hangzhou" },
    //     { "time": 2024, "title": "damon", "address": "hangzhou" }] 
    // });  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("packge onReady");
    //获得dialog组件
    // this.dialog = this.selectComponent("#dialog");
    // console.log("dialog: " + this.dialog);
    // this.dialog.showDialog();
  },
  // showDialog: function () {
  //   this.dialog.showDialog();
  // },

  // myConfirmEvent: function () {
  //   this.dialog.hideDialog();
  //   console.log("confirmEvent");
  // },
  // myBindGetUserInfo: function (e) {
  //   // bind:confirmEvent='confirmEvent'
  //   // bind: bindGetUserInfo = 'bindGetUserInfo'
  // // "usingComponents": {
  // //   "dialog": "../../components/dialog/dialog"
  // // }
  //   // 用户点击授权后，这里可以做一些登陆操作
  //   console.log("bindGetUserInfo");
  //   wx.showToast({
  //     title: 'hahaahha授权',
  //   })
  // },
  bindGetUserInfo: function(e){
    console.log("bindGetUserInfo errMsg: " + e.detail.errMsg)
    console.log("bindGetUserInfo userInfo: " + e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo;
    console.log("bindGetUserInfo rawData: " + e.detail.rawData);
    this.updateUserInfo();
  },
  confirmEvent: function(){
    console.log("confirmEvent");
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("package onShow");
    // this.showDialog();
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
    console.log("下拉");

    // wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("到底了");
  },
  onPageScroll: function (res) {
    console.log("scrolling..."+ res.scrollTop);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '哈哈',
      path: '/page/user?id=123'
    }
  },
  viewTapMe: function () {
    console.log('view tap me')
  },
  addNewList: function (e) {
    console.log("addNewList" + e.target.id);
    // wx.getUserInfo({
    //   success: function (res) {
    //     console(res.userInfo)
    //   }
    // })
  },
  closePackage: function (e) {
    console.log("closePackage" + e.target.id);
  },
  updatePackageList: function() {
    var that = this;
    wx.request({
      url: 'http://192.168.127.100:8086/package/find',
      data: {
        userID: app.globalData.userInfo.userid,
      },
      success: function (res) {
        console.log(res.data);
        if (200 == res.data.statusCode) {
          var list = res.data.data;
          console.log("packageList: " + list);
          for (var i = 0; i < list.length; i++) {
            console.log(list[i]);
            var unarrived = 0;
            var modify = 0;
            var arrived = 0;
            var totalOrder = list[i].orderList.length;
            var deadTime = list[i].orderList[0].deadlinedate;
            var totalTips = list[i].orderList.length;
            for (var j = 0; j < list[i].orderList.length; j++) {
              if (deadTime < list[i].orderList[j].deadlinedate){
                deadTime = list[i].orderList[j].deadlinedate;
              }
              switch (list[i].orderList[j].orderstatus){
                case 0:{
                  unarrived = unarrived + 1;
                }
                  break;
                case 1:{
                  modify = modify + 1;
                }
                  break;
                case 2: {
                  arrived = arrived + 1;
                }
                  break;
                default:
                  break;
              }
            }
            list[i]['unarrived'] = unarrived;
            list[i]['modify'] = modify;
            list[i]['arrived'] = arrived;
            list[i]['totalOrder'] = totalOrder;
            list[i]['totalTips'] = totalTips;
            list[i]['deadTime'] = deadTime;
          }
          console.log("changed list:" + list);
          that.data.packageList = list;
          that.setData({
            packageList: that.data.packageList
          });
        }
      }
    })
  },
  updateUserInfo: function(){
    var that = this;
    //查询是否存在
    wx.request({
      url: 'http://192.168.127.100:8086/user/find',
      data: {
        openID: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data);
        if (200 == res.data.statusCode){
          if (40003 == res.data.data.code) {
            //不存在，则创建新用户
            wx.request({
              url: 'http://192.168.127.100:8086/user/new',
              data: {
                nickName: app.globalData.userInfo.nickName,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                phoneNumber: "15867139686",
                gender: app.globalData.userInfo.gender,
                openID: app.globalData.openid
              },
              success: function (res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                  console.log("new user create! " + res.data.data.code);
                  //新建后，重新获取一次用户数据
                  wx.request({
                    url: 'http://192.168.127.100:8086/user/find',
                    data: {
                      openID: app.globalData.openid
                    },
                    success: function (res) {
                      console.log(res.data);
                      if (200 == res.data.statusCode) {
                        if (40003 != res.data.data.code) {
                          app.globalData.userInfo = res.data.data.data[0];
                          that.updatePackageList();
                        }
                      }
                      console.log("/user/new: " + res.data.statusCode);
                    }
                  });
                }
                console.log("/user/new: " + res.data.statusCode);
              }
            });
          }
          else {
            //存在用户
            var test = (res.data.data.data[0]);
            // debugger
            app.globalData.userInfo = res.data.data.data[0];
            that.updatePackageList();
          }
        }
        if (200 == res.data.statusCode) {
          
        }
        console.log("/user/find: " + res.data.statusCode);
      },
      fail:function(){
        console.log("/user/find: api failed");
      }
    });
  },
  showModal: function () {
    // 显示遮罩层    
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 20)
  },//myview 为点击控件的bindtap 应用时写在对应控件中就好  
  myview: function () {
    if (this.data.showModalStatus) {
      this.hideModal();
    } else {
      this.showModal();
    }
  },
  hideModal: function () {
    // 隐藏遮罩层    
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 20)
  },
  click_cancel: function () {
    console.log("点击取消");
    this.hideModal();
  },
  click_ok: function () {
    console.log("点击确定，输入的信息为为==", inputinfo);
    this.hideModal();
  },
  input_content: function (e) {
    console.log(e);
    inputinfo = e.detail.value;
  }
})