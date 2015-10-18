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
