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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpRm9ybS5qcyIsInVpRm9ybUNvbmZpZy5qcyIsInVpRm9ybUVsZW1lbnQuanMiLCJ1aUZvcm1JbnB1dC5qcyIsInVpRm9ybUxhYmVsLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwb2dlZS51aS1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHVpRm9ybSgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHZhciBjb250cm9sbGVyID0gY0F0dHJzLmNvbnRyb2xsZXI7XG4gICAgICB2YXIgY1ByZWZpeCA9IGNvbnRyb2xsZXIgPyBjb250cm9sbGVyICsgJy4nIDogJyc7XG5cbiAgICAgIGN0cmwuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICBjdHJsLmNQcmVmaXggPSBjUHJlZml4O1xuXG4gICAgICBjRWwuYXR0cignbmFtZScsIGNQcmVmaXggKyAnZm9ybScpO1xuICAgICAgY0VsLmF0dHIoJ25nLXN1Ym1pdCcsIGNQcmVmaXggKyAnZm9ybS4kdmFsaWQgJiYgJyArIGNQcmVmaXggKyAnc3VibWl0KCknKTtcbiAgICAgIGNFbC5hdHRyKCduZy1jbGFzcycsICd7IGF0dGVtcHRlZDogJyArIGNQcmVmaXggKyAnZm9ybS4kc3VibWl0dGVkIH0nKTtcbiAgICAgIGNFbC5hdHRyKCdub3ZhbGlkYXRlJywgJycpO1xuXG4gICAgICBpZih1aUZvcm1Db25maWcuZm9ybS5jbGFzcyl7XG4gICAgICAgIGNFbC5hZGRDbGFzcyh1aUZvcm1Db25maWcuZm9ybS5jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtJyk7XG4gICAgICAkY29tcGlsZShjRWwpKHNjb3BlKTtcblxuICAgICAgJHRyYW5zY2x1ZGUoZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNFbC5wcmVwZW5kKGNsb25lKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cbiIsInZhciB1aUZvcm1Db25maWcgPSB7XG4gIGZvcm06IHtcbiAgICBkYXRhQ29udGFpbmVyOiAnZW50aXR5J1xuICB9LFxuICBlbGVtZW50OiB7XG4gICAgdmFsaWRhdG9yczogWydyZXF1aXJlZCcsICdlbWFpbCcsICdudW1iZXInXSxcbiAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgY29udGFpbmVyOiAnPHNwYW4+PC9zcGFuPicsXG4gICAgICAgIGVudHJ5OiAnPHNwYW4+PC9zcGFuPidcbiAgICAgIH1cbiAgICB9LFxuICAgIG1lc3NhZ2VzOiB7XG4gICAgICByZXF1aXJlZDogJ1RoaXMgZmllbGQgaXMgcmVxdWlyZWQnLFxuICAgICAgZW1haWw6ICdJbnZhbGlkIGVtYWlsIGZvcm1hdCcsXG4gICAgICBudW1iZXI6ICdJbnZhbGlkIG51bWJlciBmb3JtYXQnXG4gICAgfVxuICB9XG59O1xuIiwiZnVuY3Rpb24gdWlGb3JtRWxlbWVudCgkY29tcGlsZSwgdWlGb3JtQ29uZmlnKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiBbJ3VpRm9ybUVsZW1lbnQnLCAnXnVpRm9ybSddLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgY29udHJvbGxlciA6IGZ1bmN0aW9uKCkge30sXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgY3RybHMsICR0cmFuc2NsdWRlKSB7XG4gICAgICB2YXIgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgdmFyIGZvcm1DdHJsID0gY3RybHNbMV07XG5cbiAgICAgIHZhciBjUHJlZml4ID0gZm9ybUN0cmwuY1ByZWZpeDtcblxuICAgICAgdmFyIGlucHV0T3B0aW9ucyA9IHNjb3BlLiRldmFsKGNBdHRycy51aUZvcm1FbGVtZW50KSB8fCB7IG1vZGVsOiBjQXR0cnMudWlGb3JtRWxlbWVudCB9O1xuICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0geyB2YWxpZGF0ZTogdHJ1ZSB9O1xuICAgICAgdmFyIG9wdGlvbnMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIGlucHV0T3B0aW9ucyk7XG4gICAgICBvcHRpb25zLnJlcXVpcmVkID0gIV8uaXNVbmRlZmluZWQoY0F0dHJzLnJlcXVpcmVkKTtcblxuICAgICAgdmFyIGNvbnRhaW5lciA9IHVpRm9ybUNvbmZpZy5mb3JtLmRhdGFDb250YWluZXI7XG4gICAgICB2YXIgbW9kZWwgPSBjUHJlZml4ICsgKGNvbnRhaW5lciA/IGNvbnRhaW5lciArICcuJyA6ICcnKSArIG9wdGlvbnMubW9kZWw7XG4gICAgICB2YXIgbW9kZWxQYXJ0cyA9IG9wdGlvbnMubW9kZWwuc3BsaXQoJy4nKTtcbiAgICAgIHZhciBmaWVsZCA9IF8ubGFzdChtb2RlbFBhcnRzKTtcbiAgICAgIHZhciBmb3JtRmllbGROYW1lID0gb3B0aW9ucy5uYW1lIHx8IChmaWVsZFswXS50b1VwcGVyQ2FzZSgpICsgZmllbGQuc3Vic3RyaW5nKDEpKTtcbiAgICAgIHZhciBmb3JtTW9kZWwgPSAobW9kZWxQYXJ0cy5sZW5ndGggPiAxID8gXy5maXJzdChtb2RlbC5zcGxpdCgnLicpKSArICcuJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAgICAgJ2Zvcm0uJyArIGZvcm1GaWVsZE5hbWU7XG5cbiAgICAgIGN0cmwub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICBjdHJsLm1vZGVsID0gbW9kZWw7XG4gICAgICBjdHJsLmZvcm1GaWVsZE5hbWUgPSBmb3JtRmllbGROYW1lO1xuICAgICAgY3RybC5lbGVtZW50SWQgPSAnZmVfJyArIF8udW5pcXVlSWQoKTtcblxuICAgICAgaWYodWlGb3JtQ29uZmlnLmVsZW1lbnQuY2xhc3Mpe1xuICAgICAgICBjRWwuYWRkQ2xhc3ModWlGb3JtQ29uZmlnLmVsZW1lbnQuY2xhc3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy52YWxpZGF0ZSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICAgIGNFbC5hZGRDbGFzcygncmVxdWlyZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgY3JlYXRlRW50cnkgPSBmdW5jdGlvbiAodCl7XG4gICAgICAgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KHVpRm9ybUNvbmZpZy5lbGVtZW50LnRlbXBsYXRlcy52YWxpZGF0aW9uLmVudHJ5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dCh1aUZvcm1Db25maWcuZWxlbWVudC5tZXNzYWdlc1t0XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ25nLWlmJywgZm9ybU1vZGVsICsgJy4kZXJyb3IuJyArIHQpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgY29udGFpbmVyRWwgPSBhbmd1bGFyLmVsZW1lbnQodWlGb3JtQ29uZmlnLmVsZW1lbnQudGVtcGxhdGVzLnZhbGlkYXRpb24uY29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ25nLWlmJywgY1ByZWZpeCArICdmb3JtLiRzdWJtaXR0ZWQnKTtcblxuICAgICAgICAgIF8uZWFjaCh1aUZvcm1Db25maWcuZWxlbWVudC52YWxpZGF0b3JzLCBmdW5jdGlvbih2KXtcbiAgICAgICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZChjcmVhdGVFbnRyeSh2KSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY0VsLmFwcGVuZChjb250YWluZXJFbCk7XG5cbiAgICAgICAgICBjRWwuYXR0cignbmctY2xhc3MnLCAneyBpbnZhbGlkOiAnICsgZm9ybU1vZGVsICsgJy4kaW52YWxpZCB9Jyk7XG4gICAgICB9XG5cbiAgICAgIGNFbC5yZW1vdmVBdHRyKCd1aS1mb3JtLWVsZW1lbnQnKTtcbiAgICAgICRjb21waWxlKGNFbCkoc2NvcGUpO1xuXG4gICAgICAkdHJhbnNjbHVkZShmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgICBjRWwucHJlcGVuZChjbG9uZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG4iLCJmdW5jdGlvbiB1aUZvcm1JbnB1dCgkY29tcGlsZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcHJpb3JpdHk6IDEwMDAsXG4gICAgcmVxdWlyZTogJ151aUZvcm1FbGVtZW50JyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGNFbCwgY0F0dHJzLCBmb3JtRWxDdHJsKSB7XG5cbiAgICAgIGNFbC5hdHRyKCdpZCcsIGZvcm1FbEN0cmwuZWxlbWVudElkKTtcbiAgICAgIGNFbC5hdHRyKCduYW1lJywgZm9ybUVsQ3RybC5mb3JtRmllbGROYW1lKTtcbiAgICAgIGNFbC5hdHRyKCduZy1tb2RlbCcsIGZvcm1FbEN0cmwubW9kZWwpO1xuXG4gICAgICBpZiAoZm9ybUVsQ3RybC5vcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgIGNFbC5hdHRyKCdyZXF1aXJlZCcsICdyZXF1aXJlZCcpO1xuICAgICAgfVxuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1pbnB1dCcpO1xuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XG4gICAgfVxuICB9O1xufVxuIiwiZnVuY3Rpb24gdWlGb3JtTGFiZWwoJGNvbXBpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICAgIHJlcXVpcmU6ICdedWlGb3JtRWxlbWVudCcsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBjRWwsIGNBdHRycywgZm9ybUVsQ3RybCkge1xuXG4gICAgICBjRWwuYXR0cignZm9yJywgZm9ybUVsQ3RybC5lbGVtZW50SWQpO1xuXG4gICAgICBjRWwucmVtb3ZlQXR0cigndWktZm9ybS1sYWJlbCcpO1xuICAgICAgJGNvbXBpbGUoY0VsKShzY29wZSk7XG4gICAgfVxuICB9O1xufVxuIiwiYW5ndWxhci5tb2R1bGUoJ2Fwb2dlZS51aS1mb3JtcycsIFtdKVxuXG4uZGlyZWN0aXZlKCd1aUZvcm0nLCB1aUZvcm0pXG4uZGlyZWN0aXZlKCd1aUZvcm1FbGVtZW50JywgdWlGb3JtRWxlbWVudClcbi5kaXJlY3RpdmUoJ3VpRm9ybUlucHV0JywgdWlGb3JtSW5wdXQpXG4uZGlyZWN0aXZlKCd1aUZvcm1MYWJlbCcsIHVpRm9ybUxhYmVsKVxuXG4udmFsdWUoJ3VpRm9ybUNvbmZpZycsIHVpRm9ybUNvbmZpZylcblxuO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9})();