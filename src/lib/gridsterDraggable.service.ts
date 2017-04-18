import {Injectable} from '@angular/core';
import {GridsterSwap} from './gridsterSwap.service';
import {scroll, cancelScroll} from './gridsterScroll.service';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterItem} from './gridsterItem.interface';

@Injectable()
export class GridsterDraggable {
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
  dragStartFunction: (event: any) => void;
  dragFunction: (event: any) => void;
  dragStopFunction: (event: any) => void;
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
    this.positionBackup = [0, 0];
  }

  checkContentClass(target, current, contentClass): boolean {
    if (target === current) {
      return false;
    }
    if (target.classList && target.classList.contains(contentClass)) {
      return true;
    } else {
      return this.checkContentClass(target.parentNode, current, contentClass);
    }
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

    const contentClass = this.gridsterItem.gridster.$options.draggable.ignoreContentClass;
    if (this.checkContentClass(e.target, e.currentTarget, contentClass)) {
      return;
    }

    e.stopPropagation();
    if (e.pageX === undefined && e.touches) {
      GridsterDraggable.touchEvent(e);
    }
    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);

    this.mousemove = this.gridsterItem.renderer.listen('document', 'mousemove', this.dragFunction);
    this.mouseup = this.gridsterItem.renderer.listen('document', 'mouseup', this.dragStopFunction);
    this.touchmove = this.gridsterItem.renderer.listen('document', 'touchmove', this.dragFunction);
    this.touchend = this.gridsterItem.renderer.listen('document', 'touchend', this.dragStopFunction);
    this.touchcancel = this.gridsterItem.renderer.listen('document', 'touchcancel', this.dragStopFunction);
    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
    this.elemPosition[0] = this.gridsterItem.left;
    this.elemPosition[1] = this.gridsterItem.top;
    this.elemPosition[2] = this.gridsterItem.width;
    this.elemPosition[3] = this.gridsterItem.height;
    this.itemCopy = JSON.parse(JSON.stringify(this.gridsterItem.$item, ['rows', 'cols', 'x', 'y']));
    this.gridsterItem.gridster.movingItem = this.gridsterItem;
    this.gridsterItem.gridster.previewStyle();
  }

  dragMove(e): void {
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

  dragStop(e): void {
    e.stopPropagation();

    cancelScroll();
    this.mousemove();
    this.mouseup();
    this.touchmove();
    this.touchend();
    this.touchcancel();
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
    this.gridsterItem.gridster.movingItem = null;
    this.gridsterItem.gridster.previewStyle();
    if (this.gridsterItem.gridster.$options.draggable.stop) {
      Promise.resolve(this.gridsterItem.gridster.$options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
    } else {
      this.makeDrag();
    }
  }

  cancelDrag() {
    this.gridsterItem.$item.x = this.itemCopy.x;
    this.gridsterItem.$item.y = this.itemCopy.y;
    this.gridsterItem.setSize(true);
  }

  makeDrag() {
    if (this.gridsterItem.gridster.$options.swap) {
      GridsterSwap.GridsterSwap(this.gridsterItem, this.elemPosition);
    }
    this.gridsterItem.setSize(true);
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.itemCopy);
  }

  calculateItemPosition() {
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.elemPosition[0] + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.elemPosition[1] + 'px');

    this.position = this.gridsterItem.gridster.pixelsToPosition(this.elemPosition[0], this.elemPosition[1], Math.round);
    if (this.position[0] !== this.gridsterItem.$item.x || this.position[1] !== this.gridsterItem.$item.y) {
      this.positionBackup[0] = this.gridsterItem.$item.x;
      this.positionBackup[1] = this.gridsterItem.$item.y;
      this.gridsterItem.$item.x = this.position[0];
      this.gridsterItem.$item.y = this.position[1];
      if (this.gridsterItem.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.x = this.positionBackup[0];
        this.gridsterItem.$item.y = this.positionBackup[1];
      } else {
        this.gridsterItem.gridster.previewStyle();
      }
    }
  }

  toggle(enable: boolean) {
    const enableDrag = !this.gridsterItem.gridster.mobile &&
      (this.gridsterItem.$item.dragEnabled === undefined ? enable : this.gridsterItem.$item.dragEnabled);
    if (!this.enabled && enableDrag) {
      this.enabled = !this.enabled;
      this.dragStartFunction = this.dragStart.bind(this);
      this.mousedown = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'mousedown', this.dragStartFunction);
      this.touchstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'touchstart', this.dragStartFunction);
    } else if (this.enabled && !enableDrag) {
      this.enabled = !this.enabled;
      this.mousedown();
      this.touchstart();
    }
  }
}
