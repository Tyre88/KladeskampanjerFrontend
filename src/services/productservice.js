define(
	[
		"app"
	],
	function(app)
	{
		app.service('productService', ["$http", function($http)
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
		}]);
	}
);