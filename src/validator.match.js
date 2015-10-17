function validator_match($parse) {

    var directive = {
        link: link,
        restrict: 'A',
        require: '?ngModel'
    };
    return directive;

    function link(scope, elem, attrs, ctrl) {
        // if ngModel is not defined, we don't need to do anything
        if (!ctrl) return;

        var ref = attrs.ngMatch;
        if (!ref) return;

        var referenceField = $parse(ref);

        var validator = function (value) {
            var temp = referenceField(scope),
                v = (value === temp);
            ctrl.$setValidity('match', v);
            return value;
        };

        ctrl.$parsers.unshift(validator);
        ctrl.$formatters.push(validator);
        attrs.$observe('ngMatch', function () {
            validator(ctrl.$viewValue);
        });
    }
}
