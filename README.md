# Angular Selector

An angular (v 1.5) selector component with filter feature. Check out the
[demo page](https://brunokrebs.github.io/).

## Installation

For the time being, only bower is supported. To install it, issue the following command:

```bash
bower install --save bng-selector
```

After that, you have to add bng-selector as a dependency to your angular app:

```avascript
var demoApp = angular.module('demoApp', ['bng-selector']);
```

## Usage

The following list explain all available options of this component:

1. options: the list of items available to selection
2. on-select: the callback function that will be called when an item is selected
3. on-unselect: the callback function that will be called when an item is unselected
4. selected: the object that the selector will show as selected from start
5. label: the name of the property that will be used as label (item description)
6. disabled: some variable that handles if the selector is disabled or not

So, as an example, if you want to use this component with all the options, you would
add it like that:

```html
<bng-selector options="ctrl.options"
      on-select="ctrl.optionSelected(option)"
      on-unselect="ctrl.optionUnselected()"
      selected="ctrl.selected"
      label="name"
      disabled="ctrl.disabled">
</bng-selector>
```