(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function($element, $timeout, $scope) {
		var ctrl = this;
		var componentElement = $element[0];
		var inputFilter = componentElement.querySelector('.bng-selector-filter-input');

		ctrl.showFilter = false;
		ctrl.term = '';
		ctrl.filteredOptions = ctrl.options;
		ctrl.selectedItems = [];

		if (!ctrl.selectAllLabel) {
			ctrl.selectAllLabel = 'Select all';
		}

		if (!ctrl.clearAllLabel) {
			ctrl.clearAllLabel = 'Clear selection';
		}

		ctrl.toggleFilter = function($event) {
			if (ctrl.disabled) {
				return;
			}
			if ($event) {
				$event.stopPropagation();
			}
			if (!ctrl.showFilter) {
				openFilter();
				$timeout(function() {
					inputFilter.focus();
				}, 100);
			} else {
				closeFilter(true);
			}
		};

		ctrl.suggest = function () {
			term = ctrl.term.trim().toLowerCase();
			if (term == '') {
				return ctrl.filteredOptions = ctrl.options;
			}

			ctrl.filteredOptions = [];
			for (var i = 0; i < ctrl.options.length; i++) {
				var option = ctrl.options[i];
				if (option[ctrl.label].toLowerCase().indexOf(term) !== -1)
					ctrl.filteredOptions.push(option);
			}
			return ctrl.filteredOptions;
		};
		
		ctrl.select = function(option) {
			ctrl.showFilter = false;
			if (!ctrl.multi) {
				ctrl.selected = option;
				ctrl.selected.label = option[ctrl.label];
				ctrl.onSelect({option: option});
			} else {
				delete option.selectedBng;
				var indexOf = ctrl.selectedItems.indexOf(option);
				if (indexOf >= 0) {
					option.selectedBng = false;
					ctrl.selectedItems.splice(indexOf, 1);
				} else {
					option.selectedBng = true;
					ctrl.selectedItems.push(option);
				}
				ctrl.onSelect({option: ctrl.selectedItems});
			}
		};

		ctrl.selectAll = function() {
			for (var i = 0; i < ctrl.filteredOptions.length; i++) {
				var item = ctrl.filteredOptions[i];
				var indexOf = ctrl.selectedItems.indexOf(item);
				if (indexOf < 0) {
					ctrl.selectedItems.push(item);
					item.selectedBng = true;
				}
			}
			ctrl.onSelect({option: ctrl.selectedItems});
		};

		ctrl.clear = function($event) {
			if (ctrl.disabled) {
				return;
			}
			ctrl.selected = null;
			ctrl.selectedItems = [];
			closeFilter(true);
			for (var i = 0; i < ctrl.options.length; i++) {
				delete ctrl.options[i].selectedBng;
			}
			ctrl.onUnselect();
			if ($event) {
				$event.stopPropagation();
			}
		};

		function openFilter() {
			componentElement.addEventListener('keydown', handleKeyDown);
			componentElement.addEventListener('blur', closeFilter);
			inputFilter.addEventListener('blur', function() {
				$timeout(function() {
					closeFilter();
				}, 150);
			});
			ctrl.showFilter = true;
		}

		function closeFilter(avoidApply) {
			componentElement.removeEventListener('keydown', handleKeyDown);
			inputFilter.removeEventListener('keydown', handleKeyDown);
			ctrl.showFilter = false;
			ctrl.term = '';
			ctrl.filteredOptions = ctrl.options;
			if (!avoidApply) {
				$scope.$apply();
			}
		}

		function handleKeyDown(event) {
			if (event.keyCode == 27 ) {
				closeFilter();
			}
		}

		ctrl.$onChanges = function (changedObject) {
			if (changedObject.options && changedObject.options.currentValue) {
				if (!changedObject.options.isFirstChange()) {
					ctrl.filteredOptions = changedObject.options.currentValue;
				}
			}
			if (!ctrl.multi && changedObject.selected && changedObject.selected.currentValue) {
				if (!changedObject.selected.isFirstChange()) {
					ctrl.selected = changedObject.selected.currentValue;
					ctrl.selected.label = changedObject.selected.currentValue[ctrl.label];
				}
			}
		};
	};
	bngSelectorController.$inject = ['$element', '$timeout', '$scope'];

	bngSelector.component('bngSelector', {
		bindings: {
			onSelect: '&',
			onUnselect: '&',
			options: '<',
			selected: '<',
			multi: '<',
			selectAllLabel: '<',
			disabled: '<',
			label: '@'
		},
		templateUrl: 'bng-selector.html',
		controller: bngSelectorController
	});
}());