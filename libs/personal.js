(function(window){
	var jQuery=function(){
		//jQuery等价于jQuery.fn.init
		var jQuery=function(selector,context){
			return new jQuery.fn.init(selector,context,root);
		}

		//等价于:jQuery.prototype={...};jQuery.fn=jQuery.prototype;jQuery.fn.init.prototype=jQuery.fn;
		jQuery.fn.init.prototype=jQuery.fn=jQuery.prototype={
			constructor:jQuery,
			init:function(selector,context,root){
				//各种类型的变量
			},
			isArray:function(t){
				return (Object.prototype.toString.call(t) === "[object Array]")?true:false;
			},
			isExp:function(t){
				return (Object.prototype.toString.call(t) === "[object RegExp]")?true:false;
			},
			isNumber:function(t){
				return (Object.prototype.toString.call(t) === "[object Number]")?true:false;
			},
			isString:function(t){
				return (Object.prototype.toString.call(t) === "[object String]")?true:false;
			},
			isDate:function(t){
				return (Object.prototype.toString.call(t) === "[object Date]")?true:false;
			},
			isObject:function(t){
				return (Object.prototype.toString.call(t) === "[object Object]")?true:false;
			},
			isFunction:function(t){
				return (Object.prototype.toString.call(t) === "[object Function]")?true:false;
			},
			isBoole:function(t){
				return (Object.prototype.toString.call(t) === "[object Boolean]")?true:false;
			},
			//深度克隆对象或数组
			clone:function(obj){
                var str, newobj = obj.constructor === Array ? [] : {};
                if(typeof obj !== 'object'){
                    return;
                } else if(window.JSON){
                    str = JSON.stringify(obj), //系列化对象
                    newobj = JSON.parse(str); //还原
                } else {
                    for(var i in obj){
                        newobj[i] = typeof obj[i] === 'object' ? 
                        cloneObj(obj[i]) : obj[i]; 
                    }
                }
                return newobj;
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
            base64:{
                encode:function (e){var r="",i,s,o,u,a,f,l,c=0;e=t(e);while(c<e.length)i=e.charCodeAt(c++),s=e.charCodeAt(c++),o=e.charCodeAt(c++),u=i>>2,a=(i&3)<<4|s>>4,f=(s&15)<<2|o>>6,l=o&63,isNaN(s)?f=l=64:isNaN(o)&&(l=64),r=r+n.charAt(u)+n.charAt(a)+n.charAt(f)+n.charAt(l);return r},
                decode:function (t){var i="",s,o,u,a,f,l,c,h=0;t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(h<t.length)a=n.indexOf(t.charAt(h++)),f=n.indexOf(t.charAt(h++)),l=n.indexOf(t.charAt(h++)),c=n.indexOf(t.charAt(h++)),s=a<<2|f>>4,o=(f&15)<<4|l>>2,u=(l&3)<<6|c,i+=r.fromCharCode(s),l!=64&&(i+=r.fromCharCode(o)),c!=64&&(i+=r.fromCharCode(u));return i=e(i),i}
            }
		};

		//反馈的是jQuery这个构造函数
		return jQuery;
	}();
	//工具函数
	//异步队列
	//浏览器测试
	//数据缓存
	//队列

	//熟悉操作

	//事件处理

	//选择器

	//DOM遍历

	//DOM操作

	//CSS操作

	//Ajax
	
	//动画

	//坐标和大小

	//变为全局变量
	window.jQuery=window.$=jQuery;
})(window);


/*json2:copy from http://www.json.org
 *description:兼容ie6,7,8下JSON.stringify和JSON.parse
 */
(function (window) {

    if (typeof JSON !== 'object') {
        window.JSON = {};
    }

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }


            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');


                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}(window));