"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var GridsterGridComponent = (function () {
    function GridsterGridComponent(el, gridster, renderer) {
        this.renderer = renderer;
        this.el = el.nativeElement;
        this.gridster = gridster;
        this.gridster.gridLines = this;
        this.columns = [];
        this.rows = [];
        this.height = 0;
        this.width = 0;
        this.columnsHeight = 0;
        this.rowsWidth = 0;
    }
    GridsterGridComponent.prototype.updateGrid = function (dragOn) {
        if (this.gridster.$options.displayGrid === 'always' && !this.gridster.mobile) {
            this.renderer.setStyle(this.el, 'display', 'block');
        }
        else if (this.gridster.$options.displayGrid === 'onDrag&Resize' && dragOn) {
            this.renderer.setStyle(this.el, 'display', 'block');
        }
        else if (this.gridster.$options.displayGrid === 'none' || !dragOn || this.gridster.mobile) {
            this.renderer.setStyle(this.el, 'display', 'none');
            return;
        }
        this.margin = this.gridster.$options.margin;
        this.height = this.gridster.curRowHeight - this.margin;
        this.width = this.gridster.curColWidth - this.margin;
        this.columns.length = Math.max(this.gridster.columns, Math.floor(this.gridster.curWidth / this.gridster.curColWidth));
        this.rows.length = Math.max(this.gridster.rows, Math.floor(this.gridster.curHeight / this.gridster.curRowHeight));
        this.columnsHeight = this.gridster.curRowHeight * this.rows.length;
        this.rowsWidth = this.gridster.curColWidth * this.columns.length;
    };
    return GridsterGridComponent;
}());
GridsterGridComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'gridster-grid',
                template: "<div class=\"columns\" [style.height.px]=\"columnsHeight\">   <div class=\"column\" *ngFor=\"let column of columns\" [style.min-width.px]=\"width\" [style.margin-left.px]=\"margin\"></div> </div> <div class=\"rows\" [style.width.px]=\"rowsWidth\">   <div class=\"row\" *ngFor=\"let row of rows\" [style.height.px]=\"height\" [style.margin-top.px]=\"margin\"></div> </div>",
                styles: [":host {   display: none;   position: absolute; }  .rows, .columns {   position: absolute; }  .columns {   display: flex;   flex-direction: row; }  .column, .row {   transition: .3s;   box-sizing: border-box; }  .column {   height: 100%;   border-left: 1px solid white;   border-right: 1px solid white; }  .row {   width: 100%;   border-top: 1px solid white;   border-bottom: 1px solid white; }"]
            },] },
];
/** @nocollapse */
GridsterGridComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: gridster_component_1.GridsterComponent, decorators: [{ type: core_1.Host },] },
    { type: core_1.Renderer2, },
]; };
exports.GridsterGridComponent = GridsterGridComponent;
//# sourceMappingURL=gridsterGrid.component.js.map