"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var gridster_component_1 = require("./gridster.component");
var GridsterPreviewComponent = (function () {
    function GridsterPreviewComponent(el, gridster) {
        this.element = el.nativeElement;
        this.gridster = gridster;
        this.gridster.previewStyle = this.previewStyle.bind(this);
    }
    GridsterPreviewComponent.prototype.previewStyle = function () {
        if (!this.gridster.movingItem) {
            this.element.style.display = 'none';
        }
        else {
            var margin = 0;
            var curRowHeight = this.gridster.state.curRowHeight;
            var curColWidth = this.gridster.state.curColWidth;
            if (this.gridster.options.outerMargin) {
                margin = this.gridster.state.options.margin;
            }
            this.element.style.display = 'block';
            this.element.style.height = (this.gridster.movingItem.rows * curRowHeight - margin) + 'px';
            this.element.style.width = (this.gridster.movingItem.cols * curColWidth - margin) + 'px';
            this.element.style.top = (this.gridster.movingItem.y * curRowHeight + margin) + 'px';
            this.element.style.left = (this.gridster.movingItem.x * curColWidth + margin) + 'px';
            this.element.style.marginBottom = margin + 'px';
        }
    };
    return GridsterPreviewComponent;
}());
GridsterPreviewComponent = __decorate([
    core_1.Component({
        selector: 'gridster-preview',
        template: ''
    }),
    __param(1, core_1.Host()),
    __metadata("design:paramtypes", [core_1.ElementRef, gridster_component_1.GridsterComponent])
], GridsterPreviewComponent);
exports.GridsterPreviewComponent = GridsterPreviewComponent;
//# sourceMappingURL=gridsterPreview.component.js.map