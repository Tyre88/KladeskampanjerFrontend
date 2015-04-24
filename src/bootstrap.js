require(
    [
        "angular",
        "app",
        "./routing.js",
        "services/productservice.js",
        "services/wishlistservice.js",
        "directives/product.js"
    ],
    function(angular)
    {
        require(["domready!"], function(document)
                {
                    return angular.bootstrap(document, ["kladeskampanjer"]);
                });
    });