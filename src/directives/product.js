define(
	[
		"app"
	],
	function(app)
	{
		app.directive('product', ["wishlistService", function(wishlistService)
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

					scope.AddToWishlist = function()
					{
						if(!scope.IsInWishlist())
						{
							wishlistService.Add(scope.ngModel);
						}
					};

					scope.RemoveFromWishlist = function()
					{
						wishlistService.Delete(scope.ngModel);
					};

					scope.IsInWishlist = function()
					{
						return wishlistService.InWishlist(scope.ngModel);
					};
				}
			};
		}])
	}
);