/*auther:jeffreyChen
 *@description:折线图
 *@time:2015/12/27
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

 */

function Schedule(options){
	this.options = this.extend({}, this.defaults(options), options);
    this.options.data = this.getFormatedData(JSON.parse(JSON.stringify(this.options.originData)));
    this.createCanvas();
}
Schedule.prototype= {

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
        
        var perY=this.getUnitTime(range, unitText);
        return (delayMinutes / (scaleNum * perY)) * (this.options.size.y / this.options.pointNum.y); //每段的长度
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
            markHeight: 4,//x轴的刻度的长度，可调
            wrapper:document.body
        }
    },

    //创建canvas
    createCanvas:function() {
        var canvas = {};
        canvas.node = document.createElement('canvas'); //canvas.node才是真正的canvas
        canvas.node.className = "canvas";
        canvas.context = canvas.node.getContext('2d'); //canvas.context是操作canvas的api
        canvas.node.width = this.options.width*2;
        canvas.node.height = this.options.height*2;
        this.options.canvas = canvas;
        this.options.wrapper.appendChild(canvas.node);
        // canvas.context.scale(this.options.scale || this.getScaleNum(), this.options.scale||this.getScaleNum());
        this.drowRact();
        this.createCoordinate();
        this.drowSchedule();
        this.drowCycle();
        this.drowXMark();
    },

    //获取画图的缩放比例,画布中画的内容的宽高，需要按照画布尺寸的宽高做自适应
    getScaleNum:function() {
        var defaults = this.defaults(this.options);
        var scaleNum;
        if (defaults.width * defaults.contentHeight > defaults.height * defaults.contentWidth) {
            //canvas的height是制约条件，按照高度的比例缩放
            scaleNum = defaults.height / defaults.contentHeight;
        } else { //canvas的width是制约条件，按照宽度的比例缩放
            scaleNum = defaults.width / defaults.contentWidth;
        }
        this.options.scale = scaleNum;
        return scaleNum || 1;

    },

    //画出对应的折线
    drowSchedule:function() {
        var data = this.options.data;
        var ctx = this.options.canvas.context;
        ctx.beginPath();
        ctx.strokeStyle = "#fe4f31"; //
        if (data && data.length) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (i == len - 1) {
                    ctx.stroke();
                    ctx.closePath();
                } else {
                    if(!data[i].isNoData&&!data[i + 1].isNoData){
                        console.log(data[i].isNoData)
                        console.log(data[i+1].isNoData)
                        ctx.moveTo(data[i].x, data[i].y);
                        ctx.lineTo(data[i + 1].x, data[i + 1].y);
                    }
                    else{
                        // ctx.moveTo(data[i].x, data[i].y);
                        ctx.moveTo(data[i + 1].x, data[i + 1].y);
                    }
                    
                }
            }
        }
    },

    //获取原点
    getOrigin:function() {
        return {
            x: 0 - this.options.related.x,
            y: 0 - this.options.related.y
        }
    },

    /*************创建坐标系 start**************/
    //创建坐标系
    createCoordinate:function(ctx) {
        var ctx = this.options.canvas.context;
        var origin = this.getOrigin();
        this.drowLine(ctx, origin);
        this.addText(ctx, origin);
    },

    //画X和Y轴
    drowLine:function(ctx, origin) {
        var rangeX = [origin.x, origin.x + this.options.size.x];
        var rangeY = [origin.y - this.options.size.y / 2, origin.y + this.options.size.y / 2];
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#b2b2b2"; //

        //画y轴
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(origin.x, rangeY[0]);
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(origin.x, rangeY[1]);


        //画x轴
        ctx.moveTo(origin.x, origin.y); //坐标原点
        ctx.lineTo(rangeX[1], origin.y); //坐标系y轴顶点

        ctx.stroke(); // 进行绘制
        ctx.closePath();
    },

    //添加X和Y轴刻度
    addText:function(ctx, origin) {
        // context.fillText(text,x,y,maxWidth);
        this.options.arrX = this.getLineArray(origin, "x"); //x轴上的各个点
        this.options.arrY = this.getLineArray(origin, "y"); //y轴上的各个点
        var arr = this.getRelatedArr(this.options.arrX, this.options.arrY);
        ctx.font = "12px Arial";
        ctx.fillStyle = "#8c8c8c";
        ctx.textAlign = "right";
        for (var i = 0, len = arr.length || 0; i < len; i++) {
            if (arr[i].text == "准点") {
                ctx.fillStyle = "#333333";
            } else {
                ctx.fillStyle = "#8c8c8c";
            }
            ctx.fillText(arr[i].text, arr[i].x, arr[i].y);

        }
    },

    //文本不可能是直接写在x轴线或者y轴线的点上，要进行微量的偏移
    getRelatedArr:function(arrX, arrY) {
        var arr = [];
        var options = this.options;
        var arrXClone = JSON.parse(JSON.stringify(arrX));
        var arrYClone = JSON.parse(JSON.stringify(arrY));
        for (var i = 0, lenX = arrX.length; i < lenX; i++) {
            arrXClone[i].y += options.relatedText.x.y; //x轴上各个点的文本标记的坐标是在x轴下
            arrXClone[i].x += options.relatedText.x.x;
        }
        for (var j = 0, lenY = arrY.length; j < lenY; j++) {
            arrYClone[j].x -= options.relatedText.y.x //x轴上各个点的文本标记的坐标是在x轴下
            arrYClone[j].y -= options.relatedText.y.y //
        }
        return arrXClone.concat(arrYClone);
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

    /**************创建坐标系 end**************/

    /**************画矩形 start**************/
    drowRact:function() {
        this.drowBigRact();
        this.drowSmallRact();
    },

    //画大矩形
    drowSmallRact:function() { //{x,y,width,height}矩形四要素
        //y轴第三个正坐标的点，第一个正坐标的点，第一个副坐标的点，第三个副坐标的点，分别可以画出4个矩形
        var arr = this.getLineArray(this.getOrigin(), "y"); //下标为奇数
        var ctx = this.options.canvas.context;
        var origin = this.getOrigin();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#f0f0f0";
        ctx.fillStyle = "#f0f0f0";
        for (var i = 0; i < arr.length; i++) {
            if (i % 2) {
                ctx.fillRect(
                    origin.x,
                    arr[i].y,
                    this.options.size.x,
                    this.options.size.y / this.options.pointNum.y
                );
            }
        }
    },

    //画小矩形
    drowBigRact:function() {
        var ctx = this.options.canvas.context;
        var origin = this.getOrigin();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#fafafa";
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(
            origin.x,
            origin.y - this.options.size.y / 2,
            this.options.size.x,
            this.options.size.y
        );
    },
    /**************画矩形 end**************/

    /****************画圆 start******************/
    drowCycle:function() {
        var data = this.options.data;
        var ctx = this.options.canvas.context;

        ctx.lineWidth = "3";
        ctx.strokeStyle = "#fd4a2c";
        ctx.fillStyle = "#ffffff";
        if (data && data.length) {
            for (var i = 0, len = data.length; i < len; i++) {
                ctx.beginPath();
                if(!data[i].isNoData){
                    ctx.arc(data[i].x, data[i].y, "3", 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    },
    /****************画圆 end******************/

    //画x轴上的各个刻度
    drowXMark:function(){
        var xArr=this.getLineArray(this.getOrigin(), "x");
        var markHeight=this.options.markHeight;
        var ctx = this.options.canvas.context;
        for(var i=0,len=xArr.length;i<len;i++){
            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.strokeStyle = "#b2b2b2"; 
            ctx.moveTo(xArr[i].x,xArr[i].y);
            ctx.lineTo(xArr[i].x,xArr[i].y+markHeight);
            ctx.stroke();
            ctx.closePath();
        }
    },

    /********************通用的基础函数 start*********************/
    //获取元素的尺寸
    getSize:function(ele, type) {
        if (window.getComputedStyle) {
            return parseInt(window.getComputedStyle(ele)[type].replace("px", "")) || 0;
        } else if (ele.currentStyle) {
            return ele.currentStyle[type].replace("px", "") || 0
        } else {
            return 0;
        }
    },

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
    }
    /********************通用的基础函数 end*********************/
}





new Schedule({
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
    wrapper:document.querySelector(".schedule")
});