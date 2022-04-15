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
  itemBackup: number[];
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
  originalClientX: number;
  originalClientY: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  newPosition: number;

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
    this.itemBackup = [0, 0, 0, 0];
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
    if (e.which && e.which !== 1) {
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
  }

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
  }

  private handleNorth = (e: MouseEvent): void => {
    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.height = this.bottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
      this.top = this.bottom - this.minHeight;
    }
    this.newPosition = this.gridster.pixelsToPositionY(
      this.top + this.margin,
      Math.floor
    );
    if (this.gridsterItem.$item.y !== this.newPosition) {
      this.itemBackup[1] = this.gridsterItem.$item.y;
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows +=
        this.gridsterItem.$item.y - this.newPosition;
      this.gridsterItem.$item.y = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromSouth);
      this.push.pushItems(
        this.push.fromSouth,
        this.gridster.$options.disablePushOnResize
      );
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.y = this.itemBackup[1];
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.setItemTop(
          this.gridster.positionYToPixels(this.gridsterItem.$item.y)
        );
        this.setItemHeight(
          this.gridster.positionYToPixels(this.gridsterItem.$item.rows) -
            this.margin
        );
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemTop(this.top);
    this.setItemHeight(this.height);
  };

  private handleWest = (e: MouseEvent): void => {
    const clientX =
      this.gridster.$options.dirType === DirTypes.RTL
        ? this.originalClientX + (this.originalClientX - e.clientX)
        : e.clientX;
    this.left = clientX + this.offsetLeft - this.diffLeft;

    this.width = this.right - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
      this.left = this.right - this.minWidth;
    }
    this.newPosition = this.gridster.pixelsToPositionX(
      this.left + this.margin,
      Math.floor
    );
    if (this.gridsterItem.$item.x !== this.newPosition) {
      this.itemBackup[0] = this.gridsterItem.$item.x;
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols +=
        this.gridsterItem.$item.x - this.newPosition;
      this.gridsterItem.$item.x = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromEast);
      this.push.pushItems(
        this.push.fromEast,
        this.gridster.$options.disablePushOnResize
      );
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.x = this.itemBackup[0];
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.setItemLeft(
          this.gridster.positionXToPixels(this.gridsterItem.$item.x)
        );
        this.setItemWidth(
          this.gridster.positionXToPixels(this.gridsterItem.$item.cols) -
            this.margin
        );
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemLeft(this.left);
    this.setItemWidth(this.width);
  };

  private handleSouth = (e: MouseEvent): void => {
    this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
    }
    this.bottom = this.top + this.height;
    this.newPosition = this.gridster.pixelsToPositionY(this.bottom, Math.ceil);
    if (
      this.gridsterItem.$item.y + this.gridsterItem.$item.rows !==
      this.newPosition
    ) {
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows =
        this.newPosition - this.gridsterItem.$item.y;
      this.pushResize.pushItems(this.pushResize.fromNorth);
      this.push.pushItems(
        this.push.fromNorth,
        this.gridster.$options.disablePushOnResize
      );
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.setItemHeight(
          this.gridster.positionYToPixels(this.gridsterItem.$item.rows) -
            this.margin
        );
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemHeight(this.height);
  };

  private handleEast = (e: MouseEvent): void => {
    const clientX =
      this.gridster.$options.dirType === DirTypes.RTL
        ? this.originalClientX + (this.originalClientX - e.clientX)
        : e.clientX;
    this.width = clientX + this.offsetLeft - this.diffRight - this.left;

    if (this.minWidth > this.width) {
      this.width = this.minWidth;
    }
    this.right = this.left + this.width;
    this.newPosition = this.gridster.pixelsToPositionX(this.right, Math.ceil);
    if (
      this.gridsterItem.$item.x + this.gridsterItem.$item.cols !==
      this.newPosition
    ) {
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols =
        this.newPosition - this.gridsterItem.$item.x;
      this.pushResize.pushItems(this.pushResize.fromWest);
      this.push.pushItems(
        this.push.fromWest,
        this.gridster.$options.disablePushOnResize
      );
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.setItemWidth(
          this.gridster.positionXToPixels(this.gridsterItem.$item.cols) -
            this.margin
        );
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.setItemWidth(this.width);
  };

  private handleNorthWest = (e: MouseEvent): void => {
    this.handleNorth(e);
    this.handleWest(e);
  };

  private handleNorthEast = (e: MouseEvent): void => {
    this.handleNorth(e);
    this.handleEast(e);
  };

  private handleSouthWest = (e: MouseEvent): void => {
    this.handleSouth(e);
    this.handleWest(e);
  };

  private handleSouthEast = (e: MouseEvent): void => {
    this.handleSouth(e);
    this.handleEast(e);
  };

  toggle(): void {
    this.resizeEnabled = this.gridsterItem.canBeResized();
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
}
