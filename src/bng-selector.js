(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function() {
		var ctrl = this;

		ctrl.toggleFilter = function($event) {
			ctrl.showFilter = !ctrl.showFilter;
			if ($event) {
				$event.stopPropagation();
			}
		};
	};
	bngSelectorController.$inject = [];

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