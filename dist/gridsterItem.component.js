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
var _ = require("lodash");
var gridster_component_1 = require("./gridster.component");
var gridsterDraggable_service_1 = require("./gridsterDraggable.service");
var gridsterResizable_service_1 = require("./gridsterResizable.service");
var GridsterItemComponent = (function () {
    function GridsterItemComponent(el, gridster) {
        this.itemChange = new core_1.EventEmitter();
        this.itemResize = new core_1.EventEmitter();
        this.state = {
            element: el.nativeElement,
            item: {
                cols: undefined,
                rows: undefined,
                x: undefined,
                y: undefined,
                initCallback: undefined,
                dragEnabled: undefined,
                resizeEnabled: undefined,
                setSize: this.setSize.bind(this),
                itemChanged: this.itemChanged.bind(this),
                checkItemChanges: this.checkItemChanges.bind(this),
                drag: new gridsterDraggable_service_1.GridsterDraggable(el.nativeElement, this),
                resize: new gridsterResizable_service_1.GridsterResizable(el.nativeElement, this)
            }
        };
        this.gridster = gridster;
    }
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.state.item = _.merge(this.state.item, this.item);
        this.gridster.addItem(this.state.item);
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.gridster.removeItem(this.state.item);
    };
    GridsterItemComponent.prototype.setSize = function (noCheck) {
        if (this.gridster.state.mobile) {
            this.top = 0;
            this.left = 0;
            this.width = this.gridster.state.curWidth - (this.gridster.state.options.outerMargin ? 2 * this.gridster.state.options.margin : 0);
            this.height = this.width / 2;
        }
        else {
            this.top = this.state.item.y * this.gridster.state.curRowHeight;
            this.left = this.state.item.x * this.gridster.state.curColWidth;
            this.width = this.state.item.cols * this.gridster.state.curColWidth - this.gridster.state.options.margin;
            this.height = this.state.item.rows * this.gridster.state.curRowHeight - this.gridster.state.options.margin;
        }
        if (!noCheck && this.top === this.itemTop && this.left === this.itemLeft &&
            this.width === this.itemWidth && this.height === this.itemHeight) {
            return;
        }
        if (this.gridster.state.options.outerMargin) {
            this.itemMargin = this.gridster.state.options.margin;
        }
        else {
            this.itemMargin = 0;
        }
        this.state.element.style.display = 'block';
        this.state.element.style.top = this.top + 'px';
        this.state.element.style.left = this.left + 'px';
        this.state.element.style.width = this.width + 'px';
        this.state.element.style.height = this.height + 'px';
        this.state.element.style.margin = this.itemMargin + 'px';
        if (this.width !== this.itemWidth || this.height !== this.itemHeight) {
            this.itemResize.emit(this.state.item);
            if (this.gridster.state.options.itemResizeCallback) {
                this.gridster.state.options.itemResizeCallback(this.state.item, this);
            }
        }
        this.itemTop = this.top;
        this.itemLeft = this.left;
        this.itemWidth = this.width;
        this.itemHeight = this.height;
    };
    GridsterItemComponent.prototype.itemChanged = function () {
        this.itemChange.emit(this.state.item);
        if (this.gridster.state.options.itemChangeCallback) {
            this.gridster.state.options.itemChangeCallback(this.state.item, this);
        }
    };
    GridsterItemComponent.prototype.checkItemChanges = function (newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
            return;
        }
        if (this.gridster.checkCollision(this.state.item)) {
            this.state.item.x = oldValue.x;
            this.state.item.y = oldValue.y;
            this.state.item.cols = oldValue.cols;
            this.state.item.rows = oldValue.rows;
        }
        else {
            this.item.cols = this.state.item.cols;
            this.item.rows = this.state.item.rows;
            this.item.x = this.state.item.x;
            this.item.y = this.state.item.y;
            this.gridster.calculateLayout();
            this.itemChanged();
        }
    };
    return GridsterItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], GridsterItemComponent.prototype, "item", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], GridsterItemComponent.prototype, "itemChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], GridsterItemComponent.prototype, "itemResize", void 0);
GridsterItemComponent = __decorate([
    core_1.Component({
        selector: 'gridster-item',
        template: require('./gridsterItem.html'),
        styles: [require('./gridsterItem.css')]
    }),
    __param(1, core_1.Host()),
    __metadata("design:paramtypes", [core_1.ElementRef, gridster_component_1.GridsterComponent])
], GridsterItemComponent);
exports.GridsterItemComponent = GridsterItemComponent;
//# sourceMappingURL=gridsterItem.component.js.map