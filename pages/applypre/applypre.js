// pages/applypre/applypre.js
var commonUtil = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    next: function (e) {
        var num = e.currentTarget.dataset.num;
        if (num == 2) {
            getApp().globalData.prodNo = '510820';  //创业贷
        } else if (num == 3) {
            getApp().globalData.prodNo = '030110';   //优易贷
        } else {
            getApp().globalData.prodNo = '010250'; //普惠贷款个人
        }
        //进入介绍页
        wx.navigateTo({
            url: '../applypre/applydetail?display=' + num
        });
    },

    dialog: function () {
        wx.showModal({
            title: "",
            content: '用于流动资金周转，购置或更新经营设备、支付租赁经营场所租金等合法生成经营活动等。',
            showCancel: false//不显示取消按钮
        })
    },

    dialog1: function () {
        wx.showModal({
            title: "",
            content: '政府创业担保贷款，最高额度300万，享受政府贴息。',
            showCancel: false//不显示取消按钮
        })
    }
})