import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {scroll, cancelScroll} from './gridsterScroll.service';
import {GridsterItem} from './gridsterItem.interface';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

@Injectable()
export class GridsterResizable {
  gridsterItem: GridsterItemComponent;
  itemCopy: GridsterItem;
  lastMouse: {
    pageX: number,
    pageY: number
  };
  elemPosition: Array<number>;
  position: Array<number>;
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

  static touchEvent(e) {
    e.pageX = e.touches[0].pageX;
    e.pageY = e.touches[0].pageY;
  }

  constructor(gridsterItem: GridsterItemComponent) {
    this.gridsterItem = gridsterItem;
    this.lastMouse = {
      pageX: 0,
      pageY: 0
    };
    this.elemPosition = [0, 0, 0, 0];
    this.position = [0, 0];
    this.itemBackup = [0, 0, 0, 0];
    this.resizeEventScrollType = {w: false, e: false, n: false, s: false};
  }

  dragStart(e) {
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
    this.gridsterItem.renderer.setElementClass(this.gridsterItem.el, 'gridster-item-resizing', true);
    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
    this.elemPosition[0] = this.gridsterItem.left;
    this.elemPosition[1] = this.gridsterItem.top;
    this.elemPosition[2] = this.gridsterItem.width;
    this.elemPosition[3] = this.gridsterItem.height;
    this.itemCopy = JSON.parse(JSON.stringify(this.gridsterItem.state.item, ['rows', 'cols', 'x', 'y']));
    this.gridsterItem.gridster.movingItem = this.gridsterItem.state.item;
    this.gridsterItem.gridster.previewStyle();

    if (e.srcElement.classList.contains('handle-n')) {
      this.resizeEventScrollType.n = true;
      this.directionFunction = this.handleN.bind(this);
    } else if (e.srcElement.classList.contains('handle-w')) {
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleW.bind(this);
    } else if (e.srcElement.classList.contains('handle-s')) {
      this.resizeEventScrollType.s = true;
      this.directionFunction = this.handleS.bind(this);
    } else if (e.srcElement.classList.contains('handle-e')) {
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleE.bind(this);
    } else if (e.srcElement.classList.contains('handle-nw')) {
      this.resizeEventScrollType.n = true;
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleNW.bind(this);
    } else if (e.srcElement.classList.contains('handle-ne')) {
      this.resizeEventScrollType.n = true;
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleNE.bind(this);
    } else if (e.srcElement.classList.contains('handle-sw')) {
      this.resizeEventScrollType.s = true;
      this.resizeEventScrollType.w = true;
      this.directionFunction = this.handleSW.bind(this);
    } else if (e.srcElement.classList.contains('handle-se')) {
      this.resizeEventScrollType.s = true;
      this.resizeEventScrollType.e = true;
      this.directionFunction = this.handleSE.bind(this);
    }
  }

  dragMove(e) {
    e.stopPropagation();
    if (e.pageX === undefined && e.touches) {
      GridsterResizable.touchEvent(e);
    }

    scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.directionFunction, true,
      this.resizeEventScrollType);

    this.directionFunction(e);

    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
  }

  dragStop(e) {
    e.stopPropagation();
    cancelScroll();
    this.mousemove();
    this.mouseup();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridsterItem.renderer.setElementClass(this.gridsterItem.el, 'gridster-item-resizing', false);
    this.gridsterItem.gridster.movingItem = null;
    this.gridsterItem.gridster.previewStyle();
    if (this.gridsterItem.gridster.state.options.resizable.stop) {
      Promise.resolve(this.gridsterItem.gridster.state.options.resizable.stop(this.gridsterItem.state.item, this.gridsterItem, e))
        .then(this.makeResize.bind(this), this.cancelResize.bind(this));
    } else {
      this.makeResize();
    }
  }

  cancelResize() {
    this.gridsterItem.state.item.cols = this.itemCopy.cols;
    this.gridsterItem.state.item.rows = this.itemCopy.rows;
    this.gridsterItem.state.item.x = this.itemCopy.x;
    this.gridsterItem.state.item.y = this.itemCopy.y;
    this.gridsterItem.state.item.setSize(true);
  }

  makeResize() {
    this.gridsterItem.state.item.setSize(true);
    this.gridsterItem.state.item.checkItemChanges(this.gridsterItem.state.item, this.itemCopy);
  }

  handleN(e) {
    this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
    this.elemPosition[3] += this.lastMouse.pageY - e.pageY;
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.floor);
    if (this.gridsterItem.state.item.y !== this.position[1]) {
      this.itemBackup[1] = this.gridsterItem.state.item.y;
      this.itemBackup[3] = this.gridsterItem.state.item.rows;
      this.gridsterItem.state.item.rows += this.gridsterItem.state.item.y - this.position[1];
      this.gridsterItem.state.item.y = this.position[1];
      if (this.gridsterItem.state.item.y < 0 || this.gridsterItem.state.item.rows < 1 ||
        this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.y = this.itemBackup[1];
        this.gridsterItem.state.item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'top', this.gridsterItem.gridster.positionYToPixels(this.gridsterItem.state.item.y) + 'px');
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'height', this.gridsterItem.gridster.positionYToPixels(this.gridsterItem.state.item.rows)
          - this.gridsterItem.gridster.state.options.margin + 'px');
        return;
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'top', this.elemPosition[1] + 'px');
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'height', this.elemPosition[3] + 'px');
  }

  handleW(e) {
    this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
    this.elemPosition[2] += this.lastMouse.pageX - e.pageX;
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.floor);
    if (this.gridsterItem.state.item.x !== this.position[0]) {
      this.itemBackup[0] = this.gridsterItem.state.item.x;
      this.itemBackup[2] = this.gridsterItem.state.item.cols;
      this.gridsterItem.state.item.cols += this.gridsterItem.state.item.x - this.position[0];
      this.gridsterItem.state.item.x = this.position[0];
      if (this.gridsterItem.state.item.x < 0 || this.gridsterItem.state.item.cols < 1 ||
        this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.x = this.itemBackup[0];
        this.gridsterItem.state.item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'left', this.gridsterItem.gridster.positionXToPixels(this.gridsterItem.state.item.x) + 'px');
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'width', this.gridsterItem.gridster.positionXToPixels(this.gridsterItem.state.item.cols)
          - this.gridsterItem.gridster.state.options.margin + 'px');
        return;
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'left', this.elemPosition[0] + 'px');
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'width', this.elemPosition[2] + 'px');
  }

  handleS(e) {
    this.elemPosition[3] += e.pageY - this.lastMouse.pageY;
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0],
      this.elemPosition[1] + this.elemPosition[3], Math.ceil);
    if ((this.gridsterItem.state.item.y + this.gridsterItem.state.item.rows) !== this.position[1]) {
      this.itemBackup[3] = this.gridsterItem.state.item.rows;
      this.gridsterItem.state.item.rows = this.position[1] - this.gridsterItem.state.item.y;
      if (this.gridsterItem.state.item.rows < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.rows = this.itemBackup[3];
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'height', this.gridsterItem.gridster.positionYToPixels(this.gridsterItem.state.item.rows)
          - this.gridsterItem.gridster.state.options.margin + 'px');
        return;
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'height', this.elemPosition[3] + 'px');
  }

  handleE(e) {
    this.elemPosition[2] += e.pageX - this.lastMouse.pageX;
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0] + this.elemPosition[2],
      this.elemPosition[1], Math.ceil);
    if ((this.gridsterItem.state.item.x + this.gridsterItem.state.item.cols) !== this.position[0]) {
      this.itemBackup[2] = this.gridsterItem.state.item.cols;
      this.gridsterItem.state.item.cols = this.position[0] - this.gridsterItem.state.item.x;
      if (this.gridsterItem.state.item.cols < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.cols = this.itemBackup[2];
        this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'width', this.gridsterItem.gridster.positionXToPixels(this.gridsterItem.state.item.cols)
          - this.gridsterItem.gridster.state.options.margin + 'px');
        return;
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
    this.gridsterItem.renderer.setElementStyle(this.gridsterItem.el, 'width', this.elemPosition[2] + 'px');
  }

  handleNW(e) {
    this.handleN(e);
    this.handleW(e);
  }

  handleNE(e) {
    this.handleN(e);
    this.handleE(e);
  }

  handleSW(e) {
    this.handleS(e);
    this.handleW(e);
  }

  handleSE(e) {
    this.handleS(e);
    this.handleE(e);
  }

  toggle(enabled) {
    this.resizeEnabled = !this.gridsterItem.gridster.state.mobile &&
      (this.gridsterItem.state.item.resizeEnabled === undefined ? enabled : this.gridsterItem.state.item.resizeEnabled);
  }
}
