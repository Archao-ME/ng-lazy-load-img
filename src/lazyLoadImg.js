angular.module('joc.lazyLoadImage',[]).factory('lazyLoadImage',['$window','$document', function ($window,$document) {
    'use strict';
    var lazyWindow = angular.element($window),lazyArr = [],isLazy = false;
    var that;
    var isVisible = function(ele){
        if(ele&&ele!=undefined){
            var position = ele[0].getBoundingClientRect();
            return position.top>0 && position.left>0 && position.top < Math.max($document[0].documentElement.clientHeight, $window.innerHeight||0) ? true : false;
        }
    };
    var loadImg = function (img,callback) {
        var timer = setInterval(function () {
            if(img.complete){
                callback(img);
                clearInterval(timer)
            }
        },200);
    }
    var throttle = (function(){
        var func,context,timer,args,previous= 0, result,now,i=0;
        var run = function () {
            console.log('run'+i++);
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
        saveDirect : function (el) {
            return lazyArr.push(el) - 1; // return lazyArr key ;
        },
        delDirect : function (key) {
            if(lazyArr[key]){
                var itemDel = lazyArr[key];
                lazyArr.splice(key,1);
                return itemDel;
            }
        },
        doneLazyLoad : function () {
            if(isLazy.length<=0){
                isLazy = false;
                lazyWindow.off('scroll',that.lazyLoad);
                lazyWindow.off('resize',that.lazyLoad);
                console.log('done!');
            }
        },
        lazyLoad : function () {
            var run = function () {
                if(lazyArr.length>0){
                    angular.forEach(lazyArr, function (item,key) {
                        if(isVisible(item)){
                            console.log(item);
                            item.attr('src',item.lazyAttr.lazyImg);
                            that.delDirect(key);
                            loadImg(item[0],function(){
                                item.removeClass(item.attr('class'));
                                item.addClass(item.lazyAttr.loadedClass);
                                lazyArr.length<=0 ? that.doneLazyLoad() : 0;
                            })
                        }
                    },that);
                }
            }
            throttle(run,200);
        },
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