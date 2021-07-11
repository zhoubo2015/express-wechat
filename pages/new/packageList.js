// pages/new/packageList.js
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
        resultList: undefined,
        listData:undefined,
        //section header 距离 ‘当前顶部’ 距离
        sectionHeaderLocationTop: 0,
        //页面滚动距离
        scrollTop: 0,
        //是否悬停
        fixed: false,
        packageListCallback: undefined,
    },
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false,
            resultList: ""
        });
    },
    clearInput: function() {
        this.setData({
            inputVal: "",
            resultList: ""
        });
    },
    inputTyping: function(e) {
        console.log("input: " + e.detail.value);
        var inputStr = e.detail.value;
        var that = this;
        // debugger
        if (inputStr.length > 0) {
            wx.request({
                url: util.factorysearch(),
                data: {
                    tokenKey: app.globalData.openid,
                    search: inputStr
                },
                success: function(res) {
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
        } else {
            wx.request({
                url: util.factorysearch(),
                data: {
                    tokenKey: app.globalData.openid
                },
                success: function(res) {
                    console.log(res.data);
                    if (200 == res.data.statusCode) {
                        // debugger
                        that.setData({
                            tokenKey: app.globalData.openid,
                            resultList: res.data.data.data
                        });
                    }
                    console.log("factory/search: " + res.data.statusCode);
                }
            });
        }
    },
    statusTap: function(e) {
        var curType = e.currentTarget.dataset.index;
        this.data.currentType = curType
        this.setData({
            currentType: curType
        });
        this.onShow();
    },
    didSelectedTap : function(e) {
        var dataIndex = e.currentTarget.dataset.index;
        console.log("index:" + dataIndex);
        /*        this.data.packageID = options.packageID;
        this.data.storeID = options.storeID;
        this.data.packageNumber = options.packageNumber;*/
        var orderJsonStr = JSON.stringify(this.data.listData[dataIndex].orderList);
        wx.navigateTo({
            url: '../package/package/packageDetail?packageID=' + this.data.listData[dataIndex].packageid + '&storeID=' + this.data.listData[dataIndex].storeData.storeid + '&storeNumber=' + this.data.listData[dataIndex].storeData.storenumber + '&packageNumber=' + this.data.listData[dataIndex].packagenumber + '&orderList=' + orderJsonStr
        });
    },
    searchResultTap: function(e) {
        console.log("searchResultTap:" + e.currentTarget.id);
        var index = e.currentTarget.id;
    },
    newOrderTap: function(e) {
        console.log("newOrderTap:" + e.currentTarget.id);
        var index = e.currentTarget.id;
        if (undefined != this.data.packageID) {
            wx.navigateTo({
                url: 'order/newOrder?factoryID=' + this.data.factoryList[index].factoryid + '&factoryName=' + this.data.factoryList[index].factoryname + '&contactName=' + this.data.factoryList[index].contactname + '&contactAddress=' + this.data.factoryList[index].contactaddress + '&phoneNumber=' + this.data.factoryList[index].phonenumber + '&packageID=' + this.data.packageID
            });
        } else {
            wx.navigateTo({
                url: 'order/newOrder?factoryID=' + this.data.factoryList[index].factoryid + '&factoryName=' + this.data.factoryList[index].factoryname + '&contactName=' + this.data.factoryList[index].contactname + '&contactAddress=' + this.data.factoryList[index].contactaddress + '&phoneNumber=' + this.data.factoryList[index].phonenumber
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (undefined != options.packageID) {
            this.data.packageID = options.packageID;
        }
        this.bWaitingAddress = false;
        wx.getSystemInfo({
            success: function(res) {
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
    onReady: function() {
        let that = this
        console.log("onReady " + this.realWindowHeight);
        var rHeight = this.realWindowHeight - 48;
        var sHeight = this.realWindowHeight - 48 - 48 - 44;
        this.setData({
            resultHeight: rHeight,
            scrollHeight: sHeight
        });

        let query = wx.createSelectorQuery()
        query.select(".section-header").boundingClientRect(function (res) {
        // console.log(res)
        that.setData({
            //section header 距离 ‘当前顶部’ 距离
            sectionHeaderLocationTop: res.top + that.data.scrollTop
        })
        }).exec()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log("onShow");
        if (undefined == app.globalData.userInfo) {
            wx.showToast({
                title: '请先注册登录',
                icon: 'error',
                duration: 2000,
            })
            return;
        }
        this.updatePackageList(undefined);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        console.log("pull down");
        if (undefined == app.globalData.userInfo) {
            wx.showToast({
                title: '请先注册登录',
                icon: 'error',
                duration: 2000,
            })
            wx.stopPullDownRefresh();
            return;
        }
        var that = this;
        this.packageListCallback = res => {
            wx.stopPullDownRefresh();
        }
        this.updatePackageList(this.packageListCallback);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    newCompany: function() {
        wx.navigateTo({
            url: 'addCompany/newCompany',
        });
    },
    onPageScroll: function (e) {
        //console.log(e)
        this.setData({
          scrollTop: e.scrollTop
        })
        if (e.scrollTop > this.data.sectionHeaderLocationTop) {
          this.setData({
            fixed: true
          })
        } else {
          this.setData({
            fixed: false
          })
        }
    },
    updatePackageList: function(callback) {
        var that = this;
        wx.request({
            url: util.packageList(),
            data: {
                tokenKey: app.globalData.openid
            },
            success: function(res) {
                console.log("packageList:" + res.data);
                if (200 == res.data.statusCode) {
                    that.data.listData = res.data.data.data;
                    that.setData({
                        listData: that.data.listData
                    });
                }
                if (callback) {
                    callback();
                }
                console.log("/webChat/packageList: " + res.data.statusCode);
            },
            fail: function(res) {
                if (callback) {
                    callback();
                }
            }
        });
    }
})