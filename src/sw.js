/**
 * Created by Victor on 2015-07-26.
 */

this.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('v1').then(function(cache) {
			console.log(cache);
			cache.add('/dependencies/extensions.js');
			cache.add('/dependencies/angular-ui-router/release/angular-ui-router.min.js');
			cache.add('/dependencies/ui-bootstrap-tpls-0.11.0.min.js');
			cache.add('/dependencies/jquery/jquery.min.js');
			cache.add('/dependencies/angular-animate/angular-animate.min.js');
			cache.add('/dependencies/angular-aria/angular-aria.min.js');
			cache.add('/dependencies/angular-material/angular-material.min.js');
			cache.add('/dependencies/angular-analytics/angular-analytics.js');
			cache.add('/social.js');
			cache.add('/dependencies/angular-material/angular-material.min.css');
			cache.add('/content/css/stylesheet.css');

		})
	);
});

this.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});