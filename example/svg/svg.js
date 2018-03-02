(function(){
	document.addEventListener("DOMContentLoaded",function(){
		var ele=document.querySelector(".svg-path");
		ele.addEventListener("animationend",function(e){
			ele.setAttribute("stroke-dashoffset",0);//animation的话结束的偏移量设置为0有bug，曲线会消失
		})
		ele.addEventListener("transitionend",function(e){/*transtion动画结束*/
			console.log(e);
		})
		var len=ele.getTotalLength();
		ele.setAttribute("stroke-dasharray",len);//这是让虚线里的每个小线段长度为20px
		ele.setAttribute("stroke-dashoffset",len);//dash模式到路径开始的偏移距离,其实就是左加右减，728表示dash线初始位置是向左平移728单位
	});
		
})();