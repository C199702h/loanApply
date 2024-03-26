// pages/auth/auth.js
var commonData = require('../../utils/data.js')
var commonUtil = require('../../utils/util.js')
var encrypt = require('../../utils/encrypt.js');
const {Base64} = require('../../utils/util.js');
Page({
    data: {
        SMSButtonText: '获取验证码',
        ImgSrc: '',
        'attendSuccessImg': '',
        'canvasImgUrl': '',
        'picSrc1': '../../images/camera.png',
        'picSrc2': '../../images/camera.png',
        'imgClass1': 'camera-img',
        'imgClass2': 'camera-img',
        'textShow1': true,
        'textShow2': true,
        'SeqNo': null,
        'MChannelId': 'microp',
        checkShow: "show",
        checkShowNext: "hidden",
        cardShow: "hidden",
        checkCardShowNext: "hidden",
        authShow: false //当前页面是否展示
    },
    uploadNum: 0,
    uploadSuccessNum: 0,

    // 点击照相
    takePic1: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    'attendSuccessImg': tempFilePaths[0],
                    'picSrc1': tempFilePaths[0],
                    'imgClass1': 'camera-img-after',
                    'textShow1': false
                });

                // 根据图片大小缩放图片
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function (res) {
                        console.log(res);
                        var width;
                        var height;
                        if (res.width > 600 & res.height > 600) {
                            width = res.width;
                            height = res.height;
                            do {
                                width = width / 2;
                                height = height / 2;
                            } while (height > 600 | width > 600)
                        } else if (res.width > 600 | res.height > 600) {
                            width = res.width / 2;
                            height = res.height / 2;
                        } else if (res.width > 300 & res.height > 300) {
                            width = res.width * 0.66;
                            height = res.height * 0.66;
                        } else {
                            width = res.width;
                            height = res.height;
                        }
                        drawCanvas(width, height);
                    }
                })

                // 生成图片
                function drawCanvas(width, height) {
                    console.log(width + ',' + height);
                    const ctx = wx.createCanvasContext('myCanvas');
                    ctx.drawImage(tempFilePaths[0], 0, 0, width, height);
                    ctx.draw(false, function () {
                        wx.canvasToTempFilePath({
                            canvasId: 'myCanvas',
                            fileType: 'jpg',
                            width: width,
                            height: height,
                            destWidth: width,
                            destHeight: height,
                            success: function (res) {
                                that.setData({
                                    'canvasImgUrl': res.tempFilePath
                                });
                                console.log(res.tempFilePath);
                                that.getPhotoData(0);
                            },
                            fail: function (error) {
                                console.log(error);
                            },
                            complete: function complete(e) {

                            }
                        })
                    });
                }
            }
        });
    },

    takePic2: function () {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    'attendSuccessImg': tempFilePaths[0],
                    'picSrc2': tempFilePaths[0],
                    'imgClass2': 'camera-img-after',
                    'textShow2': false
                });

                // 根据图片大小缩放图片
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function (res) {
                        console.log(res);
                        var width;
                        var height;
                        if (res.width > 600 & res.height > 600) {
                            width = res.width;
                            height = res.height;
                            do {
                                width = width / 2;
                                height = height / 2;
                            } while (height > 600 | width > 600)
                        } else if (res.width > 600 | res.height > 600) {
                            width = res.width / 2;
                            height = res.height / 2;
                        } else if (res.width > 300 & res.height > 300) {
                            width = res.width * 0.66;
                            height = res.height * 0.66;
                        } else {
                            width = res.width;
                            height = res.height;
                        }
                        drawCanvas(width, height);
                    }
                })

                // 生成图片
                function drawCanvas(width, height) {
                    console.log(width + ',' + height);
                    const ctx = wx.createCanvasContext('myCanvas2');
                    ctx.drawImage(tempFilePaths[0], 0, 0, width, height);
                    ctx.draw(false, function () {
                        wx.canvasToTempFilePath({
                            canvasId: 'myCanvas2',
                            fileType: 'jpg',
                            width: width,
                            height: height,
                            destWidth: width,
                            destHeight: height,
                            success: function (res) {
                                that.setData({
                                    'canvasImgUrl': res.tempFilePath
                                });
                                console.log(res.tempFilePath);
                                that.getPhotoData(1);
                            },
                            fail: function (error) {
                                console.log(error);
                            },
                            complete: function complete(e) {
                            }
                        })
                    });
                }
            }
        });


    },
    getFaceVideo: function (that) {
        wx.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 6,
            camera: 'front',
            compressed: true,
            success: function (res1) {
                // 这个就是最终拍摄视频的临时路径了
                var tempFilePath = res1.tempFilePath;
                var url = commonData.getConstantData('serverURL') + 'LoanFaceValid.do?' + commonData.getConstantData('commonUrlArg1');
                that.setData({showLoading: true});
                var platform = "android"
                wx.getSystemInfo({
                    success: function (res) {
                        if (res.platform == "ios") {
                            platform = "ios";
                        } else {
                            platform = "android";
                        }
                    },
                })
                wx.uploadFile({
                    url: url,
                    filePath: tempFilePath,
                    name: 'UploadFile',
                    formData: {
                        _locale: 'zh_CN',
                        SimSessionId: getApp().globalData.simSessionId,
                        ClientName: getApp().globalData.clientName,
                        IdNo: getApp().globalData.idNo,
                        Platform: platform,
                        AuthJnlNo: getApp().globalData.authJnlNo,
                    },
                    page: that,
                    success: function (res) {
                        that.setData({showLoading: false});
                        if (res.statusCode && res.statusCode != "200") {
                            commonUtil.wx_showModal('连接服务器失败,请联系服务端管理员:' + res.statusCode);
                            return;
                        }
                        if (res.data) {
                            var responseData = JSON.parse(res.data);
                            var result = responseData.Result;
                            if (result && result == '0') {
                                getApp().globalData.videoValidSeq = responseData.VideoValidSeq;
                                // 实名制验证
                                //   that.setData({
                                //     checkShow:'hidden',
                                //     phoneNumberInput:'false',
                                //     cardShow:'hidden',
                                //     checkShowNext:'show',
                                //     phoneNumberInput:'false',
                                //   })
                                //验证成功后跳的页面 根据产品号跳转
                                if ('030110' == getApp().globalData.prodNo) {
                                    wx.navigateTo({
                                        url: '../apply/optimalE/optimalE'
                                    })
                                } else {
                                    wx.navigateTo({
                                        url: '../apply/apply'
                                    })
                                }
                            } else {
                                commonUtil.wx_showModal('人脸识别失败,请重新尝试!');
                            }
                        } else {
                            commonUtil.wx_showModal('人脸识别服务异常,请重新尝试!');
                        }
                    },
                    fail: function (err) {
                        that.setData({showLoading: false});
                        commonUtil.wx_showModal('人脸识别超时,请稍后重新尝试!');
                    }
                });
            },
            fail: function () {
                console.error("拍摄视频出错");
            }
        })
    },
    //调用OCR身份证识别接口
    getPhotoData: function (carType) {
        var that = this;
        var k = encrypt.getK();
        let sm4SecretKey = encrypt.strToBase64(k._k_p_);
        // let sm4SecretKey= Base64.encode(k._k_p_);
        // sm4SecretKey = sm4SecretKey.substring(0, sm4SecretKey.length - 1);
        console.log("sm4SecretKey :" + sm4SecretKey);
        var url = commonData.getConstantData('serverURL') + 'OCRIdCardIden.do?' + commonData.getConstantData('commonUrlArg1');
        that.setData({showLoading: true});
        wx.uploadFile({
            url: url,
            filePath: this.data.canvasImgUrl,
            // filePath: this.data.picSrc1,
            name: 'UploadFile',
            formData: {
                _locale: 'zh_CN',
                ImgIndex: 1,
                MobilePhoneNo: this.data.MobilePhoneNo,
                SmsPassword: this.data.SmsPassword,
                OtpUUID: this.data.OtpUUID,
                CardType: carType,
                SimSessionId: getApp().globalData.simSessionId,
                sm4SecretKey: sm4SecretKey
            },
            page: this,
            success: function (res) {
                that.setData({showLoading: false});
                if (res.statusCode && res.statusCode != "200") {
                    reloadImg(carType);
                    commonUtil.wx_showModal('连接服务器失败,请联系服务端管理员:' + res.statusCode);
                    return;
                }
                console.log(res)
                if (res.data) {
                    res.data = JSON.parse(res.data);
                    if (getApp().globalData.sm4Encrypt) {
                        if ('6' == res.data.Result.substring(0, 1)) {
                            res.data.Result = encrypt.decryptData_ECB(res.data.Result.substr(1), k);
                        } else {
                            res.data.Result = Base64.decode(res.data.Result);
                        }
                    } else {
                        res.data.Result = Base64.decode(res.data.Result);
                    }
                    var result = JSON.parse(res.data.Result);
                    console.log("result:" + result);
                    if (result.Code && result.Code == '0') {
                        if (carType == '0') {
                            that.setData({
                                'IdNo': result.Idcard,
                                'ClientName': result.Name
                            });
                            getApp().globalData.clientName = result.name;
                            getApp().globalData.idNo = result.Idcard;
                        } else {
                            var str = result.ValidDate.split('-');
                            that.setData({
                                'ValidDate': str[1]
                            });
                        }
                    } else {
                        reloadImg(carType);
                        commonUtil.wx_showModal('身份证识别失败:' + result.Msg + ',请换张照片重新尝试!');
                    }
                } else {
                    reloadImg(carType);
                    commonUtil.wx_showModal('身份证识别失败：调用接口失败！请换张照片重新尝试!');
                }

                if (that.data.IdNo && that.data.IdNo && that.data.picSrc1.indexOf('camera.png') <= -1 && that.data.picSrc2.indexOf('camera.png') <= -1) {
                    that.saveImg();
                }
            },
            fail: function (err) {
                that.setData({showLoading: false});
                console.log(err);
                commonUtil.wx_showModal('身份证识别失败！请稍后重新尝试！请换张照片重新尝试!');
                reloadImg(carType);
            }
        });

        function reloadImg(cardType) {
            if (cardType == '0') {
                that.setData({
                    'attendSuccessImg': '',
                    'picSrc1': '../../images/camera.png',
                    'imgClass1': 'camera-img',
                    'textShow1': true,
                    'IdNo': '',
                    'ClientName': ''
                });
            } else {
                that.setData({
                    'attendSuccessImg': '',
                    'picSrc2': '../../images/camera.png',
                    'imgClass2': 'camera-img',
                    'textShow2': true,
                    'ValidDate': ''
                });
            }
        }
    },


    timerHandle: null,
    maxTime: 90,
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        // this.setData({ 'ClientName': '陆路' });
        // this.setData({ 'IdNo': '430405198808053034' });
        // this.setData({ 'MobilePhoneNo': '18588478058' });
        // this.setData({ 'ClientName': '小微1' });
        // this.setData({ 'IdNo': '450401199112240010' });
        // this.setData({ 'MobilePhoneNo': '15988257511' });
        var invalidate_marketcode = commonData.getConstantData('invalidate_marketcode');
        if (options.marketcode != null) {
            //判断是否是为失效客户经理号
            if (invalidate_marketcode.indexOf(options.marketcode) > -1) {
                // that.setData({ showLoading: false });
                var that = this;
                wx.showModal({
                    title: '提示',
                    content: '该二维码已失效',
                    showCancel: false,//不显示取消按钮
                    success: function () {
                        // 获取图形验证码的simsessionid
                        that.refreshImgToken();
                        wx.redirectTo({
                            url: '../index/index'
                        });
                    }
                })
            } else {
                wx.setStorageSync('Marketcode', options.marketcode);
                this.setData({'authShow': true});
                // 获取图形验证码的simsessionid
                this.refreshImgToken();
            }
        } else {
            //移除缓存中上次的客户经理号
            wx.removeStorageSync('Marketcode');
            this.setData({'authShow': true});
            // 获取图形验证码的simsessionid
            this.refreshImgToken();
        }
    },
    onReady: function () {
        // 页面渲染完成
        this.getIp();
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

    refreshImgToken: function (e) {
        var that = this;
        commonUtil.wx_request_pmf({
            url: 'GenTokenImgNoSession.do',
            method: 'GET',
            data: {
                SimSessionId: this.data.SimSessionId
            },
            page: this,
            success: function (res) {
                var imgSrc = res.data.ImgTokenBase64;
                that.setData({'ImgSrc': imgSrc});
                if (!!res.header['Set-Cookie']) {
                    var sc = res.header['Set-Cookie'];
                    wx.setStorageSync('cookie', res.header['Set-Cookie'])
                }
            }
        });
    },

    authClient: function (e) {
        //this.setData({'ShowNext':true});
        if (!this.checkInput1()) {
            return;
        }
        this.saveImg();

        var that = this;
        commonUtil.wx_request_pmf({
            url: 'LoanCifAuth.do',
            data: {
                ClientName: encodeURIComponent(this.data.ClientName),
                IdNo: this.data.IdNo,
                MobilePhoneNo: this.data.MobilePhoneNo,
                SmsPassword: this.data.SmsPassword,
                OtpUUID: this.data.OtpUUID,
                SeqNo: this.data.SeqNo,
                ObjectSource: 1
            },
            page: this,
            success: function (res) {
                that.stopTimer();
                that.setData({'AuthJnlNo': res.data.AuthJnlNo});
                getApp().globalData.authJnlNo = res.data.AuthJnlNo;
                getApp().globalData.idNo = that.data.IdNo;
                getApp().globalData.clientName = that.data.ClientName;
                var applyStatus = res.data.LoanApplyStatus;
                //0 未申请或审批拒绝
                //1,2,3,5 审批通过
                //4 审批中
                if (applyStatus == 0) {
                    //未申请或者申请被拒绝
                    //判断设备是否支持人脸检测
                    // wx.checkIsSupportFacialRecognition({
                    //   success: function () {
                    //     // getApp().globalData.verifyResult = 'XXIzTtMqCxwOaawoE91+VErY8no3EjnaTBT6Y0JgSYcZWAJs5alziwTIAwee6J9d43zD1sCsJ+31d1LOp1mInaJAqVXuhv0vqSjiwSrU5FNlbvXKtKkPdzsci0H+WBFa';
                    //     // wx.navigateTo({
                    //     //       url: '../apply/takePic'
                    //     //     });
                    //     //调腾讯人脸核身接口 进行人脸识别
                    //     wx.startFacialRecognitionVerifyAndUploadVideo({
                    //       name: that.data.ClientName,
                    //       idCardNumber: that.data.IdNo,
                    //       success: function (res) {
                    //         console.log(res);
                    //         getApp().globalData.verifyResult = res.verifyResult;
                    //         wx.navigateTo({
                    //           url: '../apply/apply'
                    //         })
                    //       },
                    //       fail: function (res) {
                    //         console.log(res);
                    //         // wx.navigateBack({
                    //         //   delta: 1
                    //         // })
                    //         // wx.navigateTo({
                    //         //   url: '../apply/takePic'
                    //         // });
                    //       }
                    //     });
                    //   },
                    //   fail: function (res) {
                    //     console.log(res);
                    //     commonUtil.wx_showModal('您的设备不支持人脸检测，请更新最新版本微信或者使用其他型号手机');
                    //     // getApp().globalData.verifyResult = 'XXIzTtMqCxwOaawoE91+VErY8no3EjnaTBT6Y0JgSYcZWAJs5alziwTIAwee6J9d43zD1sCsJ+31d1LOp1mInaJAqVXuhv0vqSjiwSrU5FNlbvXKtKkPdzsci0H+WBFa';
                    //     // wx.navigateTo({
                    //     //   url: '../apply/takePic'
                    //     // });
                    //   }
                    // });
                    that.checkBlackList();
                } else {
                    //审批中或者审批通过
                    wx.showModal({
                        title: '提示',
                        content: '您已存在存量贷款，是否继续申请',
                        cancelText: '否',
                        confirmText: '是',
                        success: function (res) {
                            if (res.confirm) {
                                that.checkBlackList();
                            } else {
                                if (applyStatus == 4) {
                                    wx.reLaunch({
                                        url: '/pages/index/index',
                                    })
                                } else {
                                    wx.navigateTo({
                                        url: '../result/result?applyStatus=' + applyStatus
                                    });
                                }
                            }
                        }
                    })
                }
            },
            fail: function () {
                that.stopTimer();
            }
        });
    },
    checkBlackList: function () {
        var that = this;
        // 黑名单查询
        commonUtil.wx_request_pmf({
            url: 'BlackListQry.do',
            data: {
                CifName: encodeURIComponent(that.data.ClientName),
                CertId: that.data.IdNo,
                CertType: 'Ind01'
            },
            page: that,
            success: function (res) {
                if (res.data.ReCode == 'Y' && res.data.IsSpecialCustomer == '0') {
                    // 实名制验证
                    that.setData({
                        checkShow: 'hidden',
                        phoneNumberInput: 'false',
                        cardShow: 'hidden',
                        checkShowNext: 'show',
                        phoneNumberInput: 'false',
                    })
                    //     if('1'==getApp().globalData.newFace){
                    //         wx.showModal({
                    //             title: '提示',
                    //             content: '即将进入人脸识别验证你的身份信息，确保为本人操作。',
                    //             showCancel: true,
                    //             success: function (res) {
                    //             if (res.confirm) {
                    //             //新的人脸识别
                    //             that.detectAuth(getApp().globalData.idNo,getApp().globalData.clientName);
                    //             }
                    //             }
                    //         })

                    //     }else{
                    //   //新的上传视频人脸识别
                    //         wx.showModal({
                    //             title: '提示',
                    //             content: '即将进入人脸识别验证你的身份信息，请拍摄一个3s左右的视频进行人脸验证,确保为本人操作。',
                    //             showCancel: true,
                    //             success: function (res) {
                    //             if (res.confirm) {
                    //                 //点击确定进入人脸识别
                    //                 that.getFaceVideo(that);
                    //             }
                    //             }
                    //         })
                    //     }

                }
            },
            fail: function (err) {
                commonUtil.wx_showModal(err);
            }
        })
    },
    /**
     * 银联四要素验证
     */
    uPay4EltValidate: function () {
        var that = this;
        if (!that.checkInput2()) {
            return
        }
        // 黑名单查询
        commonUtil.wx_request_pmf({
            url: 'BlackListQry.do',
            data: {
                CifName: encodeURIComponent(that.data.ClientName),
                CertId: that.data.IdNo,
                CertType: 'Ind01'
            },
            page: that,
            success: function (res) {
                if (res.data.ReCode == 'Y' && res.data.IsSpecialCustomer == '0') {
                    // 银联四要素验证
                    commonUtil.wx_request_pmf({
                        url: 'UPay4EltValidateByBlackList.do',
                        data: {
                            CardNo: that.data.CardNo,
                            AcctName: encodeURIComponent(that.data.ClientName),
                            DocId: that.data.IdNo,
                            PhoneNumber: that.data.MobilePhoneNo,
                            DocType: '01',
                            ChannelId: 'MICRO',
                            AuthJnlNo: getApp().globalData.authJnlNo
                        },
                        page: that,
                        success: function (res) {
                            if (res.data.ReCode == 'Y') {
                                that.faceValidate();
                                // wx.navigateTo({
                                //   url: '../apply/apply'
                                // })
                            } else {
                                that.checkTip();
                            }
                            ;
                        },
                        fail: function (err) {
                            commonUtil.wx_showModal(err);
                        }
                    })
                }
            },
            fail: function (err) {
                commonUtil.wx_showModal(err);
            }
        })
    },
    // 银行卡实名制验证失败弹窗
    checkTip: function () {
        wx.showModal({
            title: '提示',
            content: '银行卡实名制验证失败',
            cancelText: "返回首页",//默认是“取消”
            cancelColor: '#000',//取消文字的颜色
            confirmText: "重试",//默认是“确定”
            confirmColor: '#000',//确定文字的颜色
            success: function (res) {
                if (res.confirm) {
                    wx.navigateBack({
                        delta: 1
                    })
                } else if (res.cancel) {
                    wx.navigateTo({
                        url: '../index/index'
                    })
                }
            }
        })
    },
    /**
     * 鹏元手机号验证
     */
    phoneNoValidate: function () {
        var that = this;
        // 黑名单查询
        commonUtil.wx_request_pmf({
            url: 'BlackListQry.do',
            data: {
                CifName: encodeURIComponent(that.data.ClientName),
                CertId: that.data.IdNo,
                CertType: 'Ind01'
            },
            page: that,
            success: function (res) {
                if (res.data.ReCode == 'Y' && res.data.IsSpecialCustomer == '0') {
                    // 鹏元手机号验证
                    console.log(that)
                    commonUtil.wx_request_pmf({
                        url: 'PyPhoneNoVerifyByBlackList.do',
                        data: {
                            AcctName: that.data.ClientName,
                            CertNo: that.data.IdNo,
                            MobileNo: that.data.MobilePhoneNo,
                            RtrnRsn: '101',
                            SubrePortIds: '96027',
                            ChannelId: 'MICRO',
                            AuthJnlNo: getApp().globalData.authJnlNo
                        },
                        page: that,
                        success: function (res) {
                            if (res.data.ReCode == 'Y') {
                                that.faceValidate();
                                // wx.navigateTo({
                                //   url: '../apply/apply'
                                // })
                            } else {
                                that.tip();
                            }
                            ;
                        },
                        fail: function (err) {
                            // 重复提示错误,注释
                            // commonUtil.wx_showModal(err);
                        }
                    })
                }
            },
            fail: function (err) {
                // 重复提示错误,注释
                // commonUtil.wx_showModal(err);
            }
        })

    },
    tip: function () {
        var that = this;
        wx.showModal({
            title: '手机实名制验证失败',
            content: '点击“下一步”使用银行卡验证，点击“返回”更换手机号码重试',
            cancelText: "返回",//默认是“取消”
            cancelColor: '#000',//取消文字的颜色
            confirmText: "下一步",//默认是“确定”
            confirmColor: '#000',//确定文字的颜色
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        checkShow: 'hidden',
                        phoneNumberInput: 'false',
                        cardShow: 'show',
                        checkShowNext: 'hidden',
                        checkCardShowNext: 'show'
                    });
                } else if (res.cancel) {
                    wx.navigateTo({
                        url: '../index/index'
                    })
                }
            }
        })
    },
    checkInput2: function () {
        if (!this.data.CardNo) {
            commonUtil.wx_showModal('请输入银行卡账号！');
            return false;
        }
        return true;
    },
    checkInput1: function () {
        if (!this.checkInput()) {
            return false
        }
        if (!this.data.SmsPassword) {
            commonUtil.wx_showModal('请输入短信验证码');
            return false;
        }
        if (!this.data.OtpUUID) {
            commonUtil.wx_showModal('请先获取短信验证码');
            return false;
        }
        return true;
    },

    checkInput: function () {
        if (!this.data.ClientName) {
            commonUtil.wx_showModal('请输入姓名');
            return false;
        }
        if (this.data.ClientName.indexOf(' ') >= 0) {
            commonUtil.wx_showModal('姓名不允许包含空格');
            return false;
        }
        if (!this.data.IdNo) {
            commonUtil.wx_showModal('请输入身份证号码');
            return false;
        }
        if (!this.data.ValidDate) {
            commonUtil.wx_showModal('请输入身份证到期日');
            return false;
        }
        if (!this.checkValidDate()) {
            commonUtil.wx_showModal('身份证已过期');
            return false;
        }
        if (!this.data.MobilePhoneNo) {
            commonUtil.wx_showModal('请输入手机号码');
            return false;
        }
        // if(!this.data._vTokenName){
        //   commonUtil.wx_showModal('请输入图形验证码');
        //   return false;
        // }
        return true;
    },

    //校验证件有效期
    checkValidDate: function () {
        var that = this;
        var date = new Date();
        //年
        var Y = date.getFullYear();
        //月
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        console.log("当前时间：" + Y + M + D);
        // var now =  parseInt(Y +''+ M +''+ D);
        // var vd = parseInt('20181031');
        var now = Y + '' + M + '' + D;
        var vDate = that.data.ValidDate;
        return vDate >= now;
    },

    tencentVerify: function (seqNo, bizToken) {
        wx.startVerify({
            data: {
                token: bizToken // BizToken
            },
            success: (res) => { // 验证成功后触发
                // this.setData({authShow:false});
                console.log("face auth success " + res);
                console.log("face auth success " + JSON.stringify(res));
                // res 包含验证成功的token, 这里需要加500ms延时，防止iOS下不执行后面的逻辑
                setTimeout(() => {
                    // 验证成功后，拿到token后的逻辑处理，具体以客户自身逻辑为准
                    // 实名制验证
                    // this.setData({
                    //     checkShow:'hidden',
                    //     phoneNumberInput:'false',
                    //     cardShow:'hidden',
                    //     checkShowNext:'show',
                    //     phoneNumberInput:'false',
                    //   })
                    this.getDetectInfo(seqNo, bizToken);
                }, 500);
            },
            fail: (err) => {  // 验证失败时触发
                // err 包含错误码，错误信息，弹窗提示错误
                setTimeout(() => {
                    wx.showModal({
                        title: "提示",
                        content: err.ErrorMsg,
                        showCancel: false
                    })
                }, 500);
            }
        });
    },

    // 腾讯人脸核身获取token
    detectAuth: function (idCard, name) {
        var that = this;
        commonUtil.wx_request_pmf({
            url: 'DetectAuth.do',
            data: {
                IdCard: idCard,
                Name: name,
                SourceType: 'pmf',
                RedirectUrl: commonData.getConstantData('redirect_url')
            },
            page: this,
            success: function (res) {
                console.log(res);
                console.log(res.data);
                var obj = res.data;
                getApp().globalData.seqNo = obj.SeqNo;
                getApp().globalData.bizToken = obj.BizToken;
                console.log(getApp().globalData.seqNo);
                console.log(getApp().globalData.bizToken);
                that.tencentVerify(obj.SeqNo, obj.BizToken);
                console.log("" + obj.BizToken);
            }
        });
    },


    // 获取人脸核身结果
    getDetectInfo: function (seqNo, bizToken) {
        var that = this;
        commonUtil.wx_request_pmf({
            url: 'GetDetectInfoEnhanced.do',
            data: {
                // SeqNo:'e1163be4586c4792b804ff232cab5b8a',
                // BizToken:'E3094967-59E8-42E2-8C3F-A7A92AED19C0'
                SeqNo: seqNo,
                BizToken: bizToken,
                SourceType: 'pmf'
            },
            page: this,
            success: function (res) {
                //成功失败都会跳转
                //验证成功后跳的页面 根据产品号跳转
                if ('030110' == getApp().globalData.prodNo) {
                    wx.navigateTo({
                        url: '../apply/optimalE/optimalE'
                    })
                } else {
                    wx.navigateTo({
                        url: '../apply/apply'
                    })
                }
            },
            fail: function (error) {
                if ('030110' == getApp().globalData.prodNo) {
                    wx.navigateTo({
                        url: '../apply/optimalE/optimalE'
                    })
                } else {
                    wx.navigateTo({
                        url: '../apply/apply'
                    })
                }
            }
        });
    },

    changeTimerText: function () {
        if (this.maxTime > 0) {
            this.maxTime--;
            this.setData({SMSButtonText: '' + this.maxTime + '秒后可重新获取'});
        } else {
            this.stopTimer();
        }

    },

    startTimer: function () {
        this.timerHandle = setInterval(this.changeTimerText, 1000);
    },

    stopTimer: function () {
        this.setData({SMSButtonText: '获取验证码'});
        clearInterval(this.timerHandle);
        this.maxTime = 90;
        this.setData({SmsBtnLoading: false, SmsBtnDisabled: false});
    },

    //获取短信验证码
    getSMS: function () {
        if (!this.checkInput()) {

            return;
        }
        var that = this;
        var setcookie = wx.getStorageSync('cookie');
        this.setData({SmsBtnLoading: true, SmsBtnDisabled: true});
        var data;
        if (getApp().globalData.sm4Encrypt) {
            data = {
                'MobilePhoneNo': this.data.MobilePhoneNo,
                '_vTokenName': this.data._vTokenName,
                'IdNo': this.data.IdNo,
                'ClientName': this.data.ClientName,
                'MChannelId': this.data.MChannelId
            };
        } else {
            data = 'MobilePhoneNo=' + this.data.MobilePhoneNo + '&_vTokenName=' + this.data._vTokenName + '&IdNo=' + this.data.IdNo + '&ClientName=' + this.data.ClientName + "&MChannelId=" + this.data.MChannelId;
        }
        commonUtil.wx_request_pmf({
            url: 'LoanSMSPasswordApply.do',
            header: {'Cookie': setcookie},
            data: data,
            page: this,
            success: function (res) {

                that.setData({
                    OtpUUID: res.data.OtpUUID,
                    SeqNo: res.data.SeqNo,
                    SMSButtonText: that.maxTime + '秒后可重新获取',
                    SmsBtnLoading: false
                });
                that.startTimer();
                that.setData({});
            },
            fail: function () {
                that.setData({SmsBtnLoading: false, SmsBtnDisabled: false});
            }
        });
    },

    inputName: function (e) {
        this.setData({'ClientName': e.detail.value});
    },
    inputIdNo: function (e) {
        this.setData({'IdNo': e.detail.value});
    },
    inputValidDate: function (e) {
        this.setData({'ValidDate': e.detail.value});
    },
    inputMobile: function (e) {
        this.setData({'MobilePhoneNo': e.detail.value});
        wx.setStorageSync('MobilePhoneNo', e.detail.value);
    },
    inputCardNo: function (e) {
        this.setData({'CardNo': e.detail.value});
    },
    inputSMS: function (e) {
        this.setData({'SmsPassword': e.detail.value});
    },
    inputVToken: function (e) {
        this.setData({'_vTokenName': e.detail.value});
    },
    bindblur_IdNo: function (e) {
        if (!commonUtil.validator(this.data.IdNo, 'IdNo')) {
            commonUtil.wx_showModal('证件号码格式不正确，请重新输入');
        }
    },
    bindblur_MoiblePhone: function (e) {
        if (!commonUtil.validator(this.data.MobilePhoneNo, 'PhoneNumber')) {
            commonUtil.wx_showModal('手机号码格式不正确，请重新输入');
        }
    },
    bindblur_VToken: function (e) {
        if (!commonUtil.validator(this.data._vTokenName, 'VToken')) {
            commonUtil.wx_showModal('图形验证码格式不正确，请重新输入');
        }
    },
    bindblur_SMS: function (e) {
        if (!commonUtil.validator(this.data.SmsPassword, 'SMS')) {
            commonUtil.wx_showModal('短信验证码格式不正确，请重新输入');
        }
    },


    saveImg: function () {
        var that = this;
        var uploadNums = 0;
        var uploadSucessNums = 0;

        var fileList = [this.data.picSrc1, this.data.picSrc2];
        var uploadUrl = commonData.getConstantData('serverURL') + 'LoanCifImgUpload.do';
        this.setData({showLoading: true, btnDisabled: true});

        uploadImgs();

        function uploadImgs() {
            uploadOne(uploadUrl, fileList[uploadNums], uploadNums + 1);
        }

        function uploadOne(uploadUrl, tmpFilePath, imgIndex) {
            console.log('上传第' + imgIndex + '张照片.');
            console.log('url:' + uploadUrl);
            console.log('filePath:' + tmpFilePath);
            wx.uploadFile({
                url: uploadUrl,
                filePath: tmpFilePath,
                name: 'UploadFile',
                formData: {
                    SimSessionId: getApp().globalData.simSessionId,
                    ImgIndex: Number(imgIndex),
                    IdNo: that.data.IdNo,
                    _locale: 'zh_CN',
                    LoginType: 'R',
                    ClientType: 'Client'
                },
                success: function (res) {
                    var data = res.data
                    if (res.statusCode == 200) {
                        afterUpload(true);
                    } else {
                        afterUpload(false);
                    }
                    return true;
                },
                fail: function (err) {
                    afterUpload(false);

                }
            });
        }

        function afterUpload(flag) {
            console.log("upload callback: " + flag);
            uploadNums++;
            if (flag) {
                uploadSucessNums++;
            }
            if (uploadNums == 2) {
                if (uploadSucessNums == 2) {
                    console.log('上传照片成功：2');
                    return;
                } else {
                    // commonUtil.wx_showModal('上传照片失败，请重试');
                }
            } else {
                uploadImgs();
            }

        }

        this.setData({showLoading: false, btnDisabled: false});
    },
    getIp: function () {
        var that = this;
        wx.request({
            url: 'http://ip-api.com/json',
            success: function (e) {
                console.log(e.data);
                that.setData({MachineIp: e.data.query});
                wx.setStorageSync('MachineIp', e.data.query);
            }
        })
    },
    faceValidate: function () {
        var that = this;
        if ('1' == getApp().globalData.newFace) {
            wx.showModal({
                title: '提示',
                content: '即将进入人脸识别验证你的身份信息，确保为本人操作。',
                showCancel: true,
                success: function (res) {
                    if (res.confirm) {
                        //新的人脸识别
                        that.detectAuth(getApp().globalData.idNo, getApp().globalData.clientName);
                    }
                }
            })
        } else {
            //新的上传视频人脸识别
            wx.showModal({
                title: '提示',
                content: '即将进入人脸识别验证你的身份信息，请拍摄一个3s左右的视频进行人脸验证,确保为本人操作。',
                showCancel: true,
                success: function (res) {
                    if (res.confirm) {
                        //点击确定进入人脸识别
                        that.getFaceVideo(that);
                    }
                }
            })
        }
    }
})