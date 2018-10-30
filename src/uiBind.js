/**
 * Created by xqing on 2017/3/22.
 */
;(function (w, $) {
    function zxShow(opts) {
        var defaultOpts = {
            node: null
        };
        /**
         * 参数合并
         */
        this.opts = $.extend(defaultOpts, opts);
        this._init();


    }
    $.extend(zxShow.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;

            self._hrefwWithToken();
            self._popupBind();

        },

        /**
         * 所有通过data-href的跳转带上token
         * @private
         */
        _hrefwWithToken: function () {
            var self = this,
                wrapper = $(self.opts.node);

            $('body').delegate('[data-href]','click',function(){
                var $this = $(this);
                if($this.data('href')!= ''){
                    var urlParaString = window.location.href.split("?")[1],
                        paraArr = null,
                        paraToken = null;
                    // var iToken = '';

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
                    var $thisHref = $(this).data('href');
                    var urlWithToken = $thisHref+ '?token=' + paraToken;
                    window.location = urlWithToken;
                }
            });
            //select切换带token
            wrapper.delegate('.choose select','change',function(){
                //$('.choose').find('select  option:selected').data('href');
                var urlParaString = window.location.href.split("?")[1],
                    paraArr = null,
                    paraToken = null;
                if (typeof(urlParaString)!='undefined'){
                    paraArr = urlParaString.split("&");
                    paraToken = paraArr[0].split("token=")[1];
                }
                var $thisHref = $(this).find('option:selected').data('href');
                var urlWithToken = $thisHref+ '?token=' + paraToken;
                window.location = urlWithToken;

            });
        },
        /**
         * 弹窗的呼出和关闭
         * @private
         */
        _popupBind: function () {
            var self = this;
            var wrapper = $(self.opts.node);

            //活动规则提示弹窗
            var rulesPopup = $(self.opts.node).parents('body').find('#j-rules');
            //所有的popup弹窗
            var allPopup = $(self.opts.node).parents('body').find('.popup');


            //呼出规则弹窗
            // wrapper.delegate('#j-call-rules','click',function () {
            //     rulesPopup.removeClass('hide');
            // });

            // //失焦关闭
            // $(document).mouseup(function(e){
            //     //活动规则
            //     var _con = $('.rule-card');
            //     if(!_con.is(e.target) && _con.has(e.target).length === 0){
            //         $('.rule-popup').addClass('hide');
            //     }
            //
            // });


            //弹窗的关闭按钮
            allPopup.delegate('.j-pclose','click',function () {
                var $this = $(this);
                $this.parents('.popup').addClass('hide');
            });
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
    if (!w.zxShow) {
        w.zxShow = function () {
            $('.j_wrapper').each(function () {
                new zxShow({
                    node: this
                });

            });
        };
    }

    /**
     * banner入口
     */
    $(function () {
        w.zxShow();
    });

})(window, jQuery);