"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GridsterUtils = (function () {
    function GridsterUtils() {
    }
    GridsterUtils.merge = function (obj1, obj2, properties) {
        for (var p in obj2) {
            if (obj2.hasOwnProperty(p) && properties.hasOwnProperty(p)) {
                if (typeof obj2[p] === 'object') {
                    obj1[p] = GridsterUtils.merge(obj1[p], obj2[p], properties[p]);
                }
                else {
                    obj1[p] = obj2[p];
                }
            }
        }
        return obj1;
    };
    GridsterUtils.debounce = function (func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    return GridsterUtils;
}());
GridsterUtils.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
GridsterUtils.ctorParameters = function () { return []; };
exports.GridsterUtils = GridsterUtils;
//# sourceMappingURL=gridsterUtils.service.js.map