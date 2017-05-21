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
            this.renderer.setStyle(this.el, 'display', 'none');
        }
        else {
            var margin = 0;
            var curRowHeight = this.gridster.curRowHeight;
            var curColWidth = this.gridster.curColWidth;
            if (this.gridster.$options.outerMargin) {
                margin = this.gridster.$options.margin;
            }
            this.renderer.setStyle(this.el, 'display', 'block');
            this.renderer.setStyle(this.el, 'height', (this.gridster.movingItem.$item.rows * curRowHeight - margin) + 'px');
            this.renderer.setStyle(this.el, 'width', (this.gridster.movingItem.$item.cols * curColWidth - margin) + 'px');
            this.renderer.setStyle(this.el, 'top', (this.gridster.movingItem.$item.y * curRowHeight + margin) + 'px');
            this.renderer.setStyle(this.el, 'left', (this.gridster.movingItem.$item.x * curColWidth + margin) + 'px');
            this.renderer.setStyle(this.el, 'marginBottom', margin + 'px');
        }
    };
    return GridsterPreviewComponent;
}());
GridsterPreviewComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster-preview',
                template: '',
                styles: [":host {   background: rgba(0, 0, 0, 0.15);   position: absolute; }"]
            },] },
];
/** @nocollapse */
GridsterPreviewComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
    { type: core_1.Renderer2, },
]; };
exports.GridsterPreviewComponent = GridsterPreviewComponent;
//# sourceMappingURL=gridsterPreview.component.js.map