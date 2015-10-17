(function(){
var uid = 0;

var utils = {
  isUndefined: function(v){ return typeof v === 'undefined'; },
  first: function(v) { return (v && v.length) ? v[0] : null; },
  last: function(v) { return (v && v.length) ? v[v.length - 1] : null; },
  uniqueId: function(){ return uid++; }
};

function uiForm($compile, uiFormConfig) {
  return {
    restrict: 'A',
    transclude: true,
    terminal: true,
    controller: function() {},
    link: function (scope, cEl, cAttrs, ctrl, $transclude) {
      var controller = cAttrs.controller;
      var cPrefix = controller ? controller + '.' : '';

      ctrl.controller = controller;
      ctrl.elements = {};
      ctrl.cPrefix = cPrefix;

      cEl.attr('name', cPrefix + 'form');
      cEl.attr('ng-submit', cPrefix + 'form.$valid && ' + cPrefix + 'submit()');
      cEl.attr('ng-class', '{ attempted: ' + cPrefix + 'form.$submitted }');
      cEl.attr('novalidate', '');

      if(uiFormConfig.form.class){
        cEl.addClass(uiFormConfig.form.class);
      }

      cEl.removeAttr('ui-form');

      var c = uiFormConfig.form.dataContainer;
      scope[c] = scope[c] || {};
      $compile(cEl)(scope);

      $transclude(function (clone) {
        cEl.prepend(clone);
      });
    }
  };
}

var uiFormConfig = {
  form: {
    dataContainer: 'entity'
  },
  element: {
    validators: ['required', 'email', 'number', 'match'],
    templates: {
      validation: {
        container: '<span></span>',
        entry: '<span></span>'
      }
    },
    messages: {
      required: 'This field is required',
      email: 'Invalid email format',
      number: 'Invalid number format',
      match: 'This field must match: '
    }
  }
};

function uiFormElement($compile, uiFormConfig) {
  return {
    restrict: 'A',
    require: ['uiFormElement', '^uiForm'],
    transclude: true,
    terminal: true,
    controller : function() {},
    link: function (scope, cEl, cAttrs, ctrls, $transclude) {
      var ctrl = ctrls[0];
      var formCtrl = ctrls[1];

      var cPrefix = formCtrl.cPrefix;

      var inputOptions = scope.$eval(cAttrs.uiFormElement) || { model: cAttrs.uiFormElement };

      if(!inputOptions.model) throw 'You must provide a field name for form-element';

      var defaultOptions = { validate: true };
      var options = angular.extend({}, defaultOptions, inputOptions);
      var messages = angular.copy(uiFormConfig.element.messages);

      options.required = !utils.isUndefined(cAttrs.required);
      messages.required = cAttrs.required || messages.required;

      if(cAttrs.match) {
        var matchp = cAttrs.match.split(':');
        options.match = matchp[0];
        messages.match = matchp.splice(1).join() || messages.match;
      }

      var container = uiFormConfig.form.dataContainer;
      var model = cPrefix + (container ? container + '.' : '') + options.model;
      var modelParts = options.model.split('.');
      var field = utils.last(modelParts);
      var formFieldName = options.name || (field[0].toUpperCase() + field.substring(1));
      var formModel = cPrefix + (modelParts.length > 1 ? utils.first(model.split('.')) + '.' : '') +
                      'form.' + formFieldName;

      ctrl.options = options;
      ctrl.model = model;
      ctrl.formFieldName = formFieldName;
      ctrl.elementId = 'fe_' + utils.uniqueId();

      if(uiFormConfig.element.class){
        cEl.addClass(uiFormConfig.element.class);
      }

      if (options.validate) {
          if (options.required) {
              cEl.addClass('required');
          }

          var createEntry = function (t){
            return angular.element(uiFormConfig.element.templates.validation.entry)
                          .text(messages[t])
                          .attr('ng-if', formModel + '.$error.' + t);
          };

          var containerEl = angular.element(uiFormConfig.element.templates.validation.container)
                                 .attr('ng-if', cPrefix + 'form.$submitted');

          uiFormConfig.element.validators.forEach(function(v){
            containerEl.append(createEntry(v));
          });
          cEl.append(containerEl);

          cEl.attr('ng-class', '{ invalid: ' + formModel + '.$invalid }');
      }

      formCtrl.elements[options.model] = ctrl;

      cEl.removeAttr('ui-form-element');
      $compile(cEl)(scope);

      $transclude(function (clone) {
          cEl.prepend(clone);
      });
    }
  };
}

function uiFormInput($compile) {
  return {
    restrict: 'A',
    priority: 1000,
    require: ['^uiFormElement', '^uiForm'],
    terminal: true,
    link: function (scope, cEl, cAttrs, ctrls) {
      var formElCtrl = ctrls[0];
      var formCtrl = ctrls[1];

      cEl.attr('id', formElCtrl.elementId);
      cEl.attr('name', formElCtrl.formFieldName);
      cEl.attr('ng-model', formElCtrl.model);

      if (formElCtrl.options.required) {
        cEl.attr('required', 'required');
      }
      if (formElCtrl.options.match) {
        var m = formElCtrl.options.match.split(':');
        var ref = m[0];
        var message = m.splice(1).join();
        var e = formCtrl.elements[ref];
        console.log(e);
        if(e) {
          cEl.attr('ng-match', e.model);
        }
      }

      cEl.removeAttr('ui-form-input');
      $compile(cEl)(scope);
    }
  };
}

function uiFormLabel($compile) {
  return {
    restrict: 'A',
    priority: 1000,
    require: '^uiFormElement',
    terminal: true,
    link: function (scope, cEl, cAttrs, formElCtrl) {

      formElCtrl.label = cEl.text();

      cEl.attr('for', formElCtrl.elementId);

      cEl.removeAttr('ui-form-label');
      $compile(cEl)(scope);
    }
  };
}

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

angular.module('apogee.ui-forms', [])

.directive('uiForm', uiForm)
.directive('uiFormElement', uiFormElement)
.directive('uiFormInput', uiFormInput)
.directive('uiFormLabel', uiFormLabel)

.value('uiFormConfig', uiFormConfig)

.directive('ngMatch', validator_match)

;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwidWlGb3JtLmpzIiwidWlGb3JtQ29uZmlnLmpzIiwidWlGb3JtRWxlbWVudC5qcyIsInVpRm9ybUlucHV0LmpzIiwidWlGb3JtTGFiZWwuanMiLCJ2YWxpZGF0b3IubWF0Y2guanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBvZ2VlLnVpLWZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHVpZCA9IDA7XG5cbnZhciB1dGlscyA9IHtcbiAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uKHYpeyByZXR1cm4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnOyB9LFxuICBmaXJzdDogZnVuY3Rpb24odikgeyByZXR1cm4gKHYgJiYgdi5sZW5ndGgpID8gdlswXSA6IG51bGw7IH0sXG4gIGxhc3Q6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuICh2ICYmIHYubGVuZ3RoKSA/IHZbdi5sZW5ndGggLSAxXSA6IG51bGw7IH0sXG4gIHVuaXF1ZUlkOiBmdW5jdGlvbigpeyByZXR1cm4gdWlkKys7IH1cbn07XG4iLCJmdW5jdGlvbiB1aUZvcm0oJGNvbXBpbGUsIHVpRm9ybUNvbmZpZykge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9LFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGN0cmwsICR0cmFuc2NsdWRlKSB7XG4gICAgICB2YXIgY29udHJvbGxlciA9IGNBdHRycy5jb250cm9sbGVyO1xuICAgICAgdmFyIGNQcmVmaXggPSBjb250cm9sbGVyID8gY29udHJvbGxlciArICcuJyA6ICcnO1xuXG4gICAgICBjdHJsLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyO1xuICAgICAgY3RybC5lbGVtZW50cyA9IHt9O1xuICAgICAgY3RybC5jUHJlZml4ID0gY1ByZWZpeDtcblxuICAgICAgY0VsLmF0dHIoJ25hbWUnLCBjUHJlZml4ICsgJ2Zvcm0nKTtcbiAgICAgIGNFbC5hdHRyKCduZy1zdWJtaXQnLCBjUHJlZml4ICsgJ2Zvcm0uJHZhbGlkICYmICcgKyBjUHJlZml4ICsgJ3N1Ym1pdCgpJyk7XG4gICAgICBjRWwuYXR0cignbmctY2xhc3MnLCAneyBhdHRlbXB0ZWQ6ICcgKyBjUHJlZml4ICsgJ2Zvcm0uJHN1Ym1pdHRlZCB9Jyk7XG4gICAgICBjRWwuYXR0cignbm92YWxpZGF0ZScsICcnKTtcblxuICAgICAgaWYodWlGb3JtQ29uZmlnLmZvcm0uY2xhc3Mpe1xuICAgICAgICBjRWwuYWRkQ2xhc3ModWlGb3JtQ29uZmlnLmZvcm0uY2xhc3MpO1xuICAgICAgfVxuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybScpO1xuXG4gICAgICB2YXIgYyA9IHVpRm9ybUNvbmZpZy5mb3JtLmRhdGFDb250YWluZXI7XG4gICAgICBzY29wZVtjXSA9IHNjb3BlW2NdIHx8IHt9O1xuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XG5cbiAgICAgICR0cmFuc2NsdWRlKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICBjRWwucHJlcGVuZChjbG9uZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCJ2YXIgdWlGb3JtQ29uZmlnID0ge1xuICBmb3JtOiB7XG4gICAgZGF0YUNvbnRhaW5lcjogJ2VudGl0eSdcbiAgfSxcbiAgZWxlbWVudDoge1xuICAgIHZhbGlkYXRvcnM6IFsncmVxdWlyZWQnLCAnZW1haWwnLCAnbnVtYmVyJywgJ21hdGNoJ10sXG4gICAgdGVtcGxhdGVzOiB7XG4gICAgICB2YWxpZGF0aW9uOiB7XG4gICAgICAgIGNvbnRhaW5lcjogJzxzcGFuPjwvc3Bhbj4nLFxuICAgICAgICBlbnRyeTogJzxzcGFuPjwvc3Bhbj4nXG4gICAgICB9XG4gICAgfSxcbiAgICBtZXNzYWdlczoge1xuICAgICAgcmVxdWlyZWQ6ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJyxcbiAgICAgIGVtYWlsOiAnSW52YWxpZCBlbWFpbCBmb3JtYXQnLFxuICAgICAgbnVtYmVyOiAnSW52YWxpZCBudW1iZXIgZm9ybWF0JyxcbiAgICAgIG1hdGNoOiAnVGhpcyBmaWVsZCBtdXN0IG1hdGNoOiAnXG4gICAgfVxuICB9XG59O1xuIiwiZnVuY3Rpb24gdWlGb3JtRWxlbWVudCgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiBbJ3VpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgY29udHJvbGxlciA6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybHMsICR0cmFuc2NsdWRlKSB7XG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIHZhciBjUHJlZml4ID0gZm9ybUN0cmwuY1ByZWZpeDtcblxuICAgICAgdmFyIGlucHV0T3B0aW9ucyA9IHNjb3BlLiRldmFsKGNBdHRycy51aUZvcm1FbGVtZW50KSB8fCB7IG1vZGVsOiBjQXR0cnMudWlGb3JtRWxlbWVudCB9O1xuXG4gICAgICBpZighaW5wdXRPcHRpb25zLm1vZGVsKSB0aHJvdyAnWW91IG11c3QgcHJvdmlkZSBhIGZpZWxkIG5hbWUgZm9yIGZvcm0tZWxlbWVudCc7XG5cbiAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHsgdmFsaWRhdGU6IHRydWUgfTtcbiAgICAgIHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBpbnB1dE9wdGlvbnMpO1xuICAgICAgdmFyIG1lc3NhZ2VzID0gYW5ndWxhci5jb3B5KHVpRm9ybUNvbmZpZy5lbGVtZW50Lm1lc3NhZ2VzKTtcblxuICAgICAgb3B0aW9ucy5yZXF1aXJlZCA9ICF1dGlscy5pc1VuZGVmaW5lZChjQXR0cnMucmVxdWlyZWQpO1xuICAgICAgbWVzc2FnZXMucmVxdWlyZWQgPSBjQXR0cnMucmVxdWlyZWQgfHwgbWVzc2FnZXMucmVxdWlyZWQ7XG5cbiAgICAgIGlmKGNBdHRycy5tYXRjaCkge1xuICAgICAgICB2YXIgbWF0Y2hwID0gY0F0dHJzLm1hdGNoLnNwbGl0KCc6Jyk7XG4gICAgICAgIG9wdGlvbnMubWF0Y2ggPSBtYXRjaHBbMF07XG4gICAgICAgIG1lc3NhZ2VzLm1hdGNoID0gbWF0Y2hwLnNwbGljZSgxKS5qb2luKCkgfHwgbWVzc2FnZXMubWF0Y2g7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250YWluZXIgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xuICAgICAgdmFyIG1vZGVsID0gY1ByZWZpeCArIChjb250YWluZXIgPyBjb250YWluZXIgKyAnLicgOiAnJykgKyBvcHRpb25zLm1vZGVsO1xuICAgICAgdmFyIG1vZGVsUGFydHMgPSBvcHRpb25zLm1vZGVsLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgZmllbGQgPSB1dGlscy5sYXN0KG1vZGVsUGFydHMpO1xuICAgICAgdmFyIGZvcm1GaWVsZE5hbWUgPSBvcHRpb25zLm5hbWUgfHwgKGZpZWxkWzBdLnRvVXBwZXJDYXNlKCkgKyBmaWVsZC5zdWJzdHJpbmcoMSkpO1xuICAgICAgdmFyIGZvcm1Nb2RlbCA9IGNQcmVmaXggKyAobW9kZWxQYXJ0cy5sZW5ndGggPiAxID8gdXRpbHMuZmlyc3QobW9kZWwuc3BsaXQoJy4nKSkgKyAnLicgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICdmb3JtLicgKyBmb3JtRmllbGROYW1lO1xuXG4gICAgICBjdHJsLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgY3RybC5tb2RlbCA9IG1vZGVsO1xuICAgICAgY3RybC5mb3JtRmllbGROYW1lID0gZm9ybUZpZWxkTmFtZTtcbiAgICAgIGN0cmwuZWxlbWVudElkID0gJ2ZlXycgKyB1dGlscy51bmlxdWVJZCgpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnZhbGlkYXRlKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgY0VsLmFkZENsYXNzKCdyZXF1aXJlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjcmVhdGVFbnRyeSA9IGZ1bmN0aW9uICh0KXtcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQodWlGb3JtQ29uZmlnLmVsZW1lbnQudGVtcGxhdGVzLnZhbGlkYXRpb24uZW50cnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KG1lc3NhZ2VzW3RdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBmb3JtTW9kZWwgKyAnLiRlcnJvci4nICsgdCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBjb250YWluZXJFbCA9IGFuZ3VsYXIuZWxlbWVudCh1aUZvcm1Db25maWcuZWxlbWVudC50ZW1wbGF0ZXMudmFsaWRhdGlvbi5jb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBjUHJlZml4ICsgJ2Zvcm0uJHN1Ym1pdHRlZCcpO1xuXG4gICAgICAgICAgdWlGb3JtQ29uZmlnLmVsZW1lbnQudmFsaWRhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kKGNyZWF0ZUVudHJ5KHYpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjRWwuYXBwZW5kKGNvbnRhaW5lckVsKTtcblxuICAgICAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGludmFsaWQ6ICcgKyBmb3JtTW9kZWwgKyAnLiRpbnZhbGlkIH0nKTtcbiAgICAgIH1cblxuICAgICAgZm9ybUN0cmwuZWxlbWVudHNbb3B0aW9ucy5tb2RlbF0gPSBjdHJsO1xuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1lbGVtZW50Jyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdWlGb3JtSW5wdXQoJGNvbXBpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHJlcXVpcmU6IFsnXnVpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgZm9ybUVsQ3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIGNFbC5hdHRyKCdpZCcsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcbiAgICAgIGNFbC5hdHRyKCduYW1lJywgZm9ybUVsQ3RybC5mb3JtRmllbGROYW1lKTtcbiAgICAgIGNFbC5hdHRyKCduZy1tb2RlbCcsIGZvcm1FbEN0cmwubW9kZWwpO1xuXG4gICAgICBpZiAoZm9ybUVsQ3RybC5vcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgIGNFbC5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKGZvcm1FbEN0cmwub3B0aW9ucy5tYXRjaCkge1xuICAgICAgICB2YXIgbSA9IGZvcm1FbEN0cmwub3B0aW9ucy5tYXRjaC5zcGxpdCgnOicpO1xuICAgICAgICB2YXIgcmVmID0gbVswXTtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBtLnNwbGljZSgxKS5qb2luKCk7XG4gICAgICAgIHZhciBlID0gZm9ybUN0cmwuZWxlbWVudHNbcmVmXTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIGlmKGUpIHtcbiAgICAgICAgICBjRWwuYXR0cignbmctbWF0Y2gnLCBlLm1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1pbnB1dCcpO1xuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XG4gICAgfVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdWlGb3JtTGFiZWwoJGNvbXBpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHJlcXVpcmU6ICdedWlGb3JtRWxlbWVudCcsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgZm9ybUVsQ3RybCkge1xuXG4gICAgICBmb3JtRWxDdHJsLmxhYmVsID0gY0VsLnRleHQoKTtcblxuICAgICAgY0VsLmF0dHIoJ2ZvcicsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tbGFiZWwnKTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHZhbGlkYXRvcl9tYXRjaCgkcGFyc2UpIHtcblxuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCdcbiAgICB9O1xuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgICAgICAvLyBpZiBuZ01vZGVsIGlzIG5vdCBkZWZpbmVkLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nXG4gICAgICAgIGlmICghY3RybCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciByZWYgPSBhdHRycy5uZ01hdGNoO1xuICAgICAgICBpZiAoIXJlZikgcmV0dXJuO1xuXG4gICAgICAgIHZhciByZWZlcmVuY2VGaWVsZCA9ICRwYXJzZShyZWYpO1xuXG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gcmVmZXJlbmNlRmllbGQoc2NvcGUpLFxuICAgICAgICAgICAgICAgIHYgPSAodmFsdWUgPT09IHRlbXApO1xuICAgICAgICAgICAgY3RybC4kc2V0VmFsaWRpdHkoJ21hdGNoJywgdik7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC4kcGFyc2Vycy51bnNoaWZ0KHZhbGlkYXRvcik7XG4gICAgICAgIGN0cmwuJGZvcm1hdHRlcnMucHVzaCh2YWxpZGF0b3IpO1xuICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnbmdNYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvcihjdHJsLiR2aWV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBvZ2VlLnVpLWZvcm1zJywgW10pXG5cbi5kaXJlY3RpdmUoJ3VpRm9ybScsIHVpRm9ybSlcbi5kaXJlY3RpdmUoJ3VpRm9ybUVsZW1lbnQnLCB1aUZvcm1FbGVtZW50KVxuLmRpcmVjdGl2ZSgndWlGb3JtSW5wdXQnLCB1aUZvcm1JbnB1dClcbi5kaXJlY3RpdmUoJ3VpRm9ybUxhYmVsJywgdWlGb3JtTGFiZWwpXG5cbi52YWx1ZSgndWlGb3JtQ29uZmlnJywgdWlGb3JtQ29uZmlnKVxuXG4uZGlyZWN0aXZlKCduZ01hdGNoJywgdmFsaWRhdG9yX21hdGNoKVxuXG47XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
})();