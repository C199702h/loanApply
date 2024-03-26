//获取应用实例
var app = getApp()
Page({
    data: {
        //imageWidth: {}
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        var that = this;

    },
    imageLoad: function (e) {
        var $width = e.detail.width,    //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height;    //图片的真实宽高比例
        var viewWidth = 750,           //设置图片显示宽度，左右留有16rpx边距
            viewHeight = 750 / ratio;    //计算的高度值
        this.setData({
            imageWidth: viewWidth,
            imageHeight: viewHeight,
            showImage: true
        })
    },
    loanApply: function () {
        wx.navigateTo({
            url: '../apply/apply'
        })
    }
})