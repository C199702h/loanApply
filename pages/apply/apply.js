// pages/apply/apply.js
var commonData = require('../../utils/data.js')
var commonUtil = require('../../utils/util.js')
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
        TermList: [],
        TermList01: [12, 24, 36, 48, 60],
        TermList02: [12, 24, 36],
        TermIndex: 0,
        Checked: false,
        PromiseViewed: false,
        TaxAuthViewed: false,
        chooseMortage: {code: ["1", "0"], name: ['是', '否']},
        chooseMortageIndex: 1,
        EntName: null,
        propertyType: {code: ["01", "02", "03", "04"], name: ['住宅', '公寓', '商铺', '其他'], value: ["1", "2", "3", "4"]},
        propertyTypeIndex: null,
        showMarriage: false,
        showArea: false,
        showHouse: false,
        showChoice: false,
        chooseMarriage: {code: ["1", "0"], name: ['是', '否']},
        chooseMarriageIndex: 1,
        mateName: null,
        certType: {
            code: ["Ind01", "Ind03", "Ind04", "Ind05", "Ind06", "Ind07", "Ind09", "Ind10", "Ind11", "Ind15", "Ind16"],
            name: ['身份证', '外国护照', '军官证', '士兵证', '港澳居民来往内地通行证', '台湾同胞来往内地通行证', '外国人永久居留身份证', '警官证', '其他个人证件', '文职干部证', '中国护照'],
            value: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
        },
        certTypeIndex: null,
        mateCertNo: null,
        matePhoneNo: null,
        AreaSquare: '',
        PropertyAddress: '',
        Email: null,
        chooseProduct: {code: ["1", "0"], name: ['是', '否']},
        chooseProductIndex: "1",
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (getApp().globalData.prodNo == '510820') {  //创业贷
            this.setData({showMarriage: true});
            this.setData({showChoice: true});
        } else if (getApp().globalData.prodNo == '030110') {  //优易贷
            this.setData({showArea: true});
            this.setData({showHouse: true});
        } else {  //普惠贷款
            this.setData({showHouse: true});
        }

    },
    onReady: function () {
        // 页面渲染完成
        this.chooseTerm(this.data.occupation.code[1]);//初始化时选择贷款期限列表

        if (getApp().globalData.prodNo == '510820') {
            this.setData({
                TermIndex: 2
            });   //创业贷默认期限36个月不可修改
        }

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
        if (v == 0) {
            this.setData({propertyTypeIndex: 0});
        } else {
            //清空保存数据
            this.setData({propertyTypeIndex: null});
            this.setData({AreaSquare: null});
            this.setData({PropertyAddress: null});
        }
    },


    //保存抵押房产类型
    bindPickerpropertyType: function (e) {
        this.setData({propertyTypeIndex: e.detail.value});
    },

    //保存公司名称
    bindInputEntName: function (e) {
        this.setData({EntName: e.detail.value});
    },

    //保存抵押房产面积
    bindInputSquare: function (e) {
        this.setData({AreaSquare: e.detail.value});
    },

    //保存抵押房产地址
    bindInputAddress: function (e) {
        this.setData({PropertyAddress: e.detail.value});
    },

    //判断是否有配偶
    bindPickerMarriage: function (e) {
        var v = e.detail.value;
        this.setData({chooseMarriageIndex: e.detail.value});
        if (v == 0) {
            this.setData({certTypeIndex: 0});
        } else {
            //清空保存数据
            this.setData({certTypeIndex: null});
            this.setData({mateName: null});
            this.setData({mateCertType: null});
            this.setData({mateCertNo: null});
            this.setData({matePhoneNo: null});
        }
    },

    //保存配偶姓名
    bindInputMateName: function (e) {
        this.setData({mateName: e.detail.value});
    },

    //保存配偶证件类型
    bindMateCertType: function (e) {
        this.setData({certTypeIndex: e.detail.value});
    },

    //保存配偶证件号
    bindInputMateCertNo: function (e) {
        this.setData({mateCertNo: e.detail.value});
    },

    //保存配偶手机号
    bindInputMatePhoneNo: function (e) {
        this.setData({matePhoneNo: e.detail.value});
    },

    //保存Email
    bindInputEmail: function (e) {
        this.setData({Email: e.detail.value});
    },
    bindPickerCity: function (e) {
        var v = e.detail.value;
        this.setData({cityIndex: e.detail.value});
        this.setArea();
    },

    bindPickerArea: function (e) {
        var v = e.detail.value;
        this.setData({areaIndex: e.detail.value});
        this.setStreet();
    },

    bindPickerStreet: function (e) {
        this.setData({streetIndex: e.detail.value});
    },

    bindGotoPromise: function () {
        this.setData({PromiseViewed: true});
        wx.navigateTo({
            url: 'promise'
        });
    },

    bindGotoTaxAuth: function () {
        this.setData({TaxAuthViewed: true});
        wx.navigateTo({
            url: 'taxauth',
        });
    },

    bindInputAmount: function (e) {
        console.log(e.detail.value);
        this.setData({ContractAmount: e.detail.value});
    },

    bindPickerTerm: function (e) {
        this.setData({TermIndex: e.detail.value});
    },

    bindPickerProduct: function (e) {
        this.setData({chooseProductIndex: e.detail.value});
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
                'IsMortgage': this.data.chooseMortage.code[this.data.chooseMortageIndex],
                'PropertyType': this.data.propertyType.code[this.data.propertyTypeIndex],
                'PropertyAddress': this.data.PropertyAddress,
                'AreaSquare': this.data.AreaSquare,
                'IsMarried': this.data.chooseMarriage.code[this.data.chooseMarriageIndex],
                'MateName': this.data.mateName,
                'MateCertType': this.data.certType.code[this.data.certTypeIndex],
                'MateCertNo': this.data.mateCertNo,
                'MatePhoneNo': this.data.matePhoneNo,
                'EntName': this.data.EntName,
                'Email': this.data.Email,
                'ProductChangeIntention': this.data.chooseProduct.code[this.data.chooseProductIndex],
                'IsNewFace': getApp().globalData.newFace,
                'SeqNo': getApp().globalData.seqNo,
                'BizToken': getApp().globalData.bizToken
            },
            page: this,
            success: function (res) {
                wx.redirectTo({
                    url: '../result/result?applyStatus=4'
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

        if (this.data.chooseMortageIndex == 0) {
            if (!this.data.AreaSquare) {
                commonUtil.wx_showModal('请输入抵押房产面积');
                return false;
            } else {
                var checkSquare = /^([0]|[1-9]([0-9])*)(.[0-9]{1,4})?$/;
                if (!checkSquare.test(this.data.AreaSquare)) {
                    commonUtil.wx_showModal('请输入正确面积');
                    this.setData({AreaSquare: null});
                    return false;
                } else if (this.data.AreaSquare == 0) {
                    commonUtil.wx_showModal('面积不能为零');
                    this.setData({AreaSquare: null});
                    return false;
                }
            }

            if (!this.data.PropertyAddress) {
                commonUtil.wx_showModal('请输入房产详细地址');
                return false;
            }


        }
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        if (this.data.chooseMarriageIndex == 0) {
            if (!this.data.mateName || re.test(this.data.mateName)) {
                commonUtil.wx_showModal('请输入配偶姓名');
                return false;
            }

            if (!this.data.mateCertNo) {
                commonUtil.wx_showModal('请输入配偶证件号码');
                return false;
            } else {
                var idNoReg = /((^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$))/;   //证件号校验正则
                if (this.data.certTypeIndex == 0 && (!idNoReg.test(this.data.mateCertNo) || !checkLicense(this.data.mateCertNo))) {
                    commonUtil.wx_showModal('请输入正确的身份证号码');
                    this.setData({mateCertNo: null});
                    return false;
                }
            }

            if (!this.data.matePhoneNo) {
                commonUtil.wx_showModal('请输入配偶手机号码');
                return false;
            }
            if (this.data.matePhoneNo.length != 11 || this.data.matePhoneNo.substring(0, 1) != "1") {
                commonUtil.wx_showModal('请输入正确的手机号码');
                return false;
            }
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
    chooseTerm: function (occupation) {
        this.setData({TermIndex: 0});
        switch (occupation) {
            case '01':
                this.setData({TermList: this.data.TermList01});
                break;
            case '02':
                this.setData({TermList: this.data.TermList02});
                break;
            default:
                break;
        }
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

    dialog: function () {
        wx.showModal({
            title: "",
            content: '若为已婚时，夫妻双方负债合计不得超过10万元。',
            showCancel: false//不显示取消按钮
        })
    },
})

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

//证件末位校验
function checkPersonId(personId) {
    var strVerify = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var intAll = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var intTemp = 0;
    for (var i = 0; i < personId.length - 1; i++) {
        intTemp += personId.substring(i, i + 1) * intAll[i];
    }
    intTemp %= 11;
    return personId.substring(personId.length - 1) == strVerify[intTemp];
}

function checkLicense(idNo) {
    var checkedValue = idNo;
    if (checkedValue.length != 15 && checkedValue.length != 18) {
        return false;
    }
    var dateValue;
    if (checkedValue.length == 15) {
        dateValue = '19' + checkedValue.substring(6, 12);
    } else {
        dateValue = checkedValue.substring(6, 14);
    }

    if (!checkDate(dateValue)) {
        return false;
    }

    if (checkedValue.length == 18) {
        return checkPersonId(checkedValue);
    }
    return true;
}