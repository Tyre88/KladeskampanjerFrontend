define(
	[
		"app"
	],
	function(app)
	{
		app.service('wishlistService', ["$http", "$q", "productService", function($http, $q, productService)
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
	}
);