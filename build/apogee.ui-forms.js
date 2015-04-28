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
      ctrl.cPrefix = cPrefix;

      cEl.attr('name', cPrefix + 'form');
      cEl.attr('ng-submit', cPrefix + 'form.$valid && ' + cPrefix + 'submit()');
      cEl.attr('ng-class', '{ attempted: ' + cPrefix + 'form.$submitted }');
      cEl.attr('novalidate', '');

      if(uiFormConfig.form.class){
        cEl.addClass(uiFormConfig.form.class);
      }

      cEl.removeAttr('ui-form');
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
    validators: ['required', 'email', 'number'],
    templates: {
      validation: {
        container: '<span></span>',
        entry: '<span></span>'
      }
    },
    messages: {
      required: 'This field is required',
      email: 'Invalid email format',
      number: 'Invalid number format'
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
      options.required = !utils.isUndefined(cAttrs.required);

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
                          .text(uiFormConfig.element.messages[t])
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
    require: '^uiFormElement',
    terminal: true,
    link: function (scope, cEl, cAttrs, formElCtrl) {

      cEl.attr('id', formElCtrl.elementId);
      cEl.attr('name', formElCtrl.formFieldName);
      cEl.attr('ng-model', formElCtrl.model);

      if (formElCtrl.options.required) {
        cEl.attr('required', 'required');
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

      cEl.attr('for', formElCtrl.elementId);

      cEl.removeAttr('ui-form-label');
      $compile(cEl)(scope);
    }
  };
}

angular.module('apogee.ui-forms', [])

.directive('uiForm', uiForm)
.directive('uiFormElement', uiFormElement)
.directive('uiFormInput', uiFormInput)
.directive('uiFormLabel', uiFormLabel)

.value('uiFormConfig', uiFormConfig)

;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLmpzIiwidWlGb3JtLmpzIiwidWlGb3JtQ29uZmlnLmpzIiwidWlGb3JtRWxlbWVudC5qcyIsInVpRm9ybUlucHV0LmpzIiwidWlGb3JtTGFiZWwuanMiLCJtYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBvZ2VlLnVpLWZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHVpZCA9IDA7XG5cbnZhciB1dGlscyA9IHtcbiAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uKHYpeyByZXR1cm4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnOyB9LFxuICBmaXJzdDogZnVuY3Rpb24odikgeyByZXR1cm4gKHYgJiYgdi5sZW5ndGgpID8gdlswXSA6IG51bGw7IH0sXG4gIGxhc3Q6IGZ1bmN0aW9uKHYpIHsgcmV0dXJuICh2ICYmIHYubGVuZ3RoKSA/IHZbdi5sZW5ndGggLSAxXSA6IG51bGw7IH0sXG4gIHVuaXF1ZUlkOiBmdW5jdGlvbigpeyByZXR1cm4gdWlkKys7IH1cbn07XG4iLCJmdW5jdGlvbiB1aUZvcm0oJGNvbXBpbGUsIHVpRm9ybUNvbmZpZykge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgIHRlcm1pbmFsOiB0cnVlLFxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oKSB7fSxcclxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGN0cmwsICR0cmFuc2NsdWRlKSB7XHJcbiAgICAgIHZhciBjb250cm9sbGVyID0gY0F0dHJzLmNvbnRyb2xsZXI7XHJcbiAgICAgIHZhciBjUHJlZml4ID0gY29udHJvbGxlciA/IGNvbnRyb2xsZXIgKyAnLicgOiAnJztcclxuXHJcbiAgICAgIGN0cmwuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XHJcbiAgICAgIGN0cmwuY1ByZWZpeCA9IGNQcmVmaXg7XHJcblxyXG4gICAgICBjRWwuYXR0cignbmFtZScsIGNQcmVmaXggKyAnZm9ybScpO1xyXG4gICAgICBjRWwuYXR0cignbmctc3VibWl0JywgY1ByZWZpeCArICdmb3JtLiR2YWxpZCAmJiAnICsgY1ByZWZpeCArICdzdWJtaXQoKScpO1xyXG4gICAgICBjRWwuYXR0cignbmctY2xhc3MnLCAneyBhdHRlbXB0ZWQ6ICcgKyBjUHJlZml4ICsgJ2Zvcm0uJHN1Ym1pdHRlZCB9Jyk7XHJcbiAgICAgIGNFbC5hdHRyKCdub3ZhbGlkYXRlJywgJycpO1xyXG5cclxuICAgICAgaWYodWlGb3JtQ29uZmlnLmZvcm0uY2xhc3Mpe1xyXG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZm9ybS5jbGFzcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtJyk7XHJcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xyXG5cclxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XHJcbiAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcbiIsInZhciB1aUZvcm1Db25maWcgPSB7XHJcbiAgZm9ybToge1xyXG4gICAgZGF0YUNvbnRhaW5lcjogJ2VudGl0eSdcclxuICB9LFxyXG4gIGVsZW1lbnQ6IHtcclxuICAgIHZhbGlkYXRvcnM6IFsncmVxdWlyZWQnLCAnZW1haWwnLCAnbnVtYmVyJ10sXHJcbiAgICB0ZW1wbGF0ZXM6IHtcclxuICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgIGNvbnRhaW5lcjogJzxzcGFuPjwvc3Bhbj4nLFxyXG4gICAgICAgIGVudHJ5OiAnPHNwYW4+PC9zcGFuPidcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgIHJlcXVpcmVkOiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCcsXHJcbiAgICAgIGVtYWlsOiAnSW52YWxpZCBlbWFpbCBmb3JtYXQnLFxyXG4gICAgICBudW1iZXI6ICdJbnZhbGlkIG51bWJlciBmb3JtYXQnXHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG4iLCJmdW5jdGlvbiB1aUZvcm1FbGVtZW50KCRjb21waWxlLCB1aUZvcm1Db25maWcpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgIHJlcXVpcmU6IFsndWlGb3JtRWxlbWVudCcsICdedWlGb3JtJ10sXHJcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgdGVybWluYWw6IHRydWUsXHJcbiAgICBjb250cm9sbGVyIDogZnVuY3Rpb24oKSB7fSxcclxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGN0cmxzLCAkdHJhbnNjbHVkZSkge1xyXG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xyXG4gICAgICB2YXIgZm9ybUN0cmwgPSBjdHJsc1sxXTtcclxuXHJcbiAgICAgIHZhciBjUHJlZml4ID0gZm9ybUN0cmwuY1ByZWZpeDtcclxuXHJcbiAgICAgIHZhciBpbnB1dE9wdGlvbnMgPSBzY29wZS4kZXZhbChjQXR0cnMudWlGb3JtRWxlbWVudCkgfHwgeyBtb2RlbDogY0F0dHJzLnVpRm9ybUVsZW1lbnQgfTtcclxuXHJcbiAgICAgIGlmKCFpbnB1dE9wdGlvbnMubW9kZWwpIHRocm93ICdZb3UgbXVzdCBwcm92aWRlIGEgZmllbGQgbmFtZSBmb3IgZm9ybS1lbGVtZW50JztcclxuXHJcbiAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHsgdmFsaWRhdGU6IHRydWUgfTtcclxuICAgICAgdmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIGlucHV0T3B0aW9ucyk7XHJcbiAgICAgIG9wdGlvbnMucmVxdWlyZWQgPSAhdXRpbHMuaXNVbmRlZmluZWQoY0F0dHJzLnJlcXVpcmVkKTtcclxuXHJcbiAgICAgIHZhciBjb250YWluZXIgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xyXG4gICAgICB2YXIgbW9kZWwgPSBjUHJlZml4ICsgKGNvbnRhaW5lciA/IGNvbnRhaW5lciArICcuJyA6ICcnKSArIG9wdGlvbnMubW9kZWw7XHJcbiAgICAgIHZhciBtb2RlbFBhcnRzID0gb3B0aW9ucy5tb2RlbC5zcGxpdCgnLicpO1xyXG4gICAgICB2YXIgZmllbGQgPSB1dGlscy5sYXN0KG1vZGVsUGFydHMpO1xyXG4gICAgICB2YXIgZm9ybUZpZWxkTmFtZSA9IG9wdGlvbnMubmFtZSB8fCAoZmllbGRbMF0udG9VcHBlckNhc2UoKSArIGZpZWxkLnN1YnN0cmluZygxKSk7XHJcbiAgICAgIHZhciBmb3JtTW9kZWwgPSBjUHJlZml4ICsgKG1vZGVsUGFydHMubGVuZ3RoID4gMSA/IHV0aWxzLmZpcnN0KG1vZGVsLnNwbGl0KCcuJykpICsgJy4nIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgICAgICdmb3JtLicgKyBmb3JtRmllbGROYW1lO1xyXG5cclxuICAgICAgY3RybC5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgY3RybC5tb2RlbCA9IG1vZGVsO1xyXG4gICAgICBjdHJsLmZvcm1GaWVsZE5hbWUgPSBmb3JtRmllbGROYW1lO1xyXG4gICAgICBjdHJsLmVsZW1lbnRJZCA9ICdmZV8nICsgdXRpbHMudW5pcXVlSWQoKTtcclxuXHJcbiAgICAgIGlmKHVpRm9ybUNvbmZpZy5lbGVtZW50LmNsYXNzKXtcclxuICAgICAgICBjRWwuYWRkQ2xhc3ModWlGb3JtQ29uZmlnLmVsZW1lbnQuY2xhc3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy52YWxpZGF0ZSkge1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMucmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICBjRWwuYWRkQ2xhc3MoJ3JlcXVpcmVkJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGNyZWF0ZUVudHJ5ID0gZnVuY3Rpb24gKHQpe1xyXG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KHVpRm9ybUNvbmZpZy5lbGVtZW50LnRlbXBsYXRlcy52YWxpZGF0aW9uLmVudHJ5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHVpRm9ybUNvbmZpZy5lbGVtZW50Lm1lc3NhZ2VzW3RdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCduZy1pZicsIGZvcm1Nb2RlbCArICcuJGVycm9yLicgKyB0KTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIGNvbnRhaW5lckVsID0gYW5ndWxhci5lbGVtZW50KHVpRm9ybUNvbmZpZy5lbGVtZW50LnRlbXBsYXRlcy52YWxpZGF0aW9uLmNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ25nLWlmJywgY1ByZWZpeCArICdmb3JtLiRzdWJtaXR0ZWQnKTtcclxuXHJcbiAgICAgICAgICB1aUZvcm1Db25maWcuZWxlbWVudC52YWxpZGF0b3JzLmZvckVhY2goZnVuY3Rpb24odil7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZChjcmVhdGVFbnRyeSh2KSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNFbC5hcHBlbmQoY29udGFpbmVyRWwpO1xyXG5cclxuICAgICAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGludmFsaWQ6ICcgKyBmb3JtTW9kZWwgKyAnLiRpbnZhbGlkIH0nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tZWxlbWVudCcpO1xyXG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcclxuXHJcbiAgICAgICR0cmFuc2NsdWRlKGZ1bmN0aW9uIChjbG9uZSkge1xyXG4gICAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcbiIsImZ1bmN0aW9uIHVpRm9ybUlucHV0KCRjb21waWxlKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICBwcmlvcml0eTogMTAwMCxcclxuICAgIHJlcXVpcmU6ICdedWlGb3JtRWxlbWVudCcsXHJcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcclxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGZvcm1FbEN0cmwpIHtcclxuXHJcbiAgICAgIGNFbC5hdHRyKCdpZCcsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcclxuICAgICAgY0VsLmF0dHIoJ25hbWUnLCBmb3JtRWxDdHJsLmZvcm1GaWVsZE5hbWUpO1xyXG4gICAgICBjRWwuYXR0cignbmctbW9kZWwnLCBmb3JtRWxDdHJsLm1vZGVsKTtcclxuXHJcbiAgICAgIGlmIChmb3JtRWxDdHJsLm9wdGlvbnMucmVxdWlyZWQpIHtcclxuICAgICAgICBjRWwuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0taW5wdXQnKTtcclxuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCJmdW5jdGlvbiB1aUZvcm1MYWJlbCgkY29tcGlsZSkge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgcHJpb3JpdHk6IDEwMDAsXHJcbiAgICByZXF1aXJlOiAnXnVpRm9ybUVsZW1lbnQnLFxyXG4gICAgdGVybWluYWw6IHRydWUsXHJcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBmb3JtRWxDdHJsKSB7XHJcblxyXG4gICAgICBjRWwuYXR0cignZm9yJywgZm9ybUVsQ3RybC5lbGVtZW50SWQpO1xyXG5cclxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tbGFiZWwnKTtcclxuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBvZ2VlLnVpLWZvcm1zJywgW10pXHJcblxyXG4uZGlyZWN0aXZlKCd1aUZvcm0nLCB1aUZvcm0pXHJcbi5kaXJlY3RpdmUoJ3VpRm9ybUVsZW1lbnQnLCB1aUZvcm1FbGVtZW50KVxyXG4uZGlyZWN0aXZlKCd1aUZvcm1JbnB1dCcsIHVpRm9ybUlucHV0KVxyXG4uZGlyZWN0aXZlKCd1aUZvcm1MYWJlbCcsIHVpRm9ybUxhYmVsKVxyXG5cclxuLnZhbHVlKCd1aUZvcm1Db25maWcnLCB1aUZvcm1Db25maWcpXHJcblxyXG47XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
})();