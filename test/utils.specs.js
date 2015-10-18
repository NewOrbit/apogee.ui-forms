var sut = originalUtils;

describe('utils tests', function () {

  describe('.isUndefined', function () {
    function testCase(v, expected) {
      it('for value \''+v+'\' expect \''+expected+'\'', function () {
        expect(sut.isUndefined(v)).to.equal(expected);
      });
    }

    testCase(undefined, true);
    testCase(null, false);
    testCase('', false);
    testCase(0, false);
  });

  describe('.first', function () {
    function testCase(v, expected) {
      it('for value \''+v+'\' expect \''+expected+'\'', function () {
        expect(sut.first(v)).to.equal(expected);
      });
    }

    testCase(undefined, null);
    testCase(null, null);
    testCase('', null);
    testCase(0, null);
    testCase([], null);
    testCase(['a'], 'a');
    testCase(['a', 'b'], 'a');
  });

  describe('.last', function () {
    function testCase(v, expected) {
      it('for value \''+v+'\' expect \''+expected+'\'', function () {
        expect(sut.last(v)).to.equal(expected);
      });
    }

    testCase(undefined, null);
    testCase(null, null);
    testCase('', null);
    testCase(0, null);
    testCase([], null);
    testCase(['a'], 'a');
    testCase(['a', 'b'], 'b');
  });

  describe('.uniqueId', function () {

    function testCase(expected) {
      it('expect \''+expected+'\'', function () {
        expect(sut.uniqueId()).to.equal(expected);
      });
    }

    uid = 0;
    testCase(0);
    testCase(1);
    testCase(2);
    testCase(3);
    testCase(4);
    testCase(5);
  });

});
