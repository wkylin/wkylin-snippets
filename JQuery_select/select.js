jQuery.fn.CRselectBox = jQuery.fn.sBox = function(){
	var _self = this;
	/*构建结构*/
	var _parent = _self.parent();
	var wrapHtml = '<div class="CRselectBox"></div>';
	var $wrapHtml = $(wrapHtml).appendTo(_parent);
	var selectedOptionValue = _self.find("option:selected").attr("value");
	var selectedOptionTxt = _self.find("option:selected").text();
	var name = _self.attr("name");
	var id = _self.attr("id");
	var inputHtml = '<input type="hidden" value="'+selectedOptionValue+'" name="'+name+'" id="'+id+'"/>';
	$(inputHtml).appendTo($wrapHtml);
	var inputTxtHtml = '<input type="hidden" value="'+selectedOptionTxt+'" name="'+name+'_CRtext" id="'+id+'_CRtext"/>';
	$(inputTxtHtml).appendTo($wrapHtml);
	var aHtml = '<a class="CRselectValue" href="#">'+selectedOptionTxt+'</a>';
	$(aHtml).appendTo($wrapHtml);
	var ulHtml = '<ul class="CRselectBoxOptions"></ul>';
	var $ulHtml = $(ulHtml).appendTo($wrapHtml);
	var liHtml = "";
	_self.find("option").each(function(){
		if($(this).attr("selected")){
			liHtml += '<li class="CRselectBoxItem"><a href="#" class="selected" rel="'+$(this).attr("value")+'">'+$(this).text()+'</a></li>';
		}else{
			liHtml += '<li class="CRselectBoxItem"><a href="#" rel="'+$(this).attr("value")+'">'+$(this).text()+'</a></li>';
		}
	});
	$(liHtml).appendTo($ulHtml);
	/*添加效果*/
	$( $wrapHtml, _parent).hover(function(){
		$(this).addClass("CRselectBoxHover");
	},function(){
		$(this).removeClass("CRselectBoxHover");
	});
	$(".CRselectValue",$wrapHtml).click(function(){
		$(this).blur();	
		$(".CRselectBoxOptions",$wrapHtml).show();
		return false;
	});
	$(".CRselectBoxItem a",$wrapHtml).click(function(){
		$(this).blur();
		var value = $(this).attr("rel");
		var txt = $(this).text();
		$("#"+id).val(value);
		$("#"+id+"_CRtext").val(txt);
		$(".CRselectValue",$wrapHtml).text(txt);
		$(".CRselectBoxItem a",$wrapHtml).removeClass("selected");
		$(this).addClass("selected");
		$(".CRselectBoxOptions",$wrapHtml).hide();
		return false;
	});
	$(document).click(function(event){
		if( $(event.target).attr("class") != "CRselectBox" ){
			$(".CRselectBoxOptions",$wrapHtml).hide();
		}
	});
	_self.remove();
	return _self;
}
