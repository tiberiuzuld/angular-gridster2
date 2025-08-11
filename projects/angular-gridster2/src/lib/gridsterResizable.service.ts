import { NgZone } from '@angular/core';
import { GridsterComponentInterface } from './gridster.interface';
import { DirTypes } from './gridsterConfig.interface';
import { GridsterItemComponentInterface } from './gridsterItem.interface';
import { GridsterPush } from './gridsterPush.service';
import { GridsterPushResize } from './gridsterPushResize.service';
import { GridsterResizeEventType } from './gridsterResizeEventType.interface';

import { cancelScroll, scroll } from './gridsterScroll.service';
import { GridsterUtils } from './gridsterUtils.service';

export class GridsterResizable {
  gridsterItem: GridsterItemComponentInterface;
  gridster: GridsterComponentInterface;
  lastMouse: {
    clientX: number;
    clientY: number;
  };
  itemBackup = { x: 0, y: 0, cols: 0, rows: 0 };
  resizeEventScrollType: GridsterResizeEventType;

  /**
   * The direction function may reference any of the `GridsterResizable` class methods, that are
   * responsible for gridster resize when the `dragmove` event is being handled. E.g. it may reference
   * the `handleNorth` method when the north handle is pressed and moved by a mouse.
   */
  private directionFunction:
    | ((event: Pick<MouseEvent, 'clientX' | 'clientY'>) => void)
    | null = null;

  resizeEnabled: boolean;
  resizableHandles?: {
    s: boolean;
    e: boolean;
    n: boolean;
    w: boolean;
    se: boolean;
    ne: boolean;
    sw: boolean;
    nw: boolean;
  };
  mousemove: () => void;
  mouseup: () => void;
  mouseleave: () => void;
  cancelOnBlur: () => void;
  touchmove: () => void;
  touchend: () => void;
  touchcancel: () => void;
  push: GridsterPush;
  pushResize: GridsterPushResize;
  minHeight: number;
  minWidth: number;
  offsetTop: number;
  offsetLeft: number;
  diffTop: number;
  diffLeft: number;
  diffRight: number;
  diffBottom: number;
  margin: number;
  outerMarginTop: number | null;
  outerMarginRight: number | null;
  outerMarginBottom: number | null;
  outerMarginLeft: number | null;
  originalClientX: number;
  originalClientY: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  hasRatio: boolean;

  constructor(
    gridsterItem: GridsterItemComponentInterface,
    gridster: GridsterComponentInterface,
    private zone: NgZone
  ) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.lastMouse = {
      clientX: 0,
      clientY: 0
    };
    this.resizeEventScrollType = {
      west: false,
      east: false,
      north: false,
      south: false
    };
  }

  destroy(): void {
    this.gridster?.previewStyle();
    this.gridster = this.gridsterItem = null!;
  }

  dragStart(e: MouseEvent): void {
    if ((e.which && e.which !== 1) || this.gridster.dragInProgress) {
      return;
    }
    if (
      this.gridster.options.resizable &&
      this.gridster.options.resizable.start
    ) {
      this.gridster.options.resizable.start(
        this.gridsterItem.item,
        this.gridsterItem,
        e
      );
    }
    e.stopPropagation();
    e.preventDefault();

    this.zone.runOutsideAngular(() => {
      this.mousemove = this.gridsterItem.renderer.listen(
        'document',
        'mousemove',
        this.dragMove
      );
      this.touchmove = this.gridster.renderer.listen(
        this.gridster.el,
        'touchmove',
        this.dragMove
      );
    });
    this.mouseup = this.gridsterItem.renderer.listen(
      'document',
      'mouseup',
      this.dragStop
    );
    this.mouseleave = this.gridsterItem.renderer.listen(
      'document',
      'mouseleave',
      this.dragStop
    );
    this.cancelOnBlur = this.gridsterItem.renderer.listen(
      'window',
      'blur',
      this.dragStop
    );
    this.touchend = this.gridsterItem.renderer.listen(
      'document',
      'touchend',
      this.dragStop
    );
    this.touchcancel = this.gridsterItem.renderer.listen(
      'document',
      'touchcancel',
      this.dragStop
    );

    this.gridsterItem.renderer.addClass(
      this.gridsterItem.el,
      'gridster-item-resizing'
    );
    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.left = this.gridsterItem.left;
    this.top = this.gridsterItem.top;
    this.originalClientX = e.clientX;
    this.originalClientY = e.clientY;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    this.bottom = this.gridsterItem.top + this.gridsterItem.height;
    this.right = this.gridsterItem.left + this.gridsterItem.width;
    this.margin = this.gridster.$options.margin;
    this.outerMarginTop = this.gridster.$options.outerMarginTop;
    this.outerMarginRight = this.gridster.$options.outerMarginRight;
    this.outerMarginBottom = this.gridster.$options.outerMarginBottom;
    this.outerMarginLeft = this.gridster.$options.outerMarginLeft;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.diffLeft = e.clientX + this.offsetLeft - this.left;
    this.diffRight = e.clientX + this.offsetLeft - this.right;
    this.diffTop = e.clientY + this.offsetTop - this.top;
    this.diffBottom = e.clientY + this.offsetTop - this.bottom;
    this.minHeight =
      this.gridster.positionYToPixels(
        this.gridsterItem.$item.minItemRows ||
          this.gridster.$options.minItemRows
      ) - this.margin;
    this.minWidth =
      this.gridster.positionXToPixels(
        this.gridsterItem.$item.minItemCols ||
          this.gridster.$options.minItemCols
      ) - this.margin;
    this.gridster.movingItem = this.gridsterItem.$item;
    this.gridster.previewStyle();
    this.push = new GridsterPush(this.gridsterItem);
    this.pushResize = new GridsterPushResize(this.gridsterItem);
    this.gridster.dragInProgress = true;
    this.hasRatio = !!(
      this.gridster.$options.itemAspectRatio ||
      this.gridsterItem.$item.itemAspectRatio
    );
    this.itemBackup = { x: 0, y: 0, cols: 0, rows: 0 };
    this.gridster.updateGrid();

    const { classList } = e.target as HTMLElement;

    if (classList.contains('handle-n')) {
      this.resizeEventScrollType.north = true;
      this.directionFunction = this.handleNorth;
    } else if (classList.contains('handle-w')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleEast;
      } else {
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleWest;
      }
    } else if (classList.contains('handle-s')) {
      this.resizeEventScrollType.south = true;
      this.directionFunction = this.handleSouth;
    } else if (classList.contains('handle-e')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleWest;
      } else {
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleEast;
      }
    } else if (classList.contains('handle-nw')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.north = true;
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleNorthEast;
      } else {
        this.resizeEventScrollType.north = true;
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleNorthWest;
      }
    } else if (classList.contains('handle-ne')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.north = true;
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleNorthWest;
      } else {
        this.resizeEventScrollType.north = true;
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleNorthEast;
      }
    } else if (classList.contains('handle-sw')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.south = true;
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleSouthEast;
      } else {
        this.resizeEventScrollType.south = true;
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleSouthWest;
      }
    } else if (classList.contains('handle-se')) {
      if (this.gridster.$options.dirType === DirTypes.RTL) {
        this.resizeEventScrollType.south = true;
        this.resizeEventScrollType.west = true;
        this.directionFunction = this.handleSouthWest;
      } else {
        this.resizeEventScrollType.south = true;
        this.resizeEventScrollType.east = true;
        this.directionFunction = this.handleSouthEast;
      }
    }
  }

  dragMove = (e: MouseEvent): void => {
    if (this.directionFunction === null) {
      throw new Error(
        'The `directionFunction` has not been set before calling `dragMove`.'
      );
    }

    e.stopPropagation();
    e.preventDefault();
    GridsterUtils.checkTouchEvent(e);
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    scroll(
      this.gridster,
      this.left,
      this.top,
      this.width,
      this.height,
      e,
      this.lastMouse,
      this.directionFunction,
      true,
      this.resizeEventScrollType
    );

    const scale = this.gridster.options.scale || 1;
    this.directionFunction({
      clientX:
        this.originalClientX + (e.clientX - this.originalClientX) / scale,
      clientY: this.originalClientY + (e.clientY - this.originalClientY) / scale
    });

    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.zone.run(() => {
      this.gridster.updateGrid();
    });
  };

  dragStop = (e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    cancelScroll();
    this.mousemove();
    this.mouseup();
    this.mouseleave();
    this.cancelOnBlur();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridster.dragInProgress = false;
    this.resizeEventScrollType = {
      west: false,
      east: false,
      north: false,
      south: false
    };
    this.gridster.updateGrid();
    if (
      this.gridster.options.resizable &&
      this.gridster.options.resizable.stop
    ) {
      Promise.resolve(
        this.gridster.options.resizable.stop(
          this.gridsterItem.item,
          this.gridsterItem,
          e
        )
      ).then(this.makeResize, this.cancelResize);
    } else {
      this.makeResize();
    }
    setTimeout(() => {
      this.gridsterItem.renderer.removeClass(
        this.gridsterItem.el,
        'gridster-item-resizing'
      );
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      }
    });
  };

  cancelResize = (): void => {
    this.gridsterItem.$item.cols = this.gridsterItem.item.cols || 1;
    this.gridsterItem.$item.rows = this.gridsterItem.item.rows || 1;
    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
    this.gridsterItem.setSize();
    this.push.restoreItems();
    this.pushResize.restoreItems();
    this.push.destroy();
    this.push = null!;
    this.pushResize.destroy();
    this.pushResize = null!;
  };

  makeResize = (): void => {
    this.gridsterItem.setSize();
    this.gridsterItem.checkItemChanges(
      this.gridsterItem.$item,
      this.gridsterItem.item
    );
    this.push.setPushedItems();
    this.pushResize.setPushedItems();
    this.push.destroy();
    this.push = null!;
    this.pushResize.destroy();
    this.pushResize = null!;
  };

  private check = (direction: string): boolean => {
    this.hasRatio && this.enforceAspectRatio();
    this.pushResize.pushItems(direction);
    this.push.pushItems(direction, this.gridster.$options.disablePushOnResize);
    if (this.gridster.checkCollision(this.gridsterItem.$item, true)) {
      this.resetItem(this.hasRatio);
      return false;
    }
    this.gridster.previewStyle();
    this.pushResize.checkPushBack();
    this.push.checkPushBack();
    return true;
  };

  private getNewNorthPosition = (e: MouseEvent): number => {
    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.height = this.bottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
      this.top = this.bottom - this.minHeight;
    } else if (this.gridster.options.enableBoundaryControl) {
      this.top = Math.max(0, this.top);
      this.height = this.bottom - this.top;
    }
    const marginTop = this.gridster.options.pushItems ? this.margin : 0;
    return this.gridster.pixelsToPositionY(this.top + marginTop, Math.floor);
  };

  private handleNorth = (e: MouseEvent): void => {
    const newPosition = this.getNewNorthPosition(e);
    if (this.gridsterItem.$item.y !== newPosition) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows += this.gridsterItem.$item.y - newPosition;
      this.gridsterItem.$item.y = newPosition;
      if (!this.check(this.pushResize.fromSouth)) {
        return;
      }
    }
    this.setItemTop(this.top);
    this.setItemHeight(this.height);
  };

  private getNewWestPosition = (e: MouseEvent): number => {
    const clientX =
      this.gridster.$options.dirType === DirTypes.RTL
        ? this.originalClientX + (this.originalClientX - e.clientX)
        : e.clientX;
    this.left = clientX + this.offsetLeft - this.diffLeft;

    this.width = this.right - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
      this.left = this.right - this.minWidth;
    } else if (this.gridster.options.enableBoundaryControl) {
      this.left = Math.max(0, this.left);
      this.width = this.right - this.left;
    }
    const marginLeft = this.gridster.options.pushItems ? this.margin : 0;
    return this.gridster.pixelsToPositionX(this.left + marginLeft, Math.floor);
  };

  private handleWest = (e: MouseEvent): void => {
    const newPosition = this.getNewWestPosition(e);
    if (this.gridsterItem.$item.x !== newPosition) {
      this.makeItemBackup();
      this.gridsterItem.$item.cols += this.gridsterItem.$item.x - newPosition;
      this.gridsterItem.$item.x = newPosition;
      if (!this.check(this.pushResize.fromEast)) {
        return;
      }
    }
    this.setItemLeft(this.left);
    this.setItemWidth(this.width);
  };

  private getNewSouthPosition = (e: MouseEvent): number => {
    this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
    }
    this.bottom = this.top + this.height;
    if (this.gridster.options.enableBoundaryControl) {
      const margin = this.outerMarginBottom ?? this.margin;
      const box = this.gridster.el.getBoundingClientRect();
      this.bottom = Math.min(this.bottom, box.bottom - box.top - 2 * margin);
      this.height = this.bottom - this.top;
    }
    const marginBottom = this.gridster.options.pushItems ? 0 : this.margin;
    return this.gridster.pixelsToPositionY(
      this.bottom + marginBottom,
      Math.ceil
    );
  };

  private handleSouth = (e: MouseEvent): void => {
    const newPosition = this.getNewSouthPosition(e);
    if (
      this.gridsterItem.$item.y + this.gridsterItem.$item.rows !==
      newPosition
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows = newPosition - this.gridsterItem.$item.y;
      if (!this.check(this.pushResize.fromNorth)) {
        return;
      }
    }
    this.setItemHeight(this.height);
  };

  private getNewEastPosition = (e: MouseEvent) => {
    const clientX =
      this.gridster.$options.dirType === DirTypes.RTL
        ? this.originalClientX + (this.originalClientX - e.clientX)
        : e.clientX;
    this.width = clientX + this.offsetLeft - this.diffRight - this.left;

    if (this.minWidth > this.width) {
      this.width = this.minWidth;
    }
    this.right = this.left + this.width;
    if (this.gridster.options.enableBoundaryControl) {
      const margin = this.outerMarginRight ?? this.margin;
      const box = this.gridster.el.getBoundingClientRect();
      this.right = Math.min(this.right, box.right - box.left - 2 * margin);
      this.width = this.right - this.left;
    }
    const marginRight = this.gridster.options.pushItems ? 0 : this.margin;
    return this.gridster.pixelsToPositionX(this.right + marginRight, Math.ceil);
  };

  private handleEast = (e: MouseEvent): void => {
    const newPosition = this.getNewEastPosition(e);
    if (
      this.gridsterItem.$item.x + this.gridsterItem.$item.cols !==
      newPosition
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.cols = newPosition - this.gridsterItem.$item.x;
      if (!this.check(this.pushResize.fromWest)) {
        return;
      }
    }
    this.setItemWidth(this.width);
  };

  private handleNorthWest = (e: MouseEvent): void => {
    const newNorth = this.getNewNorthPosition(e);
    const newWest = this.getNewWestPosition(e);
    if (
      this.gridsterItem.$item.y !== newNorth ||
      this.gridsterItem.$item.x !== newWest
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows += this.gridsterItem.$item.y - newNorth;
      this.gridsterItem.$item.y = newNorth;
      this.gridsterItem.$item.cols += this.gridsterItem.$item.x - newWest;
      this.gridsterItem.$item.x = newWest;
      if (!this.check(this.pushResize.fromSouth)) {
        return;
      }
    }
    this.setItemTop(this.top);
    this.setItemHeight(this.height);
    this.setItemLeft(this.left);
    this.setItemWidth(this.width);
  };

  private handleNorthEast = (e: MouseEvent): void => {
    const newNorth = this.getNewNorthPosition(e);
    const newEast = this.getNewEastPosition(e);
    if (
      this.gridsterItem.$item.y !== newNorth ||
      this.gridsterItem.$item.x + this.gridsterItem.$item.cols !== newEast
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows += this.gridsterItem.$item.y - newNorth;
      this.gridsterItem.$item.y = newNorth;
      this.gridsterItem.$item.cols = newEast - this.gridsterItem.$item.x;
      if (!this.check(this.pushResize.fromSouth)) {
        return;
      }
    }
    this.setItemTop(this.top);
    this.setItemHeight(this.height);
    this.setItemWidth(this.width);
  };

  private handleSouthWest = (e: MouseEvent): void => {
    const newSouth = this.getNewSouthPosition(e);
    const newWest = this.getNewWestPosition(e);
    if (
      this.gridsterItem.$item.y + this.gridsterItem.$item.rows !== newSouth ||
      this.gridsterItem.$item.x !== newWest
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows = newSouth - this.gridsterItem.$item.y;
      this.gridsterItem.$item.cols += this.gridsterItem.$item.x - newWest;
      this.gridsterItem.$item.x = newWest;
      if (!this.check(this.pushResize.fromNorth)) {
        return;
      }
    }
    this.setItemLeft(this.left);
    this.setItemHeight(this.height);
    this.setItemWidth(this.width);
  };

  private handleSouthEast = (e: MouseEvent): void => {
    const newSouth = this.getNewSouthPosition(e);
    const newEast = this.getNewEastPosition(e);
    if (
      this.gridsterItem.$item.y + this.gridsterItem.$item.rows !== newSouth ||
      this.gridsterItem.$item.x + this.gridsterItem.$item.cols !== newEast
    ) {
      this.makeItemBackup();
      this.gridsterItem.$item.rows = newSouth - this.gridsterItem.$item.y;
      this.gridsterItem.$item.cols = newEast - this.gridsterItem.$item.x;
      if (!this.check(this.pushResize.fromNorth)) {
        return;
      }
    }
    this.setItemHeight(this.height);
    this.setItemWidth(this.width);
  };

  private makeItemBackup() {
    this.itemBackup.x = this.gridsterItem.$item.x;
    this.itemBackup.y = this.gridsterItem.$item.y;
    this.itemBackup.cols = this.gridsterItem.$item.cols;
    this.itemBackup.rows = this.gridsterItem.$item.rows;
  }

  private resetItem(soft = false) {
    if (this.gridsterItem.$item.x !== this.itemBackup.x) {
      this.gridsterItem.$item.x = this.itemBackup.x;
      if (!soft) {
        this.left = this.gridster.positionXToPixels(this.gridsterItem.$item.y);
        this.setItemLeft(this.left);
      }
    }
    if (this.gridsterItem.$item.y !== this.itemBackup.y) {
      this.gridsterItem.$item.y = this.itemBackup.y;
      if (!soft) {
        this.top = this.gridster.positionYToPixels(this.gridsterItem.$item.y);
        this.setItemTop(this.top);
      }
    }
    if (this.gridsterItem.$item.cols !== this.itemBackup.cols) {
      this.gridsterItem.$item.cols = this.itemBackup.cols;
      if (!soft) {
        this.setItemWidth(
          this.gridster.positionXToPixels(this.gridsterItem.$item.cols) -
            this.margin
        );
      }
    }
    if (this.gridsterItem.$item.rows !== this.itemBackup.rows) {
      this.gridsterItem.$item.rows = this.itemBackup.rows;
      if (!soft) {
        this.setItemHeight(
          this.gridster.positionYToPixels(this.gridsterItem.$item.rows) -
            this.margin
        );
      }
    }
  }

  toggle(): void {
    this.resizeEnabled = this.gridsterItem.canBeResized();
    this.resizableHandles = this.gridsterItem.getResizableHandles();
  }

  dragStartDelay(e: MouseEvent | TouchEvent): void {
    GridsterUtils.checkTouchEvent(e);

    if (!this.gridster.$options.resizable.delayStart) {
      this.dragStart(e as MouseEvent);
      return;
    }

    const timeout = setTimeout(() => {
      this.dragStart(e as MouseEvent);
      cancelDrag();
    }, this.gridster.$options.resizable.delayStart);

    const {
      cancelMouse,
      cancelMouseLeave,
      cancelOnBlur,
      cancelTouchMove,
      cancelTouchEnd,
      cancelTouchCancel
    } = this.zone.runOutsideAngular(() => {
      // Note: all of these events are being added within the `<root>` zone since they all
      // don't do any view updates and don't require Angular running change detection.
      // All event listeners call `cancelDrag` once the event is dispatched, the `cancelDrag`
      // is responsible only for removing event listeners.

      const cancelMouse = this.gridsterItem.renderer.listen(
        'document',
        'mouseup',
        cancelDrag
      );
      const cancelMouseLeave = this.gridsterItem.renderer.listen(
        'document',
        'mouseleave',
        cancelDrag
      );
      const cancelOnBlur = this.gridsterItem.renderer.listen(
        'window',
        'blur',
        cancelDrag
      );
      const cancelTouchMove = this.gridsterItem.renderer.listen(
        'document',
        'touchmove',
        cancelMove
      );
      const cancelTouchEnd = this.gridsterItem.renderer.listen(
        'document',
        'touchend',
        cancelDrag
      );
      const cancelTouchCancel = this.gridsterItem.renderer.listen(
        'document',
        'touchcancel',
        cancelDrag
      );
      return {
        cancelMouse,
        cancelMouseLeave,
        cancelOnBlur,
        cancelTouchMove,
        cancelTouchEnd,
        cancelTouchCancel
      };
    });

    function cancelMove(eventMove: MouseEvent): void {
      GridsterUtils.checkTouchEvent(eventMove);
      if (
        Math.abs(eventMove.clientX - (e as MouseEvent).clientX) > 9 ||
        Math.abs(eventMove.clientY - (e as MouseEvent).clientY) > 9
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

  setItemTop(top: number): void {
    this.gridster.gridRenderer.setCellPosition(
      this.gridsterItem.renderer,
      this.gridsterItem.el,
      this.left,
      top
    );
  }

  setItemLeft(left: number): void {
    this.gridster.gridRenderer.setCellPosition(
      this.gridsterItem.renderer,
      this.gridsterItem.el,
      left,
      this.top
    );
  }

  setItemHeight(height: number): void {
    this.gridsterItem.renderer.setStyle(
      this.gridsterItem.el,
      'height',
      height + 'px'
    );
  }

  setItemWidth(width: number): void {
    this.gridsterItem.renderer.setStyle(
      this.gridsterItem.el,
      'width',
      width + 'px'
    );
  }

  /**
   * Enforces the aspect ratio by recalculating grid positions based on current pixel dimensions
   */
  private enforceAspectRatio(): void {
    const aspectRatio =
      this.gridsterItem.$item.itemAspectRatio ||
      this.gridster.$options.itemAspectRatio;
    if (!aspectRatio) {
      return;
    }

    // Calculate target ratio considering column/row dimensions
    const targetRatio =
      aspectRatio * (this.gridster.curColWidth / this.gridster.curRowHeight);

    // Get min/max dimensions
    const minCols =
      this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols;
    const minRows =
      this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows;
    const minWidth = this.gridster.positionXToPixels(minCols) - this.margin;
    const minHeight = this.gridster.positionYToPixels(minRows) - this.margin;

    const maxCols =
      this.gridsterItem.$item.maxItemCols ||
      this.gridster.$options.maxItemCols ||
      0;
    const maxRows =
      this.gridsterItem.$item.maxItemRows ||
      this.gridster.$options.maxItemRows ||
      0;
    const maxWidth = maxCols
      ? this.gridster.positionXToPixels(maxCols) - this.margin
      : Number.MAX_VALUE;
    const maxHeight = maxRows
      ? this.gridster.positionYToPixels(maxRows) - this.margin
      : Number.MAX_VALUE;

    let newWidth = this.width;
    let newHeight = this.height;

    // For north/south resize, prioritize height and calculate width
    if (this.resizeEventScrollType.north || this.resizeEventScrollType.south) {
      newWidth = this.height * targetRatio;

      // Check width constraints
      if (newWidth < minWidth) {
        newWidth = minWidth;
        newHeight = minWidth / targetRatio;
      } else if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / targetRatio;
      }
    }
    // For east/west resize, prioritize width and calculate height
    else if (
      this.resizeEventScrollType.east ||
      this.resizeEventScrollType.west
    ) {
      newHeight = this.width / targetRatio;

      // Check height constraints
      if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = minHeight * targetRatio;
      } else if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * targetRatio;
      }
    }

    // Ensure we don't exceed grid boundaries
    if (this.gridster.options.enableBoundaryControl) {
      const box = this.gridster.el.getBoundingClientRect();
      const margin = Math.max(
        this.outerMarginTop || this.margin,
        this.outerMarginRight || this.margin,
        this.outerMarginBottom || this.margin,
        this.outerMarginLeft || this.margin
      );

      const maxRight = box.width - 2 * margin;
      const maxBottom = box.height - 2 * margin;

      if (this.resizeEventScrollType.west) {
        if (this.right - newWidth < 0) {
          newWidth = this.right;
          newHeight = newWidth / targetRatio;
        }
      } else if (this.resizeEventScrollType.east) {
        if (this.left + newWidth > maxRight) {
          newWidth = maxRight - this.left;
          newHeight = newWidth / targetRatio;
        }
      }

      if (this.resizeEventScrollType.north) {
        if (this.bottom - newHeight < 0) {
          newHeight = this.bottom;
          newWidth = newHeight * targetRatio;
        }
      } else if (this.resizeEventScrollType.south) {
        if (this.top + newHeight > maxBottom) {
          newHeight = maxBottom - this.top;
          newWidth = newHeight * targetRatio;
        }
      }
    }

    // Update dimensions and positions
    this.width = newWidth;
    this.height = newHeight;

    if (this.resizeEventScrollType.west) {
      this.left = this.right - this.width;
    }
    if (this.resizeEventScrollType.north) {
      this.top = this.bottom - this.height;
    }

    // Update grid positions
    const marginLeft = this.gridster.options.pushItems ? 0 : this.margin;
    const marginTop = this.gridster.options.pushItems ? 0 : this.margin;
    const marginRight = this.gridster.options.pushItems ? this.margin : 0;
    const marginBottom = this.gridster.options.pushItems ? this.margin : 0;

    this.gridsterItem.$item.x = this.gridster.pixelsToPositionX(
      this.left + marginLeft,
      Math.floor
    );
    this.gridsterItem.$item.y = this.gridster.pixelsToPositionY(
      this.top + marginTop,
      Math.floor
    );
    this.gridsterItem.$item.cols = this.gridster.pixelsToPositionX(
      this.width + marginRight,
      Math.ceil
    );
    this.gridsterItem.$item.rows = this.gridster.pixelsToPositionY(
      this.height + marginBottom,
      Math.ceil
    );

    // Update visual dimensions
    this.setItemTop(this.top);
    this.setItemLeft(this.left);
    this.setItemWidth(this.width);
    this.setItemHeight(this.height);
  }
}
