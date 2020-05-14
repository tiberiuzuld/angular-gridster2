import { Injectable, NgZone } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { DirTypes } from './gridsterConfig.interface';
import { GridsterItemComponentInterface } from './gridsterItemComponent.interface';
import { GridsterPush } from './gridsterPush.service';
import { cancelScroll, scroll } from './gridsterScroll.service';
import { GridsterSwap } from './gridsterSwap.service';
import { GridsterUtils } from './gridsterUtils.service';
import * as i0 from "@angular/core";
import * as i1 from "./gridsterItemComponent.interface";
import * as i2 from "./gridster.interface";
var GridsterDraggable = /** @class */ (function () {
    function GridsterDraggable(gridsterItem, gridster, zone) {
        this.zone = zone;
        this.collision = false;
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            clientX: 0,
            clientY: 0
        };
        this.path = [];
    }
    GridsterDraggable.prototype.destroy = function () {
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle(true);
        }
        delete this.gridsterItem;
        delete this.gridster;
        delete this.collision;
        if (this.mousedown) {
            this.mousedown();
            this.touchstart();
        }
    };
    GridsterDraggable.prototype.dragStart = function (e) {
        var _this = this;
        if (e.which && e.which !== 1) {
            return;
        }
        if (this.gridster.options.draggable && this.gridster.options.draggable.start) {
            this.gridster.options.draggable.start(this.gridsterItem.item, this.gridsterItem, e);
        }
        e.stopPropagation();
        e.preventDefault();
        this.dragFunction = this.dragMove.bind(this);
        this.dragStopFunction = this.dragStop.bind(this);
        this.zone.runOutsideAngular(function () {
            _this.mousemove = _this.gridsterItem.renderer.listen('document', 'mousemove', _this.dragFunction);
            _this.touchmove = _this.gridster.renderer.listen(_this.gridster.el, 'touchmove', _this.dragFunction);
        });
        this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
        this.mouseleave = this.gridsterItem.renderer.listen('document', 'mouseleave', this.dragStopFunction);
        this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
        this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
        this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
        this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
        this.margin = this.gridster.$options.margin;
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        this.left = this.gridsterItem.left - this.margin;
        this.top = this.gridsterItem.top - this.margin;
        this.originalClientX = e.clientX;
        this.originalClientY = e.clientY;
        this.width = this.gridsterItem.width;
        this.height = this.gridsterItem.height;
        if (this.gridster.$options.dirType === DirTypes.RTL) {
            this.diffLeft = (e.clientX - this.gridster.el.scrollWidth + this.gridsterItem.left);
        }
        else {
            this.diffLeft = e.clientX + this.offsetLeft - this.margin - this.left;
        }
        this.diffTop = e.clientY + this.offsetTop - this.margin - this.top;
        this.gridster.movingItem = this.gridsterItem.$item;
        this.gridster.previewStyle(true);
        this.push = new GridsterPush(this.gridsterItem);
        this.swap = new GridsterSwap(this.gridsterItem);
        this.gridster.dragInProgress = true;
        this.gridster.updateGrid();
        this.path.push({ x: this.gridsterItem.item.x || 0, y: this.gridsterItem.item.y || 0 });
    };
    GridsterDraggable.prototype.dragMove = function (e) {
        e.stopPropagation();
        e.preventDefault();
        GridsterUtils.checkTouchEvent(e);
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse, this.calculateItemPositionFromMousePosition.bind(this));
        this.calculateItemPositionFromMousePosition(e);
    };
    GridsterDraggable.prototype.calculateItemPositionFromMousePosition = function (e) {
        var _this = this;
        if (this.gridster.options.scale) {
            this.calculateItemPositionWithScale(e, this.gridster.options.scale);
        }
        else {
            this.calculateItemPositionWithoutScale(e);
        }
        this.calculateItemPosition();
        this.lastMouse.clientX = e.clientX;
        this.lastMouse.clientY = e.clientY;
        this.zone.run(function () {
            _this.gridster.updateGrid();
        });
    };
    GridsterDraggable.prototype.calculateItemPositionWithScale = function (e, scale) {
        this.left = this.originalClientX + ((e.clientX - this.originalClientX) / scale) + this.offsetLeft - this.diffLeft;
        this.top = this.originalClientY + ((e.clientY - this.originalClientY) / scale) + this.offsetTop - this.diffTop;
    };
    GridsterDraggable.prototype.calculateItemPositionWithoutScale = function (e) {
        if (this.gridster.$options.dirType === DirTypes.RTL) {
            this.left = this.gridster.el.scrollWidth - e.clientX + this.diffLeft;
        }
        else {
            this.left = e.clientX + this.offsetLeft - this.diffLeft;
        }
        this.top = e.clientY + this.offsetTop - this.diffTop;
    };
    GridsterDraggable.prototype.dragStop = function (e) {
        var _this = this;
        e.stopPropagation();
        e.preventDefault();
        cancelScroll();
        this.cancelOnBlur();
        this.mousemove();
        this.mouseup();
        this.mouseleave();
        this.touchmove();
        this.touchend();
        this.touchcancel();
        this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
        this.gridster.dragInProgress = false;
        this.gridster.updateGrid();
        this.path = [];
        if (this.gridster.options.draggable && this.gridster.options.draggable.stop) {
            Promise.resolve(this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
                .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
        }
        else {
            this.makeDrag();
        }
        setTimeout(function () {
            if (_this.gridster) {
                _this.gridster.movingItem = null;
                _this.gridster.previewStyle(true);
            }
        });
    };
    GridsterDraggable.prototype.cancelDrag = function () {
        this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
        this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
        this.gridsterItem.setSize();
        if (this.push) {
            this.push.restoreItems();
        }
        if (this.swap) {
            this.swap.restoreSwapItem();
        }
        if (this.push) {
            this.push.destroy();
            delete this.push;
        }
        if (this.swap) {
            this.swap.destroy();
            delete this.swap;
        }
    };
    GridsterDraggable.prototype.makeDrag = function () {
        if (this.gridster.$options.draggable.dropOverItems && this.gridster.options.draggable
            && this.gridster.options.draggable.dropOverItemsCallback
            && this.collision && this.collision !== true && this.collision.$item) {
            this.gridster.options.draggable.dropOverItemsCallback(this.gridsterItem.item, this.collision.item, this.gridster);
        }
        this.collision = false;
        this.gridsterItem.setSize();
        this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
        if (this.push) {
            this.push.setPushedItems();
        }
        if (this.swap) {
            this.swap.setSwapItem();
        }
        if (this.push) {
            this.push.destroy();
            delete this.push;
        }
        if (this.swap) {
            this.swap.destroy();
            delete this.swap;
        }
    };
    GridsterDraggable.prototype.calculateItemPosition = function () {
        this.gridster.movingItem = this.gridsterItem.$item;
        this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
        this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
        this.positionXBackup = this.gridsterItem.$item.x;
        this.positionYBackup = this.gridsterItem.$item.y;
        this.gridsterItem.$item.x = this.positionX;
        if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
            this.gridsterItem.$item.x = this.positionXBackup;
        }
        this.gridsterItem.$item.y = this.positionY;
        if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
            this.gridsterItem.$item.y = this.positionYBackup;
        }
        this.gridster.gridRenderer.setCellPosition(this.gridsterItem.renderer, this.gridsterItem.el, this.left, this.top);
        if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
            var lastPosition = this.path[this.path.length - 1];
            var direction = '';
            if (lastPosition.x < this.gridsterItem.$item.x) {
                direction = this.push.fromWest;
            }
            else if (lastPosition.x > this.gridsterItem.$item.x) {
                direction = this.push.fromEast;
            }
            else if (lastPosition.y < this.gridsterItem.$item.y) {
                direction = this.push.fromNorth;
            }
            else if (lastPosition.y > this.gridsterItem.$item.y) {
                direction = this.push.fromSouth;
            }
            this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
            this.swap.swapItems();
            this.collision = this.gridster.checkCollision(this.gridsterItem.$item);
            if (this.collision) {
                this.gridsterItem.$item.x = this.positionXBackup;
                this.gridsterItem.$item.y = this.positionYBackup;
                if (this.gridster.$options.draggable.dropOverItems && this.collision !== true && this.collision.$item) {
                    this.gridster.movingItem = null;
                }
            }
            else {
                this.path.push({ x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y });
            }
            this.push.checkPushBack();
        }
        this.gridster.previewStyle(true);
    };
    GridsterDraggable.prototype.toggle = function () {
        var enableDrag = this.gridsterItem.canBeDragged();
        if (!this.enabled && enableDrag) {
            this.enabled = !this.enabled;
            this.dragStartFunction = this.dragStartDelay.bind(this);
            this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
            this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
        }
        else if (this.enabled && !enableDrag) {
            this.enabled = !this.enabled;
            this.mousedown();
            this.touchstart();
        }
    };
    GridsterDraggable.prototype.dragStartDelay = function (e) {
        var _this = this;
        if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') > -1) {
            return;
        }
        if (GridsterUtils.checkContentClassForEvent(this.gridster, e)) {
            return;
        }
        GridsterUtils.checkTouchEvent(e);
        if (!this.gridster.$options.draggable.delayStart) {
            this.dragStart(e);
            return;
        }
        var timeout = setTimeout(function () {
            _this.dragStart(e);
            cancelDrag();
        }, this.gridster.$options.draggable.delayStart);
        var cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
        var cancelMouseLeave = this.gridsterItem.renderer.listen('document', 'mouseleave', cancelDrag);
        var cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
        var cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
        var cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
        var cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);
        function cancelMove(eventMove) {
            GridsterUtils.checkTouchEvent(eventMove);
            if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
                cancelDrag();
            }
        }
        function cancelDrag() {
            clearTimeout(timeout);
            cancelOnBlur();
            cancelMouse();
            cancelMouseLeave();
            cancelTouchMove();
            cancelTouchEnd();
            cancelTouchCancel();
        }
    };
    GridsterDraggable.ɵfac = function GridsterDraggable_Factory(t) { return new (t || GridsterDraggable)(i0.ɵɵinject(i1.GridsterItemComponentInterface), i0.ɵɵinject(i2.GridsterComponentInterface), i0.ɵɵinject(i0.NgZone)); };
    GridsterDraggable.ɵprov = i0.ɵɵdefineInjectable({ token: GridsterDraggable, factory: GridsterDraggable.ɵfac });
    return GridsterDraggable;
}());
export { GridsterDraggable };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(GridsterDraggable, [{
        type: Injectable
    }], function () { return [{ type: i1.GridsterItemComponentInterface }, { type: i2.GridsterComponentInterface }, { type: i0.NgZone }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0ZXJEcmFnZ2FibGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ3JpZHN0ZXIyLyIsInNvdXJjZXMiOlsibGliL2dyaWRzdGVyRHJhZ2dhYmxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3BELE9BQU8sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2pGLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRTlELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0seUJBQXlCLENBQUM7Ozs7QUFFdEQ7SUF5Q0UsMkJBQVksWUFBNEMsRUFBRSxRQUFvQyxFQUFVLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBRnBILGNBQVMsR0FBNkMsS0FBSyxDQUFDO1FBRzFELElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxtQ0FBTyxHQUFQO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFD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QyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUNsRDtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWxILElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVB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QUFDO2FBQ2Q7UUFDSCxDQUFDO1FBRUQsU0FBUyxVQUFVO1lBQ2pCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixZQUFZLEVBQUUsQ0FBQztZQUNmLFdBQVcsRUFBRSxDQUFDO1lBQ2QsZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQixlQUFlLEVBQUUsQ0FBQztZQUNsQixjQUFjLEVBQUUsQ0FBQztZQUNqQixpQkFBaUIsRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO3NGQXJVVSxpQkFBaUI7NkRBQWpCLGlCQUFpQixXQUFqQixpQkFBaUI7NEJBWDlCO0NBaVZDLEFBdlVELElBdVVDO1NBdFVZLGlCQUFpQjtrREFBakIsaUJBQWlCO2NBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIE5nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0dyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlfSBmcm9tICcuL2dyaWRzdGVyLmludGVyZmFjZSc7XG5pbXBvcnQge0RpclR5cGVzfSBmcm9tICcuL2dyaWRzdGVyQ29uZmlnLmludGVyZmFjZSc7XG5pbXBvcnQge0dyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZX0gZnJvbSAnLi9ncmlkc3Rlckl0ZW1Db21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7R3JpZHN0ZXJQdXNofSBmcm9tICcuL2dyaWRzdGVyUHVzaC5zZXJ2aWNlJztcbmltcG9ydCB7Y2FuY2VsU2Nyb2xsLCBzY3JvbGx9IGZyb20gJy4vZ3JpZHN0ZXJTY3JvbGwuc2VydmljZSc7XG5cbmltcG9ydCB7R3JpZHN0ZXJTd2FwfSBmcm9tICcuL2dyaWRzdGVyU3dhcC5zZXJ2aWNlJztcbmltcG9ydCB7R3JpZHN0ZXJVdGlsc30gZnJvbSAnLi9ncmlkc3RlclV0aWxzLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR3JpZHN0ZXJEcmFnZ2FibGUge1xuICBncmlkc3Rlckl0ZW06IEdyaWRzdGVySXRlbUNvbXBvbmVudEludGVyZmFjZTtcbiAgZ3JpZHN0ZXI6IEdyaWRzdGVyQ29tcG9uZW50SW50ZXJmYWNlO1xuICBsYXN0TW91c2U6IHtcbiAgICBjbGllbnRYOiBudW1iZXIsXG4gICAgY2xpZW50WTogbnVtYmVyXG4gIH07XG4gIG9mZnNldExlZnQ6IG51bWJlcjtcbiAgb2Zmc2V0VG9wOiBudW1iZXI7XG4gIG1hcmdpbjogbnVtYmVyO1xuICBkaWZmVG9wOiBudW1iZXI7XG4gIGRpZmZMZWZ0OiBudW1iZXI7XG4gIG9yaWdpbmFsQ2xpZW50WDogbnVtYmVyO1xuICBvcmlnaW5hbENsaWVudFk6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIHBvc2l0aW9uWDogbnVtYmVyO1xuICBwb3NpdGlvblk6IG51bWJlcjtcbiAgcG9zaXRpb25YQmFja3VwOiBudW1iZXI7XG4gIHBvc2l0aW9uWUJhY2t1cDogbnVtYmVyO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBkcmFnU3RhcnRGdW5jdGlvbjogKGV2ZW50OiBhbnkpID0+IHZvaWQ7XG4gIGRyYWdGdW5jdGlvbjogKGV2ZW50OiBhbnkpID0+IHZvaWQ7XG4gIGRyYWdTdG9wRnVuY3Rpb246IChldmVudDogYW55KSA9PiB2b2lkO1xuICBtb3VzZW1vdmU6ICgpID0+IHZvaWQ7XG4gIG1vdXNldXA6ICgpID0+IHZvaWQ7XG4gIG1vdXNlbGVhdmU6ICgpID0+IHZvaWQ7XG4gIGNhbmNlbE9uQmx1cjogKCkgPT4gdm9pZDtcbiAgdG91Y2htb3ZlOiAoKSA9PiB2b2lkO1xuICB0b3VjaGVuZDogKCkgPT4gdm9pZDtcbiAgdG91Y2hjYW5jZWw6ICgpID0+IHZvaWQ7XG4gIG1vdXNlZG93bjogKCkgPT4gdm9pZDtcbiAgdG91Y2hzdGFydDogKCkgPT4gdm9pZDtcbiAgcHVzaDogR3JpZHN0ZXJQdXNoO1xuICBzd2FwOiBHcmlkc3RlclN3YXA7XG4gIHBhdGg6IEFycmF5PHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfT47XG4gIGNvbGxpc2lvbjogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlIHwgYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGdyaWRzdGVySXRlbTogR3JpZHN0ZXJJdGVtQ29tcG9uZW50SW50ZXJmYWNlLCBncmlkc3RlcjogR3JpZHN0ZXJDb21wb25lbnRJbnRlcmZhY2UsIHByaXZhdGUgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0gPSBncmlkc3Rlckl0ZW07XG4gICAgdGhpcy5ncmlkc3RlciA9IGdyaWRzdGVyO1xuICAgIHRoaXMubGFzdE1vdXNlID0ge1xuICAgICAgY2xpZW50WDogMCxcbiAgICAgIGNsaWVudFk6IDBcbiAgICB9O1xuICAgIHRoaXMucGF0aCA9IFtdO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUpIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlKHRydWUpO1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy5ncmlkc3Rlckl0ZW07XG4gICAgZGVsZXRlIHRoaXMuZ3JpZHN0ZXI7XG4gICAgZGVsZXRlIHRoaXMuY29sbGlzaW9uO1xuICAgIGlmICh0aGlzLm1vdXNlZG93bikge1xuICAgICAgdGhpcy5tb3VzZWRvd24oKTtcbiAgICAgIHRoaXMudG91Y2hzdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIGRyYWdTdGFydChlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoZS53aGljaCAmJiBlLndoaWNoICE9PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5kcmFnZ2FibGUgJiYgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmRyYWdnYWJsZS5zdGFydCkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmRyYWdnYWJsZS5zdGFydCh0aGlzLmdyaWRzdGVySXRlbS5pdGVtLCB0aGlzLmdyaWRzdGVySXRlbSwgZSk7XG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5kcmFnRnVuY3Rpb24gPSB0aGlzLmRyYWdNb3ZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kcmFnU3RvcEZ1bmN0aW9uID0gdGhpcy5kcmFnU3RvcC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMubW91c2Vtb3ZlID0gdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCB0aGlzLmRyYWdGdW5jdGlvbik7XG4gICAgICB0aGlzLnRvdWNobW92ZSA9IHRoaXMuZ3JpZHN0ZXIucmVuZGVyZXIubGlzdGVuKHRoaXMuZ3JpZHN0ZXIuZWwsICd0b3VjaG1vdmUnLCB0aGlzLmRyYWdGdW5jdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy5tb3VzZXVwID0gdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZXVwJywgdGhpcy5kcmFnU3RvcEZ1bmN0aW9uKTtcbiAgICB0aGlzLm1vdXNlbGVhdmUgPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbGVhdmUnLCB0aGlzLmRyYWdTdG9wRnVuY3Rpb24pO1xuICAgIHRoaXMuY2FuY2VsT25CbHVyID0gdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnYmx1cicsIHRoaXMuZHJhZ1N0b3BGdW5jdGlvbik7XG4gICAgdGhpcy50b3VjaGVuZCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hlbmQnLCB0aGlzLmRyYWdTdG9wRnVuY3Rpb24pO1xuICAgIHRoaXMudG91Y2hjYW5jZWwgPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNoY2FuY2VsJywgdGhpcy5kcmFnU3RvcEZ1bmN0aW9uKTtcbiAgICB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmdyaWRzdGVySXRlbS5lbCwgJ2dyaWRzdGVyLWl0ZW0tbW92aW5nJyk7XG4gICAgdGhpcy5tYXJnaW4gPSB0aGlzLmdyaWRzdGVyLiRvcHRpb25zLm1hcmdpbjtcbiAgICB0aGlzLm9mZnNldExlZnQgPSB0aGlzLmdyaWRzdGVyLmVsLnNjcm9sbExlZnQgLSB0aGlzLmdyaWRzdGVyLmVsLm9mZnNldExlZnQ7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSB0aGlzLmdyaWRzdGVyLmVsLnNjcm9sbFRvcCAtIHRoaXMuZ3JpZHN0ZXIuZWwub2Zmc2V0VG9wO1xuICAgIHRoaXMubGVmdCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLmxlZnQgLSB0aGlzLm1hcmdpbjtcbiAgICB0aGlzLnRvcCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLnRvcCAtIHRoaXMubWFyZ2luO1xuICAgIHRoaXMub3JpZ2luYWxDbGllbnRYID0gZS5jbGllbnRYO1xuICAgIHRoaXMub3JpZ2luYWxDbGllbnRZID0gZS5jbGllbnRZO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmdyaWRzdGVySXRlbS53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLmhlaWdodDtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kaXJUeXBlID09PSBEaXJUeXBlcy5SVEwpIHtcbiAgICAgIHRoaXMuZGlmZkxlZnQgPSAoZS5jbGllbnRYIC0gdGhpcy5ncmlkc3Rlci5lbC5zY3JvbGxXaWR0aCArIHRoaXMuZ3JpZHN0ZXJJdGVtLmxlZnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpZmZMZWZ0ID0gZS5jbGllbnRYICsgdGhpcy5vZmZzZXRMZWZ0IC0gdGhpcy5tYXJnaW4gLSB0aGlzLmxlZnQ7XG4gICAgfVxuICAgIHRoaXMuZGlmZlRvcCA9IGUuY2xpZW50WSArIHRoaXMub2Zmc2V0VG9wIC0gdGhpcy5tYXJnaW4gLSB0aGlzLnRvcDtcbiAgICB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gPSB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbTtcbiAgICB0aGlzLmdyaWRzdGVyLnByZXZpZXdTdHlsZSh0cnVlKTtcbiAgICB0aGlzLnB1c2ggPSBuZXcgR3JpZHN0ZXJQdXNoKHRoaXMuZ3JpZHN0ZXJJdGVtKTtcbiAgICB0aGlzLnN3YXAgPSBuZXcgR3JpZHN0ZXJTd2FwKHRoaXMuZ3JpZHN0ZXJJdGVtKTtcbiAgICB0aGlzLmdyaWRzdGVyLmRyYWdJblByb2dyZXNzID0gdHJ1ZTtcbiAgICB0aGlzLmdyaWRzdGVyLnVwZGF0ZUdyaWQoKTtcbiAgICB0aGlzLnBhdGgucHVzaCh7eDogdGhpcy5ncmlkc3Rlckl0ZW0uaXRlbS54IHx8IDAsIHk6IHRoaXMuZ3JpZHN0ZXJJdGVtLml0ZW0ueSB8fCAwfSk7XG4gIH1cblxuICBkcmFnTW92ZShlOiBhbnkpOiB2b2lkIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBHcmlkc3RlclV0aWxzLmNoZWNrVG91Y2hFdmVudChlKTtcbiAgICB0aGlzLm9mZnNldExlZnQgPSB0aGlzLmdyaWRzdGVyLmVsLnNjcm9sbExlZnQgLSB0aGlzLmdyaWRzdGVyLmVsLm9mZnNldExlZnQ7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSB0aGlzLmdyaWRzdGVyLmVsLnNjcm9sbFRvcCAtIHRoaXMuZ3JpZHN0ZXIuZWwub2Zmc2V0VG9wO1xuICAgIHNjcm9sbCh0aGlzLmdyaWRzdGVyLCB0aGlzLmxlZnQsIHRoaXMudG9wLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgZSwgdGhpcy5sYXN0TW91c2UsXG4gICAgICB0aGlzLmNhbGN1bGF0ZUl0ZW1Qb3NpdGlvbkZyb21Nb3VzZVBvc2l0aW9uLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5jYWxjdWxhdGVJdGVtUG9zaXRpb25Gcm9tTW91c2VQb3NpdGlvbihlKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZUl0ZW1Qb3NpdGlvbkZyb21Nb3VzZVBvc2l0aW9uKGU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuc2NhbGUpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlSXRlbVBvc2l0aW9uV2l0aFNjYWxlKGUsIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5zY2FsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlSXRlbVBvc2l0aW9uV2l0aG91dFNjYWxlKGUpO1xuICAgIH1cbiAgICB0aGlzLmNhbGN1bGF0ZUl0ZW1Qb3NpdGlvbigpO1xuICAgIHRoaXMubGFzdE1vdXNlLmNsaWVudFggPSBlLmNsaWVudFg7XG4gICAgdGhpcy5sYXN0TW91c2UuY2xpZW50WSA9IGUuY2xpZW50WTtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXIudXBkYXRlR3JpZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlSXRlbVBvc2l0aW9uV2l0aFNjYWxlKGU6IGFueSwgc2NhbGU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMubGVmdCA9IHRoaXMub3JpZ2luYWxDbGllbnRYICsgKChlLmNsaWVudFggLSB0aGlzLm9yaWdpbmFsQ2xpZW50WCkgLyBzY2FsZSkgKyB0aGlzLm9mZnNldExlZnQgLSB0aGlzLmRpZmZMZWZ0O1xuICAgIHRoaXMudG9wID0gdGhpcy5vcmlnaW5hbENsaWVudFkgKyAoKGUuY2xpZW50WSAtIHRoaXMub3JpZ2luYWxDbGllbnRZKSAvIHNjYWxlKSAgKyB0aGlzLm9mZnNldFRvcCAtIHRoaXMuZGlmZlRvcDtcbiAgfVxuXG4gIGNhbGN1bGF0ZUl0ZW1Qb3NpdGlvbldpdGhvdXRTY2FsZShlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kaXJUeXBlID09PSBEaXJUeXBlcy5SVEwpIHtcbiAgICAgIHRoaXMubGVmdCA9IHRoaXMuZ3JpZHN0ZXIuZWwuc2Nyb2xsV2lkdGggLSBlLmNsaWVudFggKyB0aGlzLmRpZmZMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlZnQgPSBlLmNsaWVudFggKyB0aGlzLm9mZnNldExlZnQgLSB0aGlzLmRpZmZMZWZ0O1xuICAgIH1cblxuICAgIHRoaXMudG9wID0gZS5jbGllbnRZICsgdGhpcy5vZmZzZXRUb3AgLSB0aGlzLmRpZmZUb3A7XG4gIH1cblxuICBkcmFnU3RvcChlOiBhbnkpOiB2b2lkIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGNhbmNlbFNjcm9sbCgpO1xuICAgIHRoaXMuY2FuY2VsT25CbHVyKCk7XG4gICAgdGhpcy5tb3VzZW1vdmUoKTtcbiAgICB0aGlzLm1vdXNldXAoKTtcbiAgICB0aGlzLm1vdXNlbGVhdmUoKTtcbiAgICB0aGlzLnRvdWNobW92ZSgpO1xuICAgIHRoaXMudG91Y2hlbmQoKTtcbiAgICB0aGlzLnRvdWNoY2FuY2VsKCk7XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ncmlkc3Rlckl0ZW0uZWwsICdncmlkc3Rlci1pdGVtLW1vdmluZycpO1xuICAgIHRoaXMuZ3JpZHN0ZXIuZHJhZ0luUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmdyaWRzdGVyLnVwZGF0ZUdyaWQoKTtcbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICBpZiAodGhpcy5ncmlkc3Rlci5vcHRpb25zLmRyYWdnYWJsZSAmJiB0aGlzLmdyaWRzdGVyLm9wdGlvbnMuZHJhZ2dhYmxlLnN0b3ApIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSh0aGlzLmdyaWRzdGVyLm9wdGlvbnMuZHJhZ2dhYmxlLnN0b3AodGhpcy5ncmlkc3Rlckl0ZW0uaXRlbSwgdGhpcy5ncmlkc3Rlckl0ZW0sIGUpKVxuICAgICAgICAudGhlbih0aGlzLm1ha2VEcmFnLmJpbmQodGhpcyksIHRoaXMuY2FuY2VsRHJhZy5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYWtlRHJhZygpO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmdyaWRzdGVyKSB7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIubW92aW5nSXRlbSA9IG51bGw7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXIucHJldmlld1N0eWxlKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2FuY2VsRHJhZygpIHtcbiAgICB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS54ID0gdGhpcy5ncmlkc3Rlckl0ZW0uaXRlbS54IHx8IDA7XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueSA9IHRoaXMuZ3JpZHN0ZXJJdGVtLml0ZW0ueSB8fCAwO1xuICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLnNldFNpemUoKTtcbiAgICBpZiAodGhpcy5wdXNoKSB7XG4gICAgICB0aGlzLnB1c2gucmVzdG9yZUl0ZW1zKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN3YXApIHtcbiAgICAgIHRoaXMuc3dhcC5yZXN0b3JlU3dhcEl0ZW0oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHVzaCkge1xuICAgICAgdGhpcy5wdXNoLmRlc3Ryb3koKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnB1c2g7XG4gICAgfVxuICAgIGlmICh0aGlzLnN3YXApIHtcbiAgICAgIHRoaXMuc3dhcC5kZXN0cm95KCk7XG4gICAgICBkZWxldGUgdGhpcy5zd2FwO1xuICAgIH1cbiAgfVxuXG4gIG1ha2VEcmFnKCkge1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5kcm9wT3Zlckl0ZW1zICYmIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5kcmFnZ2FibGVcbiAgICAgICYmIHRoaXMuZ3JpZHN0ZXIub3B0aW9ucy5kcmFnZ2FibGUuZHJvcE92ZXJJdGVtc0NhbGxiYWNrXG4gICAgICAmJiB0aGlzLmNvbGxpc2lvbiAmJiB0aGlzLmNvbGxpc2lvbiAhPT0gdHJ1ZSAmJiB0aGlzLmNvbGxpc2lvbi4kaXRlbSkge1xuICAgICAgdGhpcy5ncmlkc3Rlci5vcHRpb25zLmRyYWdnYWJsZS5kcm9wT3Zlckl0ZW1zQ2FsbGJhY2sodGhpcy5ncmlkc3Rlckl0ZW0uaXRlbSwgdGhpcy5jb2xsaXNpb24uaXRlbSwgdGhpcy5ncmlkc3Rlcik7XG4gICAgfVxuICAgIHRoaXMuY29sbGlzaW9uID0gZmFsc2U7XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0uc2V0U2l6ZSgpO1xuICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLmNoZWNrSXRlbUNoYW5nZXModGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0sIHRoaXMuZ3JpZHN0ZXJJdGVtLml0ZW0pO1xuICAgIGlmICh0aGlzLnB1c2gpIHtcbiAgICAgIHRoaXMucHVzaC5zZXRQdXNoZWRJdGVtcygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zd2FwKSB7XG4gICAgICB0aGlzLnN3YXAuc2V0U3dhcEl0ZW0oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucHVzaCkge1xuICAgICAgdGhpcy5wdXNoLmRlc3Ryb3koKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnB1c2g7XG4gICAgfVxuICAgIGlmICh0aGlzLnN3YXApIHtcbiAgICAgIHRoaXMuc3dhcC5kZXN0cm95KCk7XG4gICAgICBkZWxldGUgdGhpcy5zd2FwO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUl0ZW1Qb3NpdGlvbigpIHtcbiAgICB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gPSB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbTtcbiAgICB0aGlzLnBvc2l0aW9uWCA9IHRoaXMuZ3JpZHN0ZXIucGl4ZWxzVG9Qb3NpdGlvblgodGhpcy5sZWZ0LCBNYXRoLnJvdW5kKTtcbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMuZ3JpZHN0ZXIucGl4ZWxzVG9Qb3NpdGlvblkodGhpcy50b3AsIE1hdGgucm91bmQpO1xuICAgIHRoaXMucG9zaXRpb25YQmFja3VwID0gdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueDtcbiAgICB0aGlzLnBvc2l0aW9uWUJhY2t1cCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnk7XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueCA9IHRoaXMucG9zaXRpb25YO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLmNoZWNrR3JpZENvbGxpc2lvbih0aGlzLmdyaWRzdGVySXRlbS4kaXRlbSkpIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnggPSB0aGlzLnBvc2l0aW9uWEJhY2t1cDtcbiAgICB9XG4gICAgdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueSA9IHRoaXMucG9zaXRpb25ZO1xuICAgIGlmICh0aGlzLmdyaWRzdGVyLmNoZWNrR3JpZENvbGxpc2lvbih0aGlzLmdyaWRzdGVySXRlbS4kaXRlbSkpIHtcbiAgICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnkgPSB0aGlzLnBvc2l0aW9uWUJhY2t1cDtcbiAgICB9XG4gICAgdGhpcy5ncmlkc3Rlci5ncmlkUmVuZGVyZXIuc2V0Q2VsbFBvc2l0aW9uKHRoaXMuZ3JpZHN0ZXJJdGVtLnJlbmRlcmVyLCB0aGlzLmdyaWRzdGVySXRlbS5lbCwgdGhpcy5sZWZ0LCB0aGlzLnRvcCk7XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvblhCYWNrdXAgIT09IHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnggfHwgdGhpcy5wb3NpdGlvbllCYWNrdXAgIT09IHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnkpIHtcbiAgICAgIGNvbnN0IGxhc3RQb3NpdGlvbiA9IHRoaXMucGF0aFt0aGlzLnBhdGgubGVuZ3RoIC0gMV07XG4gICAgICBsZXQgZGlyZWN0aW9uID0gJyc7XG4gICAgICBpZiAobGFzdFBvc2l0aW9uLnggPCB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS54KSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IHRoaXMucHVzaC5mcm9tV2VzdDtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFBvc2l0aW9uLnggPiB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS54KSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IHRoaXMucHVzaC5mcm9tRWFzdDtcbiAgICAgIH0gZWxzZSBpZiAobGFzdFBvc2l0aW9uLnkgPCB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS55KSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IHRoaXMucHVzaC5mcm9tTm9ydGg7XG4gICAgICB9IGVsc2UgaWYgKGxhc3RQb3NpdGlvbi55ID4gdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueSkge1xuICAgICAgICBkaXJlY3Rpb24gPSB0aGlzLnB1c2guZnJvbVNvdXRoO1xuICAgICAgfVxuICAgICAgdGhpcy5wdXNoLnB1c2hJdGVtcyhkaXJlY3Rpb24sIHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZGlzYWJsZVB1c2hPbkRyYWcpO1xuICAgICAgdGhpcy5zd2FwLnN3YXBJdGVtcygpO1xuICAgICAgdGhpcy5jb2xsaXNpb24gPSB0aGlzLmdyaWRzdGVyLmNoZWNrQ29sbGlzaW9uKHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtKTtcbiAgICAgIGlmICh0aGlzLmNvbGxpc2lvbikge1xuICAgICAgICB0aGlzLmdyaWRzdGVySXRlbS4kaXRlbS54ID0gdGhpcy5wb3NpdGlvblhCYWNrdXA7XG4gICAgICAgIHRoaXMuZ3JpZHN0ZXJJdGVtLiRpdGVtLnkgPSB0aGlzLnBvc2l0aW9uWUJhY2t1cDtcbiAgICAgICAgaWYgKHRoaXMuZ3JpZHN0ZXIuJG9wdGlvbnMuZHJhZ2dhYmxlLmRyb3BPdmVySXRlbXMgJiYgdGhpcy5jb2xsaXNpb24gIT09IHRydWUgJiYgdGhpcy5jb2xsaXNpb24uJGl0ZW0pIHtcbiAgICAgICAgICB0aGlzLmdyaWRzdGVyLm1vdmluZ0l0ZW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhdGgucHVzaCh7eDogdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueCwgeTogdGhpcy5ncmlkc3Rlckl0ZW0uJGl0ZW0ueX0pO1xuICAgICAgfVxuICAgICAgdGhpcy5wdXNoLmNoZWNrUHVzaEJhY2soKTtcbiAgICB9XG4gICAgdGhpcy5ncmlkc3Rlci5wcmV2aWV3U3R5bGUodHJ1ZSk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgY29uc3QgZW5hYmxlRHJhZyA9IHRoaXMuZ3JpZHN0ZXJJdGVtLmNhbkJlRHJhZ2dlZCgpO1xuICAgIGlmICghdGhpcy5lbmFibGVkICYmIGVuYWJsZURyYWcpIHtcbiAgICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWQ7XG4gICAgICB0aGlzLmRyYWdTdGFydEZ1bmN0aW9uID0gdGhpcy5kcmFnU3RhcnREZWxheS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5tb3VzZWRvd24gPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4odGhpcy5ncmlkc3Rlckl0ZW0uZWwsICdtb3VzZWRvd24nLCB0aGlzLmRyYWdTdGFydEZ1bmN0aW9uKTtcbiAgICAgIHRoaXMudG91Y2hzdGFydCA9IHRoaXMuZ3JpZHN0ZXJJdGVtLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmdyaWRzdGVySXRlbS5lbCwgJ3RvdWNoc3RhcnQnLCB0aGlzLmRyYWdTdGFydEZ1bmN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZW5hYmxlZCAmJiAhZW5hYmxlRHJhZykge1xuICAgICAgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZDtcbiAgICAgIHRoaXMubW91c2Vkb3duKCk7XG4gICAgICB0aGlzLnRvdWNoc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBkcmFnU3RhcnREZWxheShlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoZS50YXJnZXQuaGFzQXR0cmlidXRlKCdjbGFzcycpICYmIGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKS5zcGxpdCgnICcpLmluZGV4T2YoJ2dyaWRzdGVyLWl0ZW0tcmVzaXphYmxlLWhhbmRsZXInKSA+IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChHcmlkc3RlclV0aWxzLmNoZWNrQ29udGVudENsYXNzRm9yRXZlbnQodGhpcy5ncmlkc3RlciwgZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgR3JpZHN0ZXJVdGlscy5jaGVja1RvdWNoRXZlbnQoZSk7XG4gICAgaWYgKCF0aGlzLmdyaWRzdGVyLiRvcHRpb25zLmRyYWdnYWJsZS5kZWxheVN0YXJ0KSB7XG4gICAgICB0aGlzLmRyYWdTdGFydChlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kcmFnU3RhcnQoZSk7XG4gICAgICBjYW5jZWxEcmFnKCk7XG4gICAgfSwgdGhpcy5ncmlkc3Rlci4kb3B0aW9ucy5kcmFnZ2FibGUuZGVsYXlTdGFydCk7XG4gICAgY29uc3QgY2FuY2VsTW91c2UgPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCBjYW5jZWxEcmFnKTtcbiAgICBjb25zdCBjYW5jZWxNb3VzZUxlYXZlID0gdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgY2FuY2VsRHJhZyk7XG4gICAgY29uc3QgY2FuY2VsT25CbHVyID0gdGhpcy5ncmlkc3Rlckl0ZW0ucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnYmx1cicsIGNhbmNlbERyYWcpO1xuICAgIGNvbnN0IGNhbmNlbFRvdWNoTW92ZSA9IHRoaXMuZ3JpZHN0ZXJJdGVtLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2htb3ZlJywgY2FuY2VsTW92ZSk7XG4gICAgY29uc3QgY2FuY2VsVG91Y2hFbmQgPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNoZW5kJywgY2FuY2VsRHJhZyk7XG4gICAgY29uc3QgY2FuY2VsVG91Y2hDYW5jZWwgPSB0aGlzLmdyaWRzdGVySXRlbS5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNoY2FuY2VsJywgY2FuY2VsRHJhZyk7XG5cbiAgICBmdW5jdGlvbiBjYW5jZWxNb3ZlKGV2ZW50TW92ZTogYW55KSB7XG4gICAgICBHcmlkc3RlclV0aWxzLmNoZWNrVG91Y2hFdmVudChldmVudE1vdmUpO1xuICAgICAgaWYgKE1hdGguYWJzKGV2ZW50TW92ZS5jbGllbnRYIC0gZS5jbGllbnRYKSA+IDkgfHwgTWF0aC5hYnMoZXZlbnRNb3ZlLmNsaWVudFkgLSBlLmNsaWVudFkpID4gOSkge1xuICAgICAgICBjYW5jZWxEcmFnKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuY2VsRHJhZygpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGNhbmNlbE9uQmx1cigpO1xuICAgICAgY2FuY2VsTW91c2UoKTtcbiAgICAgIGNhbmNlbE1vdXNlTGVhdmUoKTtcbiAgICAgIGNhbmNlbFRvdWNoTW92ZSgpO1xuICAgICAgY2FuY2VsVG91Y2hFbmQoKTtcbiAgICAgIGNhbmNlbFRvdWNoQ2FuY2VsKCk7XG4gICAgfVxuICB9XG59XG4iXX0=