/*
 *@author：jeffrey chen
 *@param
 	innerRadius:钟的內圆半径
 	outerRadius:钟的外圆半径
 	width:画布宽度
 	height：画布高度
 	wrapper：画布的容器
 	ctx：画布的绘图上下文对象（该对象操作画图）
 	note:画布内的提示语句
 */
function Clock(config){
	this.width=config.width;
	this.height=config.height;
	this.wrapper=config.wrapper||document.body;
	this.note=config.note;
	this.speed=config.speed||1;
	this.ele=config.tgEle;
	this.init();
}
Clock.prototype={
	//初始化
	init:function(){
		this.ele||this.createCanvas();
		this.drawPic()
		this.wrapper.appendChild(this.ele);
	},
	createCanvas:function(){
		this.ele=document.createElement("canvas");
		this.ctx=this.ele.getContext?this.ele.getContext("2d"):null;
		this.ele.setAttribute('width',this.width);
		this.ele.setAttribute('height',this.height);
		this.ele.innerHTML=this.note||"the browser is not support the canvas";
	},
	drawPic:function(){
		if(this.ctx){
			var ctx=this.ctx;
			ctx.beginPath();
			ctx.arc(200,200,100,0,Math.PI*2,false);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(200,200,92,0,Math.PI*2,false);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle="#323232";
			ctx.moveTo(200,200);
			ctx.lineTo(200,140);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle="#000000";
			ctx.moveTo(200,200);
			ctx.lineTo(160,200);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle="#A92323";
			ctx.moveTo(200,200);
			ctx.lineTo(275,200);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle="#000000";
			ctx.arc(200,200,2,0,2*Math.PI,false);
			ctx.closePath();
			ctx.fill();

			ctx.font="bold 14px Arial";
			ctx.textAlign="center";
			ctx.textBaseLine="bottom";
			ctx.fillStyle="#000000";
			ctx.fillText("12",200,125);
			ctx.fillText("6",201,285);
			ctx.fillText("9",120,205);
			ctx.fillText("3",280,205);
		}
	},
	//直接跳转到某个时间
	changeTimeTo:function(timeStr){
		// if()
	},
	//从凌晨开始重新计时
	restart:function(){

	},
	//修改秒针的走速
	changeSpeed:function(){

	},

	//时钟开始走动
	play:function(){

	},

	//时钟停止
	stop:function(){

	}
}


// var pic=new Clock({
// 	width:800,
// 	height:400,
// 	wrapper:document.body
// });
var a ={};
var b = a;
a.x = a = 1;
console.log(a);
console.log(b.x);