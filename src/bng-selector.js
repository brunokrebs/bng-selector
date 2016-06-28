(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function($element, $timeout, $scope) {
		var ctrl = this;
		var componentElement = $element[0];
		var inputFilter = componentElement.querySelector('.bng-selector-filter-input');

		ctrl.toggleFilter = function($event) {
			if ($event) {
				$event.stopPropagation();
			}
			if (!ctrl.showFilter) {
				openFilter();
				$timeout(function() {
					inputFilter.focus();
				}, 100);
			} else {
				closeFilter();
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
				if (option.label.toLowerCase().indexOf(term) !== -1)
					ctrl.filteredOptions.push(option);
			}
			return ctrl.filteredOptions;
		};
		
		ctrl.select = function(option) {
			ctrl.showFilter = false;
			ctrl.selected = option;
			ctrl.onSelect({option: option});
		};

		ctrl.clear = function($event) {
			ctrl.selected = null;
			ctrl.term = '';
			ctrl.filteredOptions = ctrl.options;
			ctrl.showFilter = false;
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

		function closeFilter(event) {
			componentElement.removeEventListener('keydown', handleKeyDown);
			inputFilter.removeEventListener('keydown', handleKeyDown);
			ctrl.showFilter = false;
			ctrl.term = '';
			$scope.$apply();
		}

		function handleKeyDown(event) {
			if (event.keyCode == 27 ) {
				closeFilter();
			}
		}

		ctrl.clear();
	};
	bngSelectorController.$inject = ['$element', '$timeout', '$scope'];

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