(function() {
	var bngSelector = angular.module('bng-selector', []);

	var bngSelectorController = function() {
		var ctrl = this;

		ctrl.options = [
			'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Curabitur'
		];

	};
	bngSelectorController.$inject = [];

	bngSelector.component('bngSelector', {
		bindings: {
			onSelect: '&',
			onUnselect: '&'
		},
		template:
			'<div class="bng-selector">' + 
			'	<ul>' +
			'		<li ng-repeat="opt in $ctrl.options">' +
			'			{{opt}}' +
			'		</li>' +
			'	</ul>' +
			'</div>',
		controller: bngSelectorController
	});
}());