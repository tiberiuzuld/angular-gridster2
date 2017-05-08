"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var gridsterItem_component_1 = require("./gridsterItem.component");
var gridsterPreview_component_1 = require("./gridsterPreview.component");
var gridsterGrid_component_1 = require("./gridsterGrid.component");
var GridsterModule = (function () {
    function GridsterModule() {
    }
    return GridsterModule;
}());
GridsterModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [
                    gridster_component_1.GridsterComponent,
                    gridsterItem_component_1.GridsterItemComponent,
                    gridsterGrid_component_1.GridsterGridComponent,
                    gridsterPreview_component_1.GridsterPreviewComponent
                ],
                imports: [
                    common_1.CommonModule
                ],
                exports: [gridster_component_1.GridsterComponent, gridsterItem_component_1.GridsterItemComponent],
                providers: [],
                bootstrap: []
            },] },
];
/** @nocollapse */
GridsterModule.ctorParameters = function () { return []; };
exports.GridsterModule = GridsterModule;
//# sourceMappingURL=gridster.module.js.map