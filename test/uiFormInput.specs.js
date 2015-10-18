describe('directive: ui-form-element', function () {

  // scenario:
  // simple form input - basics
  // .
  describe('when valid: basics', function () {
    var html =
    '<form ui-form>' +
      '<div ui-form-element="someField">'+
        '<input type="text" ui-form-input sut>'+
      '</div>' +
    '</form>';

    beforeEach(compile.bind(this, html));

    it('should have correct `name` set', function () {
      expect(element.attr('name')).to.equal('SomeField');
    });

    it('should have correct `id` set', function () {
      expect(element.attr('id')).to.equal('fe_some-id-111');
    });

    it('should have correct `ng-model` set', function () {
      expect(element.attr('ng-model')).to.equal('entity.someField');
    });

    it('doesnt have original `attr` after compilation', function () {
      expect(element.attr('ui-form-input')).to.equal(undefined);
    });
  });

  // scenario:
  // simple form input - full option
  // .
  describe('when valid: basics full option', function () {
    var html =
    '<form ui-form>' +
      '<div ui-form-element="{ model: \'someField\', name: \'SomeOtherName\' }">'+
        '<input type="text" ui-form-input sut>'+
      '</div>' +
    '</form>';

    beforeEach(compile.bind(this, html));

    it('should have custom `name` set', function () {
      expect(element.attr('name')).to.equal('SomeOtherName');
    });
  });

  // scenario:
  // simple form input - no container
  // .
  describe('when valid: no container', function () {
    var html =
    '<form ui-form>' +
      '<div ui-form-element="{ model: \'someField\', name: \'SomeOtherName\' }">'+
        '<input type="text" ui-form-input sut>'+
      '</div>' +
    '</form>';

    function testCase(container, expected) {
      describe('test case: expect \''+expected+'\' for container \''+container+'\'', function () {
        beforeEach(compile.bind(this, html, {
          form: { dataContainer: container }
        }));

        it('should have correct `ng-model` set', function () {
          expect(element.attr('ng-model')).to.equal(expected);
        });
      });
    }

    testCase('', 'someField');
    testCase(undefined, 'someField');
    testCase(null, 'someField');
    testCase('someContainer', 'someContainer.someField');
  });

  // scenario:
  // required form input
  // .
  describe('when valid: required', function () {
    function withElement(message) {
      var html =
      '<form ui-form>' +
        '<div ui-form-element="someField" required'+ (message ? ('="'+message+'"') : '') +' sut="element">'+
          '<input type="text" ui-form-input sut>'+
        '</div>' +
        '<button sut="submit" type="submit">Submit</button>' +
      '</form>';

      var config = {
        element: {
          templates: {
            validation: {
              container: '<span class="validation-container"></span>',
            }
          }
        }
      };

      compile(html, config);
    }

    describe('basics', function () {
      beforeEach(function () {
        withElement();
      });

      it('should have `required` attribute set', function () {
        expect(element.attr('required')).to.equal('required');
      });
    });

    function testCase(message, expected) {
      describe('when submitted, with message: \''+message+'\'', function () {
        beforeEach(function () {
          withElement(message);
          suts.submit.click();
        });

        it('should have validation showed', function () {
          expect(suts.element.children('.validation-container').text()).to.equal(expected);
        });
      });
    }

    testCase('', 'This field is required');
    testCase('some custom required message', 'some custom required message');

  });

  // scenario:
  // match form input with another
  // .
  describe('when valid: match with another field', function () {
    function withElement(message, props) {
      var html =
      '<form ui-form>' +
        '<div ui-form-element="foo">'+
          '<label ui-form-label>foo label</label>' +
          '<input type="text" ui-form-input value="aa" sut="otherField">'+
        '</div>' +
        '<div ui-form-element="bar" match=\'foo'+(message ? (': ' + message ) : '')+'\' sut="element">'+
          '<input type="text" ui-form-input sut>'+
        '</div>' +
        '<button sut="submit" type="submit">Submit</button>' +
      '</form>';

      var config = {
        element: {
          templates: {
            validation: {
              container: '<span class="validation-container"></span>',
            }
          }
        }
      };

      compile(html, config, { entity: props });
    }

    function testCase(message, expected) {
      describe('when submitted, with message: \''+message+'\'', function () {
        beforeEach(function () {
          withElement(message, { foo: 'value', bar: 'value 2' });
          suts.submit.click();
        });

        it('should have validation showed', function () {
          expect(suts.element.children('.validation-container').text()).to.equal(expected);
        });
      });
    }

    testCase('', 'This field must match \'foo label\'');
    testCase('some custom match message', 'some custom match message');

  });

});
