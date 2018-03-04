import {Injectable, NgZone} from '@angular/core';

import {GridsterPush} from './gridsterPush.service';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterPushResize} from './gridsterPushResize.service';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

@Injectable()
export class GridsterResizable {
  gridsterItem: GridsterItemComponentInterface;
  gridster: GridsterComponentInterface;
  lastMouse: {
    clientX: number,
    clientY: number
  };
  itemBackup: Array<number>;
  directionFunction: Function;
  dragFunction: (event: any) => void;
  dragStopFunction: (event: any) => void;
  resizeEnabled: boolean;
  mousemove: Function;
  mouseup: Function;
  cancelOnBlur: Function;
  touchmove: Function;
  touchend: Function;
  touchcancel: Function;
  mousedown: Function;
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
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  newPosition: number;

  constructor(gridsterItem: GridsterItemComponentInterface, gridster: GridsterComponentInterface, private zone: NgZone) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.lastMouse = {
      clientX: 0,
      clientY: 0
    };
    this.itemBackup = [0, 0, 0, 0];
  }

  destroy(): void {
    delete this.gridster.movingItem;
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle();
    }
    delete this.gridsterItem;
    delete this.gridster;
  }

  dragStart(e: any): void {
    switch (e.which) {
      case 1:
        // left mouse button
        break;
      case 2:
      case 3:
        // right or middle mouse button
        return;
    }
    if (this.gridster.options.resizable && this.gridster.options.resizable.start) {
      this.gridster.options.resizable.start(this.gridsterItem.item, this.gridsterItem, e);
    }
    e.stopPropagation();
    e.preventDefault();
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);
    this.zone.runOutsideAngular(() => {
      this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
      this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
      this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
      this.touchmove = this.gridster.renderer.listen(this.gridster.el, 'touchmove', this.dragFunction);
      this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
      this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
    });

    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.left = this.gridsterItem.left;
    this.top = this.gridsterItem.top;
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
    this.minHeight = this.gridster.positionYToPixels(this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows)
      - this.margin;
    this.minWidth = this.gridster.positionXToPixels(this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols)
      - this.margin;
    this.gridster.movingItem = this.gridsterItem.$item;
    this.gridster.previewStyle();
    this.push = new GridsterPush(this.gridsterItem);
    this.pushResize = new GridsterPushResize(this.gridsterItem);
    this.gridster.dragInProgress = true;
    this.gridster.updateGrid();

    if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-n') > -1) {
      this.directionFunction = this.handleN;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-w') > -1) {
      this.directionFunction = this.handleW;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-s') > -1) {
      this.directionFunction = this.handleS;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-e') > -1) {
      this.directionFunction = this.handleE;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-nw') > -1) {
      this.directionFunction = this.handleNW;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-ne') > -1) {
      this.directionFunction = this.handleNE;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-sw') > -1) {
      this.directionFunction = this.handleSW;
    } else if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('handle-se') > -1) {
      this.directionFunction = this.handleSE;
    }
  }

  dragMove(e: any): void {
    e.stopPropagation();
    e.preventDefault();
    GridsterUtils.checkTouchEvent(e);
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.directionFunction(e);

    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.zone.run(() => {
      this.gridster.updateGrid();
    });
  }

  dragStop(e: any): void {
    e.stopPropagation();
    e.preventDefault();
    this.mousemove();
    this.mouseup();
    this.cancelOnBlur();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', null);
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', null);
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', null);
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', null);
    this.gridster.dragInProgress = false;
    this.gridster.updateGrid();
    if (this.gridster.options.resizable && this.gridster.options.resizable.stop) {
      Promise.resolve(this.gridster.options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeResize.bind(this), this.cancelResize.bind(this));
    } else {
      this.makeResize();
    }
    setTimeout(() => {
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle();
      }
    });
  }

  cancelResize(): void {
    this.gridsterItem.$item.cols = this.gridsterItem.item.cols || 1;
    this.gridsterItem.$item.rows = this.gridsterItem.item.rows || 1;
    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
    this.gridsterItem.setSize();
    this.push.restoreItems();
    this.pushResize.restoreItems();
    this.push.destroy();
    delete this.push;
    this.pushResize.destroy();
    delete this.pushResize;
  }

  makeResize(): void {
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    this.gridsterItem.setSize();
    this.push.setPushedItems();
    this.pushResize.setPushedItems();
    this.push.destroy();
    delete this.push;
    this.pushResize.destroy();
    delete this.pushResize;
  }

  handleN(e: any): void {
    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.height = this.bottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
      this.top = this.bottom - this.minHeight;
    }
    this.newPosition = this.gridster.pixelsToPositionY(this.top, Math.floor);
    if (this.gridsterItem.$item.y !== this.newPosition) {
      this.itemBackup[1] = this.gridsterItem.$item.y;
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows += this.gridsterItem.$item.y - this.newPosition;
      this.gridsterItem.$item.y = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromSouth);
      this.push.pushItems(this.push.fromSouth, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.y = this.itemBackup[1];
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top',
          (this.gridster.positionYToPixels(this.gridsterItem.$item.y) - this.gridsterItem.top) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height',
          this.gridster.positionYToPixels(this.gridsterItem.$item.rows) - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', (this.top - this.gridsterItem.top) + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
  }

  handleW(e: any): void {
    this.left = e.clientX + this.offsetLeft - this.diffLeft;
    this.width = this.right - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
      this.left = this.right - this.minWidth;
    }
    this.newPosition = this.gridster.pixelsToPositionX(this.left, Math.floor);
    if (this.gridsterItem.$item.x !== this.newPosition) {
      this.itemBackup[0] = this.gridsterItem.$item.x;
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols += this.gridsterItem.$item.x - this.newPosition;
      this.gridsterItem.$item.x = this.newPosition;
      this.pushResize.pushItems(this.pushResize.fromEast);
      this.push.pushItems(this.push.fromEast, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.x = this.itemBackup[0];
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left',
          (this.gridster.positionXToPixels(this.gridsterItem.$item.x) - this.gridsterItem.left) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width',
          this.gridster.positionXToPixels(this.gridsterItem.$item.cols) - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', (this.left - this.gridsterItem.left) + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
  }

  handleS(e: any): void {
    this.height = e.clientY + this.offsetTop - this.diffBottom - this.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
    }
    this.bottom = this.top + this.height;
    this.newPosition = this.gridster.pixelsToPositionY(this.bottom - this.margin, Math.ceil);
    if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.newPosition) {
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows = this.newPosition - this.gridsterItem.$item.y;
      this.pushResize.pushItems(this.pushResize.fromNorth);
      this.push.pushItems(this.push.fromNorth, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
  }

  handleE(e: any): void {
    this.width = e.clientX + this.offsetLeft - this.diffRight - this.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
    }
    this.right = this.left + this.width;
    this.newPosition = this.gridster.pixelsToPositionX(this.right - this.margin, Math.ceil);
    if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.newPosition) {
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols = this.newPosition - this.gridsterItem.$item.x;
      this.pushResize.pushItems(this.pushResize.fromWest);
      this.push.pushItems(this.push.fromWest, this.gridster.$options.disablePushOnResize);
      if (this.gridster.checkCollision(this.gridsterItem.$item)) {
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
      this.pushResize.checkPushBack();
      this.push.checkPushBack();
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
  }

  handleNW(e: any): void {
    this.handleN(e);
    this.handleW(e);
  }

  handleNE(e: any): void {
    this.handleN(e);
    this.handleE(e);
  }

  handleSW(e: any): void {
    this.handleS(e);
    this.handleW(e);
  }

  handleSE(e: any): void {
    this.handleS(e);
    this.handleE(e);
  }

  toggle(): void {
    this.resizeEnabled = this.gridsterItem.canBeResized();
  }

  dragStartDelay(e: any): void {
    GridsterUtils.checkTouchEvent(e);
    if (!this.gridster.$options.resizable.delayStart) {
      this.dragStart(e);
      return;
    }
    const timeout = setTimeout(() => {
      this.dragStart(e);
      cancelDrag();
    }, this.gridster.$options.resizable.delayStart);
    const cancelMouse = this.gridsterItem.renderer.listen('document', 'mouseup', cancelDrag);
    const cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);
    const cancelTouchMove = this.gridsterItem.renderer.listen('document', 'touchmove', cancelMove);
    const cancelTouchEnd = this.gridsterItem.renderer.listen('document', 'touchend', cancelDrag);
    const cancelTouchCancel = this.gridsterItem.renderer.listen('document', 'touchcancel', cancelDrag);

    function cancelMove(eventMove: any) {
      GridsterUtils.checkTouchEvent(eventMove);
      if (Math.abs(eventMove.clientX - e.clientX) > 9 || Math.abs(eventMove.clientY - e.clientY) > 9) {
        cancelDrag();
      }
    }

    function cancelDrag() {
      clearTimeout(timeout);
      cancelOnBlur();
      cancelMouse();
      cancelTouchMove();
      cancelTouchEnd();
      cancelTouchCancel();
    }
  }
}
