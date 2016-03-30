angular.module('lazyLoadImage',[]).factory('lazyLoadImage',['$window','$document', function ($window,$document) {
    'use strict';
    var lazyWindow = angular.element($window);
    var lazyArr = [];
    var elemAttrs;
    var isLazy = false;
    var isVisible = function(ele){
        if(ele&&ele!=undefined){
            var position = ele[0].getBoundingClientRect();
            return position.top>0 && position.left>0 && position.top < Math.max($document[0].documentElement.clientHeight, $window.innerHeight) ? true : false;
        }
    };
    var doneLazyLoad = function () {
        if(!isLazy){
            console.log('no lazing');
        }else{
            isLazy = false;
            lazyWindow.off('scroll',this.lazyLoad);
            lazyWindow.off('resize',this.lazyLoad);
        }
    };
    var delDirect = function (key) {
        if(lazyArr[key]){
            var itemDel = lazyArr[key];
            lazyArr.splice(key,1);
            lazyArr.length<=0 ? doneLazyLoad() : 0;
            return itemDel;
        }
    };
    return {
        saveDirect : function (el) {
            return lazyArr.push(el) - 1; // return lazyArr key ;
        },
        lazyLoad : function () {
            if(lazyArr.length>0){
                angular.forEach(lazyArr, function (item,key) {
                    if(isVisible(item)){
                        //TODO:默认图片,图片大小,加载样式
                        item.attr('src',item.attr('lazy-img'));
                        delDirect(key);
                    }
                },this);
            }
        },
        initLazyLoad : function(attrs){
            if(this.isLazy){
                console.log('isLazing');
            }else{
                console.log('init lazy');
                elemAttrs = attrs;
                this.isLazy = true;
                //TODO:去抖
                lazyWindow.on('scroll',this.lazyLoad);
                lazyWindow.on('resize',this.lazyLoad);
                this.lazyLoad();
            }
            return true;
        }
    }
}]).directive('lazyImg',['lazyLoadImage',function(lazyLoadImage){
    return{
        restrict:'A',
        scope:{},
        link: function (scope,elem,attrs) {
            lazyLoadImage.saveDirect(elem);
            lazyLoadImage.initLazyLoad(attrs);
        }
    }
}]);