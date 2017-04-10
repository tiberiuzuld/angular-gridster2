"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var GridsterPreviewComponent = (function () {
    function GridsterPreviewComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.previewStyle = this.previewStyle.bind(this);
    }
    GridsterPreviewComponent.prototype.previewStyle = function () {
        if (!this.gridster.movingItem) {
            this.renderer.setElementStyle(this.el, 'display', 'none');
        }
        else {
            var margin = 0;
            var curRowHeight = this.gridster.state.curRowHeight;
            var curColWidth = this.gridster.state.curColWidth;
            if (this.gridster.options.outerMargin) {
                margin = this.gridster.state.options.margin;
            }
            this.renderer.setElementStyle(this.el, 'display', 'block');
            this.renderer.setElementStyle(this.el, 'height', (this.gridster.movingItem.rows * curRowHeight - margin) + 'px');
            this.renderer.setElementStyle(this.el, 'width', (this.gridster.movingItem.cols * curColWidth - margin) + 'px');
            this.renderer.setElementStyle(this.el, 'top', (this.gridster.movingItem.y * curRowHeight + margin) + 'px');
            this.renderer.setElementStyle(this.el, 'left', (this.gridster.movingItem.x * curColWidth + margin) + 'px');
            this.renderer.setElementStyle(this.el, 'marginBottom', margin + 'px');
        }
    };
    return GridsterPreviewComponent;
}());
GridsterPreviewComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster-preview',
                template: ''
            },] },
];
/** @nocollapse */
GridsterPreviewComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
    { type: core_1.Renderer, },
]; };
exports.GridsterPreviewComponent = GridsterPreviewComponent;
//# sourceMappingURL=gridsterPreview.component.js.map