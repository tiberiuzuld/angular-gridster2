import {Injectable} from '@angular/core';
import {GridsterItemComponent} from './gridsterItem.component';
import * as _ from 'lodash';
import {GridsterSwap} from './gridsterSwap.service';
import {scroll, cancelScroll} from './gridsterScroll.service';
import {GridsterItem} from './gridsterItem.interface';

@Injectable()
export class GridsterDraggable {
  element: HTMLElement;
  gridsterItem: GridsterItemComponent;
  itemCopy: GridsterItem;
  lastMouse: {
    pageX: number,
    pageY: number
  };
  elemPosition: Array<number>;
  position: Array<number>;
  positionBackup: Array<number>;
  enabled: boolean;
  dragStartFunction: EventListenerObject;
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
    this.positionBackup = [0, 0];
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
      GridsterDraggable.touchEvent(e);
    }
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);

    document.addEventListener('mousemove', this.dragFunction);
    document.addEventListener('mouseup', this.dragStopFunction);
    document.addEventListener('touchmove', this.dragFunction);
    document.addEventListener('touchend', this.dragStopFunction);
    document.addEventListener('touchcancel', this.dragStopFunction);
    this.element.classList.add('gridster-item-moving');
    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
    this.elemPosition[0] = parseInt(this.element.style.left, 10);
    this.elemPosition[1] = parseInt(this.element.style.top, 10);
    this.elemPosition[2] = this.element.offsetWidth;
    this.elemPosition[3] = this.element.offsetHeight;
    this.itemCopy = _.clone(this.gridsterItem.state.item);
    this.gridsterItem.gridster.movingItem = this.gridsterItem.state.item;
    this.gridsterItem.gridster.previewStyle();
  }

  dragMove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.pageX === undefined && e.touches) {
      GridsterDraggable.touchEvent(e);
    }
    this.elemPosition[0] += e.pageX - this.lastMouse.pageX;
    this.elemPosition[1] += e.pageY - this.lastMouse.pageY;

    scroll(this.elemPosition, this.gridsterItem, e, this.lastMouse, this.calculateItemPosition.bind(this));

    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;

    this.calculateItemPosition();
  }

  dragStop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.gridsterItem.gridster.state.options.swap) {
      GridsterSwap.GridsterSwap(this.gridsterItem, this.elemPosition);
    }
    cancelScroll();
    document.removeEventListener('mousemove', this.dragFunction);
    document.removeEventListener('mouseup', this.dragStopFunction);
    document.removeEventListener('touchmove', this.dragFunction);
    document.removeEventListener('touchend', this.dragStopFunction);
    document.removeEventListener('touchcancel', this.dragStopFunction);
    this.element.classList.remove('gridster-item-moving');
    this.gridsterItem.gridster.movingItem = null;
    this.gridsterItem.setSize(true);
    this.gridsterItem.gridster.previewStyle();
    this.gridsterItem.checkItemChanges(this.gridsterItem.state.item, this.itemCopy);
    if (this.gridsterItem.gridster.state.options.draggable.stop) {
      this.gridsterItem.gridster.state.options.draggable.stop(this.gridsterItem.state.item, this.gridsterItem);
    }
  }

  calculateItemPosition() {
    this.element.style.left = this.elemPosition[0] + 'px';
    this.element.style.top = this.elemPosition[1] + 'px';

    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1]);
    if (this.position[0] !== this.gridsterItem.state.item.x || this.position[1] !== this.gridsterItem.state.item.y) {
      this.positionBackup[0] = this.gridsterItem.state.item.x;
      this.positionBackup[1] = this.gridsterItem.state.item.y;
      this.gridsterItem.state.item.x = this.position[0];
      this.gridsterItem.state.item.y = this.position[1];
      if (this.gridsterItem.gridster.checkCollision(this.gridsterItem.state.item)) {
        this.gridsterItem.state.item.x = this.positionBackup[0];
        this.gridsterItem.state.item.y = this.positionBackup[1];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
  }

  toggle(enable: boolean) {
    if (enable && !this.enabled) {
      this.enabled = !this.enabled;
      this.dragStartFunction = this.dragStart.bind(this);
      this.element.addEventListener('mousedown', this.dragStartFunction);
      this.element.addEventListener('touchstart', this.dragStartFunction);
    } else if (!enable && this.enabled) {
      this.enabled = !this.enabled;
      this.element.removeEventListener('mousedown', this.dragStartFunction);
      this.element.removeEventListener('touchstart', this.dragStartFunction);
    }
  }
}
