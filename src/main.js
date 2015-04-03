angular.module('apogee.ui-forms', [])

.directive('uiForm', uiForm)
.directive('uiFormElement', uiFormElement)
.directive('uiFormInput', uiFormInput)
.directive('uiFormLabel', uiFormLabel)

.value('uiFormConfig', uiFormConfig)

;
