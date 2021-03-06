/**
 *
 * @type {{create: Function}}
 */

var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}

var extendObj = function (destination, source, override) {
    if (override === undefined) override = true;
    for (var property in source) {
        if (!override && typeof(source[property]) == 'function' && destination.hasOwnProperty(property)) {
            destination[property] = (function (name, method) {
                return function () {
                    this.base = source[name];
                    return method.apply(this, arguments);
                }
            })(property, destination[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};
var Bind = function (object, fun) {
    return function () {
        return fun.apply(object, arguments);
    }
}

var BindAsEventListener = function (object, fun) {
    return function (event) {
        return fun.call(object, (event || window.event));
    }
}
var ieMode = document.documentMode;
var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var isIE10 = isIE && ieMode === 10;
var $$ = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
}
var curStyle = function (element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}

function getWin() {
    var winWidth, winHeight;
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    return {w: winWidth, h: winHeight}
}

function insertAfter(newElemnt, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElemnt);
    } else {
        parent.insertBefore(newElemnt, targetElement.nextSibling);
    }
}

function hideAllSelect() {
    var t = document.getElementsByTagName("select");
    for (var i = 0; i < t.length; i++) {
        t[i].style.visibility = "hidden";
    }

    for (var temp = 0; temp < window.frames.length; temp++) {
        var t = window.frames[temp].document.getElementsByTagName("select");
        for (var i = 0; i < t.length; i++) {
            t[i].style.visibility = "hidden";
        }
    }
}

function showAllSelect() {
    var t = document.getElementsByTagName("select");
    for (var i = 0; i < t.length; i++) {
        t[i].style.visibility = "";
    }
    for (var temp = 0; temp < window.frames.length; temp++) {
        var t = window.frames[temp].document.getElementsByTagName("select");
        for (var i = 0; i < t.length; i++) {
            t[i].style.visibility = "";
        }
    }
}

function addEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
}

function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = null;
    }
}
function setOpacity(elem, opacity) {
    if (isIE && !isIE10) {
        elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    } else {
        elem.style.opacity = opacity;
    }
}

function fadeIn(elem, speed, opacity) {
    speed = speed || 100;
    opacity = opacity || 1;
    //显示元素,并将元素值为0透明度(不可见)
    elem.style.display = 'block';
    setOpacity(elem, opacity);
    //初始化透明度变化值为0
    var val = 0;
    //循环将透明值以0.1递增,即淡入效果
    (function () {
        setOpacity(elem, val);
        val += 0.1;
        if (val <= opacity) {
            setTimeout(arguments.callee, speed)
        }
    })();
}

function fadeOut(elem, speed, opacity) {
    speed = speed || 100;
    opacity = opacity || 0;
    //初始化透明度变化值为0
    var val = 1;
    //循环将透明值以5递减,即淡出效果
    (function () {
        setOpacity(elem, val);
        val -= 0.1;
        if (val >= opacity) {
            setTimeout(arguments.callee, speed);
        } else if (val < 0) {
            //元素透明度为0后隐藏元素
            elem.style.display = 'none';
        }
    })();
}

//拖放程序
var dragPop = Class.create();
dragPop.prototype = {
    //拖放对象
    initialize: function (drag, options) {
        this.ma = BindAsEventListener(this, this.moveAction);
        this.ms = Bind(this, this.stopAction);
        this.dragBox = $$(drag);//拖放对象
        this.x = this.y = 0;
        this.setOptions(options);
        this.dragHandle = $$(this.options.dragHandle) || this.dragBox;
        this.isDrag = this.options.isDrag;
        this.dragOpacity = this.options.dragOpacity;
        this.shadeOpacity = this.options.shadeOpacity;
        this.dragShade = this.options.dragShade;
        this.dragShutDown = this.options.dragShutDown || "J_shutDown";
        this.escShutDown = this.options.escShutDown;
        this.shadeShutDown = this.options.shadeShutDown;
        this.dragPos = this.options.dragPos || "center";
        this.isFadeIn = this.options.isFadeIn;
        this.isFadeOut = this.options.isFadeOut;
        this.dragWidth = this.options.dragWidth;
        this.dragHeight = this.options.dragHeight;

        this.showDrag();
        addEventHandler($$(this.dragShutDown), "click", BindAsEventListener(this, this.hideDrag));
        if (this.escShutDown) {
            addEventHandler(document, "keydown", esc);
        }
        if (this.shadeShutDown) {
            addEventHandler($$("J_shade"), "click", BindAsEventListener(this, this.hideDrag));
        }
        if (this.isDrag) {
            addEventHandler(this.dragHandle, "mousedown", BindAsEventListener(this, this.dragAction));
        } else {
            this.dragHandle.style.cursor = "default";
        }
        function esc(e) {
            e = window.event ? window.event : e;
            if (e.keyCode == 27) {
                if (this.isFadeOut) {
                    fadeOut($$(drag));
                } else {
                    $$(drag).style.display = "none";
                }
                if ($$("J_shade")) {
                    document.body.removeChild($$("J_shade"));
                }
                if ($$("J_ifie6")) {
                    document.body.removeChild($$("J_ifie6"));
                }
            }
        }
    },
    setOptions: function (options) {
        this.options = {
            dragHandle: "",
            isDrag: true,
            dragOpacity: "0.5",
            dragShade: true,
            dragShutDown: "",
            shadeOpacity: "0.2",
            escShutDown: true,
            shadeShutDown: false,
            dragPos: "",
            isFadeIn: false,
            isFadeOut: true,
            dragWidth: 400,
            dragHeight: 300
        }
        extendObj(this.options, options || {}, false);
    },
    dragAction: function (e) {

        setOpacity(this.dragBox, this.dragOpacity);
        this._x = e.clientX - parseInt(curStyle(this.dragBox).left);
        this._y = e.clientY - parseInt(curStyle(this.dragBox).top);
        addEventHandler(document, "mousemove", this.ma);
        addEventHandler(document, "mouseup", this.ms);

    },
    showDrag: function () {
        var drag = this.dragBox;
        if (this.isFadeIn) {
            fadeIn(drag, 200);
        } else {
            drag.style.display = "block";
            setOpacity(this.dragBox, 1);
        }
        this.setPos(drag);
        if (this.dragShade) {
            this.popShade();
        }
        if (isIE6) {
            this.ifIe();
            this.ie6Fie();
            addEventHandler(window, "scroll", BindAsEventListener(this, this.ie6Fie));
        }
        addEventHandler(window, "resize", BindAsEventListener(this, this.winResize));

    },
    hideDrag: function (e) {
        if (this.isFadeOut) {
            fadeOut(this.dragBox);
        } else {
            this.dragBox.style.display = "none";
        }
        if (this.dragShade) {
            if ($$("J_shade")) {
                document.body.removeChild($$("J_shade"));
            }
        }
        if (isIE6) {
            showAllSelect();
            document.body.removeChild($$("J_ifie6"));
        }
    },
    moveAction: function (e) {
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        document.body.setCapture && this.dragBox.setCapture();
        var x, y;
        var x = e.clientX - this._x;
        var y = e.clientY - this._y;
        x = x < 0 ? x = 0 : x < (getWin().w - this.dragBox.offsetWidth) ? x : (getWin().w - this.dragBox.offsetWidth);
        y = y < 0 ? y = 0 : y < (getWin().h - this.dragBox.offsetHeight) ? y : (getWin().h - this.dragBox.offsetHeight);
        if (isIE6) {
            $$("J_ifie6").style.left = x + "px";
            $$("J_ifie6").style.top = y + "px";
        }
        this.dragBox.style.left = x + "px";
        this.dragBox.style.top = y + "px";
    },
    stopAction: function () {
        removeEventHandler(document, "mousemove", this.ma);
        removeEventHandler(document, "mouseup", this.ms);

        setOpacity(this.dragBox, 1);
        if (document.releaseCapture) {
            document.releaseCapture();
        }
    },
    popShade: function () {
        var shade = document.createElement("div");
        shade.id = "J_shade";
        shade.style.position = !isIE6 ? "fixed" : "absolute";
        shade.style.top = shade.style.left = 0;
        shade.style.backgroundColor = "#000";
        shade.style.zIndex = "9000";
        if (isIE6) {
            shade.style.width = Math.min(document.documentElement.scrollWidth, document.documentElement.clientWidth) + "px";
            shade.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
            if (this.dragShade) {
                hideAllSelect();
            }

        } else {
            shade.style.width = shade.style.height = "100%";
        }
        if (this.dragShade) {
            if (this.isFadeIn) {
                fadeIn(shade, 100, 0.6);
            } else {
                setOpacity(shade, this.dragOpacity);
            }
            document.body.appendChild(shade);
        }


    },
    ifIe: function () {
        if ($$("J_ifie6")) {
            return false;
        }
        var iframe = document.createElement("iframe");
        iframe.id = "J_ifie6";
        iframe.setAttribute("src", "about:blank");
        iframe.setAttribute("height", this.dragHeight);
        iframe.setAttribute("width", this.dragWidth);
        iframe.setAttribute("marginWidth", "0");
        iframe.setAttribute("marginHeight", "0");
        iframe.setAttribute("scrolling", "auto");
        iframe.setAttribute("noresize", "noresize");
        iframe.setAttribute("allowtransparency", "true");
        iframe.setAttribute("frameborder", "0", 0);
        iframe.style.position = "absolute";
        iframe.style.zIndex = curStyle(this.dragBox).zIndex - 1;
        this.setPos(iframe);
        insertAfter(iframe, this.dragBox);
        if (this.isFadeIn) {
            fadeIn(iframe);
        }

    },
    ie6Fie: function () {
        $$("J_ifie6").style.marginTop = this.dragBox.style.marginTop = document.documentElement.scrollTop + "px";
        $$("J_ifie6").style.marginLeft = this.dragBox.style.marginLeft = document.documentElement.scrollLeft + "px";
    },
    winResize: function () {
        if (isIE6) {
            var ra = getWin().w;
            var rw = getWin().w;
            if (ra == rw) {
                this.setPos(this.dragBox);
                if (this.dragShade) {
                    $$("J_shade").style.width = ra + "px";
                    $$("J_shade").style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + "px";
                }
                this.setPos($$("J_ifie6"));
                ra = getWin().w;
            }
        } else {
            this.setPos(this.dragBox);
        }
    },
    setPos: function (obj) {
        var dh = parseInt((getWin().h - this.dragHeight)) + "px";
        var dw = parseInt((getWin().w - this.dragWidth)) + "px";
        var dwc = parseInt((getWin().h - this.dragHeight) / 2) + "px";
        var dhc = parseInt((getWin().w - this.dragWidth) / 2) + "px";
        switch (this.dragPos) {
            case "rb":
                obj.style.top = dh;
                obj.style.left = dw;
                break;
            case "rm":
                obj.style.top = dwc;
                obj.style.left = dh;
                break;
            case "rt":
                obj.style.top = "0px";
                obj.style.left = dw;
                break;
            case "lb":
                obj.style.top = dh;
                obj.style.left = "0px";
                break;
            case "lm":
                obj.style.top = dwc;
                obj.style.left = "0px";
                break;
            case "lt":
                obj.style.top = "0px";
                obj.style.left = "0px";
                break;
            default :
                obj.style.top = dwc;
                obj.style.left = dhc;
        }
    }
}
