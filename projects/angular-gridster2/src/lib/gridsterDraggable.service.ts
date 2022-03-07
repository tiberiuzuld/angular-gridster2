import { NgZone } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { DirTypes } from './gridsterConfig.interface';
import { GridsterItemComponentInterface } from './gridsterItem.interface';
import { GridsterPush } from './gridsterPush.service';
import { MouseEvent2 } from './gridsterResizeEventType.interface';
import { cancelScroll, scroll } from './gridsterScroll.service';
import { GridsterSwap } from './gridsterSwap.service';
import { GridsterUtils } from './gridsterUtils.service';

export class GridsterDraggable {
    gridsterItem: GridsterItemComponentInterface;

    gridster: GridsterComponentInterface;

    lastMouse: {
        clientX: number;
        clientY: number;
    };

    offsetLeft: number;

    offsetTop: number;

    margin: number;

    diffTop: number;

    diffLeft: number;

    originalClientX: number;

    originalClientY: number;

    top: number;

    left: number;

    height: number;

    width: number;

    positionX: number;

    positionY: number;

    positionXBackup: number;

    positionYBackup: number;

    enabled: boolean;

    dragStartFunction: (event: MouseEvent) => void;

    dragFunction: (event: MouseEvent) => void;

    dragStopFunction: (event: MouseEvent) => void;

    mousemove: () => void;

    mouseup: () => void;

    mouseleave: () => void;

    cancelOnBlur: () => void;

    touchmove: () => void;

    touchend: () => void;

    touchcancel: () => void;

    mousedown: () => void;

    touchstart: () => void;

    push: GridsterPush;

    swap: GridsterSwap;

    path: Array<{ x: number; y: number }>;

    collision: GridsterItemComponentInterface | boolean = false;

    constructor(
        gridsterItem: GridsterItemComponentInterface,
        gridster: GridsterComponentInterface,
        private zone: NgZone,
    ) {
        this.gridsterItem = gridsterItem;
        this.gridster = gridster;
        this.lastMouse = {
            clientX: 0,
            clientY: 0,
        };
        this.path = [];
    }

    destroy(): void {
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle(true);
        }
        // @ts-ignore
        delete this.gridsterItem;
        // @ts-ignore
        delete this.gridster;
        // @ts-ignore
        delete this.collision;
        if (this.mousedown) {
            this.mousedown();
            this.touchstart();
        }
    }

    dragStart(e: MouseEvent): void {
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

        this.zone.runOutsideAngular(() => {
            this.mousemove = this.gridsterItem.renderer.listen(
                'document',
                'mousemove',
                this.dragFunction,
            );
            this.touchmove = this.gridster.renderer.listen(
                this.gridster.el,
                'touchmove',
                this.dragFunction,
            );
        });
        this.mouseup = this.gridsterItem.renderer.listen(
            'document',
            'mouseup',
            this.dragStopFunction,
        );
        this.mouseleave = this.gridsterItem.renderer.listen(
            'document',
            'mouseleave',
            this.dragStopFunction,
        );
        this.cancelOnBlur = this.gridsterItem.renderer.listen(
            'window',
            'blur',
            this.dragStopFunction,
        );
        this.touchend = this.gridsterItem.renderer.listen(
            'document',
            'touchend',
            this.dragStopFunction,
        );
        this.touchcancel = this.gridsterItem.renderer.listen(
            'document',
            'touchcancel',
            this.dragStopFunction,
        );
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
            this.diffLeft = e.clientX - this.gridster.el.scrollWidth + this.gridsterItem.left;
        } else {
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
    }

    dragMove(e: MouseEvent): void {
        e.stopPropagation();
        e.preventDefault();
        GridsterUtils.checkTouchEvent(e);
        this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
        this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
        scroll(
            this.gridster,
            this.left,
            this.top,
            this.width,
            this.height,
            e,
            this.lastMouse,
            this.calculateItemPositionFromMousePosition.bind(this),
        );

        this.calculateItemPositionFromMousePosition(e);
    }

    calculateItemPositionFromMousePosition(e: MouseEvent): void {
        if (this.gridster.options.scale) {
            this.calculateItemPositionWithScale(e, this.gridster.options.scale);
        } else {
            this.calculateItemPositionWithoutScale(e);
        }
        this.calculateItemPosition();
        this.lastMouse.clientX = e.clientX;
        this.lastMouse.clientY = e.clientY;
        this.zone.run(() => {
            this.gridster.updateGrid();
        });
    }

    calculateItemPositionWithScale(e: MouseEvent, scale: number): void {
        if (this.gridster.$options.dirType === DirTypes.RTL) {
            this.left =
                this.gridster.el.scrollWidth -
                this.originalClientX +
                (e.clientX - this.originalClientX) / scale +
                this.diffLeft;
        } else {
            this.left =
                this.originalClientX +
                (e.clientX - this.originalClientX) / scale +
                this.offsetLeft -
                this.diffLeft;
        }
        this.top =
            this.originalClientY +
            (e.clientY - this.originalClientY) / scale +
            this.offsetTop -
            this.diffTop;
    }

    calculateItemPositionWithoutScale(e: MouseEvent): void {
        if (this.gridster.$options.dirType === DirTypes.RTL) {
            this.left = this.gridster.el.scrollWidth - e.clientX + this.diffLeft;
        } else {
            this.left = e.clientX + this.offsetLeft - this.diffLeft;
        }

        this.top = e.clientY + this.offsetTop - this.diffTop;
    }

    dragStop(e: MouseEvent): void {
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
            Promise.resolve(
                this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e),
            ).then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
        } else {
            this.makeDrag();
        }
        setTimeout(() => {
            if (this.gridster) {
                this.gridster.movingItem = null;
                this.gridster.previewStyle(true);
            }
        });
    }

    cancelDrag(): void {
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
            // @ts-ignore
            delete this.push;
        }
        if (this.swap) {
            this.swap.destroy();
            // @ts-ignore
            delete this.swap;
        }
    }

    makeDrag(): void {
        if (
            this.gridster.$options.draggable.dropOverItems &&
            this.gridster.options.draggable &&
            this.gridster.options.draggable.dropOverItemsCallback &&
            this.collision &&
            this.collision !== true &&
            this.collision.$item
        ) {
            this.gridster.options.draggable.dropOverItemsCallback(
                this.gridsterItem.item,
                this.collision.item,
                this.gridster,
            );
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
            // @ts-ignore
            delete this.push;
        }
        if (this.swap) {
            this.swap.destroy();
            // @ts-ignore
            delete this.swap;
        }
    }

    calculateItemPosition(): void {
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
        this.gridster.gridRenderer.setCellPosition(
            this.gridsterItem.renderer,
            this.gridsterItem.el,
            this.left,
            this.top,
        );

        if (
            this.positionXBackup !== this.gridsterItem.$item.x ||
            this.positionYBackup !== this.gridsterItem.$item.y
        ) {
            const lastPosition = this.path[this.path.length - 1];
            let direction = '';
            if (lastPosition.x < this.gridsterItem.$item.x) {
                direction = this.push.fromWest;
            } else if (lastPosition.x > this.gridsterItem.$item.x) {
                direction = this.push.fromEast;
            } else if (lastPosition.y < this.gridsterItem.$item.y) {
                direction = this.push.fromNorth;
            } else if (lastPosition.y > this.gridsterItem.$item.y) {
                direction = this.push.fromSouth;
            }
            this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
            this.swap.swapItems();
            this.collision = this.gridster.checkCollision(this.gridsterItem.$item);
            if (this.collision) {
                this.gridsterItem.$item.x = this.positionXBackup;
                this.gridsterItem.$item.y = this.positionYBackup;
                if (
                    this.gridster.$options.draggable.dropOverItems &&
                    this.collision !== true &&
                    this.collision.$item
                ) {
                    this.gridster.movingItem = null;
                }
            } else {
                this.path.push({ x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y });
            }
            this.push.checkPushBack();
        }
        this.gridster.previewStyle(true);
    }

    toggle(): void {
        const enableDrag = this.gridsterItem.canBeDragged();
        if (!this.enabled && enableDrag) {
            this.enabled = !this.enabled;
            this.dragStartFunction = this.dragStartDelay.bind(this);
            this.mousedown = this.gridsterItem.renderer.listen(
                this.gridsterItem.el,
                'mousedown',
                this.dragStartFunction,
            );
            this.touchstart = this.gridsterItem.renderer.listen(
                this.gridsterItem.el,
                'touchstart',
                this.dragStartFunction,
            );
        } else if (this.enabled && !enableDrag) {
            this.enabled = !this.enabled;
            this.mousedown();
            this.touchstart();
        }
    }

    dragStartDelay(e: MouseEvent2): void {
        if (
            e.target.hasAttribute('class') &&
            e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') >
                -1
        ) {
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
        const timeout = setTimeout(() => {
            this.dragStart(e);
            cancelDrag();
        }, this.gridster.$options.draggable.delayStart);
        const cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
        const cancelMouseLeave = this.gridsterItem.renderer.listen(
            'document',
            'mouseleave',
            cancelDrag,
        );
        const cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
        const cancelTouchMove = this.gridsterItem.renderer.listen(
            'document',
            'touchmove',
            cancelMove,
        );
        const cancelTouchEnd = this.gridsterItem.renderer.listen(
            'document',
            'touchend',
            cancelDrag,
        );
        const cancelTouchCancel = this.gridsterItem.renderer.listen(
            'document',
            'touchcancel',
            cancelDrag,
        );

        function cancelMove(eventMove: MouseEvent): void {
            GridsterUtils.checkTouchEvent(eventMove);
            if (
                Math.abs(eventMove.clientX - e.clientX) > 9 ||
                Math.abs(eventMove.clientY - e.clientY) > 9
            ) {
                cancelDrag();
            }
        }

        function cancelDrag(): void {
            clearTimeout(timeout);
            cancelOnBlur();
            cancelMouse();
            cancelMouseLeave();
            cancelTouchMove();
            cancelTouchEnd();
            cancelTouchCancel();
        }
    }
}
