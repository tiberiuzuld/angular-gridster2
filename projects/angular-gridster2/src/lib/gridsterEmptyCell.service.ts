import { GridsterUtils } from './gridsterUtils.service';
import { GridsterComponentInterface } from './gridster.interface';
import { GridsterItem } from './gridsterItem.interface';

export class GridsterEmptyCell {
    initialItem: GridsterItem | null;

    emptyCellClick: (() => void) | null;

    emptyCellClickTouch: (() => void) | null;

    emptyCellContextMenu: (() => void) | null;

    emptyCellDrop: (() => void) | null;

    emptyCellDrag: (() => void) | null;

    emptyCellDragTouch: (() => void) | null;

    emptyCellMMove: () => void;

    emptyCellMMoveTouch: () => void;

    emptyCellUp: () => void;

    emptyCellUpTouch: () => void;

    emptyCellMove: (() => void) | null;

    emptyCellExit: (() => void) | null;

    constructor(private gridster: GridsterComponentInterface) {}

    destroy(): void {
        // @ts-ignore
        delete this.initialItem;
        // @ts-ignore
        delete this.gridster.movingItem;
        if (this.gridster.previewStyle) {
            this.gridster.previewStyle();
        }
        // @ts-ignore
        delete this.gridster;
        if (this.emptyCellExit) {
            this.emptyCellExit();
            this.emptyCellExit = null;
        }
    }

    updateOptions(): void {
        if (
            this.gridster.$options.enableEmptyCellClick &&
            !this.emptyCellClick &&
            this.gridster.options.emptyCellClickCallback
        ) {
            this.emptyCellClick = this.gridster.renderer.listen(
                this.gridster.el,
                'click',
                this.emptyCellClickCb.bind(this),
            );
            this.emptyCellClickTouch = this.gridster.renderer.listen(
                this.gridster.el,
                'touchend',
                this.emptyCellClickCb.bind(this),
            );
        } else if (
            !this.gridster.$options.enableEmptyCellClick &&
            this.emptyCellClick &&
            this.emptyCellClickTouch
        ) {
            this.emptyCellClick();
            this.emptyCellClickTouch();
            this.emptyCellClick = null;
            this.emptyCellClickTouch = null;
        }
        if (
            this.gridster.$options.enableEmptyCellContextMenu &&
            !this.emptyCellContextMenu &&
            this.gridster.options.emptyCellContextMenuCallback
        ) {
            this.emptyCellContextMenu = this.gridster.renderer.listen(
                this.gridster.el,
                'contextmenu',
                this.emptyCellContextMenuCb.bind(this),
            );
        } else if (
            !this.gridster.$options.enableEmptyCellContextMenu &&
            this.emptyCellContextMenu
        ) {
            this.emptyCellContextMenu();
            this.emptyCellContextMenu = null;
        }
        if (
            this.gridster.$options.enableEmptyCellDrop &&
            !this.emptyCellDrop &&
            this.gridster.options.emptyCellDropCallback
        ) {
            this.emptyCellDrop = this.gridster.renderer.listen(
                this.gridster.el,
                'drop',
                this.emptyCellDragDrop.bind(this),
            );
            this.gridster.zone.runOutsideAngular(() => {
                this.emptyCellMove = this.gridster.renderer.listen(
                    this.gridster.el,
                    'dragover',
                    this.emptyCellDragOver.bind(this),
                );
            });
            this.emptyCellExit = this.gridster.renderer.listen('document', 'dragend', () => {
                this.gridster.movingItem = null;
                this.gridster.previewStyle();
            });
        } else if (
            !this.gridster.$options.enableEmptyCellDrop &&
            this.emptyCellDrop &&
            this.emptyCellMove &&
            this.emptyCellExit
        ) {
            this.emptyCellDrop();
            this.emptyCellMove();
            this.emptyCellExit();
            this.emptyCellMove = null;
            this.emptyCellDrop = null;
            this.emptyCellExit = null;
        }
        if (
            this.gridster.$options.enableEmptyCellDrag &&
            !this.emptyCellDrag &&
            this.gridster.options.emptyCellDragCallback
        ) {
            this.emptyCellDrag = this.gridster.renderer.listen(
                this.gridster.el,
                'mousedown',
                this.emptyCellMouseDown.bind(this),
            );
            this.emptyCellDragTouch = this.gridster.renderer.listen(
                this.gridster.el,
                'touchstart',
                this.emptyCellMouseDown.bind(this),
            );
        } else if (
            !this.gridster.$options.enableEmptyCellDrag &&
            this.emptyCellDrag &&
            this.emptyCellDragTouch
        ) {
            this.emptyCellDrag();
            this.emptyCellDragTouch();
            this.emptyCellDrag = null;
            this.emptyCellDragTouch = null;
        }
    }

    emptyCellClickCb(e: MouseEvent): void {
        if (
            !this.gridster ||
            this.gridster.movingItem ||
            GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)
        ) {
            return;
        }
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellClickCallback) {
            this.gridster.options.emptyCellClickCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }

    emptyCellContextMenuCb(e: MouseEvent): void {
        if (
            this.gridster.movingItem ||
            GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)
        ) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellContextMenuCallback) {
            this.gridster.options.emptyCellContextMenuCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }

    emptyCellDragDrop(e: DragEvent): void {
        const item = this.getValidItemFromEvent(e);
        if (!item) {
            return;
        }
        if (this.gridster.options.emptyCellDropCallback) {
            this.gridster.options.emptyCellDropCallback(e, item);
        }
        this.gridster.cdRef.markForCheck();
    }

    emptyCellDragOver(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        if (item) {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'move';
            }
            this.gridster.movingItem = item;
        } else {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'none';
            }
            this.gridster.movingItem = null;
        }
        this.gridster.previewStyle();
    }

    emptyCellMouseDown(e: MouseEvent): void {
        if (GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e);
        const leftMouseButtonCode = 1;
        if (!item || (e.buttons !== leftMouseButtonCode && !(e instanceof TouchEvent))) {
            return;
        }
        this.initialItem = item;
        this.gridster.movingItem = item;
        this.gridster.previewStyle();
        this.gridster.zone.runOutsideAngular(() => {
            this.emptyCellMMove = this.gridster.renderer.listen(
                'window',
                'mousemove',
                this.emptyCellMouseMove.bind(this),
            );
            this.emptyCellMMoveTouch = this.gridster.renderer.listen(
                'window',
                'touchmove',
                this.emptyCellMouseMove.bind(this),
            );
        });
        this.emptyCellUp = this.gridster.renderer.listen(
            'window',
            'mouseup',
            this.emptyCellMouseUp.bind(this),
        );
        this.emptyCellUpTouch = this.gridster.renderer.listen(
            'window',
            'touchend',
            this.emptyCellMouseUp.bind(this),
        );
    }

    emptyCellMouseMove(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        const item = this.getValidItemFromEvent(e, this.initialItem);
        if (!item) {
            return;
        }

        this.gridster.movingItem = item;
        this.gridster.previewStyle();
    }

    emptyCellMouseUp(e: MouseEvent): void {
        this.emptyCellMMove();
        this.emptyCellMMoveTouch();
        this.emptyCellUp();
        this.emptyCellUpTouch();
        const item = this.getValidItemFromEvent(e, this.initialItem);
        if (item) {
            this.gridster.movingItem = item;
        }
        if (this.gridster.options.emptyCellDragCallback && this.gridster.movingItem) {
            this.gridster.options.emptyCellDragCallback(e, this.gridster.movingItem);
        }
        setTimeout(() => {
            this.initialItem = null;
            if (this.gridster) {
                this.gridster.movingItem = null;
                this.gridster.previewStyle();
            }
        });
        this.gridster.cdRef.markForCheck();
    }

    getPixelsX(e: MouseEvent, rect: ClientRect): number {
        const scale = this.gridster.options.scale;
        if (scale) {
            return (
                (e.clientX - rect.left) / scale +
                this.gridster.el.scrollLeft -
                this.gridster.gridRenderer.getLeftMargin()
            );
        }
        return (
            e.clientX +
            this.gridster.el.scrollLeft -
            rect.left -
            this.gridster.gridRenderer.getLeftMargin()
        );
    }

    getPixelsY(e: MouseEvent, rect: ClientRect): number {
        const scale = this.gridster.options.scale;
        if (scale) {
            return (
                (e.clientY - rect.top) / scale +
                this.gridster.el.scrollTop -
                this.gridster.gridRenderer.getTopMargin()
            );
        }
        return (
            e.clientY +
            this.gridster.el.scrollTop -
            rect.top -
            this.gridster.gridRenderer.getTopMargin()
        );
    }

    getValidItemFromEvent(e: MouseEvent, oldItem?: GridsterItem | null): GridsterItem | undefined {
        e.preventDefault();
        e.stopPropagation();
        GridsterUtils.checkTouchEvent(e);
        const rect = this.gridster.el.getBoundingClientRect();
        const x = this.getPixelsX(e, rect);
        const y = this.getPixelsY(e, rect);
        const item: GridsterItem = {
            x: this.gridster.pixelsToPositionX(x, Math.floor, true),
            y: this.gridster.pixelsToPositionY(y, Math.floor, true),
            cols: this.gridster.$options.defaultItemCols,
            rows: this.gridster.$options.defaultItemRows,
        };
        if (oldItem) {
            item.cols = Math.min(
                Math.abs(oldItem.x - item.x) + 1,
                this.gridster.$options.emptyCellDragMaxCols,
            );
            item.rows = Math.min(
                Math.abs(oldItem.y - item.y) + 1,
                this.gridster.$options.emptyCellDragMaxRows,
            );
            if (oldItem.x < item.x) {
                item.x = oldItem.x;
            } else if (oldItem.x - item.x > this.gridster.$options.emptyCellDragMaxCols - 1) {
                item.x = this.gridster.movingItem ? this.gridster.movingItem.x : 0;
            }
            if (oldItem.y < item.y) {
                item.y = oldItem.y;
            } else if (oldItem.y - item.y > this.gridster.$options.emptyCellDragMaxRows - 1) {
                item.y = this.gridster.movingItem ? this.gridster.movingItem.y : 0;
            }
        }
        if (!this.gridster.$options.enableOccupiedCellDrop && this.gridster.checkCollision(item)) {
            return;
        }
        return item;
    }
}
