#ng-lazy-load-img

## 使用方法:

 - 懒加载图片: `lazy-img` = 图片地址
 - 载入完成后的样式 : loaded-class
 - 载入前的样式为class,载入完成后将替换为 loaded-class的样式

```
<img lazy-img={{item.src}} loaded-class={{item.loadedClass}}  class="pre-load"/>
```



