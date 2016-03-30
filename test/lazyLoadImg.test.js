describe('lazy window',function(){
    var lazyFac,scope,$compile,$window;
    beforeEach(module('lazyLoadImage'));
    beforeEach(inject(function(lazyLoadImage,_$compile_,$rootScope,_$window_) {
        lazyFac = lazyLoadImage;
        scope = $rootScope;
        $compile = _$compile_;
        $window = _$window_;
    }));
    it('save the direct dom', function () {
        var el = angular.element('<div lazy-image="img/foo.png"></div>');
        chai.expect(lazyFac.saveDirect(el)).to.be.a.number;
    });
    it('initLazyLoad',function(){
        var el = angular.element('<div lazy-image="img/foo.png"></div>');
        lazyFac.saveDirect(el);
        $window.document.body.appendChild(el[0]);
        chai.expect(lazyFac.initLazyLoad()).to.be.true;
    });
});