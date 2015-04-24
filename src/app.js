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
			return angular.module('kladeskampanjer', ['ng', 'ui.router', 'ui.bootstrap', 'ngMaterial'])
                .config(function($mdThemingProvider)
                {
                    $mdThemingProvider.theme('default')
                        .primaryPalette('pink')
                        .accentPalette('orange');
                })
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
				.controller('index', ["$scope", "$state", "productService", "wishlistService", function($scope, $state, productService, wishlistService)
				{
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

					$state.go("home");
				}])
				.controller('home', ["$scope", "productService", function($scope, productService)
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
							$http.post("http://new.kladeskampanjer.se/api/contact/contactus", {email: $scope.Email, message: $scope.Message}).success(function(response)
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
				.controller('products', ["$scope", "$state", "$q", "productService", function($scope, $state, $q, productService)
				{
					$scope.Gender = GenderType.Woman;
					$scope.Products = [];
					$scope.Page = 1;

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
							$scope.Page = 1;
							$scope.Products = [];
							$scope.LoadProducts();
						}
					});

					$scope.$watch('$parent.SelectedCategory', function(newValue, oldValue)
					{
						if(newValue != oldValue)
						{
							$scope.Page = 1;
							$scope.Products = [];
							$scope.LoadProducts();
						}
					});

					switch ($state.current.name)
					{
						case "woman":
							$scope.$parent.SelectedIndex = 2;
							$scope.Gender = GenderType.Woman;
							break;
						case "man":
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
				.controller('wishlist', ["$scope", "$state", "wishlistService", function($scope, $state, wishlistService)
				{
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
				}])
				.config([
					"$compileProvider",
					"$httpProvider",
					function($compileProvider, $httpProvider)
					{
						$compileProvider.debugInfoEnabled(false);
						$httpProvider.useApplyAsync(true);
					}
				]);
		}
    });