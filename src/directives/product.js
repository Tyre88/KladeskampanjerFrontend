define(
	[
		"app"
	],
	function(app)
	{
		app.directive('product', ["wishlistService", "productService", "$mdBottomSheet", function(wishlistService, productService, $mdBottomSheet)
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
	}
);