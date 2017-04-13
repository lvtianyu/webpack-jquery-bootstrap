import $ from "jquery"
import './pugin1.css'
import userAgent from '../../utils/userAgent'

var controller = (function ($, window, document) {
    var startX,//记录开始触法位置
        STARTIME,//记录开始出发时间
        IndexForSpanList,//默认圈数
        addPrefix = userAgent.prefix,//默认为chorme因为QQ浏览器和微信浏览器都是chorme内核
        touchClient = userAgent.appEnvironment === "pc" ? false : true, //判断是手机端还是客户端;
        target = document.getElementById("canvas"),
        $targetCanvas = $("#canvas"),
        $target = $("#quanLook"),
        targetDom = document.getElementById("quanLook"),
        isFrist,//用来判断是否是第一次加载,如果本地存储出现问题就走请求路线;
        TODAYDATA = {},//保存数据今天;
        WEEKDATA = {weight: [], waist: []};//保存首次数据7天;
 

        if (addPrefix != "-webkit-") {
            for (var i = 0; i < 6; i++) {
                $(".quan").eq(i).attr("style", addPrefix + "transform: rotate(" + 60 * (i + 1) + "deg)");
            }
        }

    if (touchClient) {
    document.addEventListener('touchstart', function (e) {
          startX = ev.touches[0].clientX;
          TIMESHARFT.touchStartFn(addPrefix);
    }, false);
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
       var client = ev.touches[0].clientX;//手机版
        TIMESHARFT.touchMoveFn(client, addPrefix);
    }, false);
    document.addEventListener('touchend', function (e) {
        TIMESHARFT.touchEnd(addPrefix);

    }, false);


    }
    else {
        target.onmouseenter = function (ev) {
            startX = ev.clientX;
            TIMESHARFT.touchStartFn(addPrefix);
        };
        target.onmouseleave = function (ev) {
            
            TIMESHARFT.touchEnd(addPrefix);
    
        };
        target.onmousemove = function (ev) {
            var client = ev.clientX;//pc版
            TIMESHARFT.touchMoveFn(client, addPrefix);
        }
    }

    var 
        
        prvbmiAnswer = "", initStandard = true, prvWaistlineAnswerForMen = "",//判断唯一性
       
        $view = $("#view"),//显示有没有达标
        $todayTimeBtn = $("#todayTime-click");//回到今日的按钮



    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate()                   //日
        };
        if (/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    var onedayTime = 86400000,//每天的秒数
        systime,//从服务器上获取的时间;
        quanshu = 0,
        history,//防止格子进来时候只是查看详情;
        datetime = systime,//记录当前的天
        openTime,//开始创建时间
        RecordPrvTimeForAjax, //= now;//避免重复请求必须记录时间与上一个时间不同
    //页面初始化;
        $spanBox = $(".timeBox"),
        deg = 0;
    var data;

    var TIMESHARFT = {//用来处理时间的逻辑
        x: 2,//32时间已经错乱可优化部分;最高压力30
        timeOfTurns: 0,//计时器用的长度
        isBackwardMove: true,
        isForwardMove: true,
        endTime: null,
        turnsOfInterval: null,          //是否开启定时器,同时设置圈数,是number;

        touchStartFn: function (addPrefix) {
            STARTIME = new Date().getTime();
            clearInterval(this['timeInterval']);//清除定时器

            this.turnsOfInterval = null;
            this.timeOfTurns = 0;
            this.x = 2;//这个判断必须在后
            this.isBackwardMove = true;
            this.isForwardMove = true;
        },
        touchMoveFn: function (client, addPrefix) {
            if (client > startX) {
                if (this.isBackwardMove) {
                    this.isForwardMove = false;//锁住另一侧不让触碰
                    this.searchOldValueFn(addPrefix);
                }
            } else if (client < startX) {
                if (this.isForwardMove) {
                    this.isBackwardMove = false;
                    this.searchNewValueFn(addPrefix);
                }
            }
            startX = client;
        },

        touchEnd: function (addPrefix) {
            this.endTime = new Date().getTime();
            var TIMEOUT = this.endTime - STARTIME;
            if ( !this.turnsOfInterval ) {
                if (TIMEOUT < 350 && TIMEOUT > 200) {
                    this.turnsOfInterval = 840;//两周
                    this.x = 12;
                } else if (TIMEOUT < 450 && TIMEOUT >= 350) {
                    this.x = 10;
                    this.turnsOfInterval = 420;//一周
                }
                var millisec = 50;//定时器的速度

                var searchValueFn = this.isBackwardMove ?   'searchOldValueFn' : 'searchNewValueFn'
                this.controlIntervalMove( millisec,searchValueFn )
            }
            this.elasticDampingRing(addPrefix);
            //抬起后就要校验50ms内是否触发了下一次;
            if ( TIMEOUT < 200 || TIMEOUT > 450 || this.turnsOfInterval ) {
                this.fnTimeout();
            }
        },

        //但触摸屏幕时调用左右移动方法
        elasticDampingRing: function (addPrefix) {
            var directionMove = this.isBackwardMove ? 'prv' : 'next';
          
            this.elasticDampingRingLogic( directionMove )
        },

        //具体操作当手离开圆盘时候的弹性回落方法
        elasticDampingRingLogic: function( directionMove  ) {
            var _degMer, 
            _MathabsDegMer, //角度的绝对值
            _deg = deg;     //重新保存全局变量的角度值
             
            _degMer = (deg % 60);//已60度为一个刻度点；为后续进行比对是非大于30，
            _MathabsDegMer = Math.abs(_degMer);

             //先判断一下传进来的是那个方法
            var _MoveFn = directionMove === "next" ,
                _judge  =  _MathabsDegMer >= 30, //大于30度就认为可以向前跳一个各了
                _difference = _deg - _degMer,   //每次都是60的整数倍
                _nextCallback  ;

            if (_degMer > 0) {

                deg = _judge ? _difference  + 60 :  _difference ;
                _nextCallback = _MoveFn && _judge ? 'next' : (_MoveFn && !_judge) ?
                null :( !_MoveFn && _judge) ? null : 'prv';

            } else if (_degMer < 0) {
                deg = _judge ? _difference - 60 : _difference;

                _nextCallback = _MoveFn && _judge ? null : (_MoveFn && !_judge) ? 'next' :( !_MoveFn && _judge) ? 'prv' : null;
                
            }

            console.log(_MoveFn,_nextCallback)
            if (_degMer != 0) {
                this.setAttributeForCircle( deg )
            }

             this[ 'prvOrNextChangeHtml' ]( datetime, _nextCallback )
           
        },

        setAttributeForCircle: function( deg ) {
            targetDom.setAttribute("style", addPrefix + "transform: rotate(" + deg + "deg)");
        },
        returnSelf: function() {
            return this;
        },
        //与页面操作要绑定的部分
        prvOrNextChangeHtml: function ( datetimeChild ,_prvOrNext ) {
            if( !_prvOrNext ) {return} ; 
            var istrue = _prvOrNext === "next"             
            //将数组重新操作一遍，为了操作页面上的元素；
            var  _IndexForSpanList ,n,newtime;
                if( istrue ) {
                    newtime = onedayTime
                    _IndexForSpanList  = IndexForSpanList.shift()
                    IndexForSpanList.push( _IndexForSpanList )
                    n = 5;
                } else {
                    newtime = (~onedayTime+1)
                    _IndexForSpanList = IndexForSpanList.pop()
                    IndexForSpanList.unshift( _IndexForSpanList )
                    n = 1;
                }
            var _replaceText;

            datetime = datetimeChild + newtime;
            _replaceText = datetime + newtime + newtime;
            _replaceText = new Date(_replaceText).Format("M-dd");

            n = IndexForSpanList[ n ];
            $spanBox.eq(n).html(_replaceText);
        },
       
        controlIntervalMove: function ( millisec , searchValueFn ) {
            var self = this;
              if ( this.turnsOfInterval ) {
                clearInterval(this[ 'timeInterval' ]);
                this['timeInterval'] = setInterval(function () {
                    self[ 'timeOfTurns' ] += self[ 'x' ];
                    self[ searchValueFn ]();
                    if (self['timeOfTurns'] == self['turnsOfInterval']) {
                        clearInterval(self['timeInterval']);
                        self['timeOfTurns'] = 0;
                        self['turnsOfInterval'] = null;
                        self['fnTimeout']();
                    }
                }, millisec)
            }
        },


        prvOrNextMove: function( deg, prvOrNext ) {

            this.setAttributeForCircle( deg );
            if (deg % 60 == 0) {
                // this[ directionMove ] = false;
                this[ 'prvOrNextChangeHtml' ]( datetime,prvOrNext );
            }
        },


        searchOldValueFn: function ( ) {
            deg -= this.x;
            this[ 'prvOrNextMove' ]( deg,'prv' )
        },

        searchNewValueFn: function ( ) {
            deg += this.x;
            this[ 'prvOrNextMove' ]( deg,'next' )
        },

        fnTimeout: function () {
            var self = this;
            setTimeout(function () {
                if (STARTIME < self.endTime) {
                    ajaxTimeForRing();

                } else {

                }
            }, 1250)
        }
  
    };
    var now,//标记今天
        requestCount = 7,
        isNow = true,//保存是否用来请求数据库的
        arrayLen;
    //判断请求数据库还是运用数组中的值
    function ajaxTimeForRing() {
        var ajaxDateTime = Math.floor(datetime / onedayTime);
      

        RecordPrvTimeForAjax = ajaxDateTime;
    }

    //业务相关的ajax请求
    function publicAjax(i, q) {
    
    }

    //时间在变化
    $todayTimeBtn.on("click", todayTimeClick);
    function todayTimeClick() {
        //消除所有的角度,将数据重置;
        deg = 0;
        isNow = true;
        datetime = systime;

        IndexForSpanList = [5, 4, 3, 2, 1, 0];//默认圈数;
        // RecordPrvTimeForAjax = Math.floor(systime / onedayTime);
        targetDom.setAttribute("style", addPrefix + "transform: rotate(" + deg + "deg)");
        initTimeForPageFn(4);//第一次的数据要记住
   
    }

    //初始页面的时间代码
    function initTimeForPageFn(day) {
        var tql = $(".timeBox"),
            j,
            len = 6 - day,
            next;
        for (var i = len; i >= -3; i--) {
            j = len - i;
            next = (systime + i * onedayTime);
            next = new Date(next).Format("M-dd");
            tql.eq(j).html(next);
        }
    }

    // 初始化页面变量
    function initPara() {
        //现查找本地存储,如果有就直接用,没有掉接口

        var listContent = sessionStorage.getItem('userInformationWeightWaist');
        systime = new Date().getTime();//如果没有就用系统时间
        var userId;
        data ;
        now = Math.floor(systime / onedayTime);
        var firstDaily ;
        if (!firstDaily) {
            firstDaily = systime;
        }
        openTime = Math.floor(firstDaily / onedayTime);
        arrayLen = now - openTime;
        TODAYDATA.weight = new Array(arrayLen);//用现在时间减创建时间就是数组长度;
        TODAYDATA.waist = new Array(arrayLen);

        if (listContent) {
            listContent = JSON.parse(listContent);//将数值转化成对象
            WEEKDATA = listContent.user;
            todayTimeClick();//初始化页面时间方法

        } else {//如果没有就请求;如果在其他浏览器上使用这个地方的进行修改

            isFrist = true;
            todayTimeClick(isFrist);
        }

    }

    var doInit = function () {
        initPara();//初始化页面变量
    };
    return {
        doInit: doInit
    }
})($, window, document);

$(function () {
    controller.doInit();
});
