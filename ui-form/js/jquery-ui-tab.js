/* =================================================
// jQuery uiTabs Plugins 1.0
// author : wkylin@qq.com
// 对象级别插件
// 参数：
// event:触发事件 mouseover click
// timeout:延迟时间
// auto:自动播放
// callback:回调函数
// 用法：$('.ui-tab').uiTabs({
                    event:"click"
                }
        );
// =================================================*/

;(function ($) {
    $.fn.extend({
        uiTabs:function (options) {
            options = $.extend({
                event:'mouseover',
                timeout:0,
                auto:0,
                callback:null
            }, options);

            var self = $(this),
                tabContent = self.children('.ui-tab-ctn').children('.ui-tab-ctn-item'),
                tabTrigger = self.children('.ui-tab-trigger'),
                tabTriggerItems = tabTrigger.find('.ui-tab-trigger-item'),
                timer;
            var tabTriggerHandle = function (e) {
                e.siblings('.ui-tab-trigger-item')
                    .removeClass('ui-tab-trigger-item-current')
                    .end()
                    .addClass('ui-tab-trigger-item-current');
                tabContent.siblings('.ui-tab-ctn-item')
                    .removeClass('ui-tab-ctn-item-current')
                    .end()
                    .eq(e.index())
                    .addClass('ui-tab-ctn-item-current');
            },

                delay = function (e, time) {
                    time ? setTimeout(function () {
                        tabTriggerHandle(e);
                    }, time) : tabTriggerHandle(e);
                },

                start = function () {
                    if (!options.auto) return;
                    timer = setInterval(autoRun, options.auto);
                },
                autoRun = function () {
                    var current = tabTrigger.find('li.ui-tab-trigger-item-current'),
                        firstItem = tabTriggerItems.eq(0),
                        len = tabTriggerItems.length,
                        index = current.index() + 1,
                        item = index === len ? firstItem : current.next('.ui-tab-trigger-item'),
                        i = index === len ? 0 : index;
                    current.removeClass('ui-tab-trigger-item-current');
                    item.addClass('ui-tab-trigger-item-current');
                    tabContent.siblings('.ui-tab-ctn-item')
                        .removeClass('ui-tab-ctn-item-current')
                        .end()
                        .eq(i)
                        .addClass('ui-tab-ctn-item-current');
                };

            tabTriggerItems.bind(options.event, function () {
                delay($(this), options.timeout);
                if (options.callback) {
                    options.callback.call(self);
                }
            });

            if (options.auto) {
                start();
                self.hover(function () {
                    clearInterval(timer);
                    timer = undefined;
                }, function () {
                    start();
                });
            }
            return this;
        }
    });
})(jQuery);