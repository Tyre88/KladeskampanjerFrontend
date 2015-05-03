define(
	[
		"app"
	],
	function(app)
	{
		app.config(
			[
				"$stateProvider",
				"$urlRouterProvider",
				function($stateProvider, $urlRouterProvider)
				{
                    $stateProvider
                        .state('home',
                        {
                            url: "/",
                            templateUrl: "views/home.html",
                            controller: "home"
                        })
						.state('information',
						{
							url: "/information",
							templateUrl: "views/information.html",
							controller: "information"
						})
						.state('woman',
						{
							url: "/kvinna",
							templateUrl: "views/products.html",
							controller: "products"
						})
						.state('man',
						{
							url: "/man",
							templateUrl: "views/products.html",
							controller: "products"
						})
						.state('wishlist',
						{
							url: "/wishlist/:guid",
							templateUrl: "views/wishlist.html",
							controller: "wishlist"
						})
						.state('product',
						{
							url: '/product/:id',
							templateUrl: "views/single-product.html",
							controller: "show-product"
						});
                }
			]
        );
	});