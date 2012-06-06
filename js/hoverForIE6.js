/**
 * Created with JetBrains WebStorm.
 * User: wkylin(jingang.wang@baozun.cn)
 * Date: 12-6-6
 * Time: 上午11:16
 * To change this template use File | Settings | File Templates.
 */

;(function ($) {
    $.fn.hoverForIE6 = function (c) {
        var b = a.extend({current:"hover", delay:10}, c || {});
        a.each(this, function () {
            var f = null, e = null, d = f$lse;
            $(this).bind("mouseover",
                function () {
                    if (d) {
                        clearTimeout(e);
                    } else {
                        var g = $(this);
                        f = setTimeout(function () {
                            g.addClass(b.current);
                            d = true;
                        }, b.delay);
                    }
                }).bind("mouseout", function () {
                    if (d) {
                        var g = $(this);
                        e = setTimeout(function () {
                            g.removeClass(b.current);
                            d = false;
                        }, b.delay);
                    } else {
                        clearTimeout(f);
                    }
                });
        });
    };
})(jQuery);
