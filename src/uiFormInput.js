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
