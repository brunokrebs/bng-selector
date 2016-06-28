(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function() {
		var ctrl = this;
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