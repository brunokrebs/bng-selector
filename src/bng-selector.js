(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function($element, $timeout) {
		var ctrl = this;

		ctrl.toggleFilter = function($event) {
			ctrl.showFilter = !ctrl.showFilter;
			if ($event) {
				$event.stopPropagation();
			}
			if (ctrl.showFilter) {
				var input = $element[0].querySelector('.bng-selector-filter-input');
				$timeout(function() {
					input.focus();
				}, 100);
			}
		};

		ctrl.suggest = function () {
			term = ctrl.term.trim().toLowerCase();
			if (term == '') {
				return ctrl.filteredOptions = ctrl.options;
			}

			console.log(term);
			ctrl.filteredOptions = [];
			for (var i = 0; i < ctrl.options.length; i++) {
				var option = ctrl.options[i];
				if (option.label.toLowerCase().indexOf(term) !== -1)
					ctrl.filteredOptions.push(option);
			}
			return ctrl.filteredOptions;
		};
		
		ctrl.select = function(option) {
			ctrl.showFilter = false;
			ctrl.selected = option;
		};

		ctrl.clear = function($event) {
			ctrl.selected = null;
			ctrl.term = '';
			ctrl.filteredOptions = ctrl.options;
			ctrl.showFilter = false;
			if ($event) {
				$event.stopPropagation();
			}
		};

		ctrl.clear();
	};
	bngSelectorController.$inject = ['$element', '$timeout'];

	bngSelector.component('bngSelector', {
		bindings: {
			onSelect: '&',
			onUnselect: '&',
			options: '<'
		},
		templateUrl: 'bng-selector.html',
		controller: bngSelectorController
	});
}());