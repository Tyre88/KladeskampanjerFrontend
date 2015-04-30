define(
	[
		"app"
	],
	function(app)
	{
		app.directive('product', ["wishlistService", "$mdBottomSheet", function(wishlistService, $mdBottomSheet)
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

					scope.ShowBottomSheet = function($event)
					{
						$mdBottomSheet.show({
							targetEvent: $event,
							templateUrl: "views/product-bottom-sheet.html",
							controller: "product-bottom-sheet"
						})
					};
				}
			};
		}])
	}
);