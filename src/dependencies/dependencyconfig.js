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

            "animate": "dependencies/angular-animate/angular-animate.min",
            "aria": "dependencies/angular-aria/angular-aria.min",
            "material": "dependencies/angular-material/angular-material.min",
            "analytics": "dependencies/angular-analytics/angular-analytics"
        },
        shim:
        {
            "app":
            {
                deps: ["ui-router", "ui-bootstrap", "material", "analytics"]
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
            },
            "analytics":
            {
                deps: ["angular"]
            }
        },
        deps:
        [
            "domready"
        ]
    };