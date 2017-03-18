import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import {scroll, cancelScroll} from './gridsterScroll.service';
import * as _ from 'lodash';
import {GridsterItem} from './gridsterItem.interface';
import {GridsterResizeEventType} from './gridsterResizeEventType.interface';

@Injectable()
export class GridsterResizable {
  element: HTMLElement;
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
  dragFunction: EventListenerObject;
  dragStopFunction: EventListenerObject;

  static touchEvent(e) {
    e.pageX = e.touches[0].pageX;
    e.pageY = e.touches[0].pageY;
  }

  constructor(element: HTMLElement, gridsterItem: GridsterItemComponent) {
    this.element = element;
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
    e.preventDefault();
    e.stopPropagation();
    if (e.pageX === undefined && e.touches) {
      GridsterResizable.touchEvent(e);
    }
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);
    document.addEventListener('mousemove', this.dragFunction);
    document.addEventListener('mouseup', this.dragStopFunction);
    document.addEventListener('touchmove', this.dragFunction);
    document.addEventListener('touchend', this.dragStopFunction);
    document.addEventListener('touchcancel', this.dragStopFunction);
    this.element.classList.add('gridster-item-resizing');
    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
    this.elemPosition[0] = parseInt(this.element.style.left, 10);
    this.elemPosition[1] = parseInt(this.element.style.top, 10);
    this.elemPosition[2] = this.element.offsetWidth;
    this.elemPosition[3] = this.element.offsetHeight;
    this.itemCopy = _.clone(this.gridsterItem.state.item);
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
    e.preventDefault();
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
    e.preventDefault();
    e.stopPropagation();
    cancelScroll();
    document.removeEventListener('mousemove', this.dragFunction);
    document.removeEventListener('mouseup', this.dragStopFunction);
    document.removeEventListener('touchmove', this.dragFunction);
    document.removeEventListener('touchend', this.dragStopFunction);
    document.removeEventListener('touchcancel', this.dragStopFunction);
    this.element.classList.remove('gridster-item-resizing');
    this.gridsterItem.gridster.movingItem = null;
    this.gridsterItem.gridster.previewStyle();
    this.gridsterItem.state.item.setSize(true);
    this.gridsterItem.state.item.checkItemChanges(this.gridsterItem.state.item, this.itemCopy);
    if (this.gridsterItem.gridster.state.options.resizable.stop) {
      this.gridsterItem.gridster.state.options.resizable.stop(this.gridsterItem.state.item, this.gridsterItem);
    }
  }

  handleN(e) {
    this.elemPosition[1] += e.pageY - this.lastMouse.pageY;
    this.elemPosition[3] += this.lastMouse.pageY - e.pageY;
    this.element.style.top = this.elemPosition[1] + 'px';
    this.element.style.height = this.elemPosition[3] + 'px';
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
    if (this.gridsterItem.state.item.y !== this.position[1]) {
      this.itemBackup[1] = this.gridsterItem.state.item.y;
      this.itemBackup[3] = this.gridsterItem.state.item.rows;
      this.gridsterItem.state.item.rows += this.gridsterItem.state.item.y - this.position[1];
      this.gridsterItem.state.item.y = this.position[1];
      if (this.gridsterItem.state.item.y < 0 || this.gridsterItem.state.item.rows < 1 ||
        this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.y = this.itemBackup[1];
        this.gridsterItem.state.item.rows = this.itemBackup[3];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
  }

  handleW(e) {
    this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
    this.elemPosition[2] += this.lastMouse.pageX - e.pageX;
    this.element.style.left = this.elemPosition[0] + 'px';
    this.element.style.width = this.elemPosition[2] + 'px';
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
    if (this.gridsterItem.state.item.x !== this.position[0]) {
      this.itemBackup[0] = this.gridsterItem.state.item.x;
      this.itemBackup[2] = this.gridsterItem.state.item.cols;
      this.gridsterItem.state.item.cols += this.gridsterItem.state.item.x - this.position[0];
      this.gridsterItem.state.item.x = this.position[0];
      if (this.gridsterItem.state.item.x < 0 || this.gridsterItem.state.item.cols < 1 ||
        this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.x = this.itemBackup[0];
        this.gridsterItem.state.item.cols = this.itemBackup[2];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
  }

  handleS(e) {
    this.elemPosition[3] += e.pageY - this.lastMouse.pageY;
    this.element.style.height = this.elemPosition[3] + 'px';
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1] + this.elemPosition[3]);
    if ((this.gridsterItem.state.item.y + this.gridsterItem.state.item.rows) !== this.position[1]) {
      this.itemBackup[3] = this.gridsterItem.state.item.rows;
      this.gridsterItem.state.item.rows = this.position[1] - this.gridsterItem.state.item.y;
      if (this.gridsterItem.state.item.rows < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.rows = this.itemBackup[3];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
  }

  handleE(e) {
    this.elemPosition[2] += e.pageX - this.lastMouse.pageX;
    this.element.style.width = this.elemPosition[2] + 'px';
    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0] + this.elemPosition[2], this.elemPosition[1]);
    if ((this.gridsterItem.state.item.x + this.gridsterItem.state.item.cols) !== this.position[0]) {
      this.itemBackup[2] = this.gridsterItem.state.item.cols;
      this.gridsterItem.state.item.cols = this.position[0] - this.gridsterItem.state.item.x;
      if (this.gridsterItem.state.item.cols < 1 || this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.cols = this.itemBackup[2];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
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
}
