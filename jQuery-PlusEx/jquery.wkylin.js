/*
 *插件类别：1.类级别的插件开发。2.对象级别插件开发。
 *
 * 1.类级别：$.post()
 * 2.对象级别：$("#Me").插件名称();
 *
 * 以下是开发对象级别插件的步骤：
 *1.定义一个带有个名为“$”参数的匿名函数。将jQuery这个全局变量传入匿名函数，并执行匿名函数。
 *
 *2.$.fn或者jQuery.fn本质上可以等于jQuery.prototype。实际上给jQuery扩展了一个名为"插件名"的方法,调用方法：$("#Me").插件名称();
 *
 *3.$.extend(defaults,options);的含义是，使用settings来覆盖defaultSettings（同名键值）,
 *或者 settings = $.extend({},defaults,options);即不去覆盖defaultSettings（默认参数），而是合并到一个空的Object。
 *or settings = $.extend(true,{},defaults, options || {});当$.extend的第一个参数为true时，会开启深层拷贝
 *
 *4.this在插件内部指向当前通过选择器选择的jquery对象，而非传统意义上的对象的引用。this.each遍历所有的元素。return JQuery对象保证插件的链式操作。
 *
 *5.插件中定义的所有方法/函数的末尾都必须带有一个 “;”（分号），否则将不利于代码的最小化。
 *
 * 参考:http://www.iteye.com/topic/545971
 * 参考:http://developer.51cto.com/art/201108/286391.htm
 * 参考:http://www.cnblogs.com/fromearth/archive/2009/07/08/1519054.html
 * 参考:http://www.36ria.com/2768
 * 参考:http://www.cnblogs.com/RascallySnake/archive/2010/05/07/1729563.html
 * 参考:http://www.36ria.com/2765
 * 参考:http://vanessa.b3log.org/jQuery-plugin-architecture
 * 参考:http://docs.jquery.com/Plugins/Authoring
 */

/* 创建一个闭包 */
;(function ($) {
    /* 插件的定义 */
    $.fn.wkylin = function (options) {
        debug(this);
        // build main options before element iteration
        var opts = $.extend(true,{}, $.fn.wkylin.defaults, options || {});
        // iterate and reformat each matched element
        return this.each(function () {
            $this = $(this);
            // build element specific options
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            // update element styles
            $this.css({
                "background-color":o.background,
                "color":o.foreground
            });
            var markup = $this.html();
            // call our format function
            markup = $.fn.wkylin.format(markup);
            $this.html(markup);
        });
    };
    // 私有函数：debugging
    function debug($obj) {
        if (window.console && window.console.log)
            window.console.log('obj size: ' + $obj.size());
    }

    /* 定义暴露format函数 */
    $.fn.wkylin.format = function (txt) {
        return '<strong>' + txt + '</strong>';
    };
    // 插件的defaults
    $.fn.wkylin.defaults = {
        foreground:'#eee',
        background:'#999'
    };
    /* 设置版本号 */
    $.fn.wkylin.version = 1.0;
    //  闭包结束
})(jQuery);