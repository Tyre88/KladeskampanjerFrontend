(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-29501390-1', 'auto');
ga('send', 'pageview');

(function(angular) {

	angular.module('analytics', ['ng']).service('analytics', [
		'$rootScope', '$window', '$location', function($rootScope, $window, $location) {
			var track = function() {
				$window.ga('send', 'pageview', { page: $location.url() });
			};
			$rootScope.$on('$viewContentLoaded', track);
		}
	]);

}(window.angular));