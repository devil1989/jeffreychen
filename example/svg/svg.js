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
                x: -80,
                y: -this.getSize(options.wrapper, "height")*0.5
            },
            size: { //坐标系的x轴和y轴的长度（备注，x轴不展示负轴）
                // x: 360, //x轴正半轴就占了全长
                // y: 180 //上下各一半长度
                x: this.getSize(options.wrapper, "width")-100, //x轴正半轴就占了全长
                y: this.getSize(options.wrapper, "height")*0.9 //上下各一半长度
            },
            pointNum: { //x轴和y轴的点数，比如本次图表，要求最近一周的数据，所以x轴一共7个点，y轴
                x: 6, //总共段数为x+1
                y: 8 //总公段数为y，因为有正负半轴，所以肯定是偶数
            },
            relatedText: { //x轴和y轴上的点的文本偏移量
                x: {
                    x: -22, //x轴的文本向左偏移
                    y: 30 //x轴的文本向下偏移
                },
                y: {
                    x: 60, //y轴的文本向左偏移
                    y: 5 //y轴的文本向下偏移
                }
            },
            circleRadius:5,//画出来的圆的半径
            markHeight: 12,//垂直于x轴的刻度小短线的长度，可调
            // arrX:[{//坐标系上的各个均分点，
            //     x:0,
            //     y:0,
            //     text:""
            // }],//
            // arrY:[{
            //     x:0,
            //     y:0,
            //     text:""
            // }],
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


    /*
      创建图像的总入口
      @param：
        type：
            line：直线
            polygon：多面形
            polyline：折线
            path：路径 （这个工具只用到了path，其他的暂时不写）
            circle：圆形
            ellipse：椭圆
            rect：矩形

     */
    create:function(opts){
        var ele=document.createElementNS("http://www.w3.org/2000/svg",opts.type);//通过namespace：http://www.w3.org/2000/svg来创建元素
        for (var key in opts){
            if(opts.hasOwnProperty(key)&&key!=="type"){//type这个字段已经在上面的createElementNS中使用过了，不需要了
                ele.setAttribute(key,opts[key]);//设置了所有的属性
                //例如： ele.setAttribute("style",opts.style);
            }
        }
        return ele;
    },

    /********************画Path用到的funciton start************************/
    moveTo:function(o){
        return "M"+o.x+","+o.y;
    },

    lineTo:function(o){
        return "L"+o.x+","+o.y;
    },

    //通过坐标，来获取path的d属性
    getPathData:function(opts){
        var str=this.moveTo(opts[0]);
        var self=this;
        (opts.slice(1)||[]).forEach(function(unit){
            str+=","+self.lineTo(unit);
        });
        return str+"";
    },
    /********************画Path用到的funciton start************************/

    createChart:function(){
        var ele;
        this.options.wrapper.innerHTML="";
        this.createCoordinate();
        this.createText();
        this.createPath();
    },

    //画曲线
    createPath:function(){
        var ele=this.create({
            type: "path",//创建的是path元素
            style: "fill:none;stroke:#000",//path元素的style
            d:this.getPathData(this.options.data)//path元素的元数据
        });
        this.options.wrapper.appendChild(ele);
        this.options.afterDrawing&&this.options.afterDrawing(ele,this.createCircle.bind(this));//添加画完以后的生命周期函数
    },

    //画圆形
    createCircle:function(scope){
        var str="",self=scope||this;
        this.options.data.forEach(function(unit,idx){
            var ele=self.create({
                type: "circle",
                cx:unit.x,
                cy:unit.y,
                r:self.options.circleRadius,
                stroke:"#000"
            });
            ele.innerHTML=unit.text;
            self.options.wrapper.appendChild(ele);
        });
    },

    //画坐标系中的文本
    createText:function(){
        var str="",self=this,origin=this.getOrigin();
        this.options.arrX = this.getLineArray(origin, "x"); //x轴上的各个点
        this.options.arrY = this.getLineArray(origin, "y"); //y轴上的各个点
        this.options.arrX.forEach(function(unit,idx){
            var ele=self.create({
                type: "text",
                x:unit.x+self.options.relatedText.x.x,
                y:unit.y+self.options.relatedText.x.y,
                fill:self.options.data[idx].date
            });
            ele.innerHTML=unit.text;
            self.options.wrapper.appendChild(ele);
        });
        this.options.arrY.reverse().forEach(function(unit,idx){
            var ele=self.create({
                type: "text",
                x:unit.x-self.options.relatedText.y.x,
                y:unit.y+self.options.relatedText.y.y,
                fill:unit.text
            });
            ele.innerHTML=unit.text;
            self.options.wrapper.appendChild(ele);
        });
    },


    /********************画坐标系，以及坐标系上的刻度，文字之类的数据 start************************/
    //创建坐标系
    createCoordinate:function(){
        var ele=this.create({
            type: "path",//创建的是path元素
            style: "fill:none;stroke:#000",//path元素的style
            d:this.getCoordinateData()//path元素的元数据
        });
        this.options.wrapper.appendChild(ele);
    },

    

    //获取坐标系的数据（2条直线和所有的刻度线）
    getCoordinateData:function(){
        return this.getCoordinateLineData()+this.getCoordinatePointerData()+this.getCoordinateArrowData();
    },


    //坐标系x，y轴path的数据
    getCoordinateLineData:function(){
        var origin=this.getOrigin();
        var size=this.options.size;
        var xPointer2={
            x:origin.x+size.x,
            y:origin.y
        };
        var yPointer1={
            x:origin.x,
            y:origin.y-size.y*0.5
        };
        var yPointer2={
            x:origin.x,
            y:origin.y+size.y*0.5
        };
        var str="";
        str+=this.moveTo(origin);
        str+=this.lineTo(xPointer2);
        str+=this.moveTo(yPointer1);
        str+=this.lineTo(yPointer2);
        return str;
    },

    //坐标系刻度path的数据
    getCoordinatePointerData:function(){
        var str="",self=this,origin=this.getOrigin();
        this.options.arrX = this.getLineArray(origin, "x"); //x轴上的各个点
        this.options.arrY = this.getLineArray(origin, "y"); //y轴上的各个点
        
        this.options.arrX.slice(1).forEach(function(unit){
            str+=self.moveTo(unit)+self.lineTo({
                x:unit.x,
                y:unit.y+self.options.markHeight
            });
        });
        this.options.arrY.slice(1,-1).forEach(function(unit){
            str+=self.moveTo(unit)+self.lineTo({
                x:unit.x-self.options.markHeight,
                y:unit.y
            });
        });

        return str;
    },

    //x,y轴箭头的数据
    getCoordinateArrowData:function(){
        var str="",origin=this.getOrigin(),xLen,yLen,xMax,yMax,origin;
        var options = this.options;
        var perXLen = options.size.x / (options.pointNum.x + 1); //x轴的段数比点数多一（x轴只有正半轴）
        var perYLen = options.size.y / options.pointNum.y; //Y轴的段数和点数一样多（因为y轴有正负半轴）
        this.options.arrX = this.getLineArray(origin, "x"); //x轴上的各个点
        this.options.arrY = this.getLineArray(origin, "y"); //y轴上的各个点
        xLen=this.options.arrX.length;
        yLen=this.options.arrY.length;
        xMax={
            x:this.options.arrX[xLen-1].x+perXLen,
            y:this.options.arrX[xLen-1].y
        };
        yMax={
            x:this.options.arrY[0].x,
            y:this.options.arrY[0].y
        }

        //x轴箭头
        str+=this.moveTo(xMax)+this.lineTo({
            x:xMax.x-this.options.markHeight,
            y:origin.y+this.options.markHeight
        })+this.moveTo(xMax)+this.lineTo({
            x:xMax.x-this.options.markHeight,
            y:origin.y-this.options.markHeight
        });

        //Y轴箭头
        str+=this.moveTo(yMax)+this.lineTo({
            x:origin.x-this.options.markHeight,
            y:yMax.y+this.options.markHeight
        })+this.moveTo(yMax)+this.lineTo({
            x:origin.x+this.options.markHeight,
            y:yMax.y+this.options.markHeight
        });
        return str
    },  

    //important 根据原点，获取对应轴线上每个等分点的坐标 
    getLineArray:function(origin, type) {

        if (type == "x" && this.options.arrX) {
            return this.options.arrX;
        } else if (type == "y" && this.options.arrY) {
            return this.options.arrY;
        } else {
            var options = this.options;
            var size = options.size[type];
            var pointNum = options.pointNum[type];
            var perXLen = size / (pointNum + 1); //x轴的段数比点数多一（x轴只有正半轴）
            var perYLen = size / pointNum; //Y轴的段数和点数一样多（因为y轴有正负半轴）
            var arr = [];
            var objArr = [];
            var textData = this.getPointText(type);
            for (var i = 0; i <= pointNum; i++) {
                var j = i - pointNum * 0.5;
                if (type == "x") {
                    var num = origin[type] + perXLen * i;
                } else { //y轴由于有正负半轴，所以和x轴的计算方法不一样
                    var num = origin[type] + perYLen * j;
                }

                var data = textData[i];
                arr.push(num);
                if (data && data.text == "0m") {
                    data.text = "准点";
                }
                if (type == "x") {
                    objArr.push({
                        x: num,
                        y: origin.y,
                        text: (data && data.date) ? data.date : ""
                    });
                } else {
                    objArr.push({
                        x: origin.x,
                        y: num,
                        text: (data && data.text) ? (data.text) : ""
                    });
                }
            }
            return objArr;
        }
    },

    //获取x轴或者y轴的坐标点的内容
    getPointText:function(type) {

        if (type == "x") {
            return this.getFormatedData(); //刻度就是传入的日期值
        } else {
            var textArr = [];
            var range = this.getRange();
            var unitText = this.getUnitText(range);
            var unitTime = this.getUnitTime(range, unitText); //以及

            var len = this.options.pointNum.y;
            for (var i = (0 - len * 0.5); i <= len * 0.5; i++) {
                textArr.push({
                    text: i * unitTime + unitText
                });
            }

            return textArr;//.reverse():服务端传过来的时候已经从小到大排序好了
        }

    },

    //获取y轴最低刻度
    getRange:function() {
        var dataArr = JSON.parse(JSON.stringify(this.getFormatedData()));
        var len = dataArr.length;
        len && dataArr.sort(function(prev, current) { //升序排列
            return prev.delMinutes - current.delMinutes;
        });
        return {
            min: dataArr[0].delMinutes,
            max: dataArr[len - 1].delMinutes
        }
    },

    //获取y轴刻度的文字（是小时还是分钟，取决于最大绝对值是否超过limitTime，超过limitTime就用小时做单位，小于limitTime就用分钟做单位）
    getUnitText:function(range) {
        return (Math.max(Math.abs(range.max), Math.abs(range.min)) >= this.options.limitTime) ? "h" : "m" //总共时间查过5小时，就用小时做单位
    },

    //获取y轴刻度的最小单位
    getUnitTime:function(range, unitText) {
        var len = this.options.pointNum.y * 0.5;
        return Math.ceil(Math.max(Math.abs(range.max), Math.abs(range.min)) / len);
    },


    /********************画坐标系，以及坐标系上的刻度，文字之类的数据 end************************/


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
    wrapper:document.querySelector(".svg-container"),

    //画完以后的接口
    afterDrawing:function(ele,callback){
        ele.addEventListener("animationend",function(e){
         ele.setAttribute("stroke-dashoffset",0);//animation的话结束的偏移量设置为0有bug，曲线会消失,所以得重新设置
         callback();
        });
        var str=ele.getAttribute("class")||" ";
        ele.setAttribute("class",str+"svg-animate");
        var len=ele.getTotalLength();
        ele.setAttribute("stroke-dasharray",len);//这是让虚线里的每个小线段长度为20px
        ele.setAttribute("stroke-dashoffset",len);//dash模式到路径开始的偏移距离,其实就是左加右减，728表示dash线初始位置是向左平移728单位
    }
});