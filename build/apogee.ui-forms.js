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
      var formModel = (modelParts.length > 1 ? _.first(model.split('.')) + '.' : '') +
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpRm9ybS5qcyIsInVpRm9ybUNvbmZpZy5qcyIsInVpRm9ybUVsZW1lbnQuanMiLCJ1aUZvcm1JbnB1dC5qcyIsInVpRm9ybUxhYmVsLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwb2dlZS51aS1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHVpRm9ybSgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjb250cm9sbGVyID0gY0F0dHJzLmNvbnRyb2xsZXI7XG4gICAgICB2YXIgY1ByZWZpeCA9IGNvbnRyb2xsZXIgPyBjb250cm9sbGVyICsgJy4nIDogJyc7XG5cbiAgICAgIGN0cmwuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICBjdHJsLmNQcmVmaXggPSBjUHJlZml4O1xuXG4gICAgICBjRWwuYXR0cignbmFtZScsIGNQcmVmaXggKyAnZm9ybScpO1xuICAgICAgY0VsLmF0dHIoJ25nLXN1Ym1pdCcsIGNQcmVmaXggKyAnZm9ybS4kdmFsaWQgJiYgJyArIGNQcmVmaXggKyAnc3VibWl0KCknKTtcbiAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGF0dGVtcHRlZDogJyArIGNQcmVmaXggKyAnZm9ybS4kc3VibWl0dGVkIH0nKTtcbiAgICAgIGNFbC5hdHRyKCdub3ZhbGlkYXRlJywgJycpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZm9ybS5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZm9ybS5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtJyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNFbC5wcmVwZW5kKGNsb25lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiIsInZhciB1aUZvcm1Db25maWcgPSB7XG4gIGZvcm06IHtcbiAgICBkYXRhQ29udGFpbmVyOiAnZW50aXR5J1xuICB9LFxuICBlbGVtZW50OiB7XG4gICAgdmFsaWRhdG9yczogWydyZXF1aXJlZCcsICdlbWFpbCcsICdudW1iZXInXSxcbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgY29udGFpbmVyOiAnPHNwYW4+PC9zcGFuPicsXG4gICAgICAgIGVudHJ5OiAnPHNwYW4+PC9zcGFuPidcbiAgICAgIH1cbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICByZXF1aXJlZDogJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnLFxuICAgICAgZW1haWw6ICdJbnZhbGlkIGVtYWlsIGZvcm1hdCcsXG4gICAgICBudW1iZXI6ICdJbnZhbGlkIG51bWJlciBmb3JtYXQnXG4gICAgfVxuICB9XG59O1xuIiwiZnVuY3Rpb24gdWlGb3JtRWxlbWVudCgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiBbJ3VpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgY29udHJvbGxlciA6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybHMsICR0cmFuc2NsdWRlKSB7XG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIHZhciBjUHJlZml4ID0gZm9ybUN0cmwuY1ByZWZpeDtcblxuICAgICAgdmFyIGlucHV0T3B0aW9ucyA9IHNjb3BlLiRldmFsKGNBdHRycy51aUZvcm1FbGVtZW50KSB8fCB7IG1vZGVsOiBjQXR0cnMudWlGb3JtRWxlbWVudCB9O1xuXG4gICAgICBpZighaW5wdXRPcHRpb25zLm1vZGVsKSB0aHJvdyAnWW91IG11c3QgcHJvdmlkZSBhIGZpZWxkIG5hbWUgZm9yIGZvcm0tZWxlbWVudCc7XG5cbiAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHsgdmFsaWRhdGU6IHRydWUgfTtcbiAgICAgIHZhciBvcHRpb25zID0gYW5ndWxhci5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBpbnB1dE9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5yZXF1aXJlZCA9ICFfLmlzVW5kZWZpbmVkKGNBdHRycy5yZXF1aXJlZCk7XG5cbiAgICAgIHZhciBjb250YWluZXIgPSB1aUZvcm1Db25maWcuZm9ybS5kYXRhQ29udGFpbmVyO1xuICAgICAgdmFyIG1vZGVsID0gY1ByZWZpeCArIChjb250YWluZXIgPyBjb250YWluZXIgKyAnLicgOiAnJykgKyBvcHRpb25zLm1vZGVsO1xuICAgICAgdmFyIG1vZGVsUGFydHMgPSBvcHRpb25zLm1vZGVsLnNwbGl0KCcuJyk7XG4gICAgICB2YXIgZmllbGQgPSBfLmxhc3QobW9kZWxQYXJ0cyk7XG4gICAgICB2YXIgZm9ybUZpZWxkTmFtZSA9IG9wdGlvbnMubmFtZSB8fCAoZmllbGRbMF0udG9VcHBlckNhc2UoKSArIGZpZWxkLnN1YnN0cmluZygxKSk7XG4gICAgICB2YXIgZm9ybU1vZGVsID0gKG1vZGVsUGFydHMubGVuZ3RoID4gMSA/IF8uZmlyc3QobW9kZWwuc3BsaXQoJy4nKSkgKyAnLicgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgICAgICdmb3JtLicgKyBmb3JtRmllbGROYW1lO1xuXG4gICAgICBjdHJsLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgY3RybC5tb2RlbCA9IG1vZGVsO1xuICAgICAgY3RybC5mb3JtRmllbGROYW1lID0gZm9ybUZpZWxkTmFtZTtcbiAgICAgIGN0cmwuZWxlbWVudElkID0gJ2ZlXycgKyBfLnVuaXF1ZUlkKCk7XG5cbiAgICAgIGlmKHVpRm9ybUNvbmZpZy5lbGVtZW50LmNsYXNzKXtcbiAgICAgICAgY0VsLmFkZENsYXNzKHVpRm9ybUNvbmZpZy5lbGVtZW50LmNsYXNzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMudmFsaWRhdGUpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5yZXF1aXJlZCkge1xuICAgICAgICAgICAgICBjRWwuYWRkQ2xhc3MoJ3JlcXVpcmVkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIGNyZWF0ZUVudHJ5ID0gZnVuY3Rpb24gKHQpe1xuICAgICAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudCh1aUZvcm1Db25maWcuZWxlbWVudC50ZW1wbGF0ZXMudmFsaWRhdGlvbi5lbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQodWlGb3JtQ29uZmlnLmVsZW1lbnQubWVzc2FnZXNbdF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCduZy1pZicsIGZvcm1Nb2RlbCArICcuJGVycm9yLicgKyB0KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIGNvbnRhaW5lckVsID0gYW5ndWxhci5lbGVtZW50KHVpRm9ybUNvbmZpZy5lbGVtZW50LnRlbXBsYXRlcy52YWxpZGF0aW9uLmNvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCduZy1pZicsIGNQcmVmaXggKyAnZm9ybS4kc3VibWl0dGVkJyk7XG5cbiAgICAgICAgICBfLmVhY2godWlGb3JtQ29uZmlnLmVsZW1lbnQudmFsaWRhdG9ycywgZnVuY3Rpb24odil7XG4gICAgICAgICAgICBjb250YWluZXJFbC5hcHBlbmQoY3JlYXRlRW50cnkodikpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNFbC5hcHBlbmQoY29udGFpbmVyRWwpO1xuXG4gICAgICAgICAgY0VsLmF0dHIoJ25nLWNsYXNzJywgJ3sgaW52YWxpZDogJyArIGZvcm1Nb2RlbCArICcuJGludmFsaWQgfScpO1xuICAgICAgfVxuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1lbGVtZW50Jyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgICAgY0VsLnByZXBlbmQoY2xvbmUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdWlGb3JtSW5wdXQoJGNvbXBpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHJlcXVpcmU6ICdedWlGb3JtRWxlbWVudCcsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgZm9ybUVsQ3RybCkge1xuXG4gICAgICBjRWwuYXR0cignaWQnLCBmb3JtRWxDdHJsLmVsZW1lbnRJZCk7XG4gICAgICBjRWwuYXR0cignbmFtZScsIGZvcm1FbEN0cmwuZm9ybUZpZWxkTmFtZSk7XG4gICAgICBjRWwuYXR0cignbmctbW9kZWwnLCBmb3JtRWxDdHJsLm1vZGVsKTtcblxuICAgICAgaWYgKGZvcm1FbEN0cmwub3B0aW9ucy5yZXF1aXJlZCkge1xuICAgICAgICBjRWwuYXR0cigncmVxdWlyZWQnLCAncmVxdWlyZWQnKTtcbiAgICAgIH1cblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0taW5wdXQnKTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cbiIsImZ1bmN0aW9uIHVpRm9ybUxhYmVsKCRjb21waWxlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBwcmlvcml0eTogMTAwMCxcbiAgICByZXF1aXJlOiAnXnVpRm9ybUVsZW1lbnQnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgY0VsLCBjQXR0cnMsIGZvcm1FbEN0cmwpIHtcblxuICAgICAgY0VsLmF0dHIoJ2ZvcicsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcblxuICAgICAgY0VsLnJlbW92ZUF0dHIoJ3VpLWZvcm0tbGFiZWwnKTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdhcG9nZWUudWktZm9ybXMnLCBbXSlcblxuLmRpcmVjdGl2ZSgndWlGb3JtJywgdWlGb3JtKVxuLmRpcmVjdGl2ZSgndWlGb3JtRWxlbWVudCcsIHVpRm9ybUVsZW1lbnQpXG4uZGlyZWN0aXZlKCd1aUZvcm1JbnB1dCcsIHVpRm9ybUlucHV0KVxuLmRpcmVjdGl2ZSgndWlGb3JtTGFiZWwnLCB1aUZvcm1MYWJlbClcblxuLnZhbHVlKCd1aUZvcm1Db25maWcnLCB1aUZvcm1Db25maWcpXG5cbjtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==})();