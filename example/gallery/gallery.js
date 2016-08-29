/*   
 *authro:jeffreychen
 *time:2014/05/15
 *description:相册组件
 *parameter
 *  @target:目标元素[原生对象,最好是id标识的元素]
 *  @data:需要的源数据
 *  @typeArray:图片类别数组
 *  @Elements:经常用到的内部元素
 *  @typeNum:每个类别的图片数量
 *  @typeIndex:每个类别的第一张图片下标
 *  @currentIndex:当前图片下标[从1开始]
 *  @picArray:所有图片集合
 *  @sto:计时器
 */

 window.picData=[//这个是默认的格式[假数据]，this.transData将第三方数据转化为这种格式
    {   
        "name":"室内图",
        "type":"indoor",
        "content":
        [{
                "big":"http://pic1.ajkimg.com/display/ajk/9b3a76-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/2708d79650138d22390a4f333f667eee-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/9b3a76-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/2708d79650138d22390a4f333f667eee-67x50c.jpg",
                "desc":"房型图"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            }
        ]                 
    },
    {
        "name":"外景图",
        "type":"outdoor",
        "content":
        [{
                "big":"http://pic1.ajkimg.com/display/ajk/9b3a76-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/2708d79650138d22390a4f333f667eee-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/9b3a76-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/2708d79650138d22390a4f333f667eee-67x50c.jpg",
                "desc":"房型图"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/06d09c-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/0681d8e0857b3615ae074a35e72ba9df-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/e86039-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/cb8f20e1ade4852d1491ea60ded4f659-67x50c.jpg",
                "desc":"pic"
            },
            {
                "big":"http://pic1.ajkimg.com/display/ajk/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-600x600.jpg",
                "small":"http://pic1.ajkimg.com/display/anjuke/c11838-%E4%BC%8A%E8%AF%9A%E5%9C%B0%E4%BA%A7/27959508c42c4dfe7e870643c7deb6cf-67x50c.jpg",
                "desc":"pic"
            }
        ]
    }                
];

(function(){
     function Gallery(targetElement,data){
        if(targetElement&&data){
            this.target=$(targetElement)||null;
            this.data=data;
            this.typeArray=[];
            this.ele=[];        
            this.currentIndex=0;
            this.totleNum=0;
            this.currentType="";
            this.picArray=[];
            this.typeNum=[];
            this.typeIndex=[0];
            this.sto=null;
            this.speed=2;
            this.size={"h":600,"w":600};
            this.init();
        }
     }

     Gallery.prototype={
        init:function(){
            //控制代码            
            // this.transData();//如果按照约定好的接口数据格式，这个是不需要的
            this.initData();
            this.getElements(); 
            this.initHtml();
            this.bindAction();
            this.show();            
        },

        //把从外界获取的数据转化为自己需要的数据格式[this.data的默认数据格式在上面有],[业务代码,可修改]
        transData:function(){
            var d=this.data,type;
            var inner={"name":"","type":"","content":[]};
            var outer={"name":"","type":"","content":[]};
            for(attr in d){
                if(attr=="indoor"){
                    inner.name="室内图";
                    inner.type=attr;
                    inner.content=inner.content.concat(d[attr]);                    
                }
                else if(attr=="model"){
                    inner.content=d[attr].concat(inner.content);
                }
                else if(attr=="outdoor"){
                    outer.name="外景图";
                    outer.type=attr;
                    outer.content=d[attr];
                }
            }
            this.data=[inner,outer];
        },

        //从标准数据格式中获取自己想要的数据
        initData:function(){
            if(this.data.length){
                for(var i=0,len=this.data.length,tpIndex=0;i<len;i++){
                    this.picArray=this.picArray.concat(this.data[i]["content"]);                                       
                    this.totleNum+=this.data[i]["content"].length;
                    this.typeArray.push(this.data[i]["name"]);
                    this.typeNum.push(this.data[i]["content"].length);

                    tpIndex+=this.data[i]["content"].length;
                    (i!=len-1)&&this.typeIndex.push(tpIndex);
                }
                // this.currentType=this.chargeType(this.currentIndex);
            }
        },

        //获取要用到的元素
        getElements:function(){
            this.ele["pre"]=this.target.find(".js_move_left").eq(0);
            this.ele["next"]=this.target.find(".js_move_right").eq(0);
            this.ele["up"]=this.target.find(".js_move_down").eq(0);
            this.ele["down"]=this.target.find(".js_move_up").eq(0);
            this.ele["bigPic"]=this.target.find(".js_gallery_curImg").eq(0);
            this.ele["curIndex"]=this.target.find(".js_gallery_curIndex").eq(0);
            this.ele["totleNum"]=this.target.find(".js_gallery_totalNum").eq(0);
            this.ele["curDes"]=this.target.find(".js_gallery_des").eq(0);
            this.ele["innerDom"]=this.target.find(".js_gallery_scale_con").eq(0);
            this.ele["outerDom"]=this.target.find(".js_gallery_scale_wrapper").eq(0);
            this.ele["content"]=this.target.find(".js_show").eq(0);
            this.ele["hidePic"]=this.target.find(".js_gallery_hidden_pic").eq(0);
            this.ele["scale"]=this.target.find(".js_gallery_scale").eq(0);
        },

        //初始化html
        initHtml:function(){
            var htmlStr="",hideStr="";
            // var cType=this.chargeType(this.currentIndex);

            //c初始化右侧侧边栏
            for(var i=0,lenOut=this.data.length,dataIndex=0;i<lenOut;i++){
                for(var j=0,lenIn=this.data[i]["content"].length;j<lenIn;j++){
                    var tgEle=this.data[i]["content"][j];
                    (j==0)&&(htmlStr+="<dl><dt>"+this.data[i]["name"]+"</dt>");                   
                    htmlStr+='<dd>'+'<span><img data-index="'+dataIndex+'" title="'+tgEle["desc"]+'" alt="'+tgEle["desc"]+'" src="'+tgEle["small"]+'" height="50" width="67"></span>'+'</dd>';
                    hideStr+='<img src="'+tgEle["big"]+'"></img>';
                    (j==lenIn-1)&&( htmlStr+="</dl>");
                    dataIndex++;
                }
                this.ele["innerDom"].html(htmlStr);
                this.ele["hidePic"].html(hideStr);            
            }

            this.ele["allLink"]=this.ele["innerDom"].find("span");
            this.resize(this.ele["hidePic"].find("img").eq(this.currentIndex));
            this.ele["bigPic"].attr("src",this.picArray[this.currentIndex]["big"]);
            this.ele["curIndex"].html(this.currentIndex+1);
            this.ele["totleNum"].html(this.totleNum);
            this.ele["curDes"].html(this.picArray[this.currentIndex]["desc"]);
            (this.ele["allLink"].length>0)&&this.ele["allLink"].eq(0).addClass("on");            
        },

        //绑定组建中元素的事件
        bindAction:function(){
            var that=this;

            //大图展示区域的左右箭头点击事件
            this.ele["next"].on("click",function(e){
                var e=window.event||e;
                e.preventDefault?e.preventDefault():(e.returnValue=false);
                that.moveTo(that.currentIndex+1);
            });
            this.ele["pre"].on("click",function(e){
                var e=window.event||e;  
                e.preventDefault?e.preventDefault():(e.returnValue=false);
                that.moveTo(that.currentIndex-1);
            });

            //缩略图点击事件
            this.ele["innerDom"].on("click",function(e){
                var e=window.event||e;
                var target=$(e.srcElement||e.target);
                if(target.attr("data-index")){
                    e.preventDefault?e.preventDefault():(e.returnValue==false);
                    that.moveTo(parseInt(target.attr("data-index")));
                }
            });

            //右侧缩略图滚动事件
            this.ele["up"].on("mouseenter",function(){
                that.scrollsTo("move_down",that);
            });
            this.ele["up"].on("mouseleave",function(){
                that.unScrollTo(that);
            });            
            this.ele["down"].on("mouseenter",function(){
                that.scrollsTo("move_up",that);
            });
            this.ele["down"].on("mouseleave",function(){
                that.unScrollTo(that);
            });

            //右侧的“上下滚动箭头”点击事件
            this.ele["up"].on("mousedown",function(){
                $(this).addClass("up_active");
            });
            this.ele["up"].on("mouseup",function(){
                $(this).removeClass("up_active");
            });
            this.ele["down"].on("mousedown",function(){
                $(this).addClass("down_active");
            });
            this.ele["down"].on("mouseup",function(){
                $(this).removeClass("down_active");
            });

            //移到大图上展示左右侧箭头
            this.ele["content"].on("mouseenter",function(){
                $(this).addClass("gallery_show_on");
            });
            this.ele["content"].on("mouseleave",function(){
                $(this).removeClass("gallery_show_on");
            });
        },

        //根据当前下标判断当前图片的类型[要考虑到某一类图片为空]
        chargeType:function(index){
            for(var i=0,len=this.typeIndex.length;i<len;i++){
                if(i==len-1){
                    return this.data[i]["name"];
                }
                else{
                    if(index>=this.typeIndex[i]&&index<this.typeIndex[i+1]){
                        return this.data[i]["name"];
                    }
                }
            }
        },

        //所有切换图片的操作统一在这里出来[core function]
        moveTo:function(tgIndex){
            if(tgIndex<0){
                tgIndex=this.totleNum-1;
            }
            else if(tgIndex>this.totleNum-1){
                tgIndex=0;
            }
            //右侧scroll位置联动[待做]

            this.ele["allLink"].eq(this.currentIndex).removeClass("on");
            this.ele["allLink"].eq(tgIndex).addClass("on");
            this.resize(this.ele["hidePic"].find("img").eq(tgIndex));
            this.ele["bigPic"].attr("src",this.picArray[tgIndex]["big"]).attr("alt",this.picArray[tgIndex]["desc"]);
            // this.currentType=this.chargeType(tgIndex);
            this.currentIndex=tgIndex;
            this.ele["curDes"].html(this.picArray[tgIndex]["desc"]);
            this.ele["curIndex"].html(this.currentIndex+1);
        },

        //图片自适应大小
        resize:function(ele){
            if(ele.get(0).height>ele.get(0).width&&ele.get(0).height>=this.size.h){
                this.ele["bigPic"].css({"height":this.size.h+"px","width":""});
            }
            else if(ele.get(0).height<=ele.get(0).width&&ele.get(0).width>=this.size.w){
                this.ele["bigPic"].css({"width":this.size.w+"px","height":""});
            }
            else{
                this.ele["bigPic"].css({"width":"","height":""});
            }
        },

        //开始滚动
        scrollsTo:function(dir,element){
            var speed=(dir=="move_up")?(0-element.speed):element.speed;  
            this.sto=setInterval(function(){                
                var originNum=parseInt(element.ele["innerDom"].get(0).style.top.replace(/[\s]*px/g,"")||0);
                if(dir=="move_up"){
                    //不能再上移
                    if(element.ele["innerDom"].offset().top<=element.ele["outerDom"].offset().top+element.ele["outerDom"].height()-element.ele["innerDom"].height()){
                        element.ele["down"].addClass("down_un");
                        element.ele["up"].removeClass("up_un");
                        element.unScrollTo(element);
                        return;
                    }
                    element.ele["up"].removeClass("up_un");        
                }
                else{
                    //不能再下移
                    if(originNum>=0){
                        element.ele["down"].removeClass("down_un");
                        element.ele["up"].addClass("up_un");
                        element.unScrollTo(element);
                        return;
                    }
                    element.ele["down"].removeClass("down_un");                    
                }
                element.ele["innerDom"].get(0).style.top=(originNum+speed)+"px";
            },5);
        },

        //停止滚动
        unScrollTo:function(element){
            clearInterval(element.sto);
            element.sto=null;
        },

        //展示相册，判断右侧缩略图相册的小箭头是否展示
        show:function(){
            this.target.css({"display":"block"});
            if(this.ele["scale"].height()<this.ele["innerDom"].height()){
                this.ele["up"].css({"display":"block"});
                this.ele["down"].css({"display":"block"});
            }
        }
     };

     var ga=new Gallery(document.getElementById("gallery1"),window.picData);

})();