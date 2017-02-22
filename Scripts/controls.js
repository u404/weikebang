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

            //$this.find('select').click(function () {
            //    var $drop = $(this);
            //    if (!$drop.val()) {
            //        $drop.val($drop.children().first().attr('value'));
            //        setSelectTextValue($drop);
            //    }
            //});
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
                opts.change.call(this, true);
            }
            else if (val == 'false') {
                $this.removeClass('active');
                opts.change.call(this, false);
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
                opts.change.call(this, true);
            }
            else if (val == 'false') {
                $this.removeClass('active');
                opts.change.call(this, false);
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

//拖拽事件监听控件
(function ($) {
    $.fn.onDrag = function (options) {

        $(this).each(function () {
            var opts = $.extend({}, $.fn.onDrag.defaults, options);

            var eventPos = {
                    x: 0,
                    y: 0
                },
                moveLength = 0,
                that = this,
                $this = $(this),
                touchSupport = 'ontouchstart' in document,
                _getPos = function (e) {
                    var posWrap = touchSupport ? e.touches[0] : e;
                    return {
                        x: posWrap.clientX,
                        y: posWrap.clientY
                    }
                },
                _start = function (e) {
                    eventPos = _getPos(e);
                    moveLength = 0;
                    opts.start && opts.start.call(that, eventPos);
                },
                _move = function (e) {
                    var lastPos = eventPos;
                    eventPos = _getPos(e);
                    moveLength += Math.sqrt(Math.pow(Math.abs(eventPos.x - lastPos.x), 2) + Math.pow(Math.abs(eventPos.y - lastPos.y), 2));
                    opts.move && opts.move.call(that, eventPos, lastPos);
                },
                _end = function (e) {
                    opts.end && opts.end.call(that, eventPos);
                },
                __end = _end;
            if (touchSupport) {
                _end = function (e) {
                    that.removeEventListener('touchmove', _move);
                    that.removeEventListener('touchend', _end);
                    __end.call(that, e);
                };

                that.addEventListener('touchstart', function (e) {
                    _start(e);
                    that.addEventListener('touchmove', _move);
                    that.addEventListener('touchend', _end);
                });
            }
            else {
                var _click = function (e) {
                    clickEvent = e;
                    e.preventDefault();
                };
                _end = function (e) {
                    document.removeEventListener('mousemove', _move);
                    document.removeEventListener('mouseup', _end);
                    that.removeEventListener('losecapture', _end);
                    window.removeEventListener('blur', _end);
                    if (moveLength > 10) {
                        that.addEventListener('click', _click);
                    }
                    else {
                        that.removeEventListener('click', _click);
                    }
                    __end.call(that, e);
                };
                that.addEventListener('dragstart', function (e) {
                    e.preventDefault();
                });
                that.addEventListener('drag', function (e) {
                    e.preventDefault();
                });
                that.addEventListener('dragend', function (e) {
                    e.preventDefault();
                });
                that.addEventListener('mousedown', function (e) {
                    _start(e);
                    document.addEventListener('mousemove', _move);
                    document.addEventListener('mouseup', _end);
                    that.addEventListener('losecapture', _end);
                    window.addEventListener('blur', _end);
                });

            }

        });

    };
    $.fn.onDrag.defaults = {
        start: null,
        move: null,
        end: null
    };
})($);

//sliderMenu v2.0
(function ($) {
    var SliderMenu = function (selector, options) {
        var opts = options;
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
            $wrap.onDrag({
                start: function (pos) {
                    opts.slideStart && opts.slideStart.call(dom, o);
                    $wrap.removeClass('transitioning');
                },
                move: function (pos, lastPos) {
                    var tmpTranslateX = translateX + pos.x - lastPos.x;
                    if (tmpTranslateX <= 0 && tmpTranslateX >= -minerWidth) {
                        translateTo(tmpTranslateX);
                    }
                },
                end: function (pos) {
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
                slideStart && slideStart.call(this);
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
    $.fn.imgLazyLoad = function (options) {
        var opts = $.extend({}, $.fn.imgLazyLoad.defaults, options);
        $(this).each(function () {
            var that = this;
            var $this = $(this);
            if ($this.data('imgLazyLoad'))
                return;
            $this.data('imgLazyLoad', true);
            if (that.nodeName === 'IMG') {
                var src = that.src;
                that.src = opts.preSrc;
                $this.addClass(opts.preClass);
                var tmpImg = new Image();
                tmpImg.onload = function () {
                    that.src = this.src;
                    $this.removeClass(opts.preClass);
                    tmpImg = null;
                }
                tmpImg.src = src;
            }
            else {
                try {
                    var bgImg = /url\("(.*?)"\)/.exec($this.css('background-image'))[1];
                    $this.css('cssText', 'background-image:url(' + opts.preSrc + ') !important').addClass(opts.preClass);
                    var tmpImg = new Image();
                    tmpImg.onload = function () {
                        tmpImg.onload = null;
                        $this.css('background-image', 'url(' + this.src + ')').removeClass(opts.preClass);
                        tmpImg = null;
                    }
                    tmpImg.src = bgImg;
                }
                catch (e) {

                }
            }
        });
    };
    $.fn.imgLazyLoad.defaults = {
        preSrc: '/Content/images/img-loading.png',
        preClass: 'img-lazy-loading',
    };
})($);

(function ($) {
    $.fn.initInputCount = function (options) {
        var opts = $.extend({}, $.fn.initInputCount.defaults, options);
        $(this).each(function () {
            var that = this,
                $this = $(this);
            if ($this.data('initInputCount'))
                return;
            $this.data('initInputCount', true);
            var $inputCount = $('<div class="tips-input-count"><span class="current">0</span>/<span class="max">' + opts.max + '</span></div>');
            $inputCount.addClass(opts.appendClass);

            if (opts.autoHide) {
                $inputCount.css('visibility', 'hidden');
                $this.on('focus', function () {
                    $inputCount.css('visibility', 'visible');
                }).on('blur', function () {
                    $inputCount.css('visibility', 'hidden');
                });
            }

            $this.after($inputCount);

            var countHandler = null;
            if (opts.type == 1) {
                countHandler = function () {
                    return Math.ceil($this.val().getBytesLength() / 2);
                };
            }
            else if (opts.type == 2) {
                countHandler = function () {
                    return $this.val().length;
                };
            }
            else {
                countHandler = opts.countHandler;
            }

            if (typeof countHandler === 'function') {
                var setInputCountCurrent = function () {
                    $inputCount.children('.current').text(countHandler());
                }
                setInputCountCurrent();
                $this.on('input', function () {
                    setInputCountCurrent();
                });
            }


        });
    };
    $.fn.initInputCount.defaults = {
        type: 1,    //1字节数统计，2length统计, 3自定义统计
        max: 100,   //最大字节数或字符数
        appendClass: '', //追加自定义的样式
        countHandler: null,
        autoHide: false
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

