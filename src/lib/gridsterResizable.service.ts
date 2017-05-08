import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {scroll, cancelScroll} from './gridsterScroll.service';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';
import {GridsterPush} from './gridsterPush.service';
import {GridsterComponent} from './gridster.component';

@Injectable()
export class GridsterResizable {
  gridsterItem: GridsterItemComponent;
  gridster: GridsterComponent;
  lastMouse: {
    pageX: number,
    pageY: number
  };
  itemBackup: Array<number>;
  enabled: boolean;
  resizeEventScrollType: GridsterResizeEventType;
  directionFunction: Function;
  dragFunction: (event: any) => void;
  dragStopFunction: (event: any) => void;
  resizeEnabled: boolean;
  mousemove: Function;
  mouseup: Function;
  touchmove: Function;
  touchend: Function;
  touchcancel: Function;
  mousedown: Function;
  touchstart: Function;
  push: GridsterPush;
  minHeight: number;
  minWidth: number;
  offsetTop: number;
  offsetLeft: number;
  margin: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  newPosition: number;

  static touchEvent(e) {
    e.pageX = e.touches[0].pageX;
    e.pageY = e.touches[0].pageY;
  }

  constructor(gridsterItem: GridsterItemComponent, gridster: GridsterComponent) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.lastMouse = {
      pageX: 0,
      pageY: 0
    };
    this.itemBackup = [0, 0, 0, 0];
    this.resizeEventScrollType = {w: false, e: false, n: false, s: false};
  }

  dragStart(e): void {
    switch (e.which) {
      case 1:
        // left mouse button
        break;
      case 2:
      case 3:
        // right or middle mouse button
        return;
    }
    e.stopPropagation();
    e.preventDefault();
    if (e.pageX === undefined && e.touches) {
      GridsterResizable.touchEvent(e);
    }
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);
    this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
    this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
    this.touchmove = this.gridsterItem.renderer.listen('document', 'touchmove', this.dragFunction);
    this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
    this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-resizing');
    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
    this.left = this.gridsterItem.left;
    this.top = this.gridsterItem.top;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    this.bottom = this.gridsterItem.top + this.gridsterItem.height;
    this.right = this.gridsterItem.left + this.gridsterItem.width;
    this.margin = this.gridster.$options.margin;
    this.minHeight = this.gridster.positionYToPixels(this.gridsterItem.$item.minItemRows || this.gridster.$options.minItemRows)
      - this.gridster.$options.margin;
    this.minWidth = this.gridster.positionXToPixels(this.gridsterItem.$item.minItemCols || this.gridster.$options.minItemCols)
      - this.gridster.$options.margin;
    this.gridster.movingItem = this.gridsterItem;
    this.gridster.previewStyle();
    this.push = new GridsterPush(this.gridsterItem, this.gridster);
    this.gridster.gridLines.updateGrid(true);

    if (e.currentTarget.classList.contains('handle-n')) {
      this.resizeEventScrollType.n = true;
      this.directionFunction = this.handleN.bind(this);
    } else if (e.currentTarget.classList.contains('handle-w')) {
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleW.bind(this);
    } else if (e.currentTarget.classList.contains('handle-s')) {
      this.resizeEventScrollType.s = true;
      this.directionFunction = this.handleS.bind(this);
    } else if (e.currentTarget.classList.contains('handle-e')) {
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleE.bind(this);
    } else if (e.currentTarget.classList.contains('handle-nw')) {
      this.resizeEventScrollType.n = true;
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleNW.bind(this);
    } else if (e.currentTarget.classList.contains('handle-ne')) {
      this.resizeEventScrollType.n = true;
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleNE.bind(this);
    } else if (e.currentTarget.classList.contains('handle-sw')) {
      this.resizeEventScrollType.s = true;
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleSW.bind(this);
    } else if (e.currentTarget.classList.contains('handle-se')) {
      this.resizeEventScrollType.s = true;
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleSE.bind(this);
    }
  }

  dragMove(e): void {
    e.stopPropagation();
    e.preventDefault();
    if (e.pageX === undefined && e.touches) {
      GridsterResizable.touchEvent(e);
    }
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    scroll(this.gridsterItem, e, this.lastMouse, this.directionFunction, true, this.resizeEventScrollType);
    this.directionFunction(e);

    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
  }

  dragStop(e): void {
    e.stopPropagation();
    e.preventDefault();
    cancelScroll();
    this.mousemove();
    this.mouseup();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-resizing');
    this.gridster.movingItem = null;
    this.gridster.previewStyle();
    this.gridster.gridLines.updateGrid(false);
    if (this.gridster.$options.resizable.stop) {
      Promise.resolve(this.gridster.$options.resizable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeResize.bind(this), this.cancelResize.bind(this));
    } else {
      this.makeResize();
    }
  }

  cancelResize(): void {
    this.gridsterItem.$item.cols = this.gridsterItem.item.cols;
    this.gridsterItem.$item.rows = this.gridsterItem.item.rows;
    this.gridsterItem.$item.x = this.gridsterItem.item.x;
    this.gridsterItem.$item.y = this.gridsterItem.item.y;
    this.gridsterItem.setSize(true);
    this.push.restoreItems();
    this.push = undefined;
  }

  makeResize(): void {
    this.gridsterItem.setSize(true);
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    this.push.setPushedItems();
    this.push = undefined;
  }

  handleN(e): void {
    this.top = e.pageY + this.offsetTop - this.margin;
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
      this.push.pushItems();
      if (this.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.y = this.itemBackup[1];
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.gridster.positionYToPixels(this.gridsterItem.$item.y) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.top + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
  }

  handleW(e): void {
    this.left = e.pageX + this.offsetLeft - this.margin;
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
      this.push.pushItems();
      if (this.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.x = this.itemBackup[0];
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left',
          this.gridster.positionXToPixels(this.gridsterItem.$item.x) + 'px');
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.left + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
  }

  handleS(e): void {
    this.height = e.pageY + this.offsetTop - this.margin - this.gridsterItem.top;
    if (this.minHeight > this.height) {
      this.height = this.minHeight;
    }
    this.bottom = this.top + this.height;
    this.newPosition = this.gridster.pixelsToPositionY(this.bottom, Math.ceil);
    if ((this.gridsterItem.$item.y + this.gridsterItem.$item.rows) !== this.newPosition) {
      this.itemBackup[3] = this.gridsterItem.$item.rows;
      this.gridsterItem.$item.rows = this.newPosition - this.gridsterItem.$item.y;
      this.push.pushItems();
      if (this.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.gridster.positionYToPixels(this.gridsterItem.$item.rows)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'height', this.height + 'px');
  }

  handleE(e): void {
    this.width = e.pageX + this.offsetLeft - this.margin - this.gridsterItem.left;
    if (this.minWidth > this.width) {
      this.width = this.minWidth;
    }
    this.right = this.left + this.width;
    this.newPosition = this.gridster.pixelsToPositionX(this.right, Math.ceil);
    if ((this.gridsterItem.$item.x + this.gridsterItem.$item.cols) !== this.newPosition) {
      this.itemBackup[2] = this.gridsterItem.$item.cols;
      this.gridsterItem.$item.cols = this.newPosition - this.gridsterItem.$item.x;
      this.push.pushItems();
      if (this.gridsterItem.$item.cols < 1 || this.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.gridster.positionXToPixels(this.gridsterItem.$item.cols)
          - this.gridster.$options.margin + 'px');
        return;
      } else {
        this.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'width', this.width + 'px');
  }

  handleNW(e): void {
    this.handleN(e);
    this.handleW(e);
  }

  handleNE(e): void {
    this.handleN(e);
    this.handleE(e);
  }

  handleSW(e): void {
    this.handleS(e);
    this.handleW(e);
  }

  handleSE(e): void {
    this.handleS(e);
    this.handleE(e);
  }

  toggle(enabled): void {
    this.resizeEnabled = !this.gridster.mobile &&
      (this.gridsterItem.$item.resizeEnabled === undefined ? enabled : this.gridsterItem.$item.resizeEnabled);
  }
}
