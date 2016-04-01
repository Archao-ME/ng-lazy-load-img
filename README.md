#jocLazyImageLoad

[![NPM](https://nodei.co/npm/ng-lazy-load-image.png?stars=true)](https://nodei.co/npm/ng-lazy-load-image/)

## npm install

> npm install --save-dev ng-lazy-load-image

## 使用方法:

添加依赖: angular.module('my-app',['joc.lazyLoadImage'])

```
<img lazy-img="https://angularjs.org/img/AngularJS-large.png" loaded-class="loaded" class="pre-load"/>
```

 - lazy-img* : 懒加载图片地址
 - class : 初始样式,完成后会被替换为loaded-class
 - loaded-class : 图片加载完成后切换为此样式


## Demo:[ng-lazy-load-img](http://blog.pikach.com/ng-lazy-load-img/)

## Update :

 - 0.1.0 : 函数节流,对scroll事件去抖