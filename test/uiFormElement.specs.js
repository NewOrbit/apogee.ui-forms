describe('directive: ui-form-element', function () {

  it('throws when no field is specified', function () {
    var html = '<form ui-form><div ui-form-element></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

  it('throws when no field is specified in options', function () {
    var html = '<form ui-form><div ui-form-element="{ something: 1234 }"></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

  describe('when valid', function () {
    var html = '<form ui-form><div sut ui-form-element="someField"></div></form>';

    it('doesnt have original attr after compilation', function () {
      compile(html);
      expect(element.attr('ui-form-element')).to.equal(undefined);
    });

    it('adds class if configured', function () {
      compile(html, { element: { class: 'some-class' } });
      expect(element.is('.some-class')).to.equal(true);
    });

  });

});
