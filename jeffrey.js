//常用方法集合
(function(w){
	var toString=Object.prototype.toString;
	w.J={

    //引用类型
    isObject:function(t){
      return (toString.call(t) === "[object Object]")?true:false;
    },
		isArray:function(t){
			return (toString.call(t) === "[object Array]")?true:false;
		},
		isExp:function(t){
			return (toString.call(t) === "[object RegExp]")?true:false;
		},
		isDate:function(t){
			return (toString.call(t) === "[object Date]")?true:false;
		},
		isFunction:function(t){
			return (toString.call(t) === "[object Function]")?true:false;
		},

    //基本类型
    isNumber:function(t){
      return (toString.call(t) === "[object Number]")?true:false;
    },
    isString:function(t){
      return (toString.call(t) === "[object String]")?true:false;
    },
		isBoole:function(t){
			return (toString.call(t) === "[object Boolean]")?true:false;
		},
		now:function(){
            return (new Date()).getTime();
        },
        offset:function(){
            //chrome,safari,ie[html头部没有dtd声明]:document.body.scrollTop
            //firefox 或者 ie[html头部有dtd声明]:document.documentElement.scrollTop 
            var p;                            
            p.y= document.documentElement.scrollTop  || document.body.scrollTop;
            p.x= document.documentElement.scrollLeft  || document.body.scrollLeft;
            return p;
        },
        docSize:function(isAllDoc){                
            //HTML标准下:document.body是dom的根元素;document.body.clientHeight[文档在屏幕中的可见区域的高度],document.documentElement.clientHeight[整个文档的高度]            
            //XHTML标准下,document.documentElement才是dom的根元素;document.body.clientHeight[整个文档的高度],document.documentElement.clientHeight[文档在屏幕中的可见区域的高度]            
            var p;
            if(isAllDoc){//整个文档的宽高(body外面有border的时候，计算出错,基本上不会出现这种情况)
                p.x=Math.max(document.body.clientWidth,document.documentElement.clientWidth);
                p.y=Math.max(document.body.clientHeight,document.documentElement.clientHeight);
            }
            else{//文档在屏幕中的可见区域的宽高[不包括滚动框]
                p.x=Math.min(document.body.clientWidth,document.documentElement.clientWidth);
                p.y=Math.min(document.body.clientHeight,document.documentElement.clientHeight);
            }
            return p;
        },
        winSize:function(isInner){//是否包括底部任务栏[屏幕宽高比较少用，一般用的是文档的宽高]
            var w;
            if(isInner){
                p.x=window.screen.availWidth;
                p.y=window.screen.availHeight;
            }
            else{//是否包括底部任务栏
                p.x=window.screen.width;
                p.y=window.screen.height;
            }
            return w;
        },
        parseXML: function( data , xml , tmp ) {   
           if ( window.DOMParser ) { // Standard 标准XML解析器
               tmp = new DOMParser();
               xml = tmp.parseFromString( data , "text/xml" );
           } 
           else { // IE IE的XML解析器
               xml = new ActiveXObject( "Microsoft.XMLDOM" );
               xml.async = "false";
               xml.loadXML( data );
           }
           tmp = xml.documentElement;  
           if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
               jQuery.error( "Invalid XML: " + data );
           }
           return xml;
        },
        // base64:{
        //     encode:function (e){var r="",i,s,o,u,a,f,l,c=0;e=t(e);while(c<e.length)i=e.charCodeAt(c++),s=e.charCodeAt(c++),o=e.charCodeAt(c++),u=i>>2,a=(i&3)<<4|s>>4,f=(s&15)<<2|o>>6,l=o&63,isNaN(s)?f=l=64:isNaN(o)&&(l=64),r=r+n.charAt(u)+n.charAt(a)+n.charAt(f)+n.charAt(l);return r},
        //     decode:function (t){var i="",s,o,u,a,f,l,c,h=0;t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(h<t.length)a=n.indexOf(t.charAt(h++)),f=n.indexOf(t.charAt(h++)),l=n.indexOf(t.charAt(h++)),c=n.indexOf(t.charAt(h++)),s=a<<2|f>>4,o=(f&15)<<4|l>>2,u=(l&3)<<6|c,i+=r.fromCharCode(s),l!=64&&(i+=r.fromCharCode(o)),c!=64&&(i+=r.fromCharCode(u));return i=e(i),i}
        // },
        //深度克隆
        clone:function(tgObj){
        	var obj={};
        	if(JSON&&JSON.stringify&&JSON.parse){
        		obj = JSON.parse(JSON.stringify(tgObj));
        	}
        	else{
        		for(key in tgObj){
              var value=tgObj[key];
              var type=toString.call(value);
              if(type=="[object Number]"||type=="[object String]"||type=="[object Boolean]"){
                obj[key]=value;
              }
              else{
                obj[key]=arguments.callee(value);
              }
        		}
        	}
          return obj;
        },

        //类继承方法（parent：父类对象或者父类方法，initializer:类的构造函数）
        Class:function(parent,initializer){
          if(!initializer){
            initializer=parent;
            parent=function(){};
          }
          var supper=typeof parent =="function" ? parent.prototype : parent;
          var originFunction=function(){
            typeof initializer == "function" && initializer.apply(this, arguments);
          }
          //originFunction继承自parent
          originFunction.prototype=supper;
          originFunction.prototype.constructor=originFunction;

          //拓展属性方法
          originFunction.extend=originFunction.prototype.extend=function(o){
            for(key in o){
              this[key]=o[key];
            }
          };
          return originFunction;
        }
	};

	return w;
})(window);