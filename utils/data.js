//获取常量数据
function getConstantData(arg) {
    switch (arg) {
        //服务器URL
        case "serverURL": {
            // var obj = "https://test.szrcb961200.com/pmf/"
            //不能用这个生产版本调试，影响token
            // var obj = "https://mobile.4001961200.com/pmf/"
            //var obj = "https://113.106.72.170/pmf/"

            //UAT-10.170.32.105服务器

            var obj = "http://netbank.qhgctech.com/pmf/" //uat
            //  var obj = "http://112.95.233.29/pmf/"  //准生产
            // var obj = "http://netbank.qhgctech.com/lzp/pmf/"  //个人本地
            return obj
        }
        //公共请求参数
        case "commonUrlArg1": {
            var obj = "_locale=zh_CN&LoginType=R&ClientType=Client&MacAddress=ccvenus123456&TerminalType=undefined&TerminalId=undefined&"
            // var obj={'_locale':'zh_CN','LoginType':'R','ClientType':'Client','MacAddress':'ccvenus123456','TerminalType':'undefined','TerminalId':'undefined'};
            return obj
        }
        //公共加密请求参数
        case "commonUrlArg2": {
            // var obj = "_locale=zh_CN&LoginType=R&ClientType=Client&MacAddress=ccvenus123456&TerminalType=undefined&TerminalId=undefined&"
            var obj = {
                '_locale': 'zh_CN',
                'LoginType': 'R',
                'ClientType': 'Client',
                'MacAddress': 'ccvenus123456',
                'TerminalType': 'undefined',
                'TerminalId': 'undefined'
            };
            return obj
        }
        //城市列表
        case "city_list": {
            var obj = ['深圳市', '桂林市', '柳州市', '宜州市', '梧州市', '崇左市']
            return obj
        }
        //默认位置，合作金融大厦坐标
        case "default_location": {
            var obj = [114.11748468875885, 22.543350260121741]
            return obj
        }
        //翻页时的每页数量
        case "page_element_num": {
            var obj = 5
            return obj
        }
        //腾讯地图key
        case "tx_map_key": {
            var obj = 'D5BBZ-SDACU-IELVK-4LAN6-UVUG5-NUF57'
            return obj
        }
        //响应加密的交易
        case "tr_encrypt": {
            var obj = ['ClientMgrQry.do']
            return obj
        }
        //已经失效的客户经理号
        case "invalidate_marketcode": {
            var obj = []
            return obj
        }
        case "redirect_url": {
            var obj = '';
            return obj;
        }
    }
}

//导出接口
module.exports = {
    getConstantData: getConstantData
}