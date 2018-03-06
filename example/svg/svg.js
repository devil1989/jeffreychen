// (function(){
// 	document.addEventListener("DOMContentLoaded",function(){
// 		var ele=document.querySelector(".svg-path");
// 		ele.addEventListener("animationend",function(e){
// 			ele.setAttribute("stroke-dashoffset",0);//animation的话结束的偏移量设置为0有bug，曲线会消失
// 		})
// 		ele.addEventListener("transitionend",function(e){/*transtion动画结束*/
// 			console.log(e);
// 		})
// 		var len=ele.getTotalLength();
// 		ele.setAttribute("stroke-dasharray",len);//这是让虚线里的每个小线段长度为20px
// 		ele.setAttribute("stroke-dashoffset",len);//dash模式到路径开始的偏移距离,其实就是左加右减，728表示dash线初始位置是向左平移728单位
// 	});
		
// })();


/*auther:jeffreyChen
 *@description:svg折线图
 *@time:2018/03/06
 *
    @example：//所有参数设置详见defaults方法
        new Schedule({
            //请求回来的原始数据
            originData:[{
                    date: "07-01",
                    delMinutes: "10",
                    isNoData：true
                }, //第一个肯定是原点
                {
                    date: "07-02",
                    delMinutes: "-9999",
                    isNoData：true//标记是否需要计入平均值，因为有的值不需要计入平均值
                }, {
                    date: "07-03",
                    delMinutes: "30",
                    isNoData：false
                }, {
                    date: "07-04",
                    delMinutes: "5",
                    isNoData：false
                }, {
                    date: "07-05",
                    delMinutes: "-10",
                    isNoData：false
                }, {
                    date: "07-06",
                    delMinutes: "2",
                    isNoData：false
                }, {
                    date: "07-07",
                    delMinutes: "6",
                    isNoData：false
                }
            ],
            //canvas需要插入的dom元素（备注，才层元素的宽高要设置好，canvas才能画出来），画布内的具体内容宽高设置，需要在defaults中手动设置
            wrapper:document.querySelector(".rate-analysis-map")
        });

        //转化以后，每个节点多了x，y参数，分别表示所在的x,y坐标位置（是按照浏览器坐标系来算的，最顶部是x轴，从左向右依次增加，）

 */
var Chart=function(options){
	debugger
	this.options = this.extend({}, this.defaults(options),options);
    this.options.data = this.getFormatedData(JSON.parse(JSON.stringify(this.options.originData)));
    this.createChart();
};
Chart.prototype={

    //默认数据，后续传入的数据会覆盖默认数据
    defaults:function(options) {
        //备注，这里面所有的长度和宽度，都是没有缩放情况下的px值; 但是画布会根据容器自动缩放，详见getScaleNum方法
        return {
            //画布的大小和wrapper的大小相同；但是画布内所画的内容的尺寸，是按照320（长）*240（高）来做的（看设计稿中的画图的长和高）
            width: this.getSize(options.wrapper, "width"), //320
            height: this.getSize(options.wrapper, "height"), //240

            contentWidth: this.getSize(options.wrapper, "width"), //画布内所画的内容的宽度,可以手动设置成px，然后就会自动缩放了
            contentHeight: this.getSize(options.wrapper, "height"), //画布内所画的内容的高度,可以手动设置成px，然后就会自动缩放了

            limitTime: 4 * 60, //单位是小时，如果y轴的最大绝对值大于这个值，就用小时做y轴刻度，否则就用分钟做y轴刻度

            originData: [ //折线图的基础数据格式
                {
                    date: "07-01",
                    delMinutes: "0.5"
                }, //delMinutes单位为小时
                {
                    date: "07-02",
                    delMinutes: "0.6"
                }, {
                    date: "07-03",
                    delMinutes: "0.7"
                }, {
                    date: "07-04",
                    delMinutes: "0.8"
                }, {
                    date: "07-05",
                    delMinutes: "0.6"
                }, {
                    date: "07-06",
                    delMinutes: "0.5"
                }, {
                    date: "07-07",
                    delMinutes: "0.2"
                }
            ],
            related: { //y轴平移，左加右减；x轴平移，上加下减
                x: -40,
                y: -this.getSize(options.wrapper, "height")*0.5
            },
            size: { //坐标系的x轴和y轴的长度（备注，x轴不展示负轴）
                // x: 360, //x轴正半轴就占了全长
                // y: 180 //上下各一半长度
                x: this.getSize(options.wrapper, "width")-40, //x轴正半轴就占了全长
                y: this.getSize(options.wrapper, "height")*0.9 //上下各一半长度
            },
            pointNum: { //x轴和y轴的点数，比如本次图表，要求最近一周的数据，所以x轴一共7个点，y轴
                x: 6, //总共段数为x+1
                y: 8 //总公段数为y，因为有正负半轴，所以肯定是偶数
            },
            relatedText: { //x轴和y轴上的点的文本偏移量
                x: {
                    x: 16, //x轴的文本向左偏移
                    y: 16 //x轴的文本向下偏移
                },
                y: {
                    x: 10, //y轴的文本向左偏移
                    y: -4 //y轴的文本向下偏移
                }
            },
            markHeight: 4,//垂直于x轴的刻度小短线的长度，可调
            wrapper:document.body
        }
    },

    //获取原点
    getOrigin:function() {
        return {
            x: 0 - this.options.related.x,
            y: 0 - this.options.related.y
        }
    },

    //把传入的数据转化成坐标系中的坐标
    getFormatedData:function(originData) {
        if (!this.options.data) {
            var origin=this.getOrigin();
            var perXLen = this.options.size.x / (this.options.pointNum.x + 1);
            for (var i = 0, len = originData.length; i < len; i++) {
                originData[i].x = origin.x+i * perXLen;
                originData[i].y = origin.y-this.getYNum(originData,originData[i].delMinutes);
            }

            return originData;
        } else {
            return this.options.data;
        }
    },

    //把延迟的分钟转换成y轴上的高度
    getYNum:function(data,delayMinutes) {
        var dataArr = JSON.parse(JSON.stringify(data));
        var len = dataArr.length;
        len && dataArr.sort(function(prev, current) { //升序排列
            return prev.delMinutes - current.delMinutes;
        });
        var range = {
            min: dataArr[0].delMinutes,
            max: dataArr[len - 1].delMinutes
        }
        var unitText = this.getUnitText(range);
        var scaleNum = (unitText == "h") ? 60 : 1;
        
        var perY=this.getPerY(range, unitText);
        //(this.options.size.y / this.options.pointNum.y)表示Y轴上每段的长度
        return (delayMinutes / (scaleNum * perY)) * (this.options.size.y / this.options.pointNum.y); 
    },

    //获取y轴刻度的最小单位，每一段的长度
    getPerY:function(range, unitText) {
        var len = this.options.pointNum.y * 0.5;//y轴的一半分成多少段
        //Math.max(Math.abs(range.max), Math.abs(range.min))获取Y轴长的那一半
        return Math.ceil(Math.max(Math.abs(range.max), Math.abs(range.min)) / len);
    },

    //获取y轴刻度的文字（是小时还是分钟，取决于最大绝对值是否超过limitTime，超过limitTime就用小时做单位，小于limitTime就用分钟做单位）
    getUnitText:function(range) {
        return (Math.max(Math.abs(range.max), Math.abs(range.min)) >= this.options.limitTime) ? "h" : "m" //总共时间查过5小时，就用小时做单位
    },


    //创建图像的总入口
    create:function(type,opts){
    	switch  (type){
    		case "line" :{//直线
    			this.createLine(type,opts);
    			break;
    		}
    		case "polygon" :{//多面形
    			this.createPolygon(type,opts);
    			break;
    		}
    		case "polyline" :{//折线
    			this.createPolyline(type,opts);
    			break;
    		}
    		case "path" :{//路径
    			this.createPath(type,opts);
    			break;
    		}
    		case "circle" :{//圆形
    			this.createCircle(type,opts);
    			break;
    		}
    		case "ellipse" :{//椭圆
    			this.createEllipse(type,opts);
    			break;
    		}
    		case "rect" :{//矩形
    			this.createRect(type,opts);
    			break;
    		}

    		default :{
    			break
    		} 
    	}
    },

    createChart:function(){
    	this.create("path",this.options.data);
    },

    //创建
    createPath:function(type,opts){
    	debugger
    	var ele=document.createElementNS("http://www.w3.org/2000/svg",type);//通过namespace：http://www.w3.org/2000/svg来创建元素

    	ele.setAttribute("d",this.getPathData(opts));//"M250 150 L150 350 L350 350 Z"
    	ele.setAttribute("style","fill:none;stroke:#000");
    	this.options.wrapper.innerHTML="";
    	this.options.wrapper.appendChild(ele);
    },

    //通过坐标，来获取折现
    getPathData:function(opts){
        var str=this.moveTo(this.getOrigin());
        var self=this;
        (opts||[]).forEach(function(unit){
            str+=","+self.lineTo(unit);
        });
        return str+"";
    },

    moveTo:function(o){
        return "M"+o.x+","+o.y;
    },

    lineTo:function(o){
        return "L"+o.x+","+o.y;
    },


    /********************通用的基础函数 start*********************/
    //等价于_.extend
    extend:function(obj) {
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    },

    //获取元素的尺寸
    getSize:function(ele, type) {
        if (window.getComputedStyle) {
            return parseInt(window.getComputedStyle(ele)[type].replace("px", "")) || 0;
        } else if (ele.currentStyle) {
            return ele.currentStyle[type].replace("px", "") || 0
        } else {
            return 0;
        }
    }
    /********************通用的基础函数 end*********************/
}

new Chart({
    //请求回来的原始数据
    originData:[{
            date: "07-01",
            delMinutes: "10",
            isNoData:false
        }, //第一个肯定是原点
        {
            date: "07-02",
            delMinutes: "5",
            isNoData:false//标记是否需要计入平均值，因为有的值不需要计入平均值
        }, {
            date: "07-03",
            delMinutes: "30",
            isNoData:false
        }, {
            date: "07-04",
            delMinutes: "5",
            isNoData:false
        }, {
            date: "07-05",
            delMinutes: "-10",
            isNoData:false
        }, {
            date: "07-06",
            delMinutes: "2",
            isNoData:false
        }, {
            date: "07-07",
            delMinutes: "6",
            isNoData:false
        }
    ],
    //canvas需要插入的dom元素（备注，才层元素的宽高要设置好，canvas才能画出来），画布内的具体内容宽高设置，需要在defaults中手动设置
    wrapper:document.querySelector(".svg-container")
});