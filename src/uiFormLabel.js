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
