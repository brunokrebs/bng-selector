(function() {
	var bngSelector = angular.module('bng-selector', []);
	bngSelector.components = [];
	var ESC_KEY = 27;

	window.addEventListener('click', function(event) {
		var element = event.target;
		var lastBngSelectorElement = null;
		var clickedElsewhere = true;
		while (hasDefaultClass(element)) {
			// clicked in some bng selector component
			clickedElsewhere = false;
			lastBngSelectorElement = element;
			element = element.parentElement;
		}
		for (var i = 0; i < bngSelector.components.length; i++) {
			var component = bngSelector.components[i];
			if (clickedElsewhere || component != lastBngSelectorElement) {
				component.handleCloseSelector();
			}
		}
	});

	function hasDefaultClass(element) {
		return (' ' + element.className + ' ').indexOf(' bng-selector-mhc ') > -1;
	}

	var bngSelectorController = function($element, $timeout, $scope) {
		var ctrl = this;
		ctrl.uniqueSelecteProperty = 'selectedBng' + (new Date()).getTime();
		var componentElement = $element[0];
		var mainDiv = componentElement.firstChild;
		bngSelector.components.push(mainDiv);
		var inputFilter = componentElement.querySelector('.bng-selector-filter-input');

		mainDiv.handleCloseSelector = closeFilter;

		if (ctrl.multi && ctrl.showMultiControls == null) {
			ctrl.showMultiControls = true;
		}

		ctrl.showOptions = false;
		ctrl.term = '';
		ctrl.filteredOptions = ctrl.options;
		ctrl.key = ctrl.key || ctrl.label;

		function handlePreSelected() {
			ctrl.selectedItems = [];
			if (!ctrl.selected || !ctrl.selected.length) {
				return;
			}
			for (var s = 0; s < ctrl.selected.length; s++) {
				var selectedOption = ctrl.selected[s];
				for (var o = 0; o < ctrl.options.length; o++) {
					var currentOption = ctrl.options[o];
					if (selectedOption[ctrl.key] == currentOption[ctrl.key]) {
						currentOption[ctrl.uniqueSelecteProperty] = true;
						ctrl.selectedItems.push(currentOption);
					}
				}
			}
		}

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
			if (!ctrl.showOptions) {
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
			if (!ctrl.multi) {
				ctrl.showOptions = false;
				ctrl.selected = option;
				ctrl.selected.label = option[ctrl.label];
				ctrl.onSelect({option: option});
			} else {
				delete option[ctrl.uniqueSelecteProperty];
				var indexOf = ctrl.selectedItems.indexOf(option);
				if (indexOf >= 0) {
					option[ctrl.uniqueSelecteProperty] = false;
					ctrl.selectedItems.splice(indexOf, 1);
				} else {
					option[ctrl.uniqueSelecteProperty] = true;
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
					item[ctrl.uniqueSelecteProperty] = true;
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
			if (!ctrl.multi) {
				closeFilter(true);
			}
			for (var i = 0; i < ctrl.options.length; i++) {
				delete ctrl.options[i][ctrl.uniqueSelecteProperty];
			}
			ctrl.onUnselect();
			if ($event) {
				$event.stopPropagation();
			}
		};

		function openFilter() {
			componentElement.addEventListener('keydown', handleKeyDown);
			ctrl.showOptions = true;
		}

		function closeFilter(avoidApply) {
			componentElement.removeEventListener('keydown', handleKeyDown);
			ctrl.showOptions = false;
			ctrl.term = '';
			ctrl.filteredOptions = ctrl.options;
			if (!avoidApply) {
				$scope.$apply();
			}
		}

		function handleKeyDown(event) {
			if (event.keyCode == ESC_KEY ) {
				closeFilter();
			}
		}

		ctrl.$onChanges = function (changedObject) {
			if (changedObject.options && changedObject.options.currentValue) {
				if (!changedObject.options.isFirstChange()) {
					ctrl.filteredOptions = changedObject.options.currentValue;
				}
				handlePreSelected();
			}
			if (!ctrl.multi && changedObject.selected && changedObject.selected.currentValue) {
				if (!changedObject.selected.isFirstChange()) {
					ctrl.selected = changedObject.selected.currentValue;
					ctrl.selected.label = changedObject.selected.currentValue[ctrl.label];
				}
				handlePreSelected();
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
			showFilter: '<',
			emptyLabel: '@',
			multi: '<',
			showMultiControls: '<',
			selectAllLabel: '@',
			clearAllLabel: '@',
			disabled: '<',
			key: '@',
			label: '@'
		},
		templateUrl: 'bng-selector.html',
		controller: bngSelectorController
	});
}());