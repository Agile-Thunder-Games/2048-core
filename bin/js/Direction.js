System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Direction;
    return {
        setters: [],
        execute: function () {
            (function (Direction) {
                Direction[Direction["Up"] = 0] = "Up";
                Direction[Direction["Right"] = 1] = "Right";
                Direction[Direction["Down"] = 2] = "Down";
                Direction[Direction["Left"] = 3] = "Left";
            })(Direction || (Direction = {}));
            exports_1("Direction", Direction);
        }
    };
});
