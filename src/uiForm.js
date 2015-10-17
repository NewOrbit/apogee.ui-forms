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
