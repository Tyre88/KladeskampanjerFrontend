var require = 
    {
        paths:
        {
            "angular": "dependencies/angular/angular.min",
            "ui-router": "dependencies/angular-ui-router/release/angular-ui-router.min",
            "app": "app",
            "domready": "dependencies/require/domready",
            "ui-bootstrap": "dependencies/ui-bootstrap-tpls-0.11.0.min",
            "jquery": "dependencies/jquery/jquery.min",

            "animate": "dependencies/angular-animate/angular-animate",
            "aria": "dependencies/angular-aria/angular-aria",
            "material": "dependencies/angular-material/angular-material"
        },
        shim:
        {
            "app":
            {
                deps: ["ui-router", "ui-bootstrap", "material"]
            },
            "ui-router":
            {
                deps: ["angular"]
            },
            "angular": 
            {
                exports: "angular",
                deps: ["jquery"]
            },
            "ui-bootstrap":
            {
                deps: ["angular"]
            },
            "material":
            {
                deps: ["animate", "aria"]
            },
            "aria":
            {
                deps: ["angular"]
            },
            "animate":
            {
                deps: ["angular"]
            }
        },
        deps:
        [
            "domready"
        ]
    };