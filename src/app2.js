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

LoadCss("content/css/font-awesome.min.css");

angular.module('kladeskampanjer', ['ng', 'ui.router', 'ui.bootstrap', 'ngMaterial', 'analytics', 'webbdudes-loader'])
	.config(["$mdThemingProvider", "$locationProvider",function($mdThemingProvider, $location)
	{
		$mdThemingProvider.theme('default')
			.primaryPalette('pink')
			.accentPalette('orange');

		$location.hashPrefix('!');
	}])
	.config(
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
						url: "/kvinna/:shop",
						templateUrl: "views/products.html",
						controller: "products"
					})
					.state('woman-category',
					{
						url:"/kvinna/:shop/kategori/:category",
						templateUrl: "views/products.html",
						controller: "products"
					})
					.state('man',
					{
						url: "/man/:shop",
						templateUrl: "views/products.html",
						controller: "products"
					})
					.state('man-category',
					{
						url:"/man/:shop/kategori/:category",
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
					})
					.state('vouchercodes',
					{
						url: "/rabattkoder",
						templateUrl: "views/vouchercodes.html",
						controller: "vouchercodes"
					});
			}
		]
	)
	.service('wishlistService', ["$http", "$q", function($http, $q)
	{
		this.WishList = {};

		if(localStorage.getItem('wishlist'))
		{
			this.WishList = JSON.parse(localStorage.getItem('wishlist'));
		}
		else
		{
			this.WishList.GUID = guid();
			this.WishList.Products = [];

			localStorage.setItem('wishlist', JSON.stringify(this.WishList));
		}

		this.Add = function(product)
		{
			this.WishList.Products.push(product);
			localStorage.setItem('wishlist', JSON.stringify(this.WishList));

			var postList = {GUID: this.WishList.GUID, Products: JSON.stringify(this.WishList.Products)};

			$http.post('http://new.kladeskampanjer.se/api/wishlist/savewishlist', postList).success(function()
			{

			});
		};

		this.Delete = function(product)
		{
			var index = this.WishList.Products.indexOf(product);
			if(index > -1)
			{
				this.WishList.Products.splice(index, 1);
			}

			localStorage.setItem('wishlist', JSON.stringify(this.WishList));

			var postList = {GUID: this.WishList.GUID, Products: JSON.stringify(this.WishList.Products)};

			$http.post('http://new.kladeskampanjer.se/api/wishlist/savewishlist', postList).success(function()
			{

			});
		};

		this.Get = function(guid)
		{
			var deferred = $q.defer();
			if(guid == this.WishList.GUID)
			{
				var WishListToReturn = this.WishList;

				setTimeout(function()
				{
					deferred.resolve(WishListToReturn);
				}, 0);
			}
			else
			{
				$http.get('http://new.kladeskampanjer.se/api/wishlist/getwishlist/' + guid).success(function(response)
				{
					var WishListToReturn = { GUID: "", Products: [] };
					WishListToReturn.GUID = response.GUID;
					WishListToReturn.Products = JSON.parse(response.Products);
					deferred.resolve(WishListToReturn);
				});
			}

			return deferred.promise;
		};

		this.InWishlist = function(product)
		{
			for(var i = 0; i < this.WishList.Products.length; i++)
			{
				if(this.WishList.Products[i].ID == product.ID)
				{
					return true;
				}
			}

			return false;
		};
	}])
	.service('productService', ["$http", function($http)
	{
		var Shops = undefined;
		var ManCategories = undefined;
		var WomanCategories = undefined;

		this.ActiveProduct = {};

		this.GetRandom = function(genderType)
		{
			switch (genderType)
			{
				case GenderType.Woman:
					return $http.get("http://new.kladeskampanjer.se/api/products/getrandom/kvinna");
					break;
				case GenderType.Man:
					return $http.get("http://new.kladeskampanjer.se/api/products/getrandom/man");
					break;
				default:
					return $http.get("http://new.kladeskampanjer.se/api/products/getrandom/kvinna");
					break;
			}
		};

		this.GetProducts = function(genderType, page, isSale, shop, category)
		{
			var action = "getproducts";
			var shopString = "";

			if(isSale)
			{
				action = "getsaleproducts";
			}

			if(shop && shop != "all")
			{
				shopString = shop;
			}

			switch (genderType)
			{
				case GenderType.Woman:
					if(category != undefined && category == "all")
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/kvinna/" + page + "?shop=" + shopString);
					}
					else
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/kvinna/" + category + "/" + page + "?shop=" + shopString);
					}
					break;
				case GenderType.Man:
					if(category != undefined && category == "all")
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/man/" + page + "?shop=" + shopString);
					}
					else
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/man/" + category + "/" + page + "?shop=" + shopString);
					}
					break;
				default:
					if(category != undefined && category == "all")
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/kvinna/" + page + "?shop=" + shopString);
					}
					else
					{
						return $http.get("http://new.kladeskampanjer.se/api/products/" + action + "/kvinna/" + category + "/" + page + "?shop=" + shopString);
					}
					break;
			}
		};

		this.GetShops = function()
		{
			return $http.get('http://new.kladeskampanjer.se/api/get/getshops');
		};

		this.GetCategories = function(gender)
		{
			if(gender == GenderType.Woman)
			{
				return $http.get('http://new.kladeskampanjer.se/api/get/getcategories/kvinna');
			}
			else if(gender == GenderType.Man)
			{
				return $http.get('http://new.kladeskampanjer.se/api/get/getcategories/man');
			}
		};

		this.GetProduct = function(id)
		{
			return $http.get('http://new.kladeskampanjer.se/api/products/getproduct/' + id);
		};

		this.GetVoucher = function(shop)
		{
			return $http.get('http://new.kladeskampanjer.se/api/voucher/get/' + shop);
		};

		this.InsertClickToVoucher = function(id)
		{
			return $http.post('http://localhost:19722/api/voucher/insertclick/', { id: id });
		};
	}])
	.directive('product', ["wishlistService", "productService", "$mdBottomSheet", function(wishlistService, productService, $mdBottomSheet)
	{
		return {
			restrict: "E",
			scope:
			{
				ngModel: "=",
				WishlistRemove: "=wishlistRemove"
			},
			templateUrl: "views/product.html",
			link: function(scope, element, attr)
			{
				element.on('click', function()
				{
					window.open(scope.ngModel.ProductLink, '_blank');
				});

				scope.RemoveFromWishlist = function()
				{
					wishlistService.Delete(scope.ngModel);
				};

				scope.ShowBottomSheet = function($event)
				{
					productService.ActiveProduct = scope.ngModel;

					$mdBottomSheet.show({
						targetEvent: $event,
						templateUrl: "views/product-bottom-sheet.html",
						controller: "product-bottom-sheet"
					})
				};
			}
		};
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
	.controller('index', ["$scope", "$rootScope", "$state", "productService", "wishlistService", "analytics", "loaderService",
						  function($scope, $rootScope, $state, productService, wishlistService, analytics, loaderService)
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

							  loaderService.Color = "rgb(233,30,99)";
							  loaderService.ApplyColors();

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

							  /*$rootScope.$watch("RequestDone", function(newVal, oldVal)
							   {
							   if(newVal >= $rootScope.RequestAmount && newVal != oldVal)
							   {
							   $rootScope.RequestAmount = 0;
							   $rootScope.RequestDone = 0;
							   $scope.PercentLoaded = 100;
							   }
							   else if(newVal != oldVal)
							   {
							   $scope.PercentLoaded = ($rootScope.RequestDone / $rootScope.RequestAmount) * 100;
							   }
							   });*/

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

		$scope.GoToVoucher = function(voucher)
		{
			productService.InsertClickToVoucher(voucher.ID);
			window.open(voucher.Link, '_blank');
		};

		productService.GetVoucher("all").success(function(response)
		{
			$scope.Vouchers = response;
		});
	}])
	.factory('authHttpResponseInterceptor', ['$q', '$rootScope', "loaderService", function($q, $rootScope, loaderService){
		return {
			'request': function(request)
			{
				$rootScope.RequestAmount++;
				//TODO(Victor): Add loading handling here - We can't provide the scope though.?
				loaderService.ShowLoading();
				return request;
			},
			'response': function(response) {
				$rootScope.RequestDone++;
				loaderService.HideLoading();
				//This is for 200 status codes
				return response || $q.when(response);
			},
			'responseError': function(rejection) {
				console.log(String.format("Response Error {0}", rejection.status), rejection);
				loaderService.HideLoading();
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

