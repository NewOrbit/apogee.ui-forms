if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP ? this : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

_.mockUniqueId = function(arr){
  _._uniqueId = _.uniqueId;
  var ix = 0;
  _.uniqueId = function(){
    var res = arr[ix];
    ix ++;
    return res;
  };
};

// basic setup
var element, scope;
var compile = function(html){
  inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile(html)(scope);
    element = $(element).find('[sut]');

    scope.$digest();
  });
};

_.mockUniqueId(['some-id-111', 'some-id-222', 'some-id-333']);
