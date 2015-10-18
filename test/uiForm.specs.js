describe('directive: ui-form', function () {

    // scenario:
    // simple form - basics
    // .
    describe('when valid: basics', function () {
      function assertAttribute(name, expected) {
        it('should have correct `'+name+'` set', function () {
          expect(element.attr(name)).to.equal(expected);
        });
      }

      describe('with default options', function () {
        var html =
        '<form ui-form sut>' +
        '</form>';

        beforeEach(compile.bind(this, html));

        assertAttribute('name', 'form');
        assertAttribute('ng-submit', 'form.$valid && submit()');
        assertAttribute('ng-class', '{ attempted: form.$submitted }');
        assertAttribute('novalidate', '');

        it('doesnt have original `attr` after compilation', function () {
          expect(element.attr('ui-form')).to.equal(undefined);
        });
      });

      describe('with full options', function () {
        var html =
        '<form ui-form controller="fooController" sut>' +
        '</form>';

        beforeEach(compile.bind(this, html, {
          form: { class: 'some-class' }
        }));

        assertAttribute('name', 'fooController.form');
        assertAttribute('ng-submit', 'fooController.form.$valid && fooController.submit()');
        assertAttribute('ng-class', '{ attempted: fooController.form.$submitted }');
        assertAttribute('novalidate', '');

        it('has class set correctly', function () {
          expect(element.hasClass('some-class')).to.equal(true);
        });
      });
    });
});
