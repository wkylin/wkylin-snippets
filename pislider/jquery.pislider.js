/*
 * jQuery PiSlider
 * 作者:痞子
 * http://www.niumowang.org/javascript/jquery-slider-plugin/
 */
(function ($) {
    $.fn.pislider = function (options) {
        var defaults = {
            child:"child",
            slider_bar:"slider_bar",
            scrollTime:500,
            autoScroll:"true",
            autoTime:7000
        };

        var options = $.extend(defaults, options);
        var _this = $(this);
        var child = _this.find("." + options.child);
        var slider_bar = $("#" + options.slider_bar);
        var len = child.length - 1;
        child.wrapAll("<div id=scroll_wrapper></div>");
        var width = child.width();
        var two_width = width * 2;
        var thr_width = width * 3;

        var wrap = $("#scroll_wrapper");
        wrap.css({width:thr_width + "px", left:-width + "px"});
        child.not(":first").hide();

        function noMove() {
            if (!wrap.is(":animated")) {
                return true;
            }
            else {
                return false;
            }
            ;
        }

        ;


        child.each(function (index) {
            if (index == 0) {
                slider_bar.append("<a href='#' class='cur'></a>");
            }
            else {
                slider_bar.append("<a href='#'></a>");
            }
            ;
        });
        var cur_a = slider_bar.find("a.cur");

        slider_bar.find("a").click(function () {
            var clickIndex = $(this).index();
            var nowIndex = slider_bar.find("a.cur").index();

            if (noMove()) {
                if (clickIndex > nowIndex) {
                    scroll(clickIndex, two_width);
                }
                else if (clickIndex < nowIndex) {
                    scroll(clickIndex, "0");
                }
                else {
                    return false;
                }
                ;
            }
            ;
            return false;
        });

        function scroll(num, scroll_width) {
            slider_bar.find("a").eq(num).addClass("cur").siblings().removeClass("cur");
            child.eq(num).show().css({left:scroll_width + "px"});
            wrap.animate({left:-scroll_width + "px"}, options.scrollTime, function () {
                child.eq(num).css({left:width + "px"}).siblings().hide();
                wrap.css({left:-width + "px"});
            });
        }

        ;

        $("#btn_prev").click(function () {
            var curIndex = slider_bar.find("a.cur").index();
            if (noMove()) {
                if (curIndex == 0) {
                    scroll(len, "0");
                }
                else {
                    slider_bar.find("a.cur").prev("a").trigger("click");
                }
                ;
            }
            ;
            return false;
        });

        $("#btn_next").click(function () {
            var curIndex = slider_bar.find("a.cur").index();
            if (noMove()) {
                if (curIndex == len) {
                    scroll("0", two_width);
                }
                else {
                    slider_bar.find("a.cur").next("a").trigger("click");
                }
                ;
            }
            ;
            return false;
        });

        if (options.autoScroll == "true") {
            autoScroll = setInterval(function () {
                $("#btn_next").trigger("click")
            }, options.autoTime);
            autoPlay = function () {
                autoScroll = setInterval(function () {
                    $("#btn_next").trigger("click")
                }, options.autoTime);
            };
            stopPlay = function () {
                clearInterval(autoScroll);
            };
            _this.hover(stopPlay, autoPlay);
            $("#btn_prev,#btn_next").hover(stopPlay, autoPlay);
        }
        ;
    };
})(jQuery);