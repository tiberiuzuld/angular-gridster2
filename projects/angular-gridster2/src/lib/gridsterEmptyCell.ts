import { Gridster } from './gridster';
import { GridsterItemConfig } from './gridsterItemConfig';
import { GridsterUtils } from './gridsterUtils';

export class GridsterEmptyCell {
  initialItem: GridsterItemConfig | null;
  removeEmptyCellClickListenerFn: (() => void) | null;
  removeEmptyCellTouchendListenerFn: (() => void) | null;
  removeEmptyCellContextMenuListenerFn: (() => void) | null;
  removeEmptyCellDropListenerFn: (() => void) | null;
  removeEmptyCellMousedownListenerFn: (() => void) | null;
  removeEmptyCellTouchstartListenerFn: (() => void) | null;
  removeWindowMousemoveListenerFn: () => void;
  removeWindowTouchmoveListenerFn: () => void;
  removeWindowMouseupListenerFn: () => void;
  removeWindowTouchendListenerFn: () => void;
  removeEmptyCellDragoverListenerFn: (() => void) | null;
  removeDocumentDragendListenerFn: (() => void) | null;

  constructor(private gridster: Gridster) {}

  destroy(): void {
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle();
    }
    this.gridster.movingItem = null;
    this.initialItem = this.gridster = null!;
    if (this.removeDocumentDragendListenerFn) {
      this.removeDocumentDragendListenerFn();
      this.removeDocumentDragendListenerFn = null;
    }
  }

  updateOptions(): void {
    const options = this.gridster.options();
    const $options = this.gridster.$options();
    if ($options.enableEmptyCellClick && !this.removeEmptyCellClickListenerFn && options.emptyCellClickCallback) {
      this.removeEmptyCellClickListenerFn = this.gridster.renderer.listen(this.gridster.el, 'click', this.emptyCellClickCb);
      this.removeEmptyCellTouchendListenerFn = this.gridster.renderer.listen(this.gridster.el, 'touchend', this.emptyCellClickCb);
    } else if (!$options.enableEmptyCellClick && this.removeEmptyCellClickListenerFn && this.removeEmptyCellTouchendListenerFn) {
      this.removeEmptyCellClickListenerFn();
      this.removeEmptyCellTouchendListenerFn();
      this.removeEmptyCellClickListenerFn = null;
      this.removeEmptyCellTouchendListenerFn = null;
    }
    if ($options.enableEmptyCellContextMenu && !this.removeEmptyCellContextMenuListenerFn && options.emptyCellContextMenuCallback) {
      this.removeEmptyCellContextMenuListenerFn = this.gridster.renderer.listen(this.gridster.el, 'contextmenu', this.emptyCellContextMenuCb);
    } else if (!$options.enableEmptyCellContextMenu && this.removeEmptyCellContextMenuListenerFn) {
      this.removeEmptyCellContextMenuListenerFn();
      this.removeEmptyCellContextMenuListenerFn = null;
    }
    if ($options.enableEmptyCellDrop && !this.removeEmptyCellDropListenerFn && options.emptyCellDropCallback) {
      this.removeEmptyCellDropListenerFn = this.gridster.renderer.listen(this.gridster.el, 'drop', this.emptyCellDragDrop);
      this.gridster.zone.runOutsideAngular(() => {
        this.removeEmptyCellDragoverListenerFn = this.gridster.renderer.listen(this.gridster.el, 'dragover', this.emptyCellDragOver);
      });
      this.removeDocumentDragendListenerFn = this.gridster.renderer.listen('document', 'dragend', () => {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      });
    } else if (
      !$options.enableEmptyCellDrop &&
      this.removeEmptyCellDropListenerFn &&
      this.removeEmptyCellDragoverListenerFn &&
      this.removeDocumentDragendListenerFn
    ) {
      this.removeEmptyCellDropListenerFn();
      this.removeEmptyCellDragoverListenerFn();
      this.removeDocumentDragendListenerFn();
      this.removeEmptyCellDragoverListenerFn = null;
      this.removeEmptyCellDropListenerFn = null;
      this.removeDocumentDragendListenerFn = null;
    }
    if ($options.enableEmptyCellDrag && !this.removeEmptyCellMousedownListenerFn && options.emptyCellDragCallback) {
      this.removeEmptyCellMousedownListenerFn = this.gridster.renderer.listen(this.gridster.el, 'mousedown', this.emptyCellMouseDown);
      this.removeEmptyCellTouchstartListenerFn = this.gridster.renderer.listen(this.gridster.el, 'touchstart', this.emptyCellMouseDown);
    } else if (!$options.enableEmptyCellDrag && this.removeEmptyCellMousedownListenerFn && this.removeEmptyCellTouchstartListenerFn) {
      this.removeEmptyCellMousedownListenerFn();
      this.removeEmptyCellTouchstartListenerFn();
      this.removeEmptyCellMousedownListenerFn = null;
      this.removeEmptyCellTouchstartListenerFn = null;
    }
  }

  emptyCellClickCb = (e: MouseEvent): void => {
    if (!this.gridster || this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return;
    }
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    const options = this.gridster.options();
    if (options.emptyCellClickCallback) {
      options.emptyCellClickCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  };

  emptyCellContextMenuCb = (e: MouseEvent): void => {
    if (this.gridster.movingItem || GridsterUtils.checkContentClassForEmptyCellClickEvent(this.gridster, e)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    const options = this.gridster.options();
    if (options.emptyCellContextMenuCallback) {
      options.emptyCellContextMenuCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  };

  emptyCellDragDrop = (e: DragEvent): void => {
    const item = this.getValidItemFromEvent(e);
    if (!item) {
      return;
    }
    const options = this.gridster.options();
    if (options.emptyCellDropCallback) {
      options.emptyCellDropCallback(e, item);
    }
    this.gridster.cdRef.markForCheck();
  };

  emptyCellDragOver = (e: DragEvent): void => {
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
  };

  emptyCellMouseDown = (e: MouseEvent): void => {
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
      this.removeWindowMousemoveListenerFn = this.gridster.renderer.listen('window', 'mousemove', this.emptyCellMouseMove);
      this.removeWindowTouchmoveListenerFn = this.gridster.renderer.listen('window', 'touchmove', this.emptyCellMouseMove);
    });
    this.removeWindowMouseupListenerFn = this.gridster.renderer.listen('window', 'mouseup', this.emptyCellMouseUp);
    this.removeWindowTouchendListenerFn = this.gridster.renderer.listen('window', 'touchend', this.emptyCellMouseUp);
  };

  emptyCellMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    const item = this.getValidItemFromEvent(e, this.initialItem);
    if (!item) {
      return;
    }

    this.gridster.movingItem = item;
    this.gridster.previewStyle();
  };

  emptyCellMouseUp = (e: MouseEvent): void => {
    this.removeWindowMousemoveListenerFn();
    this.removeWindowTouchmoveListenerFn();
    this.removeWindowMouseupListenerFn();
    this.removeWindowTouchendListenerFn();
    const item = this.getValidItemFromEvent(e, this.initialItem);
    if (item) {
      this.gridster.movingItem = item;
    }
    const options = this.gridster.options();
    if (options.emptyCellDragCallback && this.gridster.movingItem) {
      options.emptyCellDragCallback(e, this.gridster.movingItem);
    }
    setTimeout(() => {
      this.initialItem = null;
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      }
    });
    this.gridster.cdRef.markForCheck();
  };

  getPixelsX(e: MouseEvent, rect: ClientRect): number {
    const scale = this.gridster.options().scale;
    if (scale) {
      return (e.clientX - rect.left) / scale + this.gridster.el.scrollLeft - this.gridster.gridRenderer.getLeftMargin();
    }
    return e.clientX + this.gridster.el.scrollLeft - rect.left - this.gridster.gridRenderer.getLeftMargin();
  }

  getPixelsY(e: MouseEvent, rect: ClientRect): number {
    const scale = this.gridster.options().scale;
    if (scale) {
      return (e.clientY - rect.top) / scale + this.gridster.el.scrollTop - this.gridster.gridRenderer.getTopMargin();
    }
    return e.clientY + this.gridster.el.scrollTop - rect.top - this.gridster.gridRenderer.getTopMargin();
  }

  getValidItemFromEvent(e: MouseEvent, oldItem?: GridsterItemConfig | null): GridsterItemConfig | undefined {
    e.preventDefault();
    e.stopPropagation();
    GridsterUtils.checkTouchEvent(e);
    const rect = this.gridster.el.getBoundingClientRect();
    const x = this.getPixelsX(e, rect);
    const y = this.getPixelsY(e, rect);
    const $options = this.gridster.$options();
    const item: GridsterItemConfig = {
      x: this.gridster.pixelsToPositionX(x, Math.floor, true),
      y: this.gridster.pixelsToPositionY(y, Math.floor, true),
      cols: Math.max($options.defaultItemCols, $options.minItemCols),
      rows: Math.max($options.defaultItemRows, $options.minItemRows)
    };
    if (oldItem) {
      const cellX = item.x;
      const cellY = item.y;
      item.cols = Math.min(Math.max(Math.abs(oldItem.x - cellX) + 1, $options.minItemCols), $options.emptyCellDragMaxCols);
      item.rows = Math.min(Math.max(Math.abs(oldItem.y - cellY) + 1, $options.minItemRows), $options.emptyCellDragMaxRows);
      if (oldItem.x <= cellX) {
        item.x = oldItem.x;
      } else {
        item.x = oldItem.x - item.cols + 1;
      }
      if (oldItem.y <= cellY) {
        item.y = oldItem.y;
      } else {
        item.y = oldItem.y - item.rows + 1;
      }
    }
    if (!$options.enableOccupiedCellDrop && this.gridster.checkCollision(item)) {
      return;
    }
    return item;
  }
}
