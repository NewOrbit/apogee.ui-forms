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
      match: 'This field must match'
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
        var fieldToMatch = matchp[0];
        options.match = fieldToMatch;
        messages.match = matchp.splice(1).join().trim() ||
          (messages.match + ' \'{{ form.$labels.'+fieldToMatch+' }}\'');
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

      if (options.required) {
          cEl.addClass('required');
      }

      if (options.validate) {
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

      scope.form.$labels = scope.form.$labels || {};
      scope.form.$labels[formElCtrl.options.model] = cEl.text();

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwidWlGb3JtLmpzIiwidWlGb3JtQ29uZmlnLmpzIiwidWlGb3JtRWxlbWVudC5qcyIsInVpRm9ybUlucHV0LmpzIiwidWlGb3JtTGFiZWwuanMiLCJ2YWxpZGF0b3IubWF0Y2guanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwb2dlZS51aS1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1aWQgPSAwO1xuXG52YXIgdXRpbHMgPSB7XG4gIGlzVW5kZWZpbmVkOiBmdW5jdGlvbih2KXsgcmV0dXJuIHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJzsgfSxcbiAgZmlyc3Q6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuICh2ICYmIHYubGVuZ3RoKSA/IHZbMF0gOiBudWxsOyB9LFxuICBsYXN0OiBmdW5jdGlvbih2KSB7IHJldHVybiAodiAmJiB2Lmxlbmd0aCkgPyB2W3YubGVuZ3RoIC0gMV0gOiBudWxsOyB9LFxuICB1bmlxdWVJZDogZnVuY3Rpb24oKXsgcmV0dXJuIHVpZCsrOyB9XG59O1xuIiwiZnVuY3Rpb24gdWlGb3JtKCRjb21waWxlLCB1aUZvcm1Db25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7fSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBjdHJsLCAkdHJhbnNjbHVkZSkge1xuICAgICAgdmFyIGNvbnRyb2xsZXIgPSBjQXR0cnMuY29udHJvbGxlcjtcbiAgICAgIHZhciBjUHJlZml4ID0gY29udHJvbGxlciA/IGNvbnRyb2xsZXIgKyAnLicgOiAnJztcblxuICAgICAgY3RybC5jb250cm9sbGVyID0gY29udHJvbGxlcjtcbiAgICAgIGN0cmwuZWxlbWVudHMgPSB7fTtcbiAgICAgIGN0cmwuY1ByZWZpeCA9IGNQcmVmaXg7XG5cbiAgICAgIGNFbC5hdHRyKCduYW1lJywgY1ByZWZpeCArICdmb3JtJyk7XG4gICAgICBjRWwuYXR0cignbmctc3VibWl0JywgY1ByZWZpeCArICdmb3JtLiR2YWxpZCAmJiAnICsgY1ByZWZpeCArICdzdWJtaXQoKScpO1xuICAgICAgY0VsLmF0dHIoJ25nLWNsYXNzJywgJ3sgYXR0ZW1wdGVkOiAnICsgY1ByZWZpeCArICdmb3JtLiRzdWJtaXR0ZWQgfScpO1xuICAgICAgY0VsLmF0dHIoJ25vdmFsaWRhdGUnLCAnJyk7XG5cbiAgICAgIGlmKHVpRm9ybUNvbmZpZy5mb3JtLmNsYXNzKXtcbiAgICAgICAgY0VsLmFkZENsYXNzKHVpRm9ybUNvbmZpZy5mb3JtLmNsYXNzKTtcbiAgICAgIH1cblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0nKTtcblxuICAgICAgdmFyIGMgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xuICAgICAgc2NvcGVbY10gPSBzY29wZVtjXSB8fCB7fTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuXG4gICAgICAkdHJhbnNjbHVkZShmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIiwidmFyIHVpRm9ybUNvbmZpZyA9IHtcbiAgZm9ybToge1xuICAgIGRhdGFDb250YWluZXI6ICdlbnRpdHknXG4gIH0sXG4gIGVsZW1lbnQ6IHtcbiAgICB2YWxpZGF0b3JzOiBbJ3JlcXVpcmVkJywgJ2VtYWlsJywgJ251bWJlcicsICdtYXRjaCddLFxuICAgIHRlbXBsYXRlczoge1xuICAgICAgdmFsaWRhdGlvbjoge1xuICAgICAgICBjb250YWluZXI6ICc8c3Bhbj48L3NwYW4+JyxcbiAgICAgICAgZW50cnk6ICc8c3Bhbj48L3NwYW4+J1xuICAgICAgfVxuICAgIH0sXG4gICAgbWVzc2FnZXM6IHtcbiAgICAgIHJlcXVpcmVkOiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCcsXG4gICAgICBlbWFpbDogJ0ludmFsaWQgZW1haWwgZm9ybWF0JyxcbiAgICAgIG51bWJlcjogJ0ludmFsaWQgbnVtYmVyIGZvcm1hdCcsXG4gICAgICBtYXRjaDogJ1RoaXMgZmllbGQgbXVzdCBtYXRjaCdcbiAgICB9XG4gIH1cbn07XG4iLCJmdW5jdGlvbiB1aUZvcm1FbGVtZW50KCRjb21waWxlLCB1aUZvcm1Db25maWcpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcXVpcmU6IFsndWlGb3JtRWxlbWVudCcsICdedWlGb3JtJ10sXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBjb250cm9sbGVyIDogZnVuY3Rpb24oKSB7fSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBjdHJscywgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjdHJsID0gY3RybHNbMF07XG4gICAgICB2YXIgZm9ybUN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgdmFyIGNQcmVmaXggPSBmb3JtQ3RybC5jUHJlZml4O1xuXG4gICAgICB2YXIgaW5wdXRPcHRpb25zID0gc2NvcGUuJGV2YWwoY0F0dHJzLnVpRm9ybUVsZW1lbnQpIHx8IHsgbW9kZWw6IGNBdHRycy51aUZvcm1FbGVtZW50IH07XG5cbiAgICAgIGlmKCFpbnB1dE9wdGlvbnMubW9kZWwpIHRocm93ICdZb3UgbXVzdCBwcm92aWRlIGEgZmllbGQgbmFtZSBmb3IgZm9ybS1lbGVtZW50JztcblxuICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0geyB2YWxpZGF0ZTogdHJ1ZSB9O1xuICAgICAgdmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIGlucHV0T3B0aW9ucyk7XG4gICAgICB2YXIgbWVzc2FnZXMgPSBhbmd1bGFyLmNvcHkodWlGb3JtQ29uZmlnLmVsZW1lbnQubWVzc2FnZXMpO1xuXG4gICAgICBvcHRpb25zLnJlcXVpcmVkID0gIXV0aWxzLmlzVW5kZWZpbmVkKGNBdHRycy5yZXF1aXJlZCk7XG4gICAgICBtZXNzYWdlcy5yZXF1aXJlZCA9IGNBdHRycy5yZXF1aXJlZCB8fCBtZXNzYWdlcy5yZXF1aXJlZDtcblxuICAgICAgaWYoY0F0dHJzLm1hdGNoKSB7XG4gICAgICAgIHZhciBtYXRjaHAgPSBjQXR0cnMubWF0Y2guc3BsaXQoJzonKTtcbiAgICAgICAgdmFyIGZpZWxkVG9NYXRjaCA9IG1hdGNocFswXTtcbiAgICAgICAgb3B0aW9ucy5tYXRjaCA9IGZpZWxkVG9NYXRjaDtcbiAgICAgICAgbWVzc2FnZXMubWF0Y2ggPSBtYXRjaHAuc3BsaWNlKDEpLmpvaW4oKS50cmltKCkgfHxcbiAgICAgICAgICAobWVzc2FnZXMubWF0Y2ggKyAnIFxcJ3t7IGZvcm0uJGxhYmVscy4nK2ZpZWxkVG9NYXRjaCsnIH19XFwnJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250YWluZXIgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xuICAgICAgdmFyIG1vZGVsID0gY1ByZWZpeCArIChjb250YWluZXIgPyBjb250YWluZXIgKyAnLicgOiAnJykgKyBvcHRpb25zLm1vZGVsO1xuICAgICAgdmFyIG1vZGVsUGFydHMgPSBvcHRpb25zLm1vZGVsLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgZmllbGQgPSB1dGlscy5sYXN0KG1vZGVsUGFydHMpO1xuICAgICAgdmFyIGZvcm1GaWVsZE5hbWUgPSBvcHRpb25zLm5hbWUgfHwgKGZpZWxkWzBdLnRvVXBwZXJDYXNlKCkgKyBmaWVsZC5zdWJzdHJpbmcoMSkpO1xuICAgICAgdmFyIGZvcm1Nb2RlbCA9IGNQcmVmaXggKyAobW9kZWxQYXJ0cy5sZW5ndGggPiAxID8gdXRpbHMuZmlyc3QobW9kZWwuc3BsaXQoJy4nKSkgKyAnLicgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICdmb3JtLicgKyBmb3JtRmllbGROYW1lO1xuXG4gICAgICBjdHJsLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgY3RybC5tb2RlbCA9IG1vZGVsO1xuICAgICAgY3RybC5mb3JtRmllbGROYW1lID0gZm9ybUZpZWxkTmFtZTtcbiAgICAgIGN0cmwuZWxlbWVudElkID0gJ2ZlXycgKyB1dGlscy51bmlxdWVJZCgpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgICAgY0VsLmFkZENsYXNzKCdyZXF1aXJlZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy52YWxpZGF0ZSkge1xuICAgICAgICAgIHZhciBjcmVhdGVFbnRyeSA9IGZ1bmN0aW9uICh0KXtcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQodWlGb3JtQ29uZmlnLmVsZW1lbnQudGVtcGxhdGVzLnZhbGlkYXRpb24uZW50cnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KG1lc3NhZ2VzW3RdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBmb3JtTW9kZWwgKyAnLiRlcnJvci4nICsgdCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBjb250YWluZXJFbCA9IGFuZ3VsYXIuZWxlbWVudCh1aUZvcm1Db25maWcuZWxlbWVudC50ZW1wbGF0ZXMudmFsaWRhdGlvbi5jb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBjUHJlZml4ICsgJ2Zvcm0uJHN1Ym1pdHRlZCcpO1xuXG4gICAgICAgICAgdWlGb3JtQ29uZmlnLmVsZW1lbnQudmFsaWRhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kKGNyZWF0ZUVudHJ5KHYpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjRWwuYXBwZW5kKGNvbnRhaW5lckVsKTtcblxuICAgICAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGludmFsaWQ6ICcgKyBmb3JtTW9kZWwgKyAnLiRpbnZhbGlkIH0nKTtcbiAgICAgIH1cblxuICAgICAgZm9ybUN0cmwuZWxlbWVudHNbb3B0aW9ucy5tb2RlbF0gPSBjdHJsO1xuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1lbGVtZW50Jyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdWlGb3JtSW5wdXQoJGNvbXBpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHJlcXVpcmU6IFsnXnVpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGN0cmxzKSB7XG4gICAgICB2YXIgZm9ybUVsQ3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIGNFbC5hdHRyKCdpZCcsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcbiAgICAgIGNFbC5hdHRyKCduYW1lJywgZm9ybUVsQ3RybC5mb3JtRmllbGROYW1lKTtcbiAgICAgIGNFbC5hdHRyKCduZy1tb2RlbCcsIGZvcm1FbEN0cmwubW9kZWwpO1xuXG4gICAgICBpZiAoZm9ybUVsQ3RybC5vcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgIGNFbC5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKGZvcm1FbEN0cmwub3B0aW9ucy5tYXRjaCkge1xuICAgICAgICB2YXIgbSA9IGZvcm1FbEN0cmwub3B0aW9ucy5tYXRjaC5zcGxpdCgnOicpO1xuICAgICAgICB2YXIgcmVmID0gbVswXTtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBtLnNwbGljZSgxKS5qb2luKCk7XG4gICAgICAgIHZhciBlID0gZm9ybUN0cmwuZWxlbWVudHNbcmVmXTtcbiAgICAgICAgaWYoZSkge1xuICAgICAgICAgIGNFbC5hdHRyKCduZy1tYXRjaCcsIGUubW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtLWlucHV0Jyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG4iLCJmdW5jdGlvbiB1aUZvcm1MYWJlbCgkY29tcGlsZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcHJpb3JpdHk6IDEwMDAsXG4gICAgcmVxdWlyZTogJ151aUZvcm1FbGVtZW50JyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBmb3JtRWxDdHJsKSB7XG5cbiAgICAgIHNjb3BlLmZvcm0uJGxhYmVscyA9IHNjb3BlLmZvcm0uJGxhYmVscyB8fCB7fTtcbiAgICAgIHNjb3BlLmZvcm0uJGxhYmVsc1tmb3JtRWxDdHJsLm9wdGlvbnMubW9kZWxdID0gY0VsLnRleHQoKTtcblxuICAgICAgY0VsLmF0dHIoJ2ZvcicsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tbGFiZWwnKTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHZhbGlkYXRvcl9tYXRjaCgkcGFyc2UpIHtcblxuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIGxpbms6IGxpbmssXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICc/bmdNb2RlbCdcbiAgICB9O1xuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuICAgICAgICAvLyBpZiBuZ01vZGVsIGlzIG5vdCBkZWZpbmVkLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nXG4gICAgICAgIGlmICghY3RybCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciByZWYgPSBhdHRycy5uZ01hdGNoO1xuICAgICAgICBpZiAoIXJlZikgcmV0dXJuO1xuXG4gICAgICAgIHZhciByZWZlcmVuY2VGaWVsZCA9ICRwYXJzZShyZWYpO1xuXG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wID0gcmVmZXJlbmNlRmllbGQoc2NvcGUpLFxuICAgICAgICAgICAgICAgIHYgPSAodmFsdWUgPT09IHRlbXApO1xuICAgICAgICAgICAgY3RybC4kc2V0VmFsaWRpdHkoJ21hdGNoJywgdik7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC4kcGFyc2Vycy51bnNoaWZ0KHZhbGlkYXRvcik7XG4gICAgICAgIGN0cmwuJGZvcm1hdHRlcnMucHVzaCh2YWxpZGF0b3IpO1xuICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnbmdNYXRjaCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvcihjdHJsLiR2aWV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBvZ2VlLnVpLWZvcm1zJywgW10pXG5cbi5kaXJlY3RpdmUoJ3VpRm9ybScsIHVpRm9ybSlcbi5kaXJlY3RpdmUoJ3VpRm9ybUVsZW1lbnQnLCB1aUZvcm1FbGVtZW50KVxuLmRpcmVjdGl2ZSgndWlGb3JtSW5wdXQnLCB1aUZvcm1JbnB1dClcbi5kaXJlY3RpdmUoJ3VpRm9ybUxhYmVsJywgdWlGb3JtTGFiZWwpXG5cbi52YWx1ZSgndWlGb3JtQ29uZmlnJywgdWlGb3JtQ29uZmlnKVxuXG4uZGlyZWN0aXZlKCduZ01hdGNoJywgdmFsaWRhdG9yX21hdGNoKVxuXG47XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
})();