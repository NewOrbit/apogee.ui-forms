// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
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

// https://gist.github.com/kurtmilam/1868955
_.deepExtend = function(obj) {
  var parentRE = /#{\s*?_\s*?}/,
  slice = Array.prototype.slice;

  _.each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
        obj[prop] = source[prop];
      }
      else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
        if (_.isString(obj[prop])) {
          obj[prop] = source[prop].replace(parentRE, obj[prop]);
        }
      }
      else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
        if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
          throw new Error('Trying to combine an array with a non-array (' + prop + ')');
        } else {
          obj[prop] = _.reject(_.deepExtend(_.clone(obj[prop]), source[prop]), function (item) { return _.isNull(item);});
        }
      }
      else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
        if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
          throw new Error('Trying to combine an object with a non-object (' + prop + ')');
        } else {
          obj[prop] = _.deepExtend(_.clone(obj[prop]), source[prop]);
        }
      } else {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

function resetTo(obj, dest){
  for (var member in obj) delete obj[member];
  angular.extend(obj, dest);
}

function mockUniqueId(arr){
  utils._uniqueId = utils.uniqueId;
  var ix = 0;
  utils.uniqueId = function(){
    var res = arr[ix];
    ix ++;
    return res;
  };
}

// basic setup
var element, rootElement, suts, scope;
var compile = function(html, config){
  inject(function($rootScope, $compile, uiFormConfig) {
    if(config) _.deepExtend(uiFormConfig, config);

    scope = $rootScope.$new();
    rootElement = $($compile(html)(scope));
    suts = {};
    rootElement.find('[sut]').each(function (ix, el) {
      el = $(el);
      suts[el.attr('sut') || 'default'] = el;
    });

    element = suts.default;

    scope.$digest();
  });
};

beforeEach(mockUniqueId.bind(this, ['some-id-111', 'some-id-222', 'some-id-333']));
beforeEach(module('apogee.ui-forms'));

var config = angular.copy(uiFormConfig);
beforeEach(inject(function(uiFormConfig){ resetTo(uiFormConfig, config);}));
