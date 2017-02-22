/**
 * Created by admin3 on 2016/9/19 0019.
 */


var pageLoading = function() {
    var $dom = $('.pageloading');
    var show = function(){
        if($dom.length===0){
            $dom = $('<div class="pageloading"></div>').prependTo('body');
        }
        $dom.show();
    };
    var hide = function(){
        $dom.hide();
    };

    $(function(){
        if(pageLoading.autoHide)
            pageLoading.hide();
    });

    return {
        show: show,
        hide: hide,
        autoHide: true   //在document.ready时，自动关闭
    }
}();

var sTips = function(){
    var $dom = $('.stips');
    var timer = null;

    var buildDom = function() {
        $dom = $('<div class="stips">\
        <div class="stips-content"></div>\
    </div>');
        $dom.click(function(){
            hide();
        });
        $dom.appendTo('body');
    };
    var show = function(text,time) {
        if(timer)
            clearTimeout(timer);
        if($dom.length ===0) {
            buildDom();
        }
        $dom.find('.stips-content').html(text);
        $dom.show();
        if(time !==true) {
            timer = setTimeout(function(){
                $dom.hide();
            },time || 3000);
        }
    };
    var hide = function(){
        if(timer)
            clearTimeout(timer);
        $dom.hide();
    }

    return {
        show: show,
        hide: hide
    }
}();

var tipsLoading = function() {
    var $dom = $('.tipsloading');

    var buildDom = function() {
        var opts = {
            leaf: 12,
            time: 750
        };
        $dom = $('<div class="tipsloading">\
                                <div class="tipsloading-content">\
                                    <div class="tipsloading-icon"></div>\
                                    <div class="tipsloading-text">请求数据</div>\
                                </div>\
                             </div>').prependTo('body');

        var leafHtml = '';
        for (var i = 0; i < opts.leaf; i++) {
            var duration = (opts.time / 1000);
            var delay = (opts.time / opts.leaf * i / 1000);
            leafHtml += '<div class="tipsloading-icon-leaf" style="transform: rotate(' + (360 / opts.leaf * i) + 'deg); animation-duration: ' + duration + 's; animation-delay: ' + delay + 's; -webkit-animation-duration: ' + duration + 's; -webkit-animation-delay: ' + delay + 's;"></div>';
        }
        $dom.find('.tipsloading-icon').html(leafHtml);
        $dom.appendTo('body');
    };

    var show = function(text) {
        if ($dom.length === 0) {
            buildDom();
        }
        $dom.find('.tipsloading-text').html(text);
        $dom.show();
    };
    var hide = function(){
        $dom.hide();
    };

    return {
        show: show,
        hide: hide,
        autoHide: true   //在document.ready时，自动关闭
    }
}();


var dialog = function(selector,options) {
    var opts = $.extend({}, dialog.defaults, options);
    var Dialog = {
        $dom: $(selector),
        inited: false,
        display: false,
        init:function() {
            if(this.inited)
                return;
            var self = this;
            if(opts.init.call(self) === false) {
                return;
            }
            this.inited = true;
            this.$dom.on('click', '.' + opts.hideActionClass, function () {
                self.hide();
            });
            if (opts.hideOnOverLayClick) {
                this.$dom.on('click', function (e) {
                    if (e.target === this) {
                        self.hide();
                    }
                });
            }
        },
        show: function () {
            if (!this.inited) {
                this.init();
            }
            if (this.inited) {
                if (opts.show.call(this) !== false) {
                    this.$dom.show();
                }
            }
        },
        hide: function () {
            if(this.inited) {
                if (opts.hide.call(this) !== false) {
                    this.$dom.hide();
                }
            }
        }
    };
    if(Dialog.$dom.is(':visible')) {
        Dialog.init();
    }
    return Dialog;
};
dialog.defaults = {
    hideActionClass: 'dialog-action-hide',
    hideOnOverLayClick: true,
    init: function () {
    },
    show: function () {
    },
    hide: function () {
    }
};
dialog.confirm = function(content,sureHandler,sureText) {
    var $dom = $('<div class="dialog confirm" style="display: none;">\
                        <div class="dialog-body">\
                            <div class="dialog-main">\
                                <div class="confirm-content"> ' + content + '</div>\
                            </div>\
                            <div class="dialog-ft flex-row">\
                                <div class="btn btn-normal dialog-action-hide">取消</div>\
                                <div class="btn btn-sure">' + (sureText || '确定') + '</div>\
                            </div>\
                        </div>\
                    </div>');
    $dom.appendTo('body');
    var thisDialog = dialog($dom, {
        init: function () {
            if (typeof sureHandler === 'function') {
                var self = this;
                this.$dom.find('.btn-sure').click(function () {
                    if (sureHandler.call(self, arguments) !== false) {
                        self.hide();
                    }
                });
            }
        }
    });
    return thisDialog;
}


var SiteHelper = {
    getUserIcon: function (headImg) {
        if (!headImg) {
            return '/Content/images/in_progress.png';
        }
        return siteConfig.storageUrl + headImg + '/64.png';
    },
    getClassIcon: function(classIcon) {
        if(!classIcon){
            return '/Content/images/class-cover-default.jpg';
        }
        return siteConfig.storageUrl + classIcon;
    },
    getLiveIcon: function (liveLogo) {
        if (!liveLogo) {
            return '/Content/images/img-moren.png';
        }
        return siteConfig.storageUrl + liveLogo;
    }
};


/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

Date.prototype.isToday = function () {
    return new Date(this.toString()).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
}

Date.prototype.toLocalDateStr = function () {
    var now = new Date();
    if (this.isToday()) {
        return '今天';
    }
    else if (new Date(this.setHours(this.getHours() + 24)).isToday()) {
        return '昨天';
    }
    return this.format('MM-dd');
}

String.prototype.dateJsonToDate = function (fixHours) {
    var date = new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10));
    return new Date(date.setHours(date.getHours() + (fixHours || 0)));
}

String.prototype.dateJsonFormat = function(fmt,fixHours) {
    return this.dateJsonToDate(fixHours).format(fmt);
}

//字符编码数值对应的存储长度：
//UCS-2编码(16进制) UTF-8 字节流(二进制)
//0000 - 007F       0xxxxxxx （1字节）
//0080 - 07FF       110xxxxx 10xxxxxx （2字节）
//0800 - FFFF       1110xxxx 10xxxxxx 10xxxxxx （3字节）
//String.prototype.getBytesLength = function() {
//    var totalLength = 0;
//    var charCode;
//    for (var i = 0; i < this.length; i++) {
//        charCode = this.charCodeAt(i);
//        if (charCode < 0x007f)  {
//            totalLength++;
//        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {
//            totalLength += 2;
//        } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {
//            totalLength += 3;
//        } else{
//            totalLength += 4;
//        }
//    }
//    return totalLength;
//}
String.prototype.getBytesLength = function () {
    var char = this.replace(/[^\x00-\xff]/g, '**');
    return char.length;
}


Array.prototype.remove = function(ele) {
    for(var index = this.indexOf(ele);index>-1;index = this.indexOf(ele)) {
        this.splice(index, 1);
    }
}



var initCountDown = function (options) {
    var opts = $.extend({}, initCountDown.defaults, options);
    var timer = null;

    return {
        current: 0,
        start: function (options) {
            var self = this;
            this.stop();
            opts = $.extend({}, opts, options);
            if (typeof opts.start === 'function') {
                opts.start(this.current);
            }
            opts.start(this.current);
            if (self.current >= opts.duation) {
                self.stop();
                opts.end();
                return;
            }
            opts.change(opts.duation - this.current);
            timer = setInterval(function () {
                self.current += opts.delay;
                opts.change(opts.duation - self.current);
                if (self.current >= opts.duation) {
                    self.stop();
                    opts.end();
                }
            }, opts.delay);
        },
        stop: function () {
            timer = clearInterval(timer);
            this.current = 0;
        },
    }

};
initCountDown.defaults = {
    duation: 60000,
    delay: 1000,
    start: function () {

    },
    change: function () {

    },
    end: function () {

    }
}





