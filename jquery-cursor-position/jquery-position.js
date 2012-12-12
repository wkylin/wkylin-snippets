/**
 *
 * jQuery Position
 * 
 * @name jQuery Position
 * @description 定位textarea与input中光标的字符位置.
 * @author Esone (http://it.ee01.me/jquery-position.html) & 全冠清 (http://www.iteye.com/topic/438461)
 * @version 1.1 (2012.8.8 updated)
 * @copyright (c) 2012 小E
 *
 */

(function($){
	$.fn.extend({
		position:function( value ){
			var elem = this[0];
				if (elem&&(elem.tagName=="TEXTAREA"||elem.type.toLowerCase()=="text")) {
				   if($.browser.msie){
						   var rng;
						//   if(elem.tagName == "TEXTAREA"){ 
						//		rng = event.srcElement.createTextRange();
						//	    rng.moveToPoint(event.x,event.y);
						//   }else{
								rng = document.selection.createRange();
						//   }
						   if( value === undefined ){
						//   	rng.moveStart("character",-event.srcElement.value.length);
						//  	return  rng.text.length;
						
								/* 以上注释为原作者版本 */
								var e = rng.duplicate();
								e.moveToElementText(elem);
								e.setEndPoint("EndToEnd", rng);
								elem.selectionStart = e.text.length - rng.text.length;
								elem.selectionEnd = elem.selectionStart + rng.text.length;
								return elem.selectionStart;
								/* 经过窥视新浪微博脚本，得到以上修改版代码 */
								
						   }else if(typeof value === "number" ){
							 var index=this.position();
							 index>value?( rng.moveEnd("character",value-index)):(rng.moveStart("character",value-index))
							 rng.select();
						   }
					}else{
						if( value === undefined ){
							 return elem.selectionStart;
						   }else if(typeof value === "number" ){
							 elem.selectionEnd = value;
							 elem.selectionStart = value;
						   }
					}
				}else{
					if( value === undefined )
					   return undefined;
				}
		}
	});
})(jQuery);