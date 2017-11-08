/*   
 *authro:jeffreychen
 *time:2017/15/07
 *description:滚动组件
 *基于jquery
 *@param:
    wrapper:插入哪个元素
 */


(function(){
     function Scroll(options){
        if(options.data){
            options.wrapper=options.wrapper||"body";
            this.options=options;
            this.wrapper=options.wrapper;
            this.template=options.template;
            this.data=options.data;
            this.init();
        }
     }

     Scroll.prototype={
        init:function(){
            //控制代码
            this.transData();
            this.render();
            this.bindAction();
            this.show();
        },

        //转化数据格式
        transData:function(){
            var data=this.data;
            var targetData={};
            targetData.classList={
                tabActive:"unit-tab-active",
                listActive:"unit-detial-list-active",
                itemActive:"unit-detial-active"
            };

            //tab数据和其他数据得保持同步更新，然后再渲染内部数据，更新对应数据的选中状态
            targetData.tab=[{
                code:"-1",//不为-1或者isSelected为true,就展示;
                name:"选择省份",
                parentCode:"",
                level:"",
                selector:"scroll-list-list1",
                isSelected:true
            },{
                code:"-1",
                name:"选择城市",
                parentCode:"",
                level:"",
                selector:"scroll-list-list2",
                isSelected:false
            },{
                code:"-1",
                name:"选择区域",
                parentCode:"",
                level:"",
                selector:"scroll-list-list3",
                isSelected:false
            }];

            targetData.content=[];
            targetData.content.province={
                selector:"scroll-list-list1",
                isSelected:true,
                content:[{
                    code:"10",
                    name:"浙江省",
                    parentCode:"",
                    level:"",
                    isSelected:false
                }]
            };
            targetData.content.city={
                selector:"scroll-list-list2",
                isSelected:false,
                content:[{
                    code:"11",
                    name:"绍兴市",
                    parentCode:"",
                    level:"",
                    isSelected:false
                }]
            };
            targetData.content.area={
                selector:"scroll-list-list3",
                isSelected:false,
                content:[{
                    code:"12",
                    name:"上虞区",
                    parentCode:"",
                    level:"",
                    isSelected:false
                }]
            };
            this.targetData=targetData;
        },

        switchTab:function(type){
            this.switchTabHeader(type);
            this.switchTabDetail(type);
        },


        switchTabHeader:function(type){
            $(".js_unit_tab").removeClass("unit-tab-active");
            var targetElement=$('.js_unit_tab[data-selector="'+type+'"]');
            targetElement&&targetElement.addClass("unit-tab-active");
        },

        switchTabDetail:function(type){
            var detailList=$(".js_scroll_list");
            var len=detailList.length;
            if(len){
                for (var i = 0; i < len; i++) {
                    var ele=detailList.eq(i);
                    if(ele.hasClass(type)){
                        ele.addClass("unit-detial-list-active");
                    }else{
                        ele.removeClass("unit-detial-list-active");
                    }
                }
            }
        },

        //初始化html
        render:function(){
            var innerHtml=doT.compile(this.template)(this.targetData);
            if($(this.wrapper).find(".js_wrapper").length){//删除原来的
                $(this.wrapper).find(".js_wrapper").remove();
            }
            $(this.wrapper).append(innerHtml);
        },

        //绑定组建中元素的事件
        bindAction:function(){
            var me=this;
            $(this.wrapper).on("click",".js_unit_tab",function(){
                var type=$(this).attr("data-selector");
                type&&me.switchTab(type);
            });
        },

        //图片自适应大小
        resize:function(ele){
        },


        //展示相册，判断右侧缩略图相册的小箭头是否展示
        show:function(){
            $(this.wrapper+" .js_wrapper").show();
        }
     };

     var scroll=new Scroll({
        data:{},
        template:$("#scroll-tpl")[0].innerHTML
     });

})();