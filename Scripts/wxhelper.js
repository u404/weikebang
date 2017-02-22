/**
 * Created by admin3 on 2016/10/12 0012.
 */
var wxHelper = {
    config: function() {
        wx.config({
            debug: false,
            appId: $("#wxJsAppId").val(), // 必填，公众号的唯一标识
            timestamp: $("#wxJsTimeStamp").val(), // 必填，生成签名的时间戳
            nonceStr: $("#wxJsNonceStr").val(), // 必填，生成签名的随机串
            signature: $("#wxJsSignaturePage").val(),// 必填，签名，见附录1
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "chooseWXPay", "chooseImage", "previewImage", "uploadImage", "downloadImage"]
        });
    },
    pay: function(options) {
        var defaults = {
            timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: '', // 支付签名随机串，不长于 32 位
            package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: '', // 支付签名
            success: function (res) {
            },
            fail: function (res) {
            }
        };
        var opts = $.extend({}, defaults, options);
        wx.chooseWXPay(opts);
    }
}
