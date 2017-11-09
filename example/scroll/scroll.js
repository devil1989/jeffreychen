/*   
 *authro:jeffreychen
 *time:2017/15/07
 *description:滚动组件
 *基于jquery
 *@param:
    isMobile:是否展示mobile的样式
    wrapper:插入哪个元素
    template：html模板
    data：[{//传入数据
        code    String  否   区域编码 【唯标识符，通过code和parentCode来联系地域上下级关系】
        name    String  否   区域名称[例如浙江省，就是名称]
        parentCode  String  否   上级区域编码 [code就是他的子元素的parentCode]
        level   String 否   区域级别【0：国家;  1：省份 ; 2：市 ; 3：区】
    }],
    beforeClickItem :点击具体内容的callback，UI变化之前
    afterClickItem ：点击具体内容的callback，UI变化之后
    beforeClickTab ：点击tab的callback，UI变化之前
    afterClickTab ：点击tab的callback，UI变化之后
 */


(function(){
     function Scroll(options){
        if(options.data){
            options.wrapper=options.wrapper||"body";
            this.options=options;
            this.wrapper=options.wrapper;
            this.template=options.template;
            if(options.isMobile){
                $(this.wrapper).addClass("scroller-wrapper-mobile");//如果是移动端，需要添加一个移动端class来修改界面
            }
            this.init(options.data);
        }
     }

     Scroll.prototype={
        init:function(data){
            //控制代码
            this.transData(data);
            this.render();
            this.bindAction();
        },

        //只更新数据，重新渲染界面,不需要重新绑定事件
        update:function(data){
            this.transData(data);
            this.render();
        },

        //初始化html
        render:function(needHide){
            var innerHtml=doT.compile(this.template)(this.targetData);
            if($(this.wrapper).find(".js_wrapper").length){//删除原来的
                $(this.wrapper).find(".js_wrapper").remove();
            }
            $(this.wrapper).append(innerHtml);
            if(needHide){
                this.hide();
            }else{
                this.show();
            }
        },

        //数据绑定和转化都在这里处理
        transData:function(data){
            var targetData={},defalutTab;
            this.options.data=data;
            this.data=data;
            defalutTab=[{
                code:"-1",//不为-1或者isSelected为true,就展示;
                name:"选择省份",
                parentCode:"-1",
                level:"1",
                isSelected:true,
                needShow:true
            },{
                code:"-1",
                name:"选择城市",
                parentCode:"-1",
                level:"2",
                isSelected:false,
                needShow:false
            },{
                code:"-1",
                name:"选择区域",
                parentCode:"-1",
                level:"3",
                isSelected:false,
                needShow:false
            }];
            targetData.classList={
                tabActive:"unit-tab-active",
                listActive:"unit-detial-list-active",
                itemActive:"unit-detial-active"
            };

            targetData.tab=this.clone(defalutTab);

            targetData.content=[];
            targetData.content.province={
                level:1,
                isSelected:true,
                content:[{
                    code:"10",
                    name:"浙江省",
                    parentCode:"1",
                    level:"1",
                    isSelected:false
                },{
                    code:"11",
                    name:"江苏省",
                    parentCode:"1",
                    level:"1",
                    isSelected:false
                },{
                    code:"12",
                    name:"安徽省",
                    parentCode:"1",
                    level:"1",
                    isSelected:false
                },{
                    code:"13",
                    name:"福建省",
                    parentCode:"1",
                    level:"1",
                    isSelected:false
                }]
            };
            targetData.content.city={
                level:2,
                isSelected:false,
                content:[{
                    code:"110",
                    name:"绍兴市",
                    parentCode:"10",
                    level:"2",
                    isSelected:false
                },{
                    code:"111",
                    name:"南京市",
                    parentCode:"10",
                    level:"2",
                    isSelected:false
                },{
                    code:"112",
                    name:"余姚市",
                    parentCode:"10",
                    level:"2",
                    isSelected:false
                },{
                    code:"113",
                    name:"杭州市",
                    parentCode:"10",
                    level:"2",
                    isSelected:false
                },{
                    code:"114",
                    name:"宁波市",
                    parentCode:"10",
                    level:"2",
                    isSelected:false
                }]
            };
            targetData.content.area={
                level:3,
                isSelected:false,
                content:[{
                    code:"1110",
                    name:"上虞区",
                    parentCode:"110",
                    level:"3",
                    isSelected:false
                },{
                    code:"1111",
                    name:"柯桥",
                    parentCode:"110",
                    level:"3",
                    isSelected:false
                },{
                    code:"1112",
                    name:"嵊州",
                    parentCode:"110",
                    level:"3",
                    isSelected:false
                },{
                    code:"1113",
                    name:"义务",
                    parentCode:"110",
                    level:"3",
                    isSelected:false
                }]
            };
            this.targetData=targetData;
        },

        //绑定组建中元素的事件
        bindAction:function(){
            var me=this;
            $(this.wrapper).on("click",".js_unit_tab",function(e){
                var itemData={
                    code:$(this).attr("data-code"),
                    level:parseInt($(this).attr("data-level")),
                    name:$(this).attr("title"),
                    parentCode:$(this).attr("data-parent-code")
                };
                me.beforeClickTab&&me.beforeClickTab(e,itemData);
                me.updateTargetData(itemData,true);
                me.render();
                me.afterClickTab&&me.afterClickTab(e,itemData);//点击tab的回调函数
            });

            $(this.wrapper).on("click",".js_scroll_list li",function(e){
                var itemData={
                    code:$(this).attr("data-code"),
                    level:parseInt($(this).attr("data-level")),
                    name:$(this).attr("title"),
                    parentCode:$(this).attr("data-parent-code")
                };
                me.beforeClickItem&&me.beforeClickItem(e,itemData);
                me.updateTargetData(itemData);
                me.render();
                me.options.afterClickItem&&me.options.afterClickItem.bind(me)(e,itemData);//点击详细区域的回调函数
            });
        },

        /*
         *core function:核心函数，所有交互效果都在这里
         *desc:通过code和level来修改targetData，该函数和update方法是类似操作，
         @isClickTab:是否是点击tab，点击tab的时候，不需要自动切换到下一个tab
         @itemData：点击的那个地址元素，也可能是tab的默认地址元素（默认地址元素的名称是"选择省份"|"选择城市"|"选择区域"）
         */
        updateTargetData:function(itemData,isClickTab){
            this.updateTab(itemData,isClickTab);
            this.updateDetail(itemData,isClickTab);
        },

        //更新头部tab信息
        updateTab:function(itemData,isClickTab){
            var tabList=this.targetData.tab||[];
            var len=tabList.length;
            var tgIdx=null;

            //tab选中更新
            for (var i = 0; i < len; i++) {
                if(isClickTab){
                    tabList[i].isSelected=(tabList[i].level==itemData.level)?true:false;//tab选中
                }else{
                    tabList[i].isSelected=(tabList[i].level==(itemData.level+1))?true:false;//tab选中
                    if(tabList[i].level==itemData.level){
                        tgIdx=i;
                    }
                }
            }
            if(!isClickTab&&tgIdx!==null){
                if(itemData.code!=tabList[tgIdx].code){//点击是不同元素，那么tab需要做隐藏展示处理
                    for (var n = 0; n < len; n++) {
                        if (n>tgIdx+1) {
                            tabList[n].needShow=false;
                        }else{
                            tabList[n].needShow=true;
                        }
                    }
                }
                tabList[tgIdx]=$.extend(tabList[tgIdx],itemData);//选中的tab信息更新
            }
        },

        //更新具体内容信息
        updateDetail:function(itemData,isClickTab){
            var contentObj=this.targetData.content;
            var me=this,key;

            this.updateTab(itemData,isClickTab);

            //list选中+list里面的item元素的选中
            for (key in contentObj){
                if(contentObj[key].level==(itemData.level+(isClickTab?0:1))){
                    contentObj[key].isSelected=true;
                }else if(contentObj[key].level==itemData.level){//给点击的数据添加选中效果
                    contentObj[key].isSelected=false;
                    me.selectItem(contentObj[key].content,itemData);
                }else{
                    contentObj[key].isSelected=false;
                }
            }
        },

        //给某个地址添加isSelected标记
        selectItem:function(content,itemData){
            var len=(content||[]).length;
            for (var i = 0; i < len; i++) {
                content[i].isSelected=(itemData.code==content[i].code)?true:false;
            }
        },

        //深度克隆
        clone: function(tgObj) {
          var obj = {};
          if (JSON && JSON.stringify && JSON.parse) {
            obj = JSON.parse(JSON.stringify(tgObj));
          } else {
            for (key in tgObj) {
              var value = tgObj[key];
              var type = toString.call(value);
              if (type == "[object Number]" || type == "[object String]" || type == "[object Boolean]") {
                obj[key] = value;
              } else {
                obj[key] = arguments.callee(value);
              }
            }
          }
          return obj;
        },

        hide:function(){
            $(this.wrapper+" .js_wrapper").hide();
        },

        //展示相册，判断右侧缩略图相册的小箭头是否展示
        show:function(){
            $(this.wrapper+" .js_wrapper").show();
        }
     };

     var scroll=new Scroll({
        isMobile:true,
        data:{},
        template:$("#scroll-tpl")[0].innerHTML,
        afterClickItem:function(e,data){
            if(data.level==3){
                this.hide();
            }
        }
     });

})();