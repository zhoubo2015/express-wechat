// pages/package/package.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //https://user-images.githubusercontent.com/2777305/40645613-759aaef4-6359-11e8-8b20-eff82b0355b1.png
    var that = this
    that.setData({
      packageList: [{ "time": 2018, "title": "damon", "address":"hang"},
        { "time": 2019, "title": "damon", "address": "hangzhou" },
        { "time": 2020, "title": "damon11", "address": "hang" },
        { "time": 2021, "title": "da", "address": "hangzhou" },
        { "time": 2022, "title": "damon", "address": "hangzhou" },
        { "time": 2023, "title": "damon", "address": "hangzhou" },
        { "time": 2024, "title": "damon", "address": "hangzhou" }] 
    });  
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
  data: {
    messageMe: 'Hello MINA!',
    array: [1, 2, 3, 4, 5],
    packageList:[]  
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
  }
})