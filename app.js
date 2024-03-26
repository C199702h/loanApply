//app.js
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 初始化慧眼实名核身组件
        const Verify = require('/verify_mpsdk/main');
        Verify.init();
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                var platform = res.platform;
                if (platform.toUpperCase() == 'ANDROID') {
                    platform = 'Android';
                } else if (platform.toUpperCase() == 'IOS') {
                    platform = 'IOS';
                } else {
                    platform = 'PC';
                }
                that.globalData.platform = platform;
                console.log("platform:" + platform);
            }
        })
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function (res) {
                    console.log(res)
                    if (res.code) {

                    } else {
                        console.log("获取用户登录状态失败! " + res.errMsg);
                    }

                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    login: function (cb) {
        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    if (typeof cb === 'function') {
                        cb(res);
                    }
                } else {
                    console.log("获取用户登录状态失败!" + res.errMsg);
                }
            }
        });
    },
    globalData: {
        userInfo: null,
        simSessionId: null,
        platform: null,
        authJnlNo: null,
        idNo: null,
        clientName: null,
        verifyResult: null,
        videoValidSeq: null,
        prodNo: null,
        sm4Encrypt: true,
        clientName: null,
        idNo: null,
        newFace: 1,//是否使用新人脸 0 使用旧的 1-使用新的
        seqNo: null,
        bizToken: null
    }
})