// pages/apply/apply.js
var commonData = require('../../../utils/data.js')
var commonUtil = require('../../../utils/util.js')
Page({
    data: {
        occupation: {code: ["01", "02"], name: ['白领上班族', '小微企业主']},
        occupationIndex: 1,
        city: {code: [], name: [], deptId: []},
        area: {code: [], name: [], deptId: []},
        street: {code: [], name: [], deptId: []},
        cityIndex: null,
        areaIndex: null,
        streetIndex: null,
        Purpose: ['综合消费（购物等）', '经营周转'],
        ContracAmount: null,
        TermList: [3, 6, 12, 24, 36],
        TermIndex: 0,
        Checked: false,
        PromiseViewed: false,
        TaxAuthViewed: false,
        chooseMortage: {code: ["0", "1"], name: ['无', '有']},
        chooseMortageIndex: 0,
        EntName: null,
        propertyTypeIndex: true,
        showMarriage: false,
        showArea: false,
        showHouse: false,
        showChoice: false,
        certTypeIndex: null,
        mateCertNo: null,
        matePhoneNo: null,
        AreaSquare: '',
        PropertyAddress: '',
        Email: null,
        editIcon: '../../images/icon-edit.svg',
        uploadIcon: '../../../images/icon-upload.svg',
        iconPath: '../../../images/icon-upload.svg',
        picSrc1: null,
        upload: false,//是否上传图片
        'imgClass1': 'camera-img',
        isShowMortgageAddress: false, //有无房产
        collateralPic: null, //房产证照片
        fileName: null //保存房产证上传的临时路径
    },
    onLoad: function (options) {
    },
    onReady: function () {


        var that = this;
        // this.queryArea('01',null,function(list){
        //   console.log("onReady===>"+list);
        //   var cityCodes = [];
        //   var cityNames = [];
        //   var deptIds = [];

        //   for(var i in list){
        //     cityCodes.push(list[i].AddrId);
        //     cityNames.push(list[i].AddrName);
        //     deptIds.push(list[i].DeptId);
        //   }
        //   that.setData({
        //     city:{code:cityCodes,name:cityNames,deptId:deptIds},
        //     cityIndex: 0
        //   });
        //   that.setArea();
        // })

        var clientMgr = wx.getStorageSync('Marketcode');
        if (clientMgr != null && clientMgr != "") {
            this.setData({ClientMgr: clientMgr});
            this.setData({ClientMgrNo: true});
            this.setData({ClientMgrName: '正在查询...'});
            var that = this;
            commonUtil.wx_request_pmf({
                url: 'ClientMgrQry.do',
                data: {
                    ClientMgr: that.data.ClientMgr,
                    Sm4: 'Y'
                },
                page: that,
                success: function (res) {
                    console.log(res);
                    var obj = JSON.parse(res.data.Result);
                    that.setData({ClientMgrName: obj.ClientMgrName});
                }
            });
        }
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

    bindPickerOccupation: function (e) {
        var v = e.detail.value;
        this.setData({occupationIndex: v});
        this.chooseTerm(this.data.occupation.code[v]);
    },

    // 判断是否选择抵押房产，控制相关选项的显示；
    bindPickerMortage: function (e) {
        var v = e.detail.value;
        this.setData({chooseMortageIndex: e.detail.value});
        if (v == 1) {
            this.setData({'isShowMortgageAddress': true});
        } else {
            //清空保存数据
            this.setData({'isShowMortgageAddress': false});
            this.setData({'upload': false});
            this.setData({'picSrc1': null});
        }
    },


    //保存公司名称
    bindInputEntName: function (e) {
        this.setData({EntName: e.detail.value});
    },
    //保存Email
    bindInputEmail: function (e) {
        this.setData({Email: e.detail.value});
    },
    bindGotoPromise: function () {
        this.setData({PromiseViewed: true});
        wx.navigateTo({
            url: '../promise'
        });
    },

    bindGotoTaxAuth: function () {
        this.setData({TaxAuthViewed: true});
        wx.navigateTo({
            url: '../taxauth',
        });
    },

    bindInputAmount: function (e) {
        console.log(e.detail.value);
        this.setData({ContractAmount: e.detail.value});
    },

    bindPickerTerm: function (e) {
        this.setData({TermIndex: e.detail.value});
    },


    bindChangeCheck: function (e) {
        if (e.detail.value[0]) {
            if (this.data.PromiseViewed & this.data.TaxAuthViewed) {
                this.setData({Checked: true});
            } else {
                this.setData({Checked: false});
                commonUtil.wx_showModal('请先阅读《个人征信授权书》、《纳税数据查询授权书》');
            }
        } else {
            this.setData({Checked: false});
        }
    },

    bindInputClientMgr: function (e) {
        var clientMgr = e.detail.value;
        if (!clientMgr) {
            this.setData({ClientMgr: null});
            return;
        }
        this.setData({ClientMgr: clientMgr});
        this.setData({ClientMgrName: '正在查询...'});
        var that = this;
        commonUtil.wx_request_pmf({
            url: 'ClientMgrQry.do',
            data: {
                ClientMgr: that.data.ClientMgr,
                Sm4: 'Y'
            },
            page: that,
            success: function (res) {
                console.log(res);
                // var obj=commonUtil.decryptData(res.data.Result);
                var obj = JSON.parse(res.data.Result);
                that.setData({ClientMgrName: obj.ClientMgrName});
            }
        });
    },

    bindApplySubmit: function () {
        if (!this.checkData()) {
            return;
        }
        var branchNum = null;
        if (getApp().globalData.prodNo == "030110") {  //优易贷
            //   if(this.data.areaIndex == null){
            //     branchNum = this.data.city.deptId[this.data.cityIndex];
            //   }else if(this.data.streetIndex == null){
            //     branchNum = this.data.area.deptId[this.data.areaIndex];
            //   }else{
            //     branchNum = this.data.street.deptId[this.data.streetIndex];
            //   }
            branchNum = "00811";  //小商贷默认本部业务团队
        } else if (getApp().globalData.prodNo == "510820") {
            branchNum = "00811";   //创业贷默认本部业务团队
        } else {
            branchNum = "00811";  //小商贷默认本部业务团队
        }

        var addrParentId = null;
        if (this.data.area.code[this.data.areaIndex] == '2009') {
            addrParentId = '2007';
        } else {
            addrParentId = this.data.area.code[this.data.areaIndex];
        }

        // getApp().globalData.idNo='420702199704157859';
        // getApp().globalData.authJnlNo='454189515';

        console.log("data :" + JSON.stringify(this.data));
        console.log(" isMortage: " + this.data.chooseMortageIndex);
        commonUtil.wx_request_pmf({
            url: 'LoanApplyForPub.do',
            data: {
                'ClientMgr': this.data.ClientMgr,
                'ContractAmount': this.data.ContractAmount,
                'Term': this.data.TermList[this.data.TermIndex],
                'Purpose': encodeURIComponent(this.data.Purpose[this.data.occupationIndex]),
                'BranchId': branchNum,
                'Occupation': this.data.occupation.code[this.data.occupationIndex],
                'AuthJnlNo': getApp().globalData.authJnlNo,
                'IdNo': getApp().globalData.idNo,
                'ProdNo': getApp().globalData.prodNo,
                'ClientName': encodeURIComponent(getApp().globalData.clientName),
                'DeviceType': getApp().globalData.platform,
                'DeveiceUUID': '',
                'VideoValidSeq': getApp().globalData.videoValidSeq,
                'SvrSeq': 'svr_pmf_miniProgram',
                'Mobiletel': this.getMobilePhoneNo(),
                'MachineIp': this.getIp(),
                'AddrParentId': addrParentId,
                'EntName': this.data.EntName,
                'Email': this.data.Email,
                'IsMortgage': this.data.chooseMortage.code[this.data.chooseMortageIndex],
                // 'CollateralPic':encodeURIComponent(this.data.collateralPic)
                'CollateralPic': this.data.fileName,
                'IsNewFace': getApp().globalData.newFace,
                'SeqNo': getApp().globalData.seqNo,
                'BizToken': getApp().globalData.bizToken
            },
            page: this,
            success: function (res) {
                wx.redirectTo({
                    url: '../../result/result?applyStatus=4'
                });
            }
        });
    },

    checkData: function () {
        if (!this.data.ContractAmount) {
            commonUtil.wx_showModal('请输入贷款金额');
            return false;
        } else {
            var checkAount = /^([0]|[1-9]([0-9]*))(.[0-9]{1,2})?$/;
            if (!checkAount.test(this.data.ContractAmount)) {
                commonUtil.wx_showModal('请输入正确申请金额');
                this.setData({ContractAmount: null});
                return false;
            } else if (this.data.ContractAmount == 0) {
                commonUtil.wx_showModal('申请金额不能为零');
                this.setData({ContractAmount: null});
                return false;
            }
        }

        if (!this.data.EntName) {
            commonUtil.wx_showModal('请输入企业名称（全称）');
            return false;
        }

        if (!this.data.Email) {
            commonUtil.wx_showModal('请输入电子邮箱');
            return false;
        } else {
            var checkEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!checkEmail.test(this.data.Email)) {
                commonUtil.wx_showModal('此电子邮箱无效，请重新输入！');
                this.setData({Email: null});
                return false;
            }
        }

        if (this.data.showChoice && this.data.chooseProductIndex == null) {
            commonUtil.wx_showModal('请选择是否愿意选择其他产品');
            return false;
        }

        return true;
    },

    setStreet: function () {
        var that = this;

        if (!this.data.area.deptId[this.data.areaIndex]) {
            var addrId = this.data.area.code[this.data.areaIndex];
            console.log(addrId);
            this.queryArea(null, addrId, function (list) {

                console.log(list);
                var streetCodes = [];
                var streetName = [];
                var deptIds = [];
                for (var i in list) {
                    streetCodes.push(list[i].AddrId);
                    streetName.push(list[i].AddrName);
                    deptIds.push(list[i].DeptId);
                }

                that.setData({
                    street: {code: streetCodes, name: streetName, deptId: deptIds},
                    streetIndex: 0
                });
            });
        } else {
            this.setData({streetIndex: null});
        }
    },

    setArea: function () {
        var that = this;

        if (!this.data.city.deptId[this.data.cityIndex]) {
            var addrId = this.data.city.code[this.data.cityIndex];
            console.log(addrId);
            this.queryArea(null, addrId, function (list) {

                console.log(list);
                var areaCodes = [];
                var areaNames = [];
                var deptIds = [];
                for (var i in list) {
                    areaCodes.push(list[i].AddrId);
                    areaNames.push(list[i].AddrName);
                    deptIds.push(list[i].DeptId);
                }

                that.setData({
                    area: {code: areaCodes, name: areaNames, deptId: deptIds},
                    areaIndex: 0
                });
                if (that.data.streetIndex == null) {
                    that.setStreet();
                }
            });
        } else {
            this.setData({areaIndex: null});
        }
    },

    queryArea: function (addrLevel, parentId, callback) {
        commonUtil.wx_request_pmf({
            url: 'AddrListQry.do',
            data: {
                'AddrLevel': addrLevel,
                'AddrParentId': parentId
            },
            page: this,
            success: function (res) {
                callback(res.data.List);
            }
        });
    },
    getIp: function () {
        try {//获取缓存ip
            var value = wx.getStorageSync('MachineIp')
            if (value) {
                return value;
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    getMobilePhoneNo: function () {
        try {//获取缓存手机号码
            var value = wx.getStorageSync('MobilePhoneNo')
            if (value) {
                return value;
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    upload: function (e) {
        wx.chooseMessageFile({
            count: 1,
            type: 'all',
            success(file) {
                var url = commonData.getConstantData('serverURL') + 'LoanCollateralPicUpload.do?' + commonData.getConstantData('commonUrlArg1');
                wx.uploadFile({
                    url: url,
                    filePath: file.tempFiles[0].path,
                    name: 'UploadFile',
                    formData: {
                        _locale: 'zh_CN',
                        IdCard: getApp().globalData.idNo,
                        SimSessionId: getApp().globalData.simSessionId
                    },
                    page: this,
                    success: function (res) {
                        console.log("success");
                    }
                })
            }
        })
    },


    takePic1: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(res),
                    console.log("--------"),
                    that.setData({showLoading: true});
                //压缩
                console.log("before  compress:" + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"));
                wx.compressImage({
                    src: res.tempFilePaths[0], // 图片路径
                    quality: 80 // 压缩质量
                })
                console.log(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"));
                that.setData({'iconPath': '../../../images/icon-edit.svg', 'upload': true});
                // that.setData({'picSrc1':res.tempFilePaths[0],'imgClass1':'camera-img-after','uploadPic':true});
                var tempFilePaths = res.tempFilePaths;
                // 根据图片大小缩放图片
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: function (res) {
                        //检查方向,重新画图
                        if (res.orientation.indexOf("left") > -1 || res.orientation.indexOf("right") > -1) {
                            var tmp;
                            tmp = res.width;
                            res.width = res.height;
                            res.height = tmp;
                        }
                        console.log(res);
                        var width;
                        var height;
                        console.log("width==>" + res.width + "   heigth==>" + res.height + "   orientation===>" + res.orientation)
                        if (res.width > 1200 || res.height > 1200) {
                            width = res.width;
                            height = res.height;
                            do {
                                width = width / 2;
                                height = height / 2;
                            } while (height > 1200 || width > 1200)
                        } else if (res.width > 1200 || res.height > 1200) {
                            width = res.width / 2;
                            height = res.height / 2;
                        } else if (res.width > 900 && res.height > 900) {
                            width = res.width * 0.66;
                            height = res.height * 0.66;
                        } else {
                            width = res.width;
                            height = res.height;
                        }
                        console.log("width==>" + width + "   heigth==>" + height);
                        //   width=1000;
                        //   height=1000;
                        drawCanvas(width, height);
                    },
                    fail: function (err) {
                        that.setData({showLoading: false});
                        console.log(err);
                        commonUtil.wx_showModal('房产证照片上传失败，请重新上传!');
                    }
                })

                // 生成图片
                function drawCanvas(width, height) {
                    console.log(width + ',' + height);
                    const ctx = wx.createCanvasContext('myCanvas-optimalE');
                    ctx.drawImage(tempFilePaths[0], 0, 0, width, height);
                    ctx.draw(false, function () {
                        wx.canvasToTempFilePath({
                            canvasId: 'myCanvas-optimalE',
                            fileType: 'jpg',
                            width: width,
                            height: height,
                            // quality:80,
                            destWidth: width,
                            destHeight: height,
                            success: function (res) {
                                console.log("after compress" + wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64"));
                                that.setData({
                                    'picSrc1': res.tempFilePath,
                                    'imgClass1': 'camera-img-after',
                                    'uploadPic': true
                                });
                                that.data.collateralPic = wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64");
                                console.log("-------------" + res.tempFilePath);
                                var url = commonData.getConstantData('serverURL') + 'LoanCollateralPicUpload.do?' + commonData.getConstantData('commonUrlArg1');

                                wx.uploadFile({
                                    url: url,
                                    filePath: res.tempFilePath,
                                    name: 'UploadFile',
                                    formData: {
                                        _locale: 'zh_CN',
                                        IdCard: getApp().globalData.idNo,
                                        SimSessionId: getApp().globalData.simSessionId
                                    },
                                    page: this,
                                    success: function (res) {
                                        that.setData({showLoading: false});
                                        console.log(res);
                                        if (res.statusCode && res.statusCode != "200") {
                                            commonUtil.wx_showModal('连接服务器失败,请联系服务端管理员:' + res.statusCode);
                                            return;
                                        }
                                        if (res.data == null || '' == res.data) {
                                            commonUtil.wx_showModal('房产证照片上传失败，请重新上传!');
                                            return;
                                        }
                                        var obj = JSON.parse(res.data);
                                        // console.log(obj.UploadStatus);
                                        if ('0' != obj.UploadStatus) {
                                            commonUtil.wx_showModal('房产证照片上传失败，请重新上传!');
                                            return;
                                        }
                                        that.data.fileName = obj.FileKey;
                                    },
                                    fail: function (err) {
                                        that.setData({showLoading: false});
                                        console.log(err);
                                        commonUtil.wx_showModal('房产证照片上传失败，请重新上传!');
                                    }
                                });
                            },
                            complete: function complete(e) {
                            }
                        })
                    });
                }
            },
            fail: function () {
                this.showLoading
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
                Name: name
            },
            page: this,
            success: function (res) {
                console.log(res.data);
//   var obj=JSON.parse(res.data);
                var obj = res.data;
                console.log(obj.SeqNo + "===" + obj.BizToken);
                that.tencentVerify(obj.SeqNo, obj.BizToken);
                console.log("" + obj.BizToken);
            }
        });
    }
}),

    function checkDate(sDate) {
        var checkedDate = sDate;
        var year, month, day;
        //日期为空 长度不等于8或14 返回错误
        var maxDay = new Array(0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        checkedDate = checkedDate.trim();
        if (checkedDate.length != 8 && checkedDate.length != 14) {
            return false;
        }
        year = checkedDate.substring(0, 4).trim();
        month = checkedDate.substring(4, 6).trim();
        day = checkedDate.substring(6, 8).trim();

        if (year < 1900) {
            return false;
        }

        if (month < 1 || month > 12) {
            return false;
        }

        if (day > maxDay[month] || day == 0) {
            return false;
        }
        // 非闰年2月份日期大于29
        if (day == 29 && month == 2 && (year % 4 != 0 || year % 100 == 0) && (year % 4 != 0 || year % 400 != 0)) {
            return false;
        }

        if (checkedDate.length == 14) {
            var hour = checkedDate.substring(8, 10);
            var minute = checkedDate.substring(10, 12);
            var second = checkedDate.substring(12, 14);

            if (hour > 23 || hour < 0) {
                return false;
            }
            if (minute > 59 || minute < 0) {
                return false;
            }
            if (second > 59 || second < 0) {
                return false;
            }

        }
        return true;
    }
