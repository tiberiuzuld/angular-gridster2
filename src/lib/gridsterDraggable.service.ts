import {Injectable} from '@angular/core';
import {GridsterSwap} from './gridsterSwap.service';
import {scroll, cancelScroll} from './gridsterScroll.service';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterComponent} from './gridster.component';
import {GridsterPush} from './gridsterPush.service';

@Injectable()
export class GridsterDraggable {
  gridsterItem: GridsterItemComponent;
  gridster: GridsterComponent;
  lastMouse: {
    pageX: number,
    pageY: number
  };
  offsetLeft: number;
  offsetTop: number;
  margin: number;
  diffTop: number;
  diffLeft: number;
  top: number;
  left: number;
  height: number;
  width: number;
  positionX: number;
  positionY: number;
  positionXBackup: number;
  positionYBackup: number;
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
  push: GridsterPush;
  swap: GridsterSwap;

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

    const contentClass = this.gridster.$options.draggable.ignoreContentClass;
    if (this.checkContentClass(e.target, e.currentTarget, contentClass)) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
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
    this.margin = this.gridster.$options.margin;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.left = this.gridsterItem.left;
    this.top = this.gridsterItem.top;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    this.diffLeft = e.pageX + this.offsetLeft - this.margin - this.left;
    this.diffTop = e.pageY + this.offsetTop - this.margin - this.top;
    this.gridster.movingItem = this.gridsterItem;
    this.gridster.previewStyle();
    this.push = new GridsterPush(this.gridsterItem, this.gridster);
    this.swap = new GridsterSwap(this.gridsterItem, this.gridster);
    this.gridster.gridLines.updateGrid(true);
  }

  dragMove(e): void {
    e.stopPropagation();
    e.preventDefault();
    if (e.pageX === undefined && e.touches) {
      GridsterDraggable.touchEvent(e);
    }
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    scroll(this.gridsterItem, e, this.lastMouse, this.calculateItemPositionFromMousePosition.bind(this));

    this.calculateItemPositionFromMousePosition(e);

    this.lastMouse.pageX = e.pageX;
    this.lastMouse.pageY = e.pageY;
  }

  calculateItemPositionFromMousePosition(e): void {
    this.left = e.pageX + this.offsetLeft - this.margin - this.diffLeft;
    this.top = e.pageY + this.offsetTop - this.margin - this.diffTop;
    this.calculateItemPosition();
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
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
    this.gridster.movingItem = null;
    this.gridster.previewStyle();
    this.gridster.gridLines.updateGrid(false);
    if (this.gridster.$options.draggable.stop) {
      Promise.resolve(this.gridster.$options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
    } else {
      this.makeDrag();
    }
  }

  cancelDrag() {
    this.gridsterItem.$item.x = this.gridsterItem.item.x;
    this.gridsterItem.$item.y = this.gridsterItem.item.y;
    this.gridsterItem.setSize(true);
    this.push.restoreItems();
    this.push = undefined;
    this.swap.restoreSwapItem();
    this.swap = undefined;
  }

  makeDrag() {
    this.gridsterItem.setSize(true);
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    this.push.setPushedItems();
    this.push = undefined;
    this.swap.setSwapItem();
    this.swap = undefined;
  }

  calculateItemPosition() {
    this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
    this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
    this.positionXBackup = this.gridsterItem.$item.x;
    this.positionYBackup = this.gridsterItem.$item.y;
    this.gridsterItem.$item.x = this.positionX;
    this.gridsterItem.$item.y = this.positionY;
    if (this.gridster.checkGridCollision(this.gridsterItem)) {
      this.gridsterItem.$item.x = this.positionXBackup;
      this.gridsterItem.$item.y = this.positionYBackup;
      return;
    }

    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'left', this.left + 'px');
    this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'top', this.top + 'px');

    if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
      this.push.pushItems();
      this.swap.swapItems();
      if (this.gridster.checkCollision(this.gridsterItem)) {
        this.gridsterItem.$item.x = this.positionXBackup;
        this.gridsterItem.$item.y = this.positionYBackup;
      } else {
        this.gridster.previewStyle();
      }
    }
  }

  toggle(enable: boolean) {
    const enableDrag = !this.gridster.mobile &&
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
