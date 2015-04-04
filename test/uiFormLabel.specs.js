describe('directive: ui-form-element', function () {
  var element, scope;
  beforeEach(module('apogee.ui-forms'));

  _.mockUniqueId(['some-id-1234']);

  var compile = function(html){
    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile(html)(scope);
      element = $(element).find('[sut]');

      scope.$digest();
    });
  };

  var html = '<form ui-form><div ui-form-element="somefield">' +
    '<div sut ui-form-label ng-class="{ some: true }"><span ng-class="{ sub: true }"></span></div>' +
    '</div></form>';
  beforeEach(compile.bind(this, html));

  it('sets correct for attribute', function () {
    expect(element.attr('for')).to.equal('fe_some-id-1234');
  });

  it('compiles other directives on same element', function () {
    expect(element.hasClass('some')).to.equal(true);
  });

  it('compiles sub elements', function () {
    var child = element.find('span');
    expect(child.hasClass('sub')).to.equal(true);
  });

});
