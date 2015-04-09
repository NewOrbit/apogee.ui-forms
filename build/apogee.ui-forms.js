(function(){function uiForm($compile, uiFormConfig) {
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
      options.required = !_.isUndefined(cAttrs.required);

      var container = uiFormConfig.form.dataContainer;
      var model = cPrefix + (container ? container + '.' : '') + options.model;
      var modelParts = options.model.split('.');
      var field = _.last(modelParts);
      var formFieldName = options.name || (field[0].toUpperCase() + field.substring(1));
      var formModel = cPrefix + (modelParts.length > 1 ? _.first(model.split('.')) + '.' : '') +
                      'form.' + formFieldName;

      ctrl.options = options;
      ctrl.model = model;
      ctrl.formFieldName = formFieldName;
      ctrl.elementId = 'fe_' + _.uniqueId();

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

          _.each(uiFormConfig.element.validators, function(v){
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpRm9ybS5qcyIsInVpRm9ybUNvbmZpZy5qcyIsInVpRm9ybUVsZW1lbnQuanMiLCJ1aUZvcm1JbnB1dC5qcyIsInVpRm9ybUxhYmVsLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwb2dlZS51aS1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHVpRm9ybSgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjb250cm9sbGVyID0gY0F0dHJzLmNvbnRyb2xsZXI7XG4gICAgICB2YXIgY1ByZWZpeCA9IGNvbnRyb2xsZXIgPyBjb250cm9sbGVyICsgJy4nIDogJyc7XG5cbiAgICAgIGN0cmwuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICBjdHJsLmNQcmVmaXggPSBjUHJlZml4O1xuXG4gICAgICBjRWwuYXR0cignbmFtZScsIGNQcmVmaXggKyAnZm9ybScpO1xuICAgICAgY0VsLmF0dHIoJ25nLXN1Ym1pdCcsIGNQcmVmaXggKyAnZm9ybS4kdmFsaWQgJiYgJyArIGNQcmVmaXggKyAnc3VibWl0KCknKTtcbiAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGF0dGVtcHRlZDogJyArIGNQcmVmaXggKyAnZm9ybS4kc3VibWl0dGVkIH0nKTtcbiAgICAgIGNFbC5hdHRyKCdub3ZhbGlkYXRlJywgJycpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZm9ybS5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZm9ybS5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtJyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNFbC5wcmVwZW5kKGNsb25lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiIsInZhciB1aUZvcm1Db25maWcgPSB7XG4gIGZvcm06IHtcbiAgICBkYXRhQ29udGFpbmVyOiAnZW50aXR5J1xuICB9LFxuICBlbGVtZW50OiB7XG4gICAgdmFsaWRhdG9yczogWydyZXF1aXJlZCcsICdlbWFpbCcsICdudW1iZXInXSxcbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgY29udGFpbmVyOiAnPHNwYW4+PC9zcGFuPicsXG4gICAgICAgIGVudHJ5OiAnPHNwYW4+PC9zcGFuPidcbiAgICAgIH1cbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICByZXF1aXJlZDogJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnLFxuICAgICAgZW1haWw6ICdJbnZhbGlkIGVtYWlsIGZvcm1hdCcsXG4gICAgICBudW1iZXI6ICdJbnZhbGlkIG51bWJlciBmb3JtYXQnXG4gICAgfVxuICB9XG59O1xuIiwiZnVuY3Rpb24gdWlGb3JtRWxlbWVudCgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiBbJ3VpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgY29udHJvbGxlciA6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybHMsICR0cmFuc2NsdWRlKSB7XG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIHZhciBjUHJlZml4ID0gZm9ybUN0cmwuY1ByZWZpeDtcblxuICAgICAgdmFyIGlucHV0T3B0aW9ucyA9IHNjb3BlLiRldmFsKGNBdHRycy51aUZvcm1FbGVtZW50KSB8fCB7IG1vZGVsOiBjQXR0cnMudWlGb3JtRWxlbWVudCB9O1xuXG4gICAgICBpZighaW5wdXRPcHRpb25zLm1vZGVsKSB0aHJvdyAnWW91IG11c3QgcHJvdmlkZSBhIGZpZWxkIG5hbWUgZm9yIGZvcm0tZWxlbWVudCc7XG5cbiAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHsgdmFsaWRhdGU6IHRydWUgfTtcbiAgICAgIHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBpbnB1dE9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5yZXF1aXJlZCA9ICFfLmlzVW5kZWZpbmVkKGNBdHRycy5yZXF1aXJlZCk7XG5cbiAgICAgIHZhciBjb250YWluZXIgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xuICAgICAgdmFyIG1vZGVsID0gY1ByZWZpeCArIChjb250YWluZXIgPyBjb250YWluZXIgKyAnLicgOiAnJykgKyBvcHRpb25zLm1vZGVsO1xuICAgICAgdmFyIG1vZGVsUGFydHMgPSBvcHRpb25zLm1vZGVsLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgZmllbGQgPSBfLmxhc3QobW9kZWxQYXJ0cyk7XG4gICAgICB2YXIgZm9ybUZpZWxkTmFtZSA9IG9wdGlvbnMubmFtZSB8fCAoZmllbGRbMF0udG9VcHBlckNhc2UoKSArIGZpZWxkLnN1YnN0cmluZygxKSk7XG4gICAgICB2YXIgZm9ybU1vZGVsID0gY1ByZWZpeCArIChtb2RlbFBhcnRzLmxlbmd0aCA+IDEgPyBfLmZpcnN0KG1vZGVsLnNwbGl0KCcuJykpICsgJy4nIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAnZm9ybS4nICsgZm9ybUZpZWxkTmFtZTtcblxuICAgICAgY3RybC5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIGN0cmwubW9kZWwgPSBtb2RlbDtcbiAgICAgIGN0cmwuZm9ybUZpZWxkTmFtZSA9IGZvcm1GaWVsZE5hbWU7XG4gICAgICBjdHJsLmVsZW1lbnRJZCA9ICdmZV8nICsgXy51bmlxdWVJZCgpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZWxlbWVudC5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnZhbGlkYXRlKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMucmVxdWlyZWQpIHtcbiAgICAgICAgICAgICAgY0VsLmFkZENsYXNzKCdyZXF1aXJlZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBjcmVhdGVFbnRyeSA9IGZ1bmN0aW9uICh0KXtcbiAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmVsZW1lbnQodWlGb3JtQ29uZmlnLmVsZW1lbnQudGVtcGxhdGVzLnZhbGlkYXRpb24uZW50cnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHVpRm9ybUNvbmZpZy5lbGVtZW50Lm1lc3NhZ2VzW3RdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBmb3JtTW9kZWwgKyAnLiRlcnJvci4nICsgdCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciBjb250YWluZXJFbCA9IGFuZ3VsYXIuZWxlbWVudCh1aUZvcm1Db25maWcuZWxlbWVudC50ZW1wbGF0ZXMudmFsaWRhdGlvbi5jb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignbmctaWYnLCBjUHJlZml4ICsgJ2Zvcm0uJHN1Ym1pdHRlZCcpO1xuXG4gICAgICAgICAgXy5lYWNoKHVpRm9ybUNvbmZpZy5lbGVtZW50LnZhbGlkYXRvcnMsIGZ1bmN0aW9uKHYpe1xuICAgICAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kKGNyZWF0ZUVudHJ5KHYpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjRWwuYXBwZW5kKGNvbnRhaW5lckVsKTtcblxuICAgICAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGludmFsaWQ6ICcgKyBmb3JtTW9kZWwgKyAnLiRpbnZhbGlkIH0nKTtcbiAgICAgIH1cblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tZWxlbWVudCcpO1xuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XG5cbiAgICAgICR0cmFuc2NsdWRlKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICAgIGNFbC5wcmVwZW5kKGNsb25lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVpRm9ybUlucHV0KCRjb21waWxlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBwcmlvcml0eTogMTAwMCxcbiAgICByZXF1aXJlOiAnXnVpRm9ybUVsZW1lbnQnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGZvcm1FbEN0cmwpIHtcblxuICAgICAgY0VsLmF0dHIoJ2lkJywgZm9ybUVsQ3RybC5lbGVtZW50SWQpO1xuICAgICAgY0VsLmF0dHIoJ25hbWUnLCBmb3JtRWxDdHJsLmZvcm1GaWVsZE5hbWUpO1xuICAgICAgY0VsLmF0dHIoJ25nLW1vZGVsJywgZm9ybUVsQ3RybC5tb2RlbCk7XG5cbiAgICAgIGlmIChmb3JtRWxDdHJsLm9wdGlvbnMucmVxdWlyZWQpIHtcbiAgICAgICAgY0VsLmF0dHIoJ3JlcXVpcmVkJywgJ3JlcXVpcmVkJyk7XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtLWlucHV0Jyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG4iLCJmdW5jdGlvbiB1aUZvcm1MYWJlbCgkY29tcGlsZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcHJpb3JpdHk6IDEwMDAsXG4gICAgcmVxdWlyZTogJ151aUZvcm1FbGVtZW50JyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBmb3JtRWxDdHJsKSB7XG5cbiAgICAgIGNFbC5hdHRyKCdmb3InLCBmb3JtRWxDdHJsLmVsZW1lbnRJZCk7XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtLWxhYmVsJyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcbiAgICB9XG4gIH07XG59XG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBvZ2VlLnVpLWZvcm1zJywgW10pXG5cbi5kaXJlY3RpdmUoJ3VpRm9ybScsIHVpRm9ybSlcbi5kaXJlY3RpdmUoJ3VpRm9ybUVsZW1lbnQnLCB1aUZvcm1FbGVtZW50KVxuLmRpcmVjdGl2ZSgndWlGb3JtSW5wdXQnLCB1aUZvcm1JbnB1dClcbi5kaXJlY3RpdmUoJ3VpRm9ybUxhYmVsJywgdWlGb3JtTGFiZWwpXG5cbi52YWx1ZSgndWlGb3JtQ29uZmlnJywgdWlGb3JtQ29uZmlnKVxuXG47XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=})();