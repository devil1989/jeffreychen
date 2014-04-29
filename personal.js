(function(window){
	var jQuery=function(){
		//jQuery等价于jQuery.fn.init
		var jQuery=function(selector,context){
			return new jQuery.fn.init(selector,context,root);
		}

		//jQuery对象原型
		jQuery.fn=jQuery.prototype={
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
			clone:function(t){
                var s=Object.prototype.toString.call(t);
                return (s.indexOf("[object Array]")!=-1||s.indexOf("[object Object]")!=-1)?JSON.parse(JSON.stringify(t)):t;
			},
            now:function(){
                return (new Date()).getTime();
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
            }
		};

		//为了让$()后返回的对象继承自jQuery.fn原型对象，所以可以调用原型对象的所有方法和变量
		jQuery.fn.init.prototype=jQuery.fn;

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