;(function($){
    var support = {
        transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
        touch: ('ontouchstart' in window)
    };
    var touchStartEvent =  support.touch ? 'touchstart' : 'mousedown';
    var touchMoveEvent =  support.touch ? 'touchmove' : 'mousemove';
    var touchEndEvent =  support.touch ? 'touchend' : 'mouseup';
    
    var defaults = {
        clickEvent:true,
        initFunc:function(){},
        onTouchStart:function(){},
        onTouchEnd:function(){},
        onClick:function(){}
    };
    
    
    $.fn.dragable = function(option){
        var setting = {};
        var $dragTarget = this;

        var init = function(){
            setting = $.extend({},defaults,option);
            setting.initFunc();
        }

        
        
        if(this.length == 0){
            return this;
        }
        // support mutltiple elements
        if(this.length > 1){
            this.each(function(){$(this).dragable(option)});
            //setting.callbackFunc();
            return this;
        }
        
        //初期処理
        init();
        
        $dragTarget.bind(touchStartEvent,function(e){
            var self = this;
            e.preventDefault();
            self.width = $(this).width();
            self.height = $(this).height();
            self.pageX = getPage(e,'pageX');
            self.pageY = getPage(e,'pageY');
            self._left = $(self).position().left;
            self._top = $(self).position().top;
            self._startPos = {x:self._left,y:self._top};
            self._endPos = {x:0,y:0};
            self.touched = true;
            // absoluteに
            $(self).css({
                position:'fixed',
                top:self._top,
                left:self._left,
                opacity:0.8,
                'z-index':'9999',
                'webkitTransitionDuration':'0s'
            });

            //ドラッグスタート時の処理
            setting.onTouchStart();

            $(document).bind(touchMoveEvent,function(e){   //ドラッグ中
                if(!self.touched){return;}
                e.preventDefault();
                self._left = self._left - (self.pageX - getPage(e,'pageX') );
                self._top = self._top - (self.pageY - getPage(e,'pageY') );
                $(self).css({
                    left:self._left,
                    top:self._top
                });
                self.pageX = getPage(e,'pageX');
                self.pageY = getPage(e,'pageY');

            }).bind(touchEndEvent,function(e){    //ドラッグ終了
                self._endPos = {x:self._left,y:self._top};
                if(!self.touched){return;}
                self.touched = false;
                var degree = getAngel(self._startPos,self._endPos);
                $(self).css({
                    opacity:1
                });
                $(this).unbind(touchMoveEvent);
                $(this).unbind(touchEndEvent);
                
                //その場でクリックした時の処理
                if(setting.clickEvent){
                    if(!moveCheck(self._startPos,self._endPos)){
                        setting.onClick();
                    }
                }
                //ドラッグ終了時の処理
                setting.onTouchEnd();
            });
        });
        return(this);
    };
    

    /**
   * 当たり判定をチェック
   * @param {Object} $a ドラッグ中の要素
   * @param {Object} $b ドロップしたい要素
   * @return {Boolean} 当たっているか否か
   */
    function hitCheck($a,$b){
        var aPos = $a.offset();
        var bPos = $b.offset();
        return (
            aPos.top+$a.height() > bPos.top  &&
            aPos.top < bPos.top+$b.height() &&
            aPos.left+$a.width() > bPos.left &&
            aPos.left < bPos.left+$b.width()
        ) ? true : false;
    }

    // from.x/yとto.x/yからスワイプの角度を求める
    // TODO : 角度とスワイプ方向も返すか？(TOP RIGHT BOTTOM LEFT)
    function getAngel(start,end){
        var X = end.x - start.x;
        var Y = end.y-start.y;
        var r = Math.atan2(-Y,X); // ラジアン
        var angle = Math.round(r*180/Math.PI); // 角度
        if (angle < 0)
            angle = 360 - Math.abs(angle);
        return angle;
    }
    // eventからpageX/Yを適切に取って返す
    function getPage(event, page) {
        return support.touch ? event.originalEvent.touches[0][page] || event.changedTouches[0][page] : event[page];
    }
    // translate(x,y,z)かtranslate(x,y)を作って返す
    function translate(x,y){
        return support.transform3d ? 'translate3d('+x+'px,'+y+'px,0) ' : 'translate('+x+'px,'+y+'px) ' ;
    }
    // 現在のtranslateX,translateYを取得する
    function getTranslate(_this){
        var matrix = new WebKitCSSMatrix(window.getComputedStyle(_this).webkitTransform);
        var x = matrix.e;
        var y = matrix.f;
        return {x:x,y:y};
    }
    
    /**
   * 移動判定をチェック
   * @param {Object} start ドラッグ開始時の位置情報
   * @param {Object} end ドラッグ時の位置情報
   * @return {Boolean} 動いたかどうか ture:動いた　false:動いていない
   */
    function moveCheck(start,end){
        var posX = end.x - start.x;
        var posY = end.y-start.y;
        if(posX === 0 && posY === 0){
            return false;
        }else{
            return true;
        }
    }
})(jQuery);
