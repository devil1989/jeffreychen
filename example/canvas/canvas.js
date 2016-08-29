/*auther:johnJiang and jeffreyChen
 *@description:刮奖环节代码
 *@desPoints:判断画布"是否触发展示结果"的热点
 *@times:手指在画布上移动的次数,到一定次数就触发画布后面的中奖结果
 *@prize:中奖文案
 *@noPrize:未中奖文案
 *@button:画布内点击重新刮奖的按钮
 *@canvasZ:canvas元素
 *@resultArea:画布内展示刮奖结果的元素
 *@getGold:canvas中展示"添加金币数文案"的元素
 *@resultText:canvas中展示"刮奖文案"的元素
 *@buttonClickArea:点击重新刮奖按钮的触发元素（因为点击重新刮奖按钮太小，所以用这个元素来触发）
 *@radius:刮奖时候手指大小
 *@scrapeState:用户是否可刮奖(用户每天刮奖次数受限制，一旦超过，就不能再挂中)
 *@isFirstClick:标识是否第一次执行touchstart事件,(刮奖的时候只有第一次touchstart才会触发ajax请求)
 *@systemType:手机操作系统类型
 */
var canv=function() {
    var desPoints,
        times,
        prize,
        noPrize,
        button,
        canvasZ,
        resultArea,
        getGold,
        resultText,
        buttonClickArea,
        radius,
        opacity,
        scrapeState,
        isFirstClick,
        systemType,
        canvas,
        ctx,
        backDatas,
        curBackData,
        width,
        height,
        timeNum,
        isEnd,
        noteInfo,
        isGameOver;

    //获取用到的元素
    function getElements(){
        button = document.getElementById("button");
        canvasZ = document.getElementById("canvas");
        resultArea = document.getElementById("resultArea");
        getGold = document.getElementById("getGold");
        resultText = document.getElementById("resultText");
        buttonClickArea = document.getElementById("buttonClickArea");
    }

    //创建画布元素
    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.node.className = "canvas";
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }

    //绑定所有事件
    function bindAction(){
        //点击按钮重新刮奖 发送ajax请求重新获取中奖结果
        buttonClickArea.onclick = function(){
            if(!scrapeState){
                if(!isEnd && $(button).html() != "邀请好友"){
                    isEnd=1;
                    //重新获取是否中奖结果
                    canvasZ.style.display = "block";

                    //决定创建层是盖在上面的
                    ctx.globalCompositeOperation = 'source-over';

                    ctx.clearTo("#ddd");
                    times = 0;
                    desPoints = ["90:40","60:60","100:60"];
                    isFirstClick=true;
                    //clear previous background image
                    canvas.node.className = canvas.node.className.split(" ")[0];
                    $(canvas.node).addClass("resultImg0");

                    //展示图片
                    showPrizeResult(backDatas,true);
                }
                else{
                    location.href=$(".tab_switch").find("a").eq(1).attr("href");
                }

            }
            else{
                //重新获取是否中奖结果
                canvasZ.style.display = "block";

                //决定创建层是盖在上面的
                ctx.globalCompositeOperation = 'source-over';

                ctx.clearTo("#ddd");
                times = 0;
                desPoints = ["90:40","60:60","100:60"];
                isFirstClick=true;
                //clear previous background image
                canvas.node.className = canvas.node.className.split(" ")[0];
                $(canvas.node).addClass("resultImg0");

                //展示图片
                showPrizeResult(backDatas,true);
            }

        };

        //活动没结束才执行事件绑定
        if(!isGameOver){
            //画布touchstart事件
            canvas.node.addEventListener("touchstart",function(e){

                //只有第一次touchstart才会发请求,点击重新刮奖按钮以后，isFirstClick会重置为true
                if(isFirstClick){
                    //重新获取是否中奖结果
                    getResult(0);
                }
                isFirstClick=false;
                canvas.isDrawing = true;
                //touch start 才显示结果层
                $(resultArea).show();
            },false);

            //画布touchend事件
            canvas.node.addEventListener("touchend",function(e){
                canvas.isDrawing = false;
            },false);

            //画布touchend事件
            canvas.node.addEventListener("touchmove", function(e){
                times++;
                if(systemType=="androidLow"||systemType=="android"){
                    var x = e.changedTouches[0].pageX + e.layerX;//this.offsetLeft;
                    var y = e.changedTouches[0].pageY + e.layerY;//this.offsetTop;

                    //这个是手指滑动删除点的效果:具体各个参数效果详见：http://www.ahjys.net/mybox_1205/1715_2.html
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillCircle(x, y, radius);

                    ctx.checkPoint(x,y);
                    //android version < 4.12 then reflow canvas when each move happened
                    if(systemType=="androidLow"){
                        $(canvas.node).css("opacity", opacity);
                        if(opacity < 1){
                            opacity = 1;
                        }else{
                            opacity = 0.99;
                        }
                    }
                }
                else if(systemType=="ios"){
                    var x = e.layerX ;//- e.changedTouches[0].pageX
                    var y = e.layerY; //- e.changedTouches[0].pageY
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillCircle(x, y, radius);
                    ctx.checkPoint(x,y);
                }
            },false);
        }
        

        button.addEventListener("touchend", function(e){
            canvas.isDrawing = false;
        },false);

        /*禁用touchmove事件冒泡,不禁用的话，一次滑动只能触发一个点*/
        $(resultArea).on("touchmove",function(e){
            e.preventDefault();
        },false);
        $(canvasZ).find("canvas").on("touchmove",function(e){
            e.preventDefault();
        },false);
    }

    //判断手机操作系统类型
    function chargeNavType(){
        var ismatchios=navigator.userAgent.match(/cpu[\s]*iphone[\s]*os/i)?true:false;
        var ismatchAnd=navigator.userAgent.match(/android/i)?true:false;//android版本
        var exp=/android\s*\d{1,1}\.\d{1,1}\.{0,1}\d{0,1}/i;//android详细版本
        var version;
        if(ismatchios){
            return "ios";
        }
        else if(ismatchAnd){
            var vs=navigator.userAgent.match(exp)[0];
            if(vs){
                var str=vs.replace(/\./g,"").replace(/android\s*/i,"");
                // if(str<=422){
                    return "androidLow";
                // }
            }
            else{
                return "android";
            }
        }
        else{
            return "unknow";
        }
    }

    //获取刮奖结果
    function getResult(is_init){        
        if(dataP){//判断条件需要删除
            var dataP = new Object();
            dataP.act_code = act_code;//back data
            dataP.sig = sig;//back data
            dataP.is_init = is_init;//post data
            dataP.rank = new Date().getTime();//post data
            $.ajax({
                url: genCoin_url,//needed url
                type:"post",
                async:"true",
                data:dataP,
                dataType:"json",
                success: function(rs){
                    scrapeState=rs.info.is_enable;
                    showPrizeResult(rs,is_init);
                },
                error:function(msg){
                    if(!is_init){
                        //本次刮中的金币有效，因为本次的结果，是前一次刮奖或者初始加载的时候决定的
                        alert(noteInfo[3]);
                        location.href = index_url;//back data
                    }
                }
            });
        }        
    }

    //canvas中展示"中奖结果"
    function showPrizeResult(rs,isInit){
        /*初始化或"点击canvas按钮重刮"的时候才执行里面的代码; */
        if(isInit){
            curBackData=rs;
            backDatas=null;

            //判断是否超过50次刮奖
            if(!scrapeState){
                if(!scrapeState){
                    $(button).html("邀请好友");
                }
                $(resultArea).addClass("unlucky");
                canvas.node.className = canvas.node.className.split(" ")[0];
                $(canvas.node).addClass("resultImg6");
                getGold.style.display = "none";
                if(rs.info.play_num < 52){
                    resultText.innerHTML=noteInfo[0];
                }else{
                    resultText.innerHTML=noteInfo[1];
                }
            }

            else{
               //中奖逻辑
                if(rs&&rs.status==200&&rs.info.add_coins){
                    $(resultArea).removeClass("unlucky");
                    //非初始化的时候动态加金币
                    backDatas=rs;
                    canvas.node.className = canvas.node.className.split(" ")[0];
                    //添加中奖图片背景
                    $(canvas.node).addClass("canvasGoldBg");

                    getGold.innerHTML = "金币 + " + rs.info.add_coins;
                    getGold.style.display = "block";
                    resultText.innerHTML = prize[randomZ(prize.length)];
                }
                //未中奖逻辑
                else{
                    $(resultArea).addClass("unlucky");
                    //重新获取是否中奖结果填充canvas底图
                    canvas.node.className = canvas.node.className.split(" ")[0];

                    //添加未中奖图片背景
                    $(canvas.node).addClass("resultImg6");

                    getGold.style.display = "none";
                    resultText.innerHTML=noPrize[randomZ(noPrize.length)];
                }
            }
        }
        /*非初始化的时候，只保存返回的数据，以便"点击canvas按钮重刮"的时候在灰色层下面展示之前保存的获奖结果*/
        else{
            backDatas=rs;
        }
    }

    //获取指定范围随机数
    function randomZ(num){
        return Math.round(Math.random()*(num-1));
    }



    //刮奖时候挂开图层的形状:这里用圆形刮图层
    function fillType(x, y, radius, fillColor) {
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, false);
        this.fill();
    };

    //检查是否刮开彩票
    function checkPoint(x, y) {
        var i, desPointsX, desPointsY, offset = 5,chargeType;
        for(i = 0; i < desPoints.length; i++){
            desPointsX = Number(desPoints[i].split(":")[0]);
            desPointsY = Number(desPoints[i].split(":")[1]);
            if((x < (desPointsX + offset) && x > (desPointsX - offset))
                && (y < (desPointsY + offset) && y > (desPointsY - offset))){
                desPoints.pop(i);
            }
        }
        //刮奖区域被刮开
        chargeType=(systemType=="ios")?"ios":"android";
        if((times > timeNum[chargeType][0] && desPoints.length < 2) || desPoints.length < 1 || (times > timeNum[chargeType][1] && desPoints.length < 4)||(times > timeNum[chargeType][2])){
            if(!canvas.isDrawing){
                return;
            }
            ctx.clearRect(0,0, width, height);
            setTimeout(function(){
                canvasZ.style.display = "none";                
                bitCoin.refreshCoin(curBackData||null);
            },1000);
            canvas.isDrawing = false;
        }
    };

    //给固定区域添加灰层和文字
    function clearTo(fillColor) {
        //创建颜色层盖在画布上
        ctx.fillStyle = "#a9a7a3";
        ctx.fillRect(0, 0, width, height);

        //画布上添加文字
        ctx.fillStyle = "#535353";//文字颜色
        ctx.font="19px Microsoft YaHei";//文字样式
        if(isGameOver){
            ctx.fillText("活动已结束",70,55,200);//文字内容,以及相对与原点的坐标,200是文字最大宽度[可选]
        }
        else{
            ctx.fillText("刮一刮   赢金币",45,55,200);//文字内容,以及相对与原点的坐标,200是文字最大宽度[可选]
        }
        
    };

    return{
        init:function(){
            if(document.getElementById('canvas')){
                isGameOver=true;//活动结束
                //设置刮奖出发次数
                timeNum={"android":[40,55,90],"ios":[45,65,100]};//
                width=225;
                height=95;
                getElements();
                canvas = createCanvas(canvasZ,width,height);
                ctx = canvas.context;
                ctx.fillCircle =fillType;
                ctx.checkPoint = checkPoint;
                ctx.clearTo = clearTo;
                bindAction();
                times = 0;
                backDatas=null;
                canvas.isDrawing = true;
                desPoints = ["89:32","119:33","79:56","113:58"];
                prize = ["刮奖这种事，缘分来了挡也挡不住！",
                "哇！中奖根本停不下来！",
                "运气这么好，不买张彩票都对不住自己！",
                "刮中就是这么简单！",
                "加油！离想要的奖品又近了一步!"
                ];
                noPrize = ["悄悄告诉你，邀请好友也能拿金币哦！",
                        "什么，别刮了？臣妾做不到啊！",
                        "据统计，用舌头刮，中奖率高到爆！",
                        "没刮中？难道你也是本命年？",
                        "Hi，让一让，你挡着我刮奖的信号了！",
                        "帮麻麻刷一次碗可提高90%的中奖率！" ,
                        "麻麻说，刮刮更健康哦！",
                        "刮奖前，你看黄历了吗？",
                        "你的刮奖姿势不对，原地转两圈？",
                        "据扯，先刮鼻子再刮奖，中奖率很高！" ,
                        "没中奖？赶紧啃口苹果提高中奖概率！",
                        "又没刮中？你今天啤酒炸鸡了嘛？",
                        "听说，点击“邀好友”按钮有惊喜哦！",
                        "据扯，午夜0点中奖概率最高！"
                ];
                noteInfo=["下午17点还有50次刮奖机会，<br />邀好友也能拿金币哦！",
                          "今天机会用完了，明天再来吧！<br />邀好友也可赢金币哦！",
                          "服务器连接失败,无法继续刮奖，请检查是否开启wifi或移动数据"];
                radius = 16;
                opacity = 0.99;
                scrapeState=true;
                isFirstClick=true;
                systemType=chargeNavType();
                getResult(1);
                ctx.clearTo("#ddd");

                /*css3触发GPU，硬件加速*/
                if($("#act_canvas")){
                    $("#act_canvas").addClass("cube");
                }
            }
        },

    }
}();
canv.init()