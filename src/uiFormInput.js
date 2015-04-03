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
