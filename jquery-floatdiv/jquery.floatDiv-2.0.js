/**
 * onOff:true, //默认开启,此项一般不作设置
 *width:”", //宽度
 *height:”", //高度
 *cover:true, //是否遮罩，默认有
 *coverDiv:”floatDivCover”, //遮罩层挂勾(填写元素id，此项一般不作设置)
 *coverColor:”#000000″, //遮罩背景颜色
 *fade:50, //遮罩透明度
 *space:0, //沿边间距
 *level:”center”, //水平排列方式(left,center,right)
 *vertical:”middle”, //竖直排列方式(top,middle,bottom)
 *closeHandler:”", //关闭句柄(填写元素id)
 *dragHandler:”", //拖拽句柄(须为对象内元素)，默认无(支持CSS选择器语法)，若值为字符串”self”，则自身为事件句柄
 *dragLimit:true, //拖拽区域限制，默认限制在窗口可视区内
 *ifScroll:true, //是否滚动模式（层是否随滚动条滚动），默认为滚动模式
 *scrollBar:false //窗口滚动条是否可用（非滚动模式下有效）
 */

; (function($) {
	$.fn.extend({
		floatDiv: function(opt) {
			if ($(this).length == 0) {
				return
			};
			opt = $.extend({
				onOff: true,
				width: "",
				height: "",
				cover: true,
				coverDiv: "floatDivCover",
				coverColor: "#000000",
				fade: 50,
				space: 0,
				level: "center",
				vertical: "middle",
				closeHandler: "",
				dragHandler: "",
				dragLimit: true,
				ifScroll: true,
				scrollBar: false
			},
			opt);
			var obj = $(this),
			selfWidth,
			selfHeight,
			maxZ = 0,
			browserVersion = null,
			frame = "",
			dragX = 0,
			dragY = 0,
			dragFlag = false;
			var init = function() {
				if ($("#floatDivTemp").length == 0) {
					obj.append("<input type='hidden' value='' id='floatDivTemp' />")
				};
				if (browserVersion == "ie6") {
					if ($("#floatDivTemp").val() == "") {
						$("head").append("<style>html{ background-image:url('about:blank'); background-attachment:fixed;}</style>");
						$("body").append('<iframe id="framezd" scrolling="no" frameborder="0"></iframe>');
						$("#floatDivTemp").val(opt.coverDiv)
					};
					frame = opt.cover == true ? "zdCover": "zdDiv"
				};
				if ($("#floatDivTemp").val() == "") {
					$("#floatDivTemp").val(opt.coverDiv)
				};
				maxZ = getMaxZindex();
				if (opt.closeHandler != '') {
					$("#" + opt.closeHandler).click(function() {
						closeEvent()
					})
				};
				selfWidth = opt.width == "" ? obj.width() : opt.width;
				selfHeight = opt.height == "" ? obj.height() : opt.height;
				obj.width(selfWidth).height(selfHeight).show();
				if (opt.ifScroll) {
					if (browserVersion == "ie6") {
						obj.css("position", "absolute")
					} else {
						obj.css({
							"position": "fixed"
						})
					}
				} else {
					obj.css({
						"position": "absolute"
					})
				};
				if (!opt.ifScroll && !opt.scrollBar) {
					$("html").css("overflow-y", "hidden")
				};
				if (opt.cover) {
					if ($("#" + opt.coverDiv).length == 0) {
						$("body").append("<div id=" + opt.coverDiv + "></div>")
					};
					coverFix()
				} else {
					if (browserVersion == "ie6") {
						$("#framezd").width(selfWidth).height(selfHeight).css({
							"position": "absolute",
							"left": "0px",
							"top": "0px",
							"z-index": maxZ + 1,
							"opacity": 0,
							"filter": "alpha(opacity=0)"
						}).show();
						frame = "zdDiv"
					}
				};
				keepfix(opt.level, opt.vertical)
			};
			var coverFix = function() {
				var doc = document.compatMode ? document.documentElement: document.body,
				scrollWidth = doc.scrollWidth,
				scrollHeight = doc.scrollHeight;
				$("#" + opt.coverDiv).width(scrollWidth).height(scrollHeight).css({
					"position": "absolute",
					"left": "0px",
					"top": "0px",
					"display": "none",
					"background": opt.coverColor,
					"opacity": opt.fade / 100,
					"filter": "alpha(opacity=" + opt.fade + ")",
					"z-index": maxZ + 2
				}).show();
				if (browserVersion == "ie6") {
					$("#framezd").width(scrollWidth).height(scrollHeight).css({
						"position": "absolute",
						"left": "0px",
						"top": "0px",
						"opacity": 0,
						"filter": "alpha(opacity=0)",
						"z-index": maxZ + 1
					}).show();
					frame = "zdCover"
				}
			};
			var keepfix = function(level, vertical) {
				var winWidth = $(window).width(),
				winHeight = $(window).height(),
				scrollLeft = $(window).scrollLeft(),
				scrollTop = $(window).scrollTop(),
				_left_l = opt.space,
				_left_c = (winWidth - selfWidth) / 2,
				_left_r = winWidth - selfWidth - opt.space,
				_top_t = opt.space,
				_top_m = (winHeight - selfHeight) / 2,
				_top_b = winHeight - selfHeight - opt.space;
				_left = level == "left" ? _left_l: (level == "center" ? _left_c: _left_r);
				_top = vertical == "top" ? _top_t: (vertical == "middle" ? _top_m: _top_b);
				if (browserVersion == "ie6") {
					_left += scrollLeft;
					_top += scrollTop;
					if (frame == "zdDiv") {
						$("#framezd").css({
							"z-index": maxZ + 1,
							"left": _left + "px",
							"top": _top + "px"
						})
					}
				};
				obj.css({
					"z-index": maxZ + 3,
					"left": _left + "px",
					"top": _top + "px"
				})
			};
			var dragEvent = function() {
				var dragHandler = opt.dragHandler == "self" ? obj: obj.find(opt.dragHandler),
				_move = false,
				posX = 0,
				posY = 0,
				x = 0,
				y = 0;
				dragHandler.mousedown(function(e) {
					posX = e.pageX - parseInt(obj.css("left"));
					posY = e.pageY - parseInt(obj.css("top"));
					_move = true
				});
				if (opt.dragHandler != "self") {
					dragHandler.css("cursor", "move")
				};
				$(document).mousemove(function(ev) {
					if (_move) {
						x = ev.pageX - posX;
						y = ev.pageY - posY;
						dragFlag = true;
						if (opt.dragLimit) {
							x = x < 0 ? 0: x;
							x = x > $(window).width() - obj.width() ? $(window).width() - obj.width() : x;
							y = y < 0 ? 0: y;
							y = y > $(document).height() - obj.height() ? $(document).height() - obj.height() : y;
							if (!opt.ifScroll && !opt.scrollBar) {
								y = y > $(window).height() + $(window).scrollTop() - obj.height() ? $(window).height() + $(window).scrollTop() - obj.height() : y
							}
						};
						obj.css({
							"left": x,
							"top": y
						});
						ev.preventDefault()
					}
				}).mouseup(function() {
					if (_move) {
						dragX = x;
						dragY = y;
						_move = false
					}
				})
			};
			var closeEvent = function() {
				obj.css("z-index", 0).hide();
				if ($("#" + $("#floatDivTemp").val()).length != 0) {
					$("#" + $("#floatDivTemp").val()).css("z-index", 0).hide()
				};
				if ($("#framezd").length != 0) {
					$("#framezd").css("z-index", 0).hide()
				};
				if (!opt.ifScroll && !opt.scrollBar) {
					$("html").css("overflow-y", "")
				}
			};
			var getMaxZindex = function() {
				var maxIndex = 0;
				$("*").each(function() {
					var thisIndex = $(this).css("z-index");
					maxIndex = maxIndex < parseInt(thisIndex) ? parseInt(thisIndex) : maxIndex
				});
				return maxIndex
			};
			if (opt.onOff) {
				if (navigator.userAgent.indexOf("MSIE 6.0") != -1) {
					browserVersion = "ie6"
				};
				if (browserVersion == "ie6" && opt.ifScroll) {
					$(window).bind("scroll",
					function() {
						keepfix(opt.level, opt.vertical)
					})
				};
				$(window).bind("resize",
				function() {
					keepfix(opt.level, opt.vertical)
				});
				$(document).bind("keyup",
				function(e) {
					if (e.which == 27 && obj.is(":visible")) {
						closeEvent()
					}
				});
				if (obj.find(opt.dragHandler).length != 0 || opt.dragHandler == "self") {
					if (browserVersion == "ie6") {
						if (!opt.ifScroll) {
							dragEvent()
						}
					} else {
						dragEvent()
					}
				};
				init()
			} else {
				closeEvent()
			}
		}
	})
})(jQuery);