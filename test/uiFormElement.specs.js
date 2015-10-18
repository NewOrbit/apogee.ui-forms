describe('directive: ui-form-element', function () {

  // .
  // negative tests
  // .
  it('throws when no field is specified', function () {
    var html = '<form ui-form><div ui-form-element></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

  it('throws when no field is specified in options', function () {
    var html = '<form ui-form><div ui-form-element="{ something: 1234 }"></div></form>';
    expect(compile.bind(this, html)).to.throw('You must provide a field name for form-element');
  });

  // scenario:
  // simple form elements
  // .
  describe('when valid: simple', function () {
    var html =
    '<form ui-form>' +
      '<div sut ui-form-element="someField"></div>' +
    '</form>';

    it('doesnt have original `attr` after compilation', function () {
      compile(html);
      expect(element.attr('ui-form-element')).to.equal(undefined);
    });

    it('adds class if configured', function () {
      compile(html, { element: { class: 'some-class' } });
      expect(element.is('.some-class')).to.equal(true);
    });
  });

  // scenario:
  // required form elements
  // .
  describe('when valid: required', function () {
    var html =
    '<form ui-form>' +
      '<div sut ui-form-element="someField" required></div>' +
      '<button sut="submit" type="submit">Submit</button>' +
    '</form>';

    beforeEach(compile.bind(this, html, {
      element: {
        templates: {
          validation: {
            container: '<span class="sut-validation-container"></span>',
          }
        }
      }
    }));

    it('should add `required` class to element', function () {
      expect(element.hasClass('required')).to.equal(true);
    });

    describe('when submitted', function () {
      beforeEach(function () {
        suts.submit.click();
      });

      it('should add validators container', function () {
        expect(element.children('span.sut-validation-container').length).to.equal(1);
      });
    });
  });

  // scenario:
  // required form elements
  // .
  describe('when valid: required but validation disabled', function () {
    var html =
    '<form ui-form>' +
      '<div sut ui-form-element="{ model: \'someField\', validate: false }" required></div>' +
      '<button sut="submit" type="submit">Submit</button>' +
    '</form>';

    beforeEach(compile.bind(this, html, {
      element: {
        templates: {
          validation: {
            container: '<span class="sut-validation-container"></span>',
          }
        }
      }
    }));

    it('should add `required` class to element', function () {
      expect(element.hasClass('required')).to.equal(true);
    });

    describe('when submitted', function () {
      beforeEach(function () {
        suts.submit.click();
      });

      it('should NOT add validators container', function () {
        expect(element.children('span.sut-validation-container').length).to.equal(0);
      });
    });
  });

});
