/**
 * Created by admin3 on 2016/9/19 0019.
 */

//select
(function ($) {
    $.fn.initSelect = function () {
        $(this).each(function () {
            var $this = $(this);
            if ($this.data('initSelect'))
                return;
            $this.data('initSelect', true);
            var val = $this.children('input').val();
            var $drop = $this.children('select');
            $drop.val(val);
            setSelectTextValue($drop);

            $this.find('select').change(function () {
                setSelectTextValue($(this));
            });
        });
    }
    function setSelectTextValue($drop) {
        var val = $drop.val();
        if (val) {
            var text = $drop.children(':selected').text();
            $drop.siblings('.text').removeClass('placeholder').text(text);
            $drop.siblings('input').val(val);
        }
    }
})($);
//radioGroup
(function ($) {
    $.fn.initRadioGroup = function () {
        $(this).each(function () {
            var $this = $(this);
            if ($this.data('initRadioGroup'))
                return;
            $this.data('initRadioGroup', true);
            var val = $this.children('input').val();
            var $radios = $this.children();
            var $find = $radios.filter('[data-value="' + val + '"]').eq(0);
            if ($find.length > 0) {
                $radios.removeClass('active');
                $find.addClass('active');
            }
            $radios.click(function () {
                var $this = $(this);
                if ($this.hasClass('disabled') || $this.parent().hasClass('disabled'))
                    return;
                $this.addClass('active').siblings(':not(input)').removeClass('active');
                $this.siblings('input').val($this.data('value'));
            });
        });
    };
})($);
//checkbox
(function ($) {
    $.fn.initCheckbox = function (options) {
        var opts = $.extend({}, $.fn.initCheckbox.defaults, options);
        $(this).each(function () {
            var that = this;
            var $this = $(this);
            if ($this.data('initCheckbox'))
                return;
            $this.data('initCheckbox', true);
            var val = $this.children('input').val();
            if (val == 'true') {
                $this.addClass('active');
            }
            else if (val == 'false') {
                $this.removeClass('active');
            }
            var $clickHandler = opts.$clickHandler || $this;
            $clickHandler.click(function () {
                //var $this = $(this);
                if ($this.hasClass('disabled'))
                    return;
                $this.toggleClass('active');
                if ($this.hasClass('active')) {
                    $this.children('input').val('true');
                    opts.change.call(that, true);
                }
                else {
                    $this.children('input').val('false');
                    opts.change.call(that, false);
                }
            });
        });
    };
    $.fn.initCheckbox.defaults = {
        $clickHandler: null,
        change: function (checked) { }
    };


})($);
//switch
(function ($) {
    $.fn.initSwitch = function (options) {
        var opts = $.extend({}, $.fn.initSwitch.defaults, options);
        $(this).each(function () {
            var $this = $(this);
            if ($this.data('initSwitch'))
                return;
            $this.data('initSwitch', true);
            var val = $this.children('input').val();
            if (val == 'true') {
                $this.addClass('active');
            }
            else if (val == 'false') {
                $this.removeClass('active');
            }
            $this.click(function () {
                var that = this;
                var $this = $(this);
                if ($this.hasClass('disabled'))
                    return;
                $this.toggleClass('active');
                if ($this.hasClass('active')) {
                    $this.children('input').val('true');
                    opts.change.call(that,true);
                }
                else {
                    $this.children('input').val('false');
                    opts.change.call(that,false);
                }
            });
        });
    };
    $.fn.initSwitch.defaults = {
        change: function (on) { }
    };
})($);
//tab
(function ($) {
    $.fn.initTab = function (options) {
        $(this).each(function () {
            var $this = $(this);
            if ($this.data('initTab'))
                return;
            $this.data('initTab', true);
            var opts = $.extend({}, $.fn.initTab.defaults, options);

            var setActive = function ($tab, $tablist, fource) {
                if (!$tab || $tab.length === 0) {
                    return;
                }
                var $target = null;
                var $contentlist = opts.$content || $tablist.siblings('.tabcontent-list');
                if (opts.type == 'event') {
                    $target = null;
                }
                else if (opts.type == 'target') {
                    var target = $tab.data('target');
                    $target = $contentlist.children(target);
                }
                else {
                    var index = $tab.index();
                    $target = $contentlist.children('.tabcontent').eq(index);
                }
                if (!fource && $tab.hasClass('active'))
                    return;
                if (typeof opts.tabChange === 'function') {
                    var tabChangeResult = opts.tabChange.call($tab, $target);
                    if (tabChangeResult === false)
                        return;
                }
                $tab.addClass('active').siblings('.tab').removeClass('active');
                if (!$target || $target.length === 0)
                    return;
                if (typeof opts.contentChange === 'function') {
                    var contentChangeResult = opts.contentChange.call($target, $tab);
                    if (contentChangeResult === false)
                        return;
                }
                $target.addClass('active').siblings('.tabcontent').removeClass('active');
            };

            var $defaultTab = null;
            if (opts.default) {
                $defaultTab = $this.children().eq(parseInt(opts.default));
            }
            else {
                $defaultTab = $this.children('.tab.active').first();
            }
            setActive($defaultTab, $this, true);
            $this.children('.tab').click(function () {
                var $this = $(this);
                var $tablist = $this.parent();
                if ($this.hasClass('disabled') || $tablist.hasClass('disabled')) {
                    return;
                }
                setActive($this, $tablist);
            });
        });
    };

    $.fn.initTab.defaults = {
        type: 'index', //值：index 、 target 和 event
        default: null,  //初始化时，如果不配置该项，那么将自动找到第一个设置为active的tab，显示其对应的content，如果找不到，将不显示任何content
        $content: null,
        tabChange: function ($target) {

        },
        contentChange: function ($tab) {

        }
    }
})($);

//sliderMenu
(function ($) {
    var SliderMenu = function (selector, options) {
        var opts = $.extend({}, SliderMenu.defaults, options);
        var $dom = $(selector);
        var dom = $dom.get(0);
        if ($dom.data('SliderMenu')) {
            return;
        }
        var $wrap = $dom.children('.slider-menu-wrap');
        var $minor = $wrap.children().last();  //次栏位
        var minerWidth = $minor.outerWidth();

        var translateX = 0;
        var translateTo = function (tmpTranslateX) {
            $wrap.css({
                'transform': 'translateX(' + tmpTranslateX + 'px)',
                '-webkit-transform': 'translateX(' + tmpTranslateX + 'px)'
            });
            translateX = tmpTranslateX;
        };
        var o = {
            $dom: $dom,
            reset: function () { translateTo(0); }
        };
        var initEvent = function () {
            var eventing = false;
            var isTouchEvent = 'ontouchstart' in document;
            var pageX = 0;

            $wrap.on(isTouchEvent ? 'touchstart' : 'dragstart', function (e) {
                if (typeof opts.slideStart === 'function') {
                    opts.slideStart.call(dom, o);
                }
                e.stopPropagation();
                eventing = true;
                $wrap.removeClass('transitioning');
                pageX = isTouchEvent ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
            });
            $(document).on(isTouchEvent ? 'touchmove' : 'drag', function (e) {
                e.stopPropagation();
                if (eventing) {
                    var tmpPageX = isTouchEvent ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
                    var tmpTranslateX = translateX + tmpPageX - pageX;
                    if (tmpTranslateX <= 0 && tmpTranslateX >= -minerWidth) {
                        translateTo(tmpTranslateX);
                    }
                    pageX = tmpPageX;
                }
            });
            $('body').on(isTouchEvent ? 'touchend' : 'dragend', function (e) {
                e.stopPropagation();
                if (eventing) {
                    eventing = false;
                    $wrap.addClass('transitioning');
                    if (translateX <= -minerWidth / 2) {
                        translateTo(-minerWidth);
                    }
                    else {
                        translateTo(0);
                    }
                }
            });

        };

        initEvent();
        $dom.data('SliderMenu', o);
        return o;
    };
    SliderMenu.defaults = {
        slideStart: function () { }
    }

    var lastSliderMenu = null;

    $.fn.initSliderMenu = function (options) {
        var $this = $(this);
        var opts = $.extend({}, $.fn.initSliderMenu.defaults, options);
        if (opts.autoReset) {
            var slideStart = opts.slideStart;
            opts.slideStart = function (o) {
                if (lastSliderMenu && lastSliderMenu != o) {
                    lastSliderMenu.reset();
                }
                lastSliderMenu = o;
                typeof slideStart === 'function' && slideStart.call(this);
            };
        }
        $this.each(function () {
            SliderMenu(this, opts);
        });
    };
    $.fn.initSliderMenu.defaults = {
        autoReset: true,
        slideStart: function () { }
    };
})($);


(function ($) {
    //页面加载时，自动检测所有data-init-control属性的dom，
    $('[data-init-control]').each(function () {
        var $this = $(this);
        var fn = $this.data('init-control');
        if (typeof $.fn[fn] === 'function') {
            $.fn[fn].call($this);
        }
    });
})($);