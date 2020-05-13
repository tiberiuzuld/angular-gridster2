import { __decorate, __metadata, __param } from "tslib";
import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewEncapsulation, Inject, HostBinding } from '@angular/core';
import { GridsterDraggable } from './gridsterDraggable.service';
import { GridsterResizable } from './gridsterResizable.service';
import { GridsterUtils } from './gridsterUtils.service';
import { GridsterComponent } from './gridster.component';
var GridsterItemComponent = /** @class */ (function () {
    function GridsterItemComponent(el, gridster, renderer, zone) {
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
    Object.defineProperty(GridsterItemComponent.prototype, "zIndex", {
        get: function () {
            return this.getLayerIndex() + this.gridster.$options.baseLayerIndex;
        },
        enumerable: true,
        configurable: true
    });
    GridsterItemComponent.prototype.ngOnInit = function () {
        this.updateOptions();
        this.gridster.addItem(this);
    };
    GridsterItemComponent.prototype.updateOptions = function () {
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
    };
    GridsterItemComponent.prototype.ngOnDestroy = function () {
        this.gridster.removeItem(this);
        delete this.gridster;
        this.drag.destroy();
        delete this.drag;
        this.resize.destroy();
        delete this.resize;
    };
    GridsterItemComponent.prototype.setSize = function () {
        this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
        this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
        this.updateItemSize();
    };
    GridsterItemComponent.prototype.updateItemSize = function () {
        var top = this.$item.y * this.gridster.curRowHeight;
        var left = this.$item.x * this.gridster.curColWidth;
        var width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
        var height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;
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
    };
    GridsterItemComponent.prototype.itemChanged = function () {
        if (this.gridster.options.itemChangeCallback) {
            this.gridster.options.itemChangeCallback(this.item, this);
        }
    };
    GridsterItemComponent.prototype.checkItemChanges = function (newValue, oldValue) {
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
    };
    GridsterItemComponent.prototype.canBeDragged = function () {
        return !this.gridster.mobile &&
            (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
    };
    GridsterItemComponent.prototype.canBeResized = function () {
        return !this.gridster.mobile &&
            (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
    };
    GridsterItemComponent.prototype.bringToFront = function (offset) {
        if (offset && offset <= 0) {
            return;
        }
        var layerIndex = this.getLayerIndex();
        var topIndex = this.gridster.$options.maxLayerIndex;
        if (layerIndex < topIndex) {
            var targetIndex = offset ? layerIndex + offset : topIndex;
            this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
        }
    };
    GridsterItemComponent.prototype.sendToBack = function (offset) {
        if (offset && offset <= 0) {
            return;
        }
        var layerIndex = this.getLayerIndex();
        if (layerIndex > 0) {
            var targetIndex = offset ? layerIndex - offset : 0;
            this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex;
        }
    };
    GridsterItemComponent.prototype.getLayerIndex = function () {
        if (this.item.layerIndex !== undefined) {
            return this.item.layerIndex;
        }
        if (this.gridster.$options.defaultLayerIndex !== undefined) {
            return this.gridster.$options.defaultLayerIndex;
        }
        return 0;
    };
    GridsterItemComponent.ctorParameters = function () { return [
        { type: ElementRef, decorators: [{ type: Inject, args: [ElementRef,] }] },
        { type: GridsterComponent },
        { type: Renderer2, decorators: [{ type: Inject, args: [Renderer2,] }] },
        { type: NgZone, decorators: [{ type: Inject, args: [NgZone,] }] }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GridsterItemComponent.prototype, "item", void 0);
    __decorate([
        HostBinding('style.z-index'),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [])
    ], GridsterItemComponent.prototype, "zIndex", null);
    GridsterItemComponent = __decorate([
        Component({
            selector: 'gridster-item',
            template: "<ng-content></ng-content>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.s && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-s\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.e && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-e\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.n && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-n\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.w && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-w\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.se && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-se\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.ne && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-ne\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.sw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-sw\"></div>\n<div (mousedown)=\"resize.dragStartDelay($event)\" (touchstart)=\"resize.dragStartDelay($event)\"\n     *ngIf=\"gridster.$options.resizable.handles.nw && resize.resizeEnabled\"\n     class=\"gridster-item-resizable-handler handle-nw\"></div>\n",
            encapsulation: ViewEncapsulation.None,
            styles: ["gridster-item{box-sizing:border-box;z-index:1;position:absolute;overflow:hidden;transition:.3s;display:none;background:#fff;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}gridster-item.gridster-item-moving{cursor:move}gridster-item.gridster-item-moving,gridster-item.gridster-item-resizing{transition:none;z-index:2;box-shadow:0 0 5px 5px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.gridster-item-resizable-handler{position:absolute;z-index:2}.gridster-item-resizable-handler.handle-n{cursor:ns-resize;height:10px;right:0;top:0;left:0}.gridster-item-resizable-handler.handle-e{cursor:ew-resize;width:10px;bottom:0;right:0;top:0}.gridster-item-resizable-handler.handle-s{cursor:ns-resize;height:10px;right:0;bottom:0;left:0}.gridster-item-resizable-handler.handle-w{cursor:ew-resize;width:10px;left:0;top:0;bottom:0}.gridster-item-resizable-handler.handle-ne{cursor:ne-resize;width:10px;height:10px;right:0;top:0}.gridster-item-resizable-handler.handle-nw{cursor:nw-resize;width:10px;height:10px;left:0;top:0}.gridster-item-resizable-handler.handle-se{cursor:se-resize;width:0;height:0;right:0;bottom:0;border-style:solid;border-width:0 0 10px 10px;border-color:transparent}.gridster-item-resizable-handler.handle-sw{cursor:sw-resize;width:10px;height:10px;left:0;bottom:0}gridster-item:hover .gridster-item-resizable-handler.handle-se{border-color:transparent transparent #ccc}"]
        }),
        __param(0, Inject(ElementRef)), __param(2, Inject(Renderer2)), __param(3, Inject(NgZone)),
        __metadata("design:paramtypes", [ElementRef, GridsterComponent, Renderer2, NgZone])
    ], GridsterItemComponent);
    return GridsterItemComponent;
}());
export { GridsterItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJJdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVySXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXRELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBUXZEO0lBbUJFLCtCQUFnQyxFQUFjLEVBQUcsUUFBMkIsRUFBNEIsUUFBbUIsRUFBMEIsSUFBWTtRQUF6RCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQTBCLFNBQUksR0FBSixJQUFJLENBQVE7UUFDL0osSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNSLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ04sQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFB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QkFBcUI7UUFOakMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsdTdEQUFrQztZQUVsQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7U0FDdEMsQ0FBQztRQW9CYSxXQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQSxFQUFnRCxXQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQSxFQUE4QixXQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTt5Q0FBeEcsVUFBVSxFQUFhLGlCQUFpQixFQUFzQyxTQUFTLEVBQWdDLE1BQU07T0FuQnRKLHFCQUFxQixDQXdLakM7SUFBRCw0QkFBQztDQUFBLEFBeEtELElBd0tDO1NBeEtZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgSG9zdEJpbmRpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R3JpZHN0ZXJJdGVtfSBmcm9tICcuL2dyaWRzdGVySXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3RlckRyYWdnYWJsZX0gZnJvbSAnLi9ncmlkc3RlckRyYWdnYWJsZS5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJSZXNpemFibGV9IGZyb20gJy4vZ3JpZHN0ZXJSZXNpemFibGUuc2VydmljZSc7XG5pbXBvcnQge0dyaWRzdGVyVXRpbHN9IGZyb20gJy4vZ3JpZHN0ZXJVdGlscy5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVySXRlbUNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtHcmlkc3RlckNvbXBvbmVudH0gZnJvbSAnLi9ncmlkc3Rlci5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdncmlkc3Rlci1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2dyaWRzdGVySXRlbS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZ3JpZHN0ZXJJdGVtLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRzdGVySXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBHcmlkc3Rlckl0ZW1Db21wb25lbnRJbnRlcmZhY2Uge1xuICBASW5wdXQoKSBpdGVtOiBHcmlkc3Rlckl0ZW07XG4gICRpdGVtOiBHcmlkc3Rlckl0ZW07XG4gIGVsOiBhbnk7XG4gIGdyaWRzdGVyOiBHcmlkc3RlckNvbXBvbmVudDtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGRyYWc6IEdyaWRzdGVyRHJhZ2dhYmxlO1xuICByZXNpemU6IEdyaWRzdGVyUmVzaXphYmxlO1xuICBub3RQbGFjZWQ6IGJvb2xlYW47XG4gIGluaXQ6IGJvb2xlYW47XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS56LWluZGV4JylcbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmdldExheWVySW5kZXgoKSArIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuYmFzZUxheWVySW5kZXg7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEVsZW1lbnRSZWYpIGVsOiBFbGVtZW50UmVmLCAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50LCBASW5qZWN0KFJlbmRlcmVyMikgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIEBJbmplY3QoTmdab25lKSBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuZWwgPSBlbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuJGl0ZW0gPSB7XG4gICAgICBjb2xzOiAtMSxcbiAgICAgIHJvd3M6IC0xLFxuICAgICAgeDogLTEsXG4gICAgICB5OiAtMSxcbiAgICB9O1xuICAgIHRoaXMuZ3JpZHN0ZXIgPSBncmlkc3RlcjtcbiAgICB0aGlzLmRyYWcgPSBuZXcgR3JpZHN0ZXJEcmFnZ2FibGUodGhpcywgZ3JpZHN0ZXIsIHRoaXMuem9uZSk7XG4gICAgdGhpcy5yZXNpemUgPSBuZXcgR3JpZHN0ZXJSZXNpemFibGUodGhpcywgZ3JpZHN0ZXIsIHRoaXMuem9uZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZU9wdGlvbnMoKTtcbiAgICB0aGlzLmdyaWRzdGVyLmFkZEl0ZW0odGhpcyk7XG4gIH1cblxuICB1cGRhdGVPcHRpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuJGl0ZW0gPSBHcmlkc3RlclV0aWxzLm1lcmdlKHRoaXMuJGl0ZW0sIHRoaXMuaXRlbSwge1xuICAgICAgY29sczogdW5kZWZpbmVkLFxuICAgICAgcm93czogdW5kZWZpbmVkLFxuICAgICAgeDogdW5kZWZpbmVkLFxuICAgICAgeTogdW5kZWZpbmVkLFxuICAgICAgbGF5ZXJJbmRleDogdW5kZWZpbmVkLFxuICAgICAgZHJhZ0VuYWJsZWQ6IHVuZGVmaW5lZCxcbiAgICAgIHJlc2l6ZUVuYWJsZWQ6IHVuZGVmaW5lZCxcbiAgICAgIGNvbXBhY3RFbmFibGVkOiB1bmRlZmluZWQsXG4gICAgICBtYXhJdGVtUm93czogdW5kZWZpbmVkLFxuICAgICAgbWluSXRlbVJvd3M6IHVuZGVmaW5lZCxcbiAgICAgIG1heEl0ZW1Db2xzOiB1bmRlZmluZWQsXG4gICAgICBtaW5JdGVtQ29sczogdW5kZWZpbmVkLFxuICAgICAgbWF4SXRlbUFyZWE6IHVuZGVmaW5lZCxcbiAgICAgIG1pbkl0ZW1BcmVhOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmdyaWRzdGVyLnJlbW92ZUl0ZW0odGhpcyk7XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXI7XG4gICAgdGhpcy5kcmFnLmRlc3Ryb3koKTtcbiAgICBkZWxldGUgdGhpcy5kcmFnO1xuICAgIHRoaXMucmVzaXplLmRlc3Ryb3koKTtcbiAgICBkZWxldGUgdGhpcy5yZXNpemU7XG4gIH1cblxuICBzZXRTaXplKCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbCwgJ2Rpc3BsYXknLCB0aGlzLm5vdFBsYWNlZCA/ICcnIDogJ2Jsb2NrJyk7XG4gICAgdGhpcy5ncmlkc3Rlci5ncmlkUmVuZGVyZXIudXBkYXRlSXRlbSh0aGlzLmVsLCB0aGlzLiRpdGVtLCB0aGlzLnJlbmRlcmVyKTtcbiAgICB0aGlzLnVwZGF0ZUl0ZW1TaXplKCk7XG4gIH1cblxuICB1cGRhdGVJdGVtU2l6ZSgpIHtcbiAgICBjb25zdCB0b3AgPSB0aGlzLiRpdGVtLnkgKiB0aGlzLmdyaWRzdGVyLmN1clJvd0hlaWdodDtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy4kaXRlbS54ICogdGhpcy5ncmlkc3Rlci5jdXJDb2xXaWR0aDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuJGl0ZW0uY29scyAqIHRoaXMuZ3JpZHN0ZXIuY3VyQ29sV2lkdGggLSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbjtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLiRpdGVtLnJvd3MgKiB0aGlzLmdyaWRzdGVyLmN1clJvd0hlaWdodCAtIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMubWFyZ2luO1xuXG4gICAgaWYgKCF0aGlzLmluaXQgJiYgd2lkdGggPiAwICYmIGhlaWdodCA+IDApIHtcbiAgICAgIHRoaXMuaW5pdCA9IHRydWU7XG4gICAgICBpZiAodGhpcy5pdGVtLmluaXRDYWxsYmFjaykge1xuICAgICAgICB0aGlzLml0ZW0uaW5pdENhbGxiYWNrKHRoaXMuaXRlbSwgdGhpcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5ncmlkc3Rlci5vcHRpb25zLml0ZW1Jbml0Q2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLml0ZW1Jbml0Q2FsbGJhY2sodGhpcy5pdGVtLCB0aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnNjcm9sbFRvTmV3SXRlbXMpIHtcbiAgICAgICAgdGhpcy5lbC5zY3JvbGxJbnRvVmlldyhmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh3aWR0aCAhPT0gdGhpcy53aWR0aCB8fCBoZWlnaHQgIT09IHRoaXMuaGVpZ2h0KSB7XG4gICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuaXRlbVJlc2l6ZUNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5pdGVtUmVzaXplQ2FsbGJhY2sodGhpcy5pdGVtLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgfVxuXG4gIGl0ZW1DaGFuZ2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuaXRlbUNoYW5nZUNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmdyaWRzdGVyLm9wdGlvbnMuaXRlbUNoYW5nZUNhbGxiYWNrKHRoaXMuaXRlbSwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tJdGVtQ2hhbmdlcyhuZXdWYWx1ZTogR3JpZHN0ZXJJdGVtLCBvbGRWYWx1ZTogR3JpZHN0ZXJJdGVtKTogdm9pZCB7XG4gICAgaWYgKG5ld1ZhbHVlLnJvd3MgPT09IG9sZFZhbHVlLnJvd3MgJiYgbmV3VmFsdWUuY29scyA9PT0gb2xkVmFsdWUuY29scyAmJiBuZXdWYWx1ZS54ID09PSBvbGRWYWx1ZS54ICYmIG5ld1ZhbHVlLnkgPT09IG9sZFZhbHVlLnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIuY2hlY2tDb2xsaXNpb24odGhpcy4kaXRlbSkpIHtcbiAgICAgIHRoaXMuJGl0ZW0ueCA9IG9sZFZhbHVlLnggfHwgMDtcbiAgICAgIHRoaXMuJGl0ZW0ueSA9IG9sZFZhbHVlLnkgfHwgMDtcbiAgICAgIHRoaXMuJGl0ZW0uY29scyA9IG9sZFZhbHVlLmNvbHMgfHwgMTtcbiAgICAgIHRoaXMuJGl0ZW0ucm93cyA9IG9sZFZhbHVlLnJvd3MgfHwgMTtcbiAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW0uY29scyA9IHRoaXMuJGl0ZW0uY29scztcbiAgICAgIHRoaXMuaXRlbS5yb3dzID0gdGhpcy4kaXRlbS5yb3dzO1xuICAgICAgdGhpcy5pdGVtLnggPSB0aGlzLiRpdGVtLng7XG4gICAgICB0aGlzLml0ZW0ueSA9IHRoaXMuJGl0ZW0ueTtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIuY2FsY3VsYXRlTGF5b3V0RGVib3VuY2UoKTtcbiAgICAgIHRoaXMuaXRlbUNoYW5nZWQoKTtcbiAgICB9XG4gIH1cblxuICBjYW5CZURyYWdnZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmdyaWRzdGVyLm1vYmlsZSAmJlxuICAgICAgKHRoaXMuJGl0ZW0uZHJhZ0VuYWJsZWQgPT09IHVuZGVmaW5lZCA/IHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZHJhZ2dhYmxlLmVuYWJsZWQgOiB0aGlzLiRpdGVtLmRyYWdFbmFibGVkKTtcbiAgfVxuXG4gIGNhbkJlUmVzaXplZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZ3JpZHN0ZXIubW9iaWxlICYmXG4gICAgICAodGhpcy4kaXRlbS5yZXNpemVFbmFibGVkID09PSB1bmRlZmluZWQgPyB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLnJlc2l6YWJsZS5lbmFibGVkIDogdGhpcy4kaXRlbS5yZXNpemVFbmFibGVkKTtcbiAgfVxuXG4gIGJyaW5nVG9Gcm9udChvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0IDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXJJbmRleCA9IHRoaXMuZ2V0TGF5ZXJJbmRleCgpO1xuICAgIGNvbnN0IHRvcEluZGV4ID0gdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5tYXhMYXllckluZGV4O1xuICAgIGlmIChsYXllckluZGV4IDwgdG9wSW5kZXgpIHtcbiAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gb2Zmc2V0ID8gbGF5ZXJJbmRleCArIG9mZnNldCA6IHRvcEluZGV4O1xuICAgICAgdGhpcy5pdGVtLmxheWVySW5kZXggPSB0aGlzLiRpdGVtLmxheWVySW5kZXggPSB0YXJnZXRJbmRleCA+IHRvcEluZGV4ID8gdG9wSW5kZXggOiB0YXJnZXRJbmRleDtcbiAgICB9XG4gIH1cbiAgc2VuZFRvQmFjayhvZmZzZXQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChvZmZzZXQgJiYgb2Zmc2V0IDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXJJbmRleCA9IHRoaXMuZ2V0TGF5ZXJJbmRleCgpO1xuICAgIGlmIChsYXllckluZGV4ID4gMCkge1xuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSBvZmZzZXQgPyBsYXllckluZGV4IC0gb2Zmc2V0IDogMDtcbiAgICAgIHRoaXMuaXRlbS5sYXllckluZGV4ID0gdGhpcy4kaXRlbS5sYXllckluZGV4ID0gdGFyZ2V0SW5kZXggPCAwID8gMCA6IHRhcmdldEluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGF5ZXJJbmRleCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLml0ZW0ubGF5ZXJJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtLmxheWVySW5kZXg7XG4gICAgfVxuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmRlZmF1bHRMYXllckluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmRlZmF1bHRMYXllckluZGV4O1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG59XG4iXX0=