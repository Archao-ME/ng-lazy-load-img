/**
 *
 * <h1>图片懒加载</h1>
 * @module lazyLoadImage
 * @see <a href="https://github.com/jesusalexander/ng-lazy-load-img">Github</a>
 * @author jesusalexander
 */
angular.module('joc.lazyLoadImage',[]).factory('lazyLoadImage',['$window','$document', function ($window,$document) {
    'use strict';
    var lazyWindow = angular.element($window),lazyArr = [],isLazy = false;
    var that;
    var lastItem = true;
    /**
     * @menberof lazyLoadImage
     * @param {document} ele  - element对象
     * @returns {boolean} 是否可见
     */
    var isVisible = function(ele){
        if(ele&&ele!=undefined){
            var position = ele[0].getBoundingClientRect();
            return position.top>0 && position.left>0 && position.top < Math.max($document[0].documentElement.clientHeight, $window.innerHeight||0) ? true : false;
        }
    };
    /**
     * @menberof lazyLoadImage
     * @param {document} img <img>
     * @param {requestCallback} callback callback函数
     * @description 加载图片完成后调用callback
     *
     */
    var loadImg = function (img,callback) {
        var timer = setInterval(function () {
            if(img.complete){
                callback(img);
                clearInterval(timer)
            }
        },200);
    }
    /**
     * @menberof lazyLoadImage
     * @description 函数节流
     * @param {function} _func 需要节流的函数
     * @param {init} _wait 频率(200ms)
     * @returns _func的返回值
     */
    var throttle = (function(){
        var func,context,timer,args,previous= 0, result,now,i=0;
        var run = function () {
            previous = Date.now();
            timer = null;
            result = func.apply(context,args);
        }
        return function(_func,_wait){
            if(!func){
                func = _func;
                context = this;
            }
            now = Date.now();
            var remain = _wait - ( now - previous);
            if(remain<=0){
                clearTimeout(timer);
                run();
            }else if(!timer){
                timer = setTimeout(run,remain);
            }
            return result;
        };
    })();
    return {
        sayHi : function(){
          console.log('HI!!!');
        },
        /**
         * @public
         * @menberof lazyLoadImg
         * @param el
         * @returns {number} key 返回lazyArr数组的key
         */
        saveDirect : function (el) {
            return lazyArr.push(el) - 1; // return lazyArr key ;
        },
        /**
         * @public
         * @menberof lazyLoadImg
         * @param key {int} lazyArr数组的key
         * @returns {document} ele element对象
         */
        delDirect : function (key) {
            if(lazyArr[key]){
                var itemDel = lazyArr[key];
                lazyArr.splice(key,1);
                return itemDel;
            }
        },
        /**
         * @public
         * @menberof lazyLoadImg
         * @description 加载完成取消浏览器API绑定
         */
        doneLazyLoad : function () {
            isLazy = false;
            lazyWindow.off('scroll',that.lazyLoad);
            lazyWindow.off('resize',that.lazyLoad);
            console.log('done!');
        },
        /**
         * @public
         * @menberof lazyLoadImg
         * @description 遍历lazyArr数组并判断是否可见,若可见调用loadImg完成加载后的样式转换
         */
        lazyLoad : function () {
            var run = function () {
                if(lazyArr.length>=0){
                    lastItem = false;
                    angular.forEach(lazyArr, function (item,key) {
                        if(item!=null){
                            if(isVisible(item)){
                                item.attr('src',item.lazyAttr.lazyImg);
                                loadImg(item[0],function(){
                                    item.removeClass(item.attr('class'));
                                    item.addClass(item.lazyAttr.loadedClass);
                                    lazyArr[key] = null;

                                })
                            }
                            lastItem = true;
                        }
                    },that);
                }
                if(lastItem == false){
                    that.doneLazyLoad();
                }
            }
            throttle(run,200);
        },
        /**
         * @public
         * @menberof lazyLoadImg
         * @description 初始化,绑定scroll和resize事件
         * @returns {boolean}
         */
        initLazyLoad : function(){
            if(!this.isLazy){
                that = this;
                console.log('init lazy');
                this.isLazy = true;
                //TODO:去抖
                lazyWindow.on('scroll',that.lazyLoad);
                lazyWindow.on('resize',that.lazyLoad);
            }
            return true;
        }
    }
}]).directive('lazyImg',['lazyLoadImage',function(lazyLoadImage){
    return{
        restrict:'A',
        scope:{
            loadedClass:'@',
            lazyImg:'@'
        },
        link: function (scope,elem,attrs) {
            elem.lazyAttr = {
                loadedClass : scope.loadedClass,
                lazyImg : scope.lazyImg
            }
            lazyLoadImage.initLazyLoad();
            lazyLoadImage.saveDirect(elem);
            //load the first screen;
            lazyLoadImage.lazyLoad();
        }
    }
}]);