// pages/package/package.js
var inputinfo = "";
var app = getApp();
var util = require('../../common/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageMe: 'Hello MINA!',
        array: [1, 2, 3, 4, 5],
        orderList: [],
        animationData: "",
        showModalStatus: false,
        address: "",
        balePackageStatus: false,
        baleBtnTitle: "打包发货",
        addBtnTitle: "添加订单",
        storeNumber: "",
        statusType: ["未入仓", "已入仓", "已入库", "总订单"],
        currentType: 3,
        baleOrderNumbers: "",
        orderListCallback: undefined,
        checkStatus: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //https://user-images.githubusercontent.com/2777305/40645613-759aaef4-6359-11e8-8b20-eff82b0355b1.png
        // 查看是否授权
        console.log("orderList.js onLoad");
        var that = this;
        wx.showLoading({
            title: '登录中...',
        });
        wx.checkSession({
            success: function() {
                //session_key 未过期，并且在本生命周期一直有效
                console.log("session_key 未过期，并且在本生命周期一直有效");
                app.globalData.hasLogin = true;
                // that.globalData.openid = "oxiEr5Ox2L7goNZTKGY5IRGIl0sI";
                // app.globalData.hasLogin = true
                wx.getStorage({
                    key: 'localOpenID',
                    success: function(res) {
                        console.log("getStorage" + res.data);
                        var json = JSON.parse(res.data);
                        console.log(json['openIDKey']);
                        app.globalData.openid = json['openIDKey'];
                        that.checkoutUserInfoCompele();
                        // app.globalData.sessionKey = json['sessionKey'];
                        // wx.getSetting({
                        //     success: function(res) {
                        //         if (res.authSetting['scope.userInfo']) {
                        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        //             console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称");
                        //             wx.getUserInfo({
                        //                 success: function(res) {
                        //                     console.log("getUserInfo errMsg: " + res.errMsg)
                        //                     app.globalData.userInfo = res.userInfo;
                        //                     console.log(res.userInfo);
                        //                     console.log("getUserInfo rawData: " + res.rawData);
                        //                     that.updateUserInfo();
                        //                     wx.hideLoading()
                        //                 }
                        //             });
                        //         } else {
                        //             console.log("getUserInfo 未授权");
                        //             wx.hideLoading();
                        //             that.showModal();
                        //         }
                        //     }
                        // });
                    },
                    fail: function(res) {
                        //{"session_key":"cdAwOIaaXNBty+nGlOyrPQ==","openid":"oxiEr5Ox2L7goNZTKGY5IRGIl0sI"}
                        console.log("本地获取openid失败");
                        that.login();
                    }
                });
            },
            fail: function() {
                // session_key 已经失效，需要重新执行登录流程
                console.log("session_key 已经失效，需要重新执行登录流程");
                //重新登录
                that.login();
            }
        });


        // wx.getSetting({
        //   success: function (res) {
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //       console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称");
        //       wx.getUserInfo({
        //         success: function (res) {
        //           console.log("getUserInfo errMsg: " + res.errMsg)
        //           app.globalData.userInfo = res.userInfo;
        //           console.log(res.userInfo);
        //           console.log("getUserInfo rawData: " + res.rawData);
        //           that.updateUserInfo();
        //         }
        //       });
        //     }
        //     else {
        //       console.log("getUserInfo 未授权");
        //       that.showModal();
        //     }
        //   }
        // });
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
    onReady: function() {
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
    bindGetUserInfo: function(e) {
        console.log("bindGetUserInfo errMsg: " + e.detail.errMsg)
        console.log("bindGetUserInfo userInfo: " + e.detail.userInfo)
        app.globalData.userInfo = e.detail.userInfo;
        console.log("bindGetUserInfo rawData: " + e.detail.rawData);
        this.updateUserInfo();
    },
    confirmEvent: function() {
        console.log("confirmEvent");
        this.hideModal();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        console.log("package onShow");
        // this.showDialog();
        console.log(app.globalData.userInfo);
        if (undefined == app.globalData.userInfo && this.data.checkStatus) {
            wx.showToast({
                title: '请先注册登录',
                icon: 'error',
                duration: 2000,
            })
            return;
        }
        this.updateOrderList();
        this.updateStoreNumber(undefined);
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
        console.log("下拉");
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
        this.orderListCallback = res => {
            wx.stopPullDownRefresh();
        }
        this.updateOrderList();
        this.updateStoreNumber(this.orderListCallback);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log("到底了");
    },
    onPageScroll: function(res) {
        console.log("scrolling..." + res.scrollTop);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '织里童装拼包行业开创者',
            path: '/page/user?id=123'
        }
    },
    viewTapMe: function() {
        console.log('view tap me')
    },
    addNewList: function(e) {
        console.log("addNewList" + e.target.id);
        // wx.getUserInfo({
        //   success: function (res) {
        //     console(res.userInfo)
        //   }
        // })
    },
    closePackage: function(e) {
        console.log("closePackage" + e.target.id);
    },
    login: function() {
        console.log("start wx.login");
        var that = this;
        wx.login({
            // wx.login({
            success: function(res) {
                console.log("wx.login code:" + res.code);
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: util.sessionurl(),
                        data: {
                            code: res.code,
                            apptype: 1
                        },
                        success: function(res) {
                            console.log("从自己服务器获取openid: " + res.data.data);
                            var json = JSON.parse(res.data.data.data);
                            console.log(json['openIDKey']);
                            app.globalData.openid = json['openIDKey'];
                            // app.globalData.sessionKey = json['sessionKey'];
                            if (200 == res.data.statusCode) {
                                wx.setStorage({
                                    key: "localOpenID",
                                    data: res.data.data.data,
                                    success: function(res) {
                                        // wx.showToast({
                                        //   title: 'Storage',
                                        // })
                                    },
                                    fail: function(res) {
                                        console.log("setStorage failed");
                                    }
                                });
                                that.checkoutUserInfoCompele();
                                // wx.getSetting({
                                //     success: function(res) {
                                //         if (res.authSetting['scope.userInfo']) {
                                //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                                //             console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称");
                                //             wx.getUserInfo({
                                //                 success: function(res) {
                                //                     console.log("getUserInfo errMsg: " + res.errMsg)
                                //                     app.globalData.userInfo = res.userInfo;
                                //                     console.log(res.userInfo);
                                //                     console.log("getUserInfo rawData: " + res.rawData);
                                //                     that.updateUserInfo();
                                //                     wx.hideLoading();
                                //                 }
                                //             });
                                //         } else {
                                //             console.log("getUserInfo 未授权");
                                //             wx.hideLoading();
                                //             that.showModal();
                                //         }
                                //     },
                                //     fail: function(res) {
                                //         wx.hideLoading();
                                //     }
                                // });
                            } else {
                                console.log("获取openid失败");
                                wx.hideLoading()
                            }
                        },
                        fail: function(res) {
                            wx.hideLoading();
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                    wx.hideLoading();
                }
                app.globalData.hasLogin = true
                // that.setData({
                //   hasLogin: true
                // })
                // that.update()
            },
            fail: function(res) {
                wx.hideLoading()
            }
        })
    },
    checkoutUserInfoCompele: function () {
        var that = this;
        console.log("api :" + util.userfind());
        //查询是否存在
        wx.request({
            url: util.userfind(),
            data: {
                tokenKey: app.globalData.openid
            },
            success: function(res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                    if (40003 == res.data.data.retCode) {
                        //不存在，则创建新用户
                        
                    } else if (30000 == res.data.data.retCode) {
                        //key超时
                        that.login();
                    } else {
                        //存在用户
                        var test = (res.data.data.data[0]);
                        console.log("updateUser");
                        if ('微信用户' == test.nickname ||
                        undefined == test.wxnickname || '' == test.wxnickname || '微信用户' == test.wxnickname) {
                            app.globalData.userInfo = undefined;
                            wx.showToast({
                              title: '请先注册登录',
                              icon: 'error',
                              duration: 2000,
                            })
                        }
                        else {
                            app.globalData.userInfo = res.data.data.data[0];
                            that.updateOrderList();
                            that.updateStoreNumber(undefined);
                        }
                    }
                }
                if (200 == res.data.statusCode) {

                }
                console.log("/user/find: " + res.data.statusCode);
                that.data.checkStatus = true;
                wx.hideLoading();
            },
            fail: function(res) {
                console.log(res + res.errMsg);
                console.log("/user/find: api failed");
                wx.hideLoading();
                wx.showToast({
                  title: '登录失败',
                })
                that.data.checkStatus = true;
            }
        });
    },
    updateUserInfo: function() {


        var that = this;
        console.log("api :" + util.userfind());
        //查询是否存在
        wx.request({
            url: util.userfind(),
            data: {
                tokenKey: app.globalData.openid
            },
            success: function(res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                    if (40003 == res.data.data.retCode) {
                        //不存在，则创建新用户
                        wx.request({
                            url: util.usernew(),
                            data: {
                                nickName: app.globalData.userInfo.nickName,
                                avatarUrl: app.globalData.userInfo.avatarUrl,
                                phoneNumber: "15867139686",
                                gender: app.globalData.userInfo.gender,
                                openID: app.globalData.openid
                            },
                            success: function(res) {
                                console.log(res.data);
                                if (200 == res.data.statusCode) {
                                    console.log("new user create! " + res.data.data.code);
                                    //新建后，重新获取一次用户数据
                                    wx.request({
                                        url: util.userfind(),
                                        data: {
                                            openID: app.globalData.openid
                                        },
                                        success: function(res) {
                                            console.log(res.data);
                                            if (200 == res.data.statusCode) {
                                                if (40003 != res.data.data.code) {
                                                    app.globalData.userInfo = res.data.data.data[0];
                                                    that.updateOrderList();
                                                    that.updateStoreNumber(undefined);
                                                }
                                            }
                                            console.log("/user/new: " + res.data.statusCode);
                                        }
                                    });
                                }
                                console.log("/user/new: " + res.data.statusCode);
                            }
                        });
                    } else if (30000 == res.data.data.retCode) {
                        //key超时
                        that.login();
                    } else {
                        //存在用户
                        var test = (res.data.data.data[0]);
                        if (0 == test.avatarurl.length) {
                            //need uodate user info
                            wx.request({
                                url: util.updateUser(),
                                data: {
                                    nickName: app.globalData.userInfo.nickName,
                                    avatarUrl: app.globalData.userInfo.avatarUrl,
                                    phoneNumber: "000",
                                    gender: app.globalData.userInfo.gender,
                                    tokenKey: app.globalData.openid
                                },
                                success: function(res) {
                                    console.log(res.data);
                                    if (200 == res.data.statusCode) {
                                        console.log("user update! " + res.data.data.retCode);
                                        //更新后，重新获取一次用户数据
                                        wx.request({
                                            url: util.userfind(),
                                            data: {
                                                tokenKey: app.globalData.openid
                                            },
                                            success: function(res) {
                                                console.log(res.data);
                                                if (200 == res.data.statusCode) {
                                                    if (40003 != res.data.data.retCode) {
                                                        app.globalData.userInfo = res.data.data.data[0];
                                                        that.updateOrderList();
                                                        that.updateStoreNumber(undefined);
                                                    }
                                                }
                                                console.log("/user/new: " + res.data.statusCode);
                                            }
                                        });
                                    }
                                    console.log("/user/new: " + res.data.statusCode);
                                }
                            });
                        } else {
                            // debugger
                            app.globalData.userInfo = res.data.data.data[0];
                            that.updateOrderList();
                            that.updateStoreNumber(undefined);
                        }
                    }
                }
                if (200 == res.data.statusCode) {

                }
                console.log("/user/find: " + res.data.statusCode);
            },
            fail: function(res) {
                console.log(res + res.errMsg);
                console.log("/user/find: api failed");
            }
        });


    },
    baleOrderRequest: function() {
        var that = this;
        console.log("baleOrderRequest:" + this.data.baleOrderNumbers);
        wx.request({
            url: util.balePackage(),
            data: {
                tokenKey: app.globalData.openid,
                orderNumbers: that.data.baleOrderNumbers
            },
            success: function(res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                    if (0 == res.data.data.retCode) {
                        var packageData = res.data.data.data;
                        console.log("package: " + packageData);

                        that.data.balePackageStatus = !that.data.balePackageStatus;
                        that.setData({
                            baleOrderNumbers: "",
                            baleBtnTitle: "打包发货",
                            addBtnTitle: "添加订单"
                        });

                        wx.showToast({
                            title: '打包成功!',
                        });

                        that.updateOrderList();
                    } else {

                    }
                }
            }
        });
    },
    updateStoreNumber: function(callback) {
        var that = this;
        wx.request({
            url: util.findStore(),
            data: {
                tokenKey: app.globalData.openid
            },
            success: function(res) {
                console.log(res.data);
                if (200 == res.data.statusCode) {
                    if (0 == res.data.data.retCode) {
                        var storeTableList = res.data.data.data;
                        console.log("storeTableList: " + storeTableList);
                        if (storeTableList) {
                            var storeNumber = "";
                            storeTableList.forEach(storeTable => {
                                storeNumber = storeNumber + " " + storeTable.storenumber;
                            });
                            // var storeNumber = storeTable.storenumber;
                            that.setData({
                                storeNumber: storeNumber
                            });
                        }
                    }
                }
                if (callback) {
                    callback();
                }
            },
            fail: function(res) {
                if (callback) {
                    callback();
                }
            }
        });
    },
    updateOrderList: function() {
        var that = this;
        if (undefined == app.globalData.userInfo) {
            console.log("-------undefined");
            // var testError = "naocanerror";
        } else {
            console.log("-------null");
            wx.request({
                url: util.orderList(),
                data: {
                    tokenKey: app.globalData.openid
                },
                success: function(res) {
                    console.log(res.data);
                    if (200 == res.data.statusCode) {
                        var totalOrder = res.data.data.data;
                        console.log("orderList: " + totalOrder);
                        var unarrived = [];
                        var arrived = [];
                        var confirmed = [];
                        for (var i = 0; i < totalOrder.length; i++) {
                            console.log(totalOrder[i]);
                            totalOrder[i]['checked'] = '';
                            totalOrder[i]['value'] = totalOrder[i].ordernumber;
                            totalOrder[i]['display'] = '';
                            if (0 == totalOrder[i].orderstatus) {
                                totalOrder[i]['orderstatustext'] = "等待厂家配货";
                                var orderUnarrived = totalOrder[i];
                                // unarrived.splice(0, 0, orderUnarrived);
                                unarrived.push(orderUnarrived);
                            } else if (1 == totalOrder[i].orderstatus) {
                                totalOrder[i]['orderstatustext'] = "配货中心已入库";
                                var orderArrived = totalOrder[i];
                                // arrived.splice(0, 0, orderArrived);
                                arrived.push(orderArrived);
                            }else if (2 == totalOrder[i].orderstatus) {
                                totalOrder[i]['orderstatustext'] = "配货中心已点货";
                                var orderConfirmed = totalOrder[i];
                                // confirmed.splice(0, 0, orderConfirmed);
                                confirmed.push(orderConfirmed);
                            }
                        }
                        that.data.orderList = totalOrder;
                        switch (that.data.currentType) {
                            case (0):
                                {
                                    that.setData({
                                        orderList: unarrived
                                    });
                                }
                                break;
                            case (1):
                                {
                                    that.setData({
                                        orderList: arrived
                                    });
                                }
                                break;
                            case (2):
                                {
                                    that.setData({
                                        orderList: confirmed
                                    });
                                }
                                break;
                            default:
                                {
                                    that.setData({
                                        orderList: that.data.orderList
                                    });
                                }
                                break;
                                break;
                        }
                    }
                }
            });
        }
    },
    showModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 20)
    }, //myview 为点击控件的bindtap 应用时写在对应控件中就好  
    myview: function() {
        if (this.data.showModalStatus) {
            this.hideModal();
        } else {
            this.showModal();
        }
    },
    hideModal: function() {
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
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 20)
    },
    click_cancel: function() {
        console.log("点击取消");
        this.hideModal();
    },
    click_ok: function() {
        console.log("点击确定，输入的信息为为==", inputinfo);
        this.hideModal();
    },
    input_content: function(e) {
        console.log(e);
        inputinfo = e.detail.value;
    },
    checkboxChange: function(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        var items = this.data.orderList;
        var values = e.detail.value;
        if (false == this.data.balePackageStatus) {
            return;
        }
        this.data.baleOrderNumbers = values.toString();
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].value == values[j]) {
                    items[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            orderList: items
        });
    },
    addNewOrder: function(e) {
        console.log("addNewOrder: " + this.data.balePackageStatus);
        if (this.data.balePackageStatus) {
            console.log("bale package:" + this.data.baleOrderNumbers);
            this.baleOrderRequest();
        } else {
            wx.navigateTo({
                url: "/pages/package/order/addOrder?packageID=" + this.data.packageID
            });
        }
    },
    baleOrder: function(e) {
        console.log("changeOrder");

        this.data.balePackageStatus = !this.data.balePackageStatus;
        var baleBtnTitle = "";
        var addBtnTitle = "";
        var baleOrderNumbers = this.data.baleOrderNumbers;
        if (this.data.balePackageStatus) {
            baleBtnTitle = "取消打包";
            addBtnTitle = "确认打包";
        } else {
            baleBtnTitle = "打包发货";
            addBtnTitle = "添加订单";
            // baleOrderNumbers = "";
            this.data.baleOrderNumbers = "";
        }

        var items = this.data.orderList;
        for (var i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].display = !items[i].display;
        }

        this.setData({
            orderList: items,
            baleBtnTitle: baleBtnTitle,
            addBtnTitle: addBtnTitle
        });
    },
    orderDetail: function(e) {
        var orderId = e.currentTarget.id;
        if (true == this.data.balePackageStatus) {
            return;
        }
        console.log("orderID: " + orderId);
        wx.navigateTo({
            url: "/pages/package/order/orderDetail?orderID=" + orderId
        })
    },
    statusTap: function(e) {
        var curType = e.currentTarget.dataset.index;
        this.data.currentType = curType
        this.setData({
            currentType: curType
        });
        this.updateOrderList();
    },
})