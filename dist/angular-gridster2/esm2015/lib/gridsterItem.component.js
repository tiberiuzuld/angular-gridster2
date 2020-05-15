import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewEncapsulation, Inject, HostBinding } from '@angular/core';
import { GridsterDraggable } from './gridsterDraggable.service';
import { GridsterResizable } from './gridsterResizable.service';
import { GridsterUtils } from './gridsterUtils.service';
import { GridsterComponent } from './gridster.component';
let GridsterItemComponent = class GridsterItemComponent {
    constructor(el, gridster, renderer, zone) {
        this.renderer = renderer;
        this.zone = zone;
        this.el = el.nativeElement;
        this.$item = {
            cols: -1,
            rows: -1,
            x: -1,
            y: -1,
        };
        this.gridster = gridster;
        this.drag = new GridsterDraggable(this, gridster, this.zone);
        this.resize = new GridsterResizable(this, gridster, this.zone);
    }
    get zIndex() {
        return this.getLayerIndex() + this.gridster.$options.baseLayerIndex;
    }
    ngOnInit() {
        this.updateOptions();
        this.gridster.addItem(this);
    }
    updateOptions() {
        this.$item = GridsterUtils.merge(this.$item, this.item, {
            cols: undefined,
            rows: undefined,
            x: undefined,
            y: undefined,
            layerIndex: undefined,
            dragEnabled: undefined,
            resizeEnabled: undefined,
            compactEnabled: undefined,
            maxItemRows: undefined,
            minItemRows: undefined,
            maxItemCols: undefined,
            minItemCols: undefined,
            maxItemArea: undefined,
            minItemArea: undefined,
        });
    }
    ngOnDestroy() {
        this.gridster.removeItem(this);
        delete this.gridster;
        this.drag.destroy();
        delete this.drag;
        this.resize.destroy();
        delete this.resize;
    }
    setSize() {
        this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
        this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
        this.updateItemSize();
    }
    updateItemSize() {
        const top = this.$item.y * this.gridster.curRowHeight;
        const left = this.$item.x * this.gridster.curColWidth;
        const width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
        const height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
        if (!this.init && width > 0 && height > 0) {
            this.init = true;
            if (this.item.initCallback) {
                this.item.initCallback(this.item, this);
            }
            if (this.gridster.options.itemInitCallback) {
                this.gridster.options.itemInitCallback(this.item, this);
            }
            if (this.gridster.$options.scrollToNewItems) {
                this.el.scrollIntoView(false);
            }
        }
        if (width !== this.width || height !== this.height) {
            this.width = width;
            this.height = height;
            if (this.gridster.options.itemResizeCallback) {
                this.gridster.options.itemResizeCallback(this.item, this);
            }
        }
        this.top = top;
        this.left = left;
    }
    itemChanged() {
        if (this.gridster.options.itemChangeCallback) {
            this.gridster.options.itemChangeCallback(this.item, this);
        }
    }
    checkItemChanges(newValue, oldValue) {
        if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
            return;
        }
        if (this.gridster.checkCollision(this.$item)) {
            this.$item.x = oldValue.x || 0;
            this.$item.y = oldValue.y || 0;
            this.$item.cols = oldValue.cols || 1;
            this.$item.rows = oldValue.rows || 1;
            this.setSize();
        }
        else {
            this.item.cols = this.$item.cols;
            this.item.rows = this.$item.rows;
            this.item.x = this.$item.x;
            this.item.y = this.$item.y;
            this.gridster.calculateLayoutDebounce();
            this.itemChanged();
        }
    }
    canBeDragged() {
        return !this.gridster.mobile &&
            (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
    }
    canBeResized() {
        return !this.gridster.mobile &&
            (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
    }
    bringToFront(offset) {
        if (offset && offset <= 0) {
            return;
        }
        const layerIndex = this.getLayerIndex();
        const topIndex = this.gridster.$options.maxLayerIndex;
        if (layerIndex < topIndex) {
            const targetIndex = offset ? layerIndex + offset : topIndex;
            this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
        }
    }
    sendToBack(offset) {
        if (offset && offset <= 0) {
            return;
        }
        const layerIndex = this.getLayerIndex();
        if (layerIndex > 0) {
            const targetIndex = offset ? layerIndex - offset : 0;
            this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex;
        }
    }
    getLayerIndex() {
        if (this.item.layerIndex !== undefined) {
            return this.item.layerIndex;
        }
        if (this.gridster.$options.defaultLayerIndex !== undefined) {
            return this.gridster.$options.defaultLayerIndex;
        }
        return 0;
    }
};
GridsterItemComponent.ctorParameters = () => [
    { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] },
    { type: GridsterComponent },
    { type: Renderer2, decorators: [{ type: Inject, args: [Renderer2,] }] },
    { type: NgZone, decorators: [{ type: Inject, args: [NgZone,] }] }
];
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], GridsterItemComponent.prototype, "item", void 0);
tslib_1.__decorate([
    HostBinding('style.z-index'),
    tslib_1.__metadata("design:type", Number),
    tslib_1.__metadata("design:paramtypes", [])
], GridsterItemComponent.prototype, "zIndex", null);
GridsterItemComponent = tslib_1.__decorate([
    Component({
        selector: 'gridster-item',
        template: "<ng-content></ng-content>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.s && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-s\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.e && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-e\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.n && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-n\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.w && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-w\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.se && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-se\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.ne && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-ne\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.sw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-sw\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.nw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-nw\"></div>\n",
        encapsulation: ViewEncapsulation.None,
        styles: ["gridster-item{box-sizing:border-box;z-index:1;position:absolute;overflow:hidden;-webkit-transition:.3s;transition:.3s;display:none;background:#fff;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}gridster-item.gridster-item-moving{cursor:move}gridster-item.gridster-item-moving,gridster-item.gridster-item-resizing{-webkit-transition:none;transition:none;z-index:2;box-shadow:0 0 5px 5px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.gridster-item-resizable-handler{position:absolute;z-index:2}.gridster-item-resizable-handler.handle-n{cursor:ns-resize;height:10px;right:0;top:0;left:0}.gridster-item-resizable-handler.handle-e{cursor:ew-resize;width:10px;bottom:0;right:0;top:0}.gridster-item-resizable-handler.handle-s{cursor:ns-resize;height:10px;right:0;bottom:0;left:0}.gridster-item-resizable-handler.handle-w{cursor:ew-resize;width:10px;left:0;top:0;bottom:0}.gridster-item-resizable-handler.handle-ne{cursor:ne-resize;width:10px;height:10px;right:0;top:0}.gridster-item-resizable-handler.handle-nw{cursor:nw-resize;width:10px;height:10px;left:0;top:0}.gridster-item-resizable-handler.handle-se{cursor:se-resize;width:0;height:0;right:0;bottom:0;border-style:solid;border-width:0 0 10px 10px;border-color:transparent}.gridster-item-resizable-handler.handle-sw{cursor:sw-resize;width:10px;height:10px;left:0;bottom:0}gridster-item:hover .gridster-item-resizable-handler.handle-se{border-color:transparent transparent #ccc}"]
    }),
    tslib_1.__param(0, Inject(ElementRef)), tslib_1.__param(2, Inject(Renderer2)), tslib_1.__param(3, Inject(NgZone)),
    tslib_1.__metadata("design:paramtypes", [ElementRef, GridsterComponent, Renderer2, NgZone])
], GridsterItemComponent);
export { GridsterItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJJdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVySXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXRELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBUXZELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBbUJoQyxZQUFnQyxFQUFjLEVBQUcsUUFBMkIsRUFBNEIsUUFBbUIsRUFBMEIsSUFBWTtRQUF6RCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQTBCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDL0osSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNSLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ04sQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJ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QUFrQztRQUVsQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7S0FDdEMsQ0FBQztJQW9CYSxtQkFBQSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUEsRUFBZ0QsbUJBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBLEVBQThCLG1CQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTs2Q0FBeEcsVUFBVSxFQUFhLGlCQUFpQixFQUFzQyxTQUFTLEVBQWdDLE1BQU07R0FuQnRKLHFCQUFxQixDQXdLakM7U0F4S1kscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0LFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtHcmlkc3Rlckl0ZW19IGZyb20gJy4vZ3JpZHN0ZXJJdGVtLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyRHJhZ2dhYmxlfSBmcm9tICcuL2dyaWRzdGVyRHJhZ2dhYmxlLnNlcnZpY2UnO1xuaW1wb3J0IHtHcmlkc3RlclJlc2l6YWJsZX0gZnJvbSAnLi9ncmlkc3RlclJlc2l6YWJsZS5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJVdGlsc30gZnJvbSAnLi9ncmlkc3RlclV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHtHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2V9IGZyb20gJy4vZ3JpZHN0ZXJJdGVtQ29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50fSBmcm9tICcuL2dyaWRzdGVyLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dyaWRzdGVyLWl0ZW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vZ3JpZHN0ZXJJdGVtLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9ncmlkc3Rlckl0ZW0uY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZSB7XG4gIEBJbnB1dCgpIGl0ZW06IEdyaWRzdGVySXRlbTtcbiAgJGl0ZW06IEdyaWRzdGVySXRlbTtcbiAgZWw6IGFueTtcbiAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50O1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZHJhZzogR3JpZHN0ZXJEcmFnZ2FibGU7XG4gIHJlc2l6ZTogR3JpZHN0ZXJSZXNpemFibGU7XG4gIG5vdFBsYWNlZDogYm9vbGVhbjtcbiAgaW5pdDogYm9vbGVhbjtcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLnotaW5kZXgnKVxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGF5ZXJJbmRleCgpICsgdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5iYXNlTGF5ZXJJbmRleDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRWxlbWVudFJlZikgZWw6IEVsZW1lbnRSZWYsICBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnQsIEBJbmplY3QoUmVuZGVyZXIyKSBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgQEluamVjdChOZ1pvbmUpIHByaXZhdGUgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5lbCA9IGVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy4kaXRlbSA9IHtcbiAgICAgIGNvbHM6IC0xLFxuICAgICAgcm93czogLTEsXG4gICAgICB4OiAtMSxcbiAgICAgIHk6IC0xLFxuICAgIH07XG4gICAgdGhpcy5ncmlkc3RlciA9IGdyaWRzdGVyO1xuICAgIHRoaXMuZHJhZyA9IG5ldyBHcmlkc3RlckRyYWdnYWJsZSh0aGlzLCBncmlkc3RlciwgdGhpcy56b25lKTtcbiAgICB0aGlzLnJlc2l6ZSA9IG5ldyBHcmlkc3RlclJlc2l6YWJsZSh0aGlzLCBncmlkc3RlciwgdGhpcy56b25lKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlT3B0aW9ucygpO1xuICAgIHRoaXMuZ3JpZHN0ZXIuYWRkSXRlbSh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZU9wdGlvbnMoKTogdm9pZCB7XG4gICAgdGhpcy4kaXRlbSA9IEdyaWRzdGVyVXRpbHMubWVyZ2UodGhpcy4kaXRlbSwgdGhpcy5pdGVtLCB7XG4gICAgICBjb2xzOiB1bmRlZmluZWQsXG4gICAgICByb3dzOiB1bmRlZmluZWQsXG4gICAgICB4OiB1bmRlZmluZWQsXG4gICAgICB5OiB1bmRlZmluZWQsXG4gICAgICBsYXllckluZGV4OiB1bmRlZmluZWQsXG4gICAgICBkcmFnRW5hYmxlZDogdW5kZWZpbmVkLFxuICAgICAgcmVzaXplRW5hYmxlZDogdW5kZWZpbmVkLFxuICAgICAgY29tcGFjdEVuYWJsZWQ6IHVuZGVmaW5lZCxcbiAgICAgIG1heEl0ZW1Sb3dzOiB1bmRlZmluZWQsXG4gICAgICBtaW5JdGVtUm93czogdW5kZWZpbmVkLFxuICAgICAgbWF4SXRlbUNvbHM6IHVuZGVmaW5lZCxcbiAgICAgIG1pbkl0ZW1Db2xzOiB1bmRlZmluZWQsXG4gICAgICBtYXhJdGVtQXJlYTogdW5kZWZpbmVkLFxuICAgICAgbWluSXRlbUFyZWE6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZHN0ZXIucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICBkZWxldGUgdGhpcy5ncmlkc3RlcjtcbiAgICB0aGlzLmRyYWcuZGVzdHJveSgpO1xuICAgIGRlbGV0ZSB0aGlzLmRyYWc7XG4gICAgdGhpcy5yZXNpemUuZGVzdHJveSgpO1xuICAgIGRlbGV0ZSB0aGlzLnJlc2l6ZTtcbiAgfVxuXG4gIHNldFNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLCAnZGlzcGxheScsIHRoaXMubm90UGxhY2VkID8gJycgOiAnYmxvY2snKTtcbiAgICB0aGlzLmdyaWRzdGVyLmdyaWRSZW5kZXJlci51cGRhdGVJdGVtKHRoaXMuZWwsIHRoaXMuJGl0ZW0sIHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMudXBkYXRlSXRlbVNpemUoKTtcbiAgfVxuXG4gIHVwZGF0ZUl0ZW1TaXplKCkge1xuICAgIGNvbnN0IHRvcCA9IHRoaXMuJGl0ZW0ueSAqIHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0O1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLiRpdGVtLnggKiB0aGlzLmdyaWRzdGVyLmN1ckNvbFdpZHRoO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy4kaXRlbS5jb2xzICogdGhpcy5ncmlkc3Rlci5jdXJDb2xXaWR0aCAtIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuJGl0ZW0ucm93cyAqIHRoaXMuZ3JpZHN0ZXIuY3VyUm93SGVpZ2h0IC0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXJnaW47XG5cbiAgICBpZiAoIXRoaXMuaW5pdCAmJiB3aWR0aCA+IDAgJiYgaGVpZ2h0ID4gMCkge1xuICAgICAgdGhpcy5pbml0ID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLml0ZW0uaW5pdENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuaXRlbS5pbml0Q2FsbGJhY2sodGhpcy5pdGVtLCB0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuaXRlbUluaXRDYWxsYmFjaykge1xuICAgICAgICB0aGlzLmdyaWRzdGVyLm9wdGlvbnMuaXRlbUluaXRDYWxsYmFjayh0aGlzLml0ZW0sIHRoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuc2Nyb2xsVG9OZXdJdGVtcykge1xuICAgICAgICB0aGlzLmVsLnNjcm9sbEludG9WaWV3KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLndpZHRoIHx8IGhlaWdodCAhPT0gdGhpcy5oZWlnaHQpIHtcbiAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5pdGVtUmVzaXplQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLml0ZW1SZXNpemVDYWxsYmFjayh0aGlzLml0ZW0sIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICB9XG5cbiAgaXRlbUNoYW5nZWQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5pdGVtQ2hhbmdlQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5pdGVtQ2hhbmdlQ2FsbGJhY2sodGhpcy5pdGVtLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0l0ZW1DaGFuZ2VzKG5ld1ZhbHVlOiBHcmlkc3Rlckl0ZW0sIG9sZFZhbHVlOiBHcmlkc3Rlckl0ZW0pOiB2b2lkIHtcbiAgICBpZiAobmV3VmFsdWUucm93cyA9PT0gb2xkVmFsdWUucm93cyAmJiBuZXdWYWx1ZS5jb2xzID09PSBvbGRWYWx1ZS5jb2xzICYmIG5ld1ZhbHVlLnggPT09IG9sZFZhbHVlLnggJiYgbmV3VmFsdWUueSA9PT0gb2xkVmFsdWUueSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5ncmlkc3Rlci5jaGVja0NvbGxpc2lvbih0aGlzLiRpdGVtKSkge1xuICAgICAgdGhpcy4kaXRlbS54ID0gb2xkVmFsdWUueCB8fCAwO1xuICAgICAgdGhpcy4kaXRlbS55ID0gb2xkVmFsdWUueSB8fCAwO1xuICAgICAgdGhpcy4kaXRlbS5jb2xzID0gb2xkVmFsdWUuY29scyB8fCAxO1xuICAgICAgdGhpcy4kaXRlbS5yb3dzID0gb2xkVmFsdWUucm93cyB8fCAxO1xuICAgICAgdGhpcy5zZXRTaXplKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbS5jb2xzID0gdGhpcy4kaXRlbS5jb2xzO1xuICAgICAgdGhpcy5pdGVtLnJvd3MgPSB0aGlzLiRpdGVtLnJvd3M7XG4gICAgICB0aGlzLml0ZW0ueCA9IHRoaXMuJGl0ZW0ueDtcbiAgICAgIHRoaXMuaXRlbS55ID0gdGhpcy4kaXRlbS55O1xuICAgICAgdGhpcy5ncmlkc3Rlci5jYWxjdWxhdGVMYXlvdXREZWJvdW5jZSgpO1xuICAgICAgdGhpcy5pdGVtQ2hhbmdlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGNhbkJlRHJhZ2dlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZ3JpZHN0ZXIubW9iaWxlICYmXG4gICAgICAodGhpcy4kaXRlbS5kcmFnRW5hYmxlZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kcmFnZ2FibGUuZW5hYmxlZCA6IHRoaXMuJGl0ZW0uZHJhZ0VuYWJsZWQpO1xuICB9XG5cbiAgY2FuQmVSZXNpemVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5ncmlkc3Rlci5tb2JpbGUgJiZcbiAgICAgICh0aGlzLiRpdGVtLnJlc2l6ZUVuYWJsZWQgPT09IHVuZGVmaW5lZCA/IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMucmVzaXphYmxlLmVuYWJsZWQgOiB0aGlzLiRpdGVtLnJlc2l6ZUVuYWJsZWQpO1xuICB9XG5cbiAgYnJpbmdUb0Zyb250KG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKG9mZnNldCAmJiBvZmZzZXQgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsYXllckluZGV4ID0gdGhpcy5nZXRMYXllckluZGV4KCk7XG4gICAgY29uc3QgdG9wSW5kZXggPSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1heExheWVySW5kZXg7XG4gICAgaWYgKGxheWVySW5kZXggPCB0b3BJbmRleCkge1xuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBvZmZzZXQgPyBsYXllckluZGV4ICsgb2Zmc2V0IDogdG9wSW5kZXg7XG4gICAgICB0aGlzLml0ZW0ubGF5ZXJJbmRleCA9IHRoaXMuJGl0ZW0ubGF5ZXJJbmRleCA9IHRhcmdldEluZGV4ID4gdG9wSW5kZXggPyB0b3BJbmRleCA6IHRhcmdldEluZGV4O1xuICAgIH1cbiAgfVxuICBzZW5kVG9CYWNrKG9mZnNldDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKG9mZnNldCAmJiBvZmZzZXQgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsYXllckluZGV4ID0gdGhpcy5nZXRMYXllckluZGV4KCk7XG4gICAgaWYgKGxheWVySW5kZXggPiAwKSB7XG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IG9mZnNldCA/IGxheWVySW5kZXggLSBvZmZzZXQgOiAwO1xuICAgICAgdGhpcy5pdGVtLmxheWVySW5kZXggPSB0aGlzLiRpdGVtLmxheWVySW5kZXggPSB0YXJnZXRJbmRleCA8IDAgPyAwIDogdGFyZ2V0SW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMYXllckluZGV4KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuaXRlbS5sYXllckluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZW0ubGF5ZXJJbmRleDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZGVmYXVsdExheWVySW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZGVmYXVsdExheWVySW5kZXg7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbn1cbiJdfQ==