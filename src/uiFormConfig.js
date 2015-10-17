var uiFormConfig = {
  form: {
    dataContainer: 'entity'
  },
  element: {
    validators: ['required', 'email', 'number', 'match'],
    templates: {
      validation: {
        container: '<span></span>',
        entry: '<span></span>'
      }
    },
    messages: {
      required: 'This field is required',
      email: 'Invalid email format',
      number: 'Invalid number format',
      match: 'This field must match: '
    }
  }
};
