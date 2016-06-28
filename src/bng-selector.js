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