/*
Ajax 三级省市联动
settings 参数说明
-----
url:省市数据json文件路径
prov:默认省份
city:默认城市
dist:默认地区（县）
nodata:无数据状态
required:必选项
------------------------------ */
(function($){
	$.fn.cascadion=function(settings){
		if(this.length<1){return;};
		// 默认值
		settings=$.extend({
			url:"js/city.json",
			gradeX:null,
			gradeY:null,
            gradeZ:null,
            gradexDom:".grade-x",
            gradeyDom:".grade-y",
            gradezDom:".grade-z",
			nodata:null,
			required:false
		},settings);

		var that=this;
		var $gradeX=that.find(settings.gradexDom);
		var $gradeY=that.find(settings.gradeyDom);
		var $gradeZ=that.find(settings.gradezDom);
		var gradeXval=settings.gradeX;
		var gradeYval=settings.gradeY;
		var gradeZval=settings.gradeZ;
		var selectHtml=(settings.required) ? "" : "<option value=''>请选择</option>";
		var gData;

		// 赋值市级函数
		var gradeYstart=function(){
			var xIndex=$gradeX.get(0).selectedIndex;
			if(!settings.required){
                xIndex--;
			};
            $gradeY.empty().attr("disabled",true);
            $gradeZ.empty().attr("disabled",true);
			if(xIndex<0||typeof(gData.dataList[xIndex].c)=="undefined"){
				if(settings.nodata=="none"){
                    $gradeY.css("display","none");
                    $gradeZ.css("display","none");
				}else if(settings.nodata=="hidden"){
                    $gradeY.css("visibility","hidden");
                    $gradeZ.css("visibility","hidden");
				};
				return;
			};
			
			// 遍历赋值市级下拉列表
			tempHtml=selectHtml;
			$.each(gData.dataList[xIndex].c,function(i,gy){
				tempHtml+="<option value='"+gy.n+"'>"+gy.n+"</option>";
			});
            $gradeY.html(tempHtml).attr("disabled",false).css({"display":"","visibility":""});
            gradeZstart();

		};

		// 赋值地区（县）函数
		var gradeZstart=function(){
			var xid=$gradeX.get(0).selectedIndex;
			var yid=$gradeY.get(0).selectedIndex;
			if(!settings.required){
                xid--;
                yid--;
			};
            $gradeZ.empty().attr("disabled",true);

			if(xid<0||yid<0||typeof(gData.dataList[xid].c[yid].a)=="undefined"){
				if(settings.nodata=="none"){
                    $gradeZ.css("display","none");
				}else if(settings.nodata=="hidden"){
                    $gradeZ.css("visibility","hidden");
				};
				return;
			};
			
			// 遍历赋值市级下拉列表
			tempHtml=selectHtml;
			$.each(gData.dataList[xid].c[yid].a,function(i,gz){
				tempHtml+="<option value='"+gz.s+"'>"+gz.s+"</option>";
			});
            $gradeZ.html(tempHtml).attr("disabled",false).css({"display":"","visibility":""});
		};

		var init=function(){
			// 遍历赋值省份下拉列表
			tempHtml=selectHtml;
			$.each(gData.dataList,function(i,gx){
				tempHtml+="<option value='"+gx.p+"'>"+gx.p+"</option>";
			});
            $gradeX.css({"visibility":"visible"}).html(tempHtml);
            $gradeY.empty().attr("disabled",true);
            $gradeZ.empty().attr("disabled",true);
			// 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
			setTimeout(function(){
				if(settings.gradeX!=null){
                    $gradeX.val(settings.gradeX);
                    gradeYstart();
					setTimeout(function(){
						if(settings.gradeY!=null){
                            $gradeY.val(settings.gradeY);
                            gradeZstart();
							setTimeout(function(){
								if(settings.gradeZ!=null){
                                    $gradeZ.val(settings.gradeZ);
								};
							},1);
						};
					},1);
				};
			},1);

			// 选择省份时发生事件
            $gradeX.bind("change",function(){
                gradeYstart();
			});

			// 选择市级时发生事件
            $gradeY.bind("change",function(){
                gradeZstart();
			});
		};

		// 设置省市json数据
		if(typeof(settings.url)=="string"){
			$.getJSON(settings.url,function(json){
				gData=json;
				init();
			});
		}else{
			gData=settings.url;
			init();
		};
	};
})(jQuery);