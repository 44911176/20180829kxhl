/**
 * Created by xqing
 * 开学有礼
 * 调用接口：1，登陆验证 2，投票
 */

;(function (w, $) {
    function txActivity(opts) {
        var defaultOpts = {
            node: null
        };
        /**
         * 参数合并
         */
        this.opts = $.extend(defaultOpts, opts);
        /**
         * 请求URL
         * @type {{url1: string}}
         */

        this.url = {
            // 测试服host指向 192.168.60.113 xqtest.sctv.com

            //登陆
            // login:'http://xqtest.sctv.com:9080/api/transmitRequest/user/loginByToken',
            // login:'http://uistest.sctv.com:8080/api/transmitRequest/user/loginByToken',
            login:'http://uisact.sctv.com:28080/api/transmitRequest/user/loginByToken',
            //投票
            // vote:'http://xqtest.sctv.com:9080/api/vote/add',
            // vote:'http://uistest.sctv.com:8080/api/vote/add'
            vote:'http://uisact.sctv.com:28080/api/vote/add'
            //用户投票数
            // checkUserVoteCount:'http://xqtest.sctv.com:9080/api/vote/checkUserVoteCount'
            // checkUserVoteCount:'http://uistest.sctv.com:8080/api/vote/checkUserVoteCount'
            // checkUserVoteCount:'http://uisact.sctv.com:28080/api/vote/checkUserVoteCount'


        };
        /**
         * tag参数
         * @type {{pandaVideo: string, pandaWowtv: string, scfocus: string, iptvvote: string}}
         */
        this.platform={
            pandaVideo:"392861C427FE30420D959D043CD32FFD",
            scfocus:"FAF092CD57FCF2F335AA0BD2658E817B",
            pc:"41357B790F3A7A90B2A529BEEF629C43"
        };

        /**
         * 是否已登陆
         * @type {boolean}
         */
        this.login = true;
        /**
         * 是否使用mock数据
         * @type {boolean}
         */
        this.mock = false;
        /**
         * 用户token
         * @type {string}
         */
        this.token = '';
        this.uId = '';
        this.actId = '';








        this._init();







    }
    $.extend(txActivity.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;
            self._uaCheck();
            self._uiBind();
            self._getInfo();
            //self._getUserCountAjax();



        },
        /**
         * 检查ua，如果不在app内部则呼出蒙层
         * @private
         */
        _uaCheck: function () {
            var self = this;
            var windowHeight = window.screen.height;
            var unAppPopup = $('body').find('#j-to-download');
            var ua = navigator.userAgent;
            //给高度赋值
            unAppPopup.css('min-height',windowHeight);
            /*
            if($(self.opts.node).hasClass('index')){
                $('.index').css('min-height',windowHeight)
            }
*/
            // alert(ua);
            if(ua.indexOf('pandavideo') > -1){

            }else {
                unAppPopup.removeClass('hide');
                $('.index').addClass('hide');
            }
        },
        /**
         * 从url中获取token，mid
         * 从dom中获取acid
         * @private
         */
        _getInfo: function () {
            var self = this,
                thisUrl = window.location.href,
                urlParaString = window.location.href.split("?")[1],
                paraArr = urlParaString.split("&"),
                len = paraArr.length;
                paraToken = null;
            function getCookie(name) {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            //从url中获取token
            if(thisUrl.indexOf('token') > -1){

                if (typeof(urlParaString)!='undefined'){
                    //url中取token
                    for (var i=0; i<len; i++) {
                        // document.write(cars[i] + "<br>");
                        if(typeof(paraArr[i].split("token=")[1])!= 'undefined'){
                            paraToken = paraArr[i].split("token=")[1];
                        }
                    }
                }

                self.token = paraToken;
            }


            //从dom中获取actid
            self.actId = $(self.opts.node).data('actid');



        },
        /**
         * 交互事件绑定
         * @private
         */
        _uiBind: function () {
            var self = this;
            var wrapper = $(self.opts.node);

            //首页大按钮"立即"
            //点击判定登录状态
            wrapper.delegate('.j-vote-btn','click',function () {
                $this = $(this);
                self._loginCheck($this);
            });







        },

        /**
         * 验证登陆状态：1，无有效token；2，token无效 即无有效登录token则呼起app登陆
         * 检查cookie中是否已有userToken 有的话拼接到url中重载页面
         * 检查url中是否有token 有的话进行token验证
         * @private
         */
        _loginCheck: function (node) {
            var self = this,
                thisUrl = window.location.href,
                urlParaString = window.location.href.split("?")[1],
                paraArr = null,
                paraToken = null,
                loginJson = {};
                //读取cookie
            function getCookie(name) {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            if(thisUrl.indexOf('token') > -1){

                if (typeof(urlParaString)!='undefined'){
                    paraArr = urlParaString.split("&");
                    //url中取token
                    for (var i=0,len=paraArr.length; i<len; i++) {
                        // document.write(cars[i] + "<br>");
                        if(typeof(paraArr[i].split("token=")[1])!= 'undefined'){
                            paraToken = paraArr[i].split("token=")[1];
                        }
                    }
                }

                loginJson.Token = paraToken;
                self.token = paraToken;
                loginUrl = self.url.login + '?token='+self.token;
                if(self.mock){
                    self._loginSucc(self.loginMock);
                }else {
                    $.ajax({
                        type: "post",
                        url: loginUrl,
                        data: JSON.stringify(loginJson),
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function(data){
                            if(data.code == 200){
                                self._loginSucc(data,node);
                            }else {
                                alert(data.comment);
                                // $('#j-login').trigger('click');
                            }
                        },
                        error: function (data) {
                            var res = JSON.parse(data.responseText);
                            alert(res.comment);

                        }
                    });
                }

            }else {
                if(getCookie('userToken')){
                    window.location.href = thisUrl + '?token=' + getCookie('userToken');
                }else {
                    //未登录呼起app登录
                    // console.log('未登录');
                    $('#j_gotologin').removeClass('hide');
                    //$('#j-login').trigger('click');
                }
            }


        },
        /**
         * 验证登陆成功后的逻辑
         * @private
         */
        _loginSucc: function(data,node){
            var self = this;
            self.uId = data.rslt.phone;
            //self._getUserCountAjax();
            self._voteAjax(node);

        },
        /**
         * 查询已捐赠次数
         * @private
         */
        /**
        _getUserCountAjax:function () {
            var self = this;

            $.ajax({
                type: "get",
                url: self.url.checkUserVoteCount,
                // data: JSON.stringify(self._getCountJson()),
                data: self._getCountJson(),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function(data){
                    // console.log(data.voteCount);
                    $('#j_alnum').html(data.voteCount);
                },
                error: function (data) {
                    //认证失败为-4 则不做处理
                    var res = JSON.parse(data.responseText);
                    if(res.code != -4){
                        // alert(res.err);
                    }
                }
            });
        },
         */
        /**
         * token 用户手机号
         * actId  活动编号
         * platform 平台id
         * @returns {*}
         * @private
         */
        _getCountJson:function () {
            var self= this;
            var getCountJson = {};
            getCountJson.token = self.token;
            getCountJson.actId = self.actId;
            getCountJson.platform = self.platform.pandaVideo;

            return getCountJson
        },

        _voteAjax:function (node) {
            var self = this;
            var optionId = node.data('option-id');

            $.ajax({
                type: "get",
                url: self.url.vote,
                // data: JSON.stringify(self._voteJson(optionId)),
                data: self._voteJson(optionId),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function(){
                    $('#j_done').removeClass('hide');
                    //$('#j_alnum').html(parseInt($('#j_alnum').html()) + 1);
                },
                error: function (data) {
                    var res = JSON.parse(data.responseText);
                    if(res.code == -5){
                        $('#j_more').removeClass('hide');
                    }else if(res.code == -6){
                        $('#j_tips').removeClass('hide');
                    }else{
                        alert(res.err);
                    }
                }
            });
        },
        _voteJson:function (optionId) {
            var self= this;
            var voteJson = {};
            voteJson.token = self.token;
            voteJson.actId = self.actId;
            voteJson.platform = self.platform.pandaVideo;
            voteJson.optionId  = optionId ;
            voteJson.count  = 1 ;

            return voteJson
        },











        /**
         * 重新加载
         */
        reload: function () {
            this._init();
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.txActivity) {
        w.txActivity = function () {
            $('.j_wrapper').each(function () {
                new txActivity({
                    node: this
                });

            });
        };
    }

    /**
     * banner入口
     */
    $(function () {
        w.txActivity();
    });

})(window, jQuery);