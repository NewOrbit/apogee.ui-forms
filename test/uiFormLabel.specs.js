describe('directive: ui-form-element', function () {
  var element, scope;
  beforeEach(module('apogee.ui-forms'));

  var compile = function(html){
    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile(html)(scope);
      scope.$digest();
    });
  };

  it('throws when no field is specified', function () {
    var html = '<form ui-form><div ui-form-element></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

  it('throws when no field is specified in options', function () {
    var html = '<form ui-form><div ui-form-element="{ something: 1234 }"></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

});
