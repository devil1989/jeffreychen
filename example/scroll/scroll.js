/*   
 *authro:jeffreychen
 *time:2017/15/07
 *description:滚动组件
 *@param:
    wrapper:插入哪个元素
 */


(function(){
     function Scroll(options){
        if(targetElement&&data){
            this.init();
        }
     }

     Scroll.prototype={
        init:function(){
            //控制代码            
            this.getElements(); 
            this.initHtml();
            this.bindAction();
            this.show();
        },

        //获取要用到的元素
        getElements:function(){
        },

        //初始化html
        initHtml:function(){
            var htmlStr="",hideStr="";           
        },

        //绑定组建中元素的事件
        bindAction:function(){
            var that=this;
        },

        //图片自适应大小
        resize:function(ele){
        },


        //展示相册，判断右侧缩略图相册的小箭头是否展示
        show:function(){
        }
     };

     // var scroll=new Scroll(document.getElementById("gallery1"),window.picData);

})();