var GenderType =
{
	Woman: 0,
	Man: 1
};

var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};
})();

LoadCss("dependencies/angular-material/angular-material.min.css");
LoadCss("content/css/stylesheet.css");
LoadCss("content/css/font-awesome.min.css");

define(
    [
        "angular",
        "ui-router",
        "ui-bootstrap"
    ],
    function(angular)
    {
		try
		{
			return angular.module("kladeskampanjer");
		}
		catch(err)
		{
			return angular.module('kladeskampanjer', ['ng', 'ui.router', 'ui.bootstrap', 'ngMaterial', 'analytics'])
                .config(["$mdThemingProvider", "$locationProvider",function($mdThemingProvider, $location)
                {
                    $mdThemingProvider.theme('default')
                        .primaryPalette('pink')
                        .accentPalette('orange');

					$location.hashPrefix('!');
                }])
				.directive('whenScrolled', [function()
				{
					return {
						restrict: "A",
						scope:
						{
							method: "&whenScrolled"
						},
						link: function(scope, elm) {
							var raw = elm[0];
							var loading = false;

							//TODO: Need to fix so that it loads in new data if there's no scroll.
							elm.bind('scroll', function() {
								//Checks when we are 10% from bottom then we load more data.
								if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - (raw.scrollHeight / 10)) {
									if(!loading)
									{
										loading = true;

										scope.method().then(function()
										{
											loading = false;
										});
									}
								}
							});
						}
					};
				}])
				.controller('index', ["$scope", "$rootScope", "$state", "productService", "wishlistService", "analytics", function($scope, $rootScope, $state, productService, wishlistService, analytics)
				{
					$rootScope.RequestAmount = 0;
					$rootScope.RequestDone = 0;
					$scope.PercentLoaded = 0;

					$scope.SelectedIndex = 0;
					$scope.SaleOnly = false;
					$scope.Shops = [];
					$scope.Categories = [];

					$scope.SelectedShop = "all";
					$scope.SelectedCategory = "all";

					$scope.IsMenuOpen = false;

					$scope.GoToWishlist = function()
					{
						$state.go("wishlist", {guid: wishlistService.WishList.GUID});
						$scope.SelectedIndex = -1;
						$scope.IsMenuOpen = false;
					};

					$scope.GetWishlistCount = function()
					{
						return wishlistService.WishList.Products.length;
					};

					productService.GetShops().success(function(response)
					{
						for(var i = 0; i < response.length; i++)
						{
							$scope.Shops.push(response[i]);
						}
					});

					productService.GetCategories(GenderType.Woman).success(function(response)
					{
						for(var i = 0; i < response.length; i++)
						{
							$scope.Categories.push(response[i]);
						}
					});

					$rootScope.$watch("RequestDone", function(newVal, oldVal)
					{
						if(newVal >= $rootScope.RequestAmount && newVal != oldVal)
						{
							$rootScope.RequestAmount = 0;
							$rootScope.RequestDone = 0;
							$scope.PercentLoaded = 100;
							console.log('done');
						}
						else if(newVal != oldVal)
						{
							$scope.PercentLoaded = ($rootScope.RequestDone / $rootScope.RequestAmount) * 100;
						}
					});

					$state.go("home");
				}])
				.controller('home', ["$scope", "$state", "$mdToast", "productService", function($scope, $state, $mdToast, productService)
				{
					$scope.$parent.SelectedIndex = 0;

					$scope.Woman = [];
					$scope.Man = [];

					productService.GetRandom(GenderType.Woman).success(function(response)
					{
						$scope.Woman = response;
					});

					productService.GetRandom(GenderType.Man).success(function(response)
					{
						$scope.Man = response;
					});

					$scope.ShowVoucher = function(voucher)
					{
						$mdToast.show(
							$mdToast.simple()
								.content(voucher.ShopName + ': ' + voucher.Text)
								.action('Till rabattkoder')
								.highlightAction(false)
								.position('bottom left')
								.hideDelay(5000)
						)
							.then(function()
							{
								window.open(voucher.Link, '_blank');
							});
					};

					productService.GetVoucher("all").success(function(response)
					{
						if(response.length > 0)
						{
							$mdToast.show(
								$mdToast.simple()
									.content(response.length + ' Rabattkoder aktiva!')
									.action('Till rabattkoder')
									.highlightAction(false)
									.position('bottom left')
									.hideDelay(7500)
							)
							.then(function()
							{
								$state.go("vouchercodes");
							});
						}
					});
				}])
				.controller('information', ["$scope", "$http", "$mdToast", function($scope, $http, $mdToast)
				{
					$scope.$parent.SelectedIndex = 1;

					$scope.Email = "";
					$scope.Message = "";

					$scope.Send = function()
					{
						if($scope.Email != "" && $scope.Message != "")
						{
							$http.post("http://new.kladeskampanjer.se/api/Contact/contactus", {email: $scope.Email, message: $scope.Message}).success(function(response)
							{
								$mdToast.show($mdToast.simple().content("Meddelandet har skickats"));
								$scope.Email = "";
								$scope.Message = "";
							}).error(function()
							{
								$mdToast.show($mdToast.simple().content("Ett fel uppstod, försök igen"));
							});
						}
						else if($scope.Email == "" && $scope.Message == "")
						{
							$mdToast.show($mdToast.simple().content("Du måste fylla i e-post och meddelande"));
						}
						else if($scope.Email == "" && $scope.Message != "")
						{
							$mdToast.show($mdToast.simple().content("Du måste fylla i en e-post"));
						}
						else if($scope.Email != "" && $scope.Message == "")
						{
							$mdToast.show($mdToast.simple().content("Du måste fylla i ett meddelande"));
						}
					};
				}])
				.controller('products', ["$scope", "$state", "$q", "$mdToast", "productService", function($scope, $state, $q, $mdToast, productService)
				{
					$scope.Gender = GenderType.Woman;
					$scope.Products = [];
					$scope.Page = 1;

					if($state.params["shop"] != undefined && $state.params["shop"] != "")
						$scope.$parent.SelectedShop = $state.params["shop"];

					if($state.params["category"] != undefined && $state.params["category"] != "")
						$scope.$parent.SelectedCategory = $state.params["category"];

					$scope.ShowToast = function(content, url)
					{
						$mdToast.show(
							$mdToast.simple()
								.content(content)
								.action('Till butik')
								.highlightAction(false)
								.position('bottom left')
								.hideDelay(10000)
						)
							.then(function()
							{
								window.open(url, '_blank');
							});
					};

					if($state.params["shop"] != "")
					{
						productService.GetVoucher($state.params["shop"]).success(function(data)
						{
							if(data.length > 0)
							{
								for(var i = 0; i < data.length; i++)
								{
									$scope.ShowToast(data[i].Text, data[i].Link);
								}
							}
						});
					}

					$scope.$watch('$parent.SaleOnly', function(newValue, oldValue)
					{
						if(newValue != oldValue)
						{
							$scope.Page = 1;
							$scope.Products = [];
							$scope.LoadProducts();
						}
					});

					$scope.$watch('$parent.SelectedShop', function(newValue, oldValue)
					{
						if(newValue != oldValue)
						{
							switch ($state.current.name)
							{
								case "woman":
									$state.go("woman-category", {shop: newValue, category: $scope.$parent.SelectedCategory});
									break;
								case "woman-category":
									$state.go("woman-category", {shop: newValue, category: $scope.$parent.SelectedCategory});
									break;
								case "man":
									$state.go("man-category", {shop: newValue, category: $scope.$parent.SelectedCategory});
									break;
								case "man-category":
									$state.go("man-category", {shop: newValue, category: $scope.$parent.SelectedCategory});
									break;
							}
						}
					});

					$scope.$watch('$parent.SelectedCategory', function(newValue, oldValue)
					{
						if(newValue != oldValue)
						{
							switch ($state.current.name)
							{
								case "woman":
									$state.go("woman-category", {shop: $scope.$parent.SelectedShop, category: newValue});
									break;
								case "woman-category":
									$state.go("woman-category", {shop: $scope.$parent.SelectedShop, category: newValue});
									break;
								case "man":
									$state.go("man-category", {shop: $scope.$parent.SelectedShop, category: newValue});
									break;
								case "man-category":
									$state.go("man-category", {shop: $scope.$parent.SelectedShop, category: newValue});
									break;
							}

						}
					});

					switch ($state.current.name)
					{
						case "woman":
							$scope.$parent.SelectedIndex = 2;
							$scope.Gender = GenderType.Woman;
							break;
						case "woman-category":
							$scope.$parent.SelectedIndex = 2;
							$scope.Gender = GenderType.Woman;
							break;
						case "man":
							$scope.$parent.SelectedIndex = 3;
							$scope.Gender = GenderType.Man;
							break;
						case "man-category":
							$scope.$parent.SelectedIndex = 3;
							$scope.Gender = GenderType.Man;
							break;
					}

					$scope.LoadProducts = function()
					{
						var deferred = $q.defer();

						if($scope.Gender == GenderType.Woman)
						{
							productService.GetProducts(GenderType.Woman, $scope.Page, $scope.$parent.SaleOnly,
								$scope.$parent.SelectedShop, $scope.$parent.SelectedCategory).success($scope.OnProductSuccess).then(function()
							{
								deferred.resolve();
							});
						}
						else if($scope.Gender == GenderType.Man)
						{
							productService.GetProducts(GenderType.Man, $scope.Page, $scope.$parent.SaleOnly,
								$scope.$parent.SelectedShop, $scope.$parent.SelectedCategory).success($scope.OnProductSuccess).then(function()
							{
								deferred.resolve();
							});
						}

						return deferred.promise;
					};

					$scope.OnProductSuccess = function(response)
					{
						if(response)
						{
							angular.forEach(response, function(item)
							{
								$scope.Products.push(item);
							});
						}
						$scope.Page++;
					};

					$scope.LoadProducts();
				}])
				.controller('show-product', ["$scope", "$state", "productService", "wishlistService", function($scope, $state, productService, wishlistService)
				{
					$scope.ProductId = $state.params["id"];
					$scope.Product = {};

					productService.GetProduct($scope.ProductId).success(function(data)
					{
						$scope.Product = data;
					});

					$scope.AddToWishlist = function()
					{
						if(!$scope.IsInWishlist())
						{
							wishlistService.Add($scope.Product);

							$mdToast.show(
								$mdToast.simple()
									.content('Produkt tillagd i önskelista')
									.position('bottom right')
									.hideDelay(3000)
							);
						}
					};

					$scope.IsInWishlist = function()
					{
						return wishlistService.InWishlist($scope.Product);
					};

					$scope.ShareOnFacebook = function()
					{
						FB.ui({
							method: 'feed',
							link: 'http://klädeskampanjer.se/#!/product/' + $scope.Product.ID,
							caption: $scope.Product.Name,
							picture: $scope.Product.ImgURL,
							description: $scope.Product.Description,
							app_id: 900972389960054
						}, function(response){});
					};
				}])
				.controller('wishlist', ["$scope", "$state", "wishlistService", function($scope, $state, wishlistService)
				{
					$scope.$parent.SelectedIndex = 4;

					$scope.Wishlist = { GUID: "", Products: [] };
					wishlistService.Get($state.params["guid"]).then(function(response)
					{
						$scope.Wishlist.GUID = response.GUID;
						$scope.Wishlist.Products = response.Products;
					});

					$scope.IsMyWishList = function()
					{
						return $scope.Wishlist.GUID == wishlistService.WishList.GUID;
					};

					$scope.ShareOnFacebook = function()
					{
						FB.ui({
							method: 'feed',
							link: 'http://klädeskampanjer.se/#!/wishlist/' + $scope.Wishlist.GUID,
							caption: 'Min önskelista',
							picture: 'http://kladeskampanjer.se/content/images/wishlist.png',
							description: 'Kolla in min önskelista på klädeskampanjer.se!',
							app_id: 900972389960054
						}, function(response){});
					};
				}])
				.controller('product-bottom-sheet', ["$scope", "$state", "wishlistService", "productService", "$mdToast",
				function($scope, $state, wishlistService, productService, $mdToast)
				{
					$scope.ActiveProduct = productService.ActiveProduct;

					$scope.items = [
						{ name: 'Önskelista', icon: 'productWish' },
						{ name: 'Facebook', icon: '' },
						{ name: 'Twitter', icon: '' },
						{ name: 'Dela', icon: '' }
					];

					$scope.GoToProduct = function()
					{
						$state.go("product", {id: productService.ActiveProduct.ID});
					};

					$scope.AddToWishlist = function()
					{
						if(!$scope.IsInWishlist())
						{
							wishlistService.Add($scope.ActiveProduct);

							$mdToast.show(
								$mdToast.simple()
								.content('Produkt tillagd i önskelista')
								.position('bottom right')
								.hideDelay(3000)
							);
						}
					};

					$scope.IsInWishlist = function()
					{
						return wishlistService.InWishlist($scope.ActiveProduct);
					};

					$scope.ShareOnFacebook = function()
					{
						FB.ui({
							method: 'feed',
							link: 'http://klädeskampanjer.se/#!/product/' + productService.ActiveProduct.ID,
							caption: productService.ActiveProduct.Name,
							picture: productService.ActiveProduct.ImgURL,
							description: productService.ActiveProduct.Description,
							app_id: 900972389960054
						}, function(response){});
					};
				}])
				.controller('vouchercodes', ["$scope", "productService", function($scope, productService)
				{
					$scope.$parent.SelectedIndex = 5;

					$scope.Vouchers = [];

					$scope.GoToVoucher = function(url)
					{
						window.open(url, '_blank');
					};

					productService.GetVoucher("all").success(function(response)
					{
						$scope.Vouchers = response;
					});
				}])
				.factory('authHttpResponseInterceptor', ['$q', '$rootScope', function($q, $rootScope){
					return {
						'request': function(request)
						{
							$rootScope.RequestAmount++;
							//TODO(Victor): Add loading handling here - We can't provide the scope though.?
							return request;
						},
						'response': function(response) {
							$rootScope.RequestDone++;

							//This is for 200 status codes
							return response || $q.when(response);
						},
						'responseError': function(rejection) {
							console.log(String.format("Response Error {0}", rejection.status), rejection);

							return $q.reject(rejection);
						}
					}
				}])
				.config([
					"$compileProvider",
					"$httpProvider",
					function($compileProvider, $httpProvider)
					{
						$httpProvider.interceptors.push('authHttpResponseInterceptor');
						$compileProvider.debugInfoEnabled(false);
						$httpProvider.useApplyAsync(true);
					}
				]);
		}
    });