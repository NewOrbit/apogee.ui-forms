describe('directive: ui-form-label', function () {

  var html = '<form ui-form><div ui-form-element="somefield">' +
    '<div sut ui-form-label ng-class="{ some: true }"><span ng-class="{ sub: true }"></span></div>' +
    '</div></form>';

  beforeEach(compile.bind(this, html));

  it('sets correct for attribute', function () {
    expect(element.attr('for')).to.equal('fe_some-id-111');
  });

  it('compiles other directives on same element', function () {
    expect(element.hasClass('some')).to.equal(true);
  });

  it('compiles sub elements', function () {
    var child = element.find('span');
    expect(child.hasClass('sub')).to.equal(true);
  });

});
