(function(jQuery){
    /**
     * jQuery.weibo
     * Date: 2012/01/22
     *
     * @projectDescription 仿照微薄滚动效果
     *
     * @author Joe nikejaycn#gmail.com
     * @version v0.1
	 * $(".list_dl").iscroll({
	 *  ShowTime: 500,
	 *  moveTime: 1000,
	 *  ajaxUrl: "quote.php",
	 *  ajaxTrunOn: true,
	 *  ajaxTime: 10000
	 *  });
     */
    jQuery.fn.iscroll = function(params){
        options = {
            ShowTime: 500, //显示时间
            moveTime: 3000, //移动时间
            charElement:"li", //子节点
            ajaxTrunOn: false, //是否开启ajax请求，定时获取数据
            ajaxTime: 30000, //发出一次ajax请求时间，默认是30秒获取一次数据
            ajaxUrl: "", //ajax数据请求路径
            setAjaxHtml: function(data){ //数据源输出设置
                //data是ajax返回数据
				//在这里都其进行格式化输出
            }
        };
        jQuery.extend(options, params);
        //保存当前对象
        var _this = this,
            isIE = !!window.ActiveXObject,
            isIE6 = isIE&&!window.XMLHttpRequest,
            jsonData = false,
            jsonCount = -1;

        //鼠标经过设置name值为"hovered"
        function setHover(){
            _this.hover(function(){
               _this.attr("name","hovered");
            },function(){
               _this.removeAttr("name");
            });
        }setHover();

        function animateHandler(){
            if(options.ajaxTrunOn){
                //处理请求数据
                handlerJson();
            }
            var height = _this.find(".itemt:last").height();
            _this.find(".itemt:last").css({"opacity":0,"height":0});
            _this.find(".itemt:first").before( _this.find(".itemt:last") );
            _this.find(".itemt:first").animate({"height":height},options.ShowTime);
            _this.find(".itemt:first").animate({"opacity":"1"},options.ShowTime);
        }

        function setMove(){
            if(_this.attr("name") != "hovered"){
                animateHandler();
            }
        }

        //设置定时滚动
        setInterval(function(){
            jsonCount++;
            setMove();
        },options.moveTime);

        //定时查询一次数据
        if(options.ajaxTrunOn){
            setInterval(function(){
               getNewsList();
            },options.ajaxTime);
        }
        //ajax请求
        function getNewsList(){
            $.ajax({
                url: options.ajaxUrl,
                dataTypes: "json",
                success: function(json){
                    jsonCount = -1;
                    jsonData = json;
                }
            })
        }

        //处理请求回来的json
        function handlerJson(){
            if(jsonData){
                _jsonData = eval( "(" +jsonData + ")");
                var _length = _jsonData.length;
                if(jsonCount < _length){
                    //处理相应的函数
                    _this.find(".itemt:last").css("height","auto");//清除高度
                    _this.find(".itemt:last").html(options.setAjaxHtml(_jsonData[jsonCount]));
                }
            }
        }
    }
})(jQuery);
