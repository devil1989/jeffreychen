/**
 * ubtTracker数据埋点
 * 可调用方法：send
 * 统计范围：服务请求，页面jsError，页面埋点（点击事件）
 * 页面元素曝光统计使用方法：1.给元素添加属性data-exposure="key"(key为对应的统计参数，按照这个参数来确定该点击事件的唯一性)：只统计hybrid，不统计H5
                             点击事件的曝光可以不清除，但是曝光统计必须及时清除，如果某个元素曝光统计用完了，得把他删除掉，统计节点过多会影响页面滑动性能
                             
                             2.如果某个页面有底部fix的元素，那个元素会影响曝光，需要给那个fix元素添加属性data-exposurefix="1"，来排除他的影响
   
   曝光的统计key ：flight_hybrid_exposure
   页面元素曝光统计缺陷 : 1.z-index层级导致曝光问题暂时不处理(因为默认页面没有z-index，那么有z-index的页面元素，肯定是在本页面上面展示；暂时不考虑自己页面盖在需要曝光的元素上面这种情况)

   曝光的边际考虑因素： 元素隐藏（解决）
                        ajax后续加入元素（如果不考虑这个问题，其实曝光可以在页面离开的时候统一发，只要记录页面滚动最大的距离即可，但现在只能通过scroll）,
                        没触发任何事件直接关闭页面或者hybrid回退（onbeforeunload方法触发事件执行）
                        touchend在页面滚动完之前就执行了：touchend触发时间是手指离开，不太准确，最准确的是停止滚动的时候（所以只能绑scroll事件）
                        元素的z-index导致没看到（未解决）
                        页面加载一次，某个页面元素的曝光不能重复发送：局部ajax导致数据重新渲染，会重新发曝光请求，所以得在window下记录对应的曝光key，以免重复发送
 */
 
window.ubtTracker = {
    _getKey: function () {
        // 设置对应的key
        return /jeffreytrip/i.test(window.navigator.userAgent) ?   '_flight_hybird_jeffreytrip' : '_flight_h5';
    },
    _getBelongTo: function () {
        var arr = location.pathname.split('/');
        return arr[arr.length - 2];
    },
    _getErrorType: function (error) {
        if (!error) return "";
        var errorType = "";
        if (error instanceof EvalError) {//eval函数使用错误
            errorType = 'EvalError';
        } else if (error instanceof RangeError) {//超出内存容许范围，一般是递归循环调用导致
            errorType = 'RangeError';
        } else if (error instanceof ReferenceError) {//作用域内没有这个变量，但是却在使用它，会抛出这个错误【最常见错误】
            errorType = 'ReferenceError';
        } else if (error instanceof SyntaxError) {//语法错误，一般是少了括号，逗号等导致语法错误
            errorType = 'SyntaxError';
        } else if (error instanceof TypeError) {//当在作用域中找到了这个变量引用，然后你让这个变量去做他力所不能及的事情的时候，比如说引用它一个不存在的属性，或者把变量当函数使用等
            errorType = 'TypeError';
        } else if (error instanceof URIError) {//encodeURIComponent和decodeURIComponent方法报错
            errorType = 'URIError';
        }
        return errorType;
    },
    _getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (decodeURI(r[2])); return null;
    },
    init: function () {
        var me = this;

        window[ '__bfi' ] = window[ '__bfi' ] || [];
        $window.addEventListener('error', function (e) {
            me.send('error', e);
        });

        $window.addEventListener('beforeunload', function () {
            me.reportErrorWrap();
        });

        //曝光元素事件
        me.initExposure();

        // 事件代理
        me.captureOn();
    },

    reportErrorWrap: function (errWrap) {
        if (errWrap) {
            window[ '__bfi' ].push([ '_trackError', errWrap.error ]);
        } else {
            for (let key in this._error_map) {
                let errWrapItem = this._error_map[ key ];
                if (errWrapItem) {
                    window[ '__bfi' ].push([ '_trackError', errWrapItem.error ]);
                    this._error_map[ key ] = null;
                }
            }
        }
    },

    //页面曝光功能添加:需要添加在事件前面,因为有的事件触发以后就直接跳转到其他页面了,得在事件之前埋好节点
    initExposure:function(){
        var me=this;
        var FLIGHTHYBRIDEXPOURSE;
        var handel=function(){
            me.triggerExpourse();
        };
        if(window.document&&$){
            window.FLIGHTHYBRIDEXPOURSE_KEY = window.FLIGHTHYBRIDEXPOURSE_KEY||[];
            $(document).on("scroll",function(){
                clearTimeout(FLIGHTHYBRIDEXPOURSE);
                FLIGHTHYBRIDEXPOURSE=setTimeout(handel,300);
            });

            window.onbeforeunload=(function(callback){//重写事件
                var _callback=callback;
                return function(){
                    me.triggerExpourse();
                    if(typeof _callback==="function"){
                        _callback.apply(this,arguments);
                    }
                }
            })(window.onbeforeunload);
        }
    },

    //统计当前状态的页面元素曝光
    triggerExpourse:function(){
        var targetList=$("[data-exposure]");
        if(targetList&&targetList.length){
            var me=this;
            var extraHeight=$("[data-exposurefix]").eq(0)&&$("[data-exposurefix]").eq(0).height()||0;//底部fix元素的高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//y轴的滚动位置
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;//x轴的滚动位置
            var winHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);//窗口高度
            var winWidth = Math.min(document.body.clientWidth, document.documentElement.clientWidth);//窗口宽度

            targetList.forEach(function(target){
                var $target=$(target);
                var exposure= $target.attr("data-exposure")||"";//曝光的key
                var hasSended=(_&&_.some)?_.some(FLIGHTHYBRIDEXPOURSE_KEY||[],function(item){return item==exposure}):"";
                if(exposure&&target&&$target.height()!=0&&!hasSended){//元素高度为0说明是隐藏元素，肯定没曝光
                    /*元素曝光计算公式：元素顶部在页面的位置+元素高度*0.5<界面高度+滚动高度-底部fix的遮挡元素高度
                      为什么要添加元素高度*0.5：不添加高度的话，元素稍微露出一点，其实用户是没看到的，不算曝光；
                                                如果按照元素整个露出来，那么有可能某个曝光元素高度比较大，用户已经看了七七八八了但没到底部，
                                                这样不算曝光的话也不准确；所以折中，元素露出一半高度，就算曝光【和秀娟确认了这个逻辑】*/
                    var offset=$target.offset()?$target.offset():{top:0,left:0};
                    var elePositionY=offset.top||0;//元素在y轴上的高度
                    var elePositionX=offset.left||0;//元素在x轴上的位置
                    var eleHeight=$target.height?$target.height():0;//元素高度
                    var eleWidth=$target.width?$target.width():0;//元素宽度
                    if((winHeight+scrollTop>elePositionY+extraHeight+eleHeight*0.5)&&(winWidth+scrollLeft>elePositionX+eleWidth*0.5)){
                        // alert(winHeight+" "+scrollTop+" "+elePositionY+" "+extraHeight+" "+winWidth+" "+scrollLeft+" "+elePositionX+" "+eleWidth);
                        me.send("flight_hybrid_exposure",exposure);//hybrid机票元素曝光率
                        FLIGHTHYBRIDEXPOURSE_KEY.push(exposure);
                        $target.removeAttr&&$target.removeAttr("data-exposure");//发完曝光以后，需要删除曝光节点的曝光属性，以免重复发送
                    }
                }
            });
        }
    },

    // 功能描述：重写方法
    override: function (callback) {
        var me = this;
        var _callback = callback;
        return function (e) {
            // 切换上下文对象
            //_callback.call(this,e);

            // 切换上下文对象
            _callback.apply(this, arguments);

            // 捕获日志
            me.capture(e);
        };
    },

    // 功能描述：捕获
    capture:function(e){
        var me = this;
        var n = 0;

        function getSpeed(target) {
            if (!target) {
                return;
            }
            n++;

            var speedAttr = target.attributes && (target.attributes['speed'] || target.attributes['data-speed']);
            if (speedAttr) {
                return speedAttr.value;
            }
        }
        //这里一定不能写e.target， 因为父级上面的元素如果也有绑定事件， 那么 就会每次就会触发
        var speed = getSpeed(e.currentTarget);
        
        if (speed) {
            me.send('speed', speed);
        }
    },

    /**
     * 发送数据
     * @param  {Object} data 埋点数据，必须是Object类型
     * belongto: 'schedule' // 从属项目
     */
    send: function (key, data, from) {
        var me = this;
        if ( Lizard.P("oid") && localStorage.getItem('FLT_POSTSERVICE_OID') != Lizard.P("oid") ) {
            localStorage.setItem('FLT_POSTSERVICE_OID', Lizard.P("oid"));
        }
        var oid = Lizard.P("oid") || localStorage.getItem('FLT_POSTSERVICE_OID') || 0;
        //var pid = $ && $("#page_id") && $("#page_id").length && $("#page_id").get(0).value || 0;
        var pid = document.getElementById('page_id') && document.getElementById('page_id').value;
         
        var isHybrid = Lizard.app.vendor.is('CTRIP');
        var guid = localStorage.getItem('GUID');
        if (!guid) {
            var createGuid = function () {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }

                function NewGuid() {
                    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                }

                return NewGuid();
            };

            guid = createGuid();
            localStorage.setItem('GUID', guid);
        }
    
        Date.prototype.Format = function (fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        var normalData = {
            belongTo: me._getBelongTo(),
            clientID: guid,  
            speed: '',
            serverInfo: {
                startTime: '',
                endTime: '',
                requestInfo: {},
                responseInfo: {},
                url:''
            },
            error: {},
            env: isHybrid ? "hybrid" : "h5",
            pageid: pid,
            hpageid: pid,
            orderid: oid,
            startTime: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            from: from || window.encodeURIComponent(location.href)
        };

        if (typeof key === 'string') {
           
            if (typeof window['__bfi'] == 'undefined') {//__bfi字段存放错误和埋点信息
                window['__bfi'] = [];
            }

            if (key == 'error') {//错误信息
                window['__bfi'].push(['_trackError', data]);
            } else {//埋点信息，例如key="serverInfo”可以设置为服务请求埋点，统计服务请求；
                    //其他事件埋点可以通过在某个点击元素上添加data-action="点击登录"，最后在所有事件的基础上，获取data-action对应的值作为key，然后send
               
                normalData[key] = data;

                window['__bfi'].push(['_tracklog', me._getKey(), JSON.stringify(normalData)]);
            }
            
        } else {
            console.log('key 必须是字符串');
        }
    }
};

// 初始化
ubtTracker.init();

try{
    let _console = window.console || {
            log: function () {},
            error: function () {},
            info: function () {},
            assert: function () {}
        };

    let _oriError = _console.error;
    if(FLTHYBRID.dev==='prd'){
        _console.error=function(){
            let arg=arguments;
            for(let i=0;i<arg.length;i++){
                if(arg[i] instanceof Error){
                    ubtTracker.send('error',arg[i]);
                }
            }
        }
    }

}catch (e){
    ubtTracker.send('error',e);
}

