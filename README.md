# apogee.ui-forms [![Build Status](https://travis-ci.org/NewOrbit/apogee.ui-forms.svg?branch=master)](https://travis-ci.org/neworbit/apogee.ui-forms) [![Coverage Status](https://coveralls.io/repos/neworbit/apogee.ui-forms/badge.svg?branch=master)](https://coveralls.io/r/neworbit/apogee.ui-forms?branch=master)

An opinionated angular library to create awesome forms with minimal markups.

## Installation

```bash
bower install https://github.com/NewOrbit/apogee.ui-forms.git
```

## Usage

```html
<form ui-form>
    <div ui-form-element="field1" required>
      <label ui-form-label>Some label 1</label>
      <input type="email" ui-form-input>
    </div>
    <div ui-form-element="field2">
      <label ui-form-label>Some label 2</label>
      <input type="checkbox" ui-form-input>
    </div>
    <button type="submit">Submit</button>
</form>
```

```javascript
myModule.controller('MyController', function($scope){
  var vm = $scope;
  vm.submit = function(){
    console.log('form submitted:', vm.field1, vm.field2);
  };
});
```

for full examples see [here](https://github.com/NewOrbit/apogee.ui-forms/tree/master/examples);

for more advance usages see [wiki](https://github.com/NewOrbit/apogee.ui-forms/wiki).

## Contributing

TODO: Write contibution guidline

## Credits

TODO: Write credits

## License

TODO: Write license
