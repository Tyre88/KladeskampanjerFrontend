require.config({
    urlArgs: "v=0.1.7"
});

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
        return angular.bootstrap(document, ["kladeskampanjer"]);

    });