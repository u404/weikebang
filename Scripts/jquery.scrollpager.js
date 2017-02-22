/**
 * Created by admin3 on 2016/9/30 0030.
 */
(function ($) {

    $.fn.scrollPager = function (options) {
        var opts = $.extend({}, $.fn.scrollPager.defaults, options);
        var currentPage = 0;
        var isFirstLoad = true;
        var lock = false;
        var that = this;
        var $this = $(this);
        var postData = $.extend({}, {
            page: opts.page,
            pageSize: opts.pageSize
        }, opts.data);

        var tips = function ($container, direction) {
            var $tips = $('<div class="scrollpager-tips"></div>');
            if (direction == 'down') {
                $tips.appendTo($container);
            }
            else if (direction == 'up') {
                $tips.prependTo($container);
            }
            return {
                $this: $tips,
                hide: function () {
                    $tips.hide();
                },
                loading: function () {
                    $tips.html(opts.loadingTips);
                },
                nomore: function () {
                    $tips.html(opts.nomoreTips);
                },
                nodata: function () {
                    if (opts.nodataTips)
                        $tips.html(opts.nodataTips);
                    else
                        $tips.html(opts.nomoreTips);
                },
                error: function () {
                    $tips.html(opts.errorTips);
                }
            }
        }($this, opts.direction);

        var loadPage = function (page) {
            if (lock) {
                return;
            }
            lock = true;
            tips.loading();
            postData.page = page;
            $.ajax({
                url: opts.url,
                data: postData,
                type: opts.type,
                dataType: 'json',
                success: function (data) {
                    currentPage = page;
                    lock = false;
                    if (typeof data != 'object') {
                        tips.error();
                        lock = false;
                        return;
                    }
                    var list = opts.getListHandler(data);
                    if (list && list.length > 0) {
                        opts.successHandler.call(that, data);
                        if (typeof success === 'function')
                            success();
                        if (list.length < opts.pageSize) {
                            tips.nomore();
                            lock = true;
                        }
                    }
                    else {
                        if (isFirstLoad) {
                            tips.nodata();
                        }
                        else {
                            tips.nomore();
                        }
                        lock = true;
                    }
                    isFirstLoad = false;
                },
                error: function () {
                    tips.error();
                    lock = false;
                }
            });
        };

        if (opts.direction == 'up') {
            var successHandler = opts.successHandler;
            opts.successHandler = function (data) {
                var scrollTop = $this.scrollTop();
                console.log(scrollTop);
                var scrollHeight = $this[0].scrollHeight;
                successHandler.call(this, data);
                $this.scrollTop(scrollTop + $this[0].scrollHeight - scrollHeight);
            };
        }

        var scrollEvent = function () {
            var scrollTop = $this.scrollTop();
            if (opts.direction == 'down' && ($this[0].scrollHeight - $this.height() - scrollTop) <= opts.preLength) {
                loadPage(currentPage + 1);
            }
            else if (opts.direction == 'up' && scrollTop <= opts.preLength) {
                loadPage(currentPage + 1);
            }
        }
        $this.addClass('scrollpager');
        $this.scroll(scrollEvent);

        if (opts.autoLoad) {
            loadPage(opts.page);
        }

        var reload = function(options) {
            var beforeReload = function(){  };
            if(options) {
                delete options.direction;  //禁止reload时重新设置方向
                delete options.preLength;  //禁止reload时重新设置预加载距离
                (typeof options.beforeReload ==='function') && (beforeReload = options.beforeReload) && delete options.beforeReload;
                opts = $.extend({}, opts, options);
            }
            isFirstLoad = true;
            lock = false;
            postData = $.extend({},{
                page: opts.page,
                pageSize: opts.pageSize
            }, opts.data);
            if(beforeReload.call(that)!==false)
                loadPage(opts.page);
        };

        return {
            reload: reload  // reload方法的参数除了direction、preLength等无法重新设置，
                            // 可以接收一个新的参数beforeReload，可以在这个对象中做一些处理
        }


    }
    $.fn.scrollPager.defaults = {
        direction: 'down',
        page: 1,
        pageSize: 10,
        preLength: 50,
        autoLoad: true,
        getListHandler: function (data) {        //默认情况下，仅仅将返回值当做数组处理，
            return data;                            // 如果是个含其他数据的Json对象，那么自定义取出列表的委托函数。
        },
        url: '',
        type: 'POST',
        data: null,
        successHandler: function (data) {
        },
        loadingTips: '<div class="scrollpager-loading">加载中...</div>',
        nomoreTips: '<div class="scrollpager-nomore">已到最后</div>',
        nodataTips: '<div class="scrollpager-nodata">暂无记录</div>',
        errorTips: '<div class="scrollpager-error">加载失败</div>'

    }
})($);