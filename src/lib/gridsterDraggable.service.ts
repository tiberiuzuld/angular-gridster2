import {Injectable, NgZone} from '@angular/core';

import {GridsterSwap} from './gridsterSwap.service';
import {cancelScroll, scroll} from './gridsterScroll.service';
import {GridsterPush} from './gridsterPush.service';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

@Injectable()
export class GridsterDraggable {
  gridsterItem: GridsterItemComponentInterface;
  gridster: GridsterComponentInterface;
  lastMouse: {
    clientX: number,
    clientY: number
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
  drag: Function;
  dragend: Function;
  cancelOnBlur: Function;
  dragstart: Function;
  dragOver: Function;
  push: GridsterPush;
  swap: GridsterSwap;
  path: Array<{ x: number, y: number }>;
  collision: GridsterItemComponentInterface | boolean;

  static dragOverE(e: any): void {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  constructor(gridsterItem: GridsterItemComponentInterface, gridster: GridsterComponentInterface, private zone: NgZone) {
    this.gridsterItem = gridsterItem;
    this.gridster = gridster;
    this.lastMouse = {
      clientX: 0,
      clientY: 0
    };
    this.path = [];
  }

  destroy(): void {
    delete this.gridster.movingItem;
    if (this.gridster.previewStyle) {
      this.gridster.previewStyle(true);
    }
    delete this.gridsterItem;
    delete this.gridster;
    delete this.collision;
    if (this.dragstart) {
      this.dragstart();
    }
  }

  dragStart(e: any): void {
    e.dropEffect = 'move';
    if (this.gridster.options.draggable && this.gridster.options.draggable.start) {
      this.gridster.options.draggable.start(this.gridsterItem.item, this.gridsterItem, e);
    }

    this.dragFunction = this.dragMove.bind(this);
    this.dragStopFunction = this.dragStop.bind(this);

    this.zone.runOutsideAngular(() => {
      this.drag = this.gridsterItem.renderer.listen(this.gridster.el, 'drag', this.dragFunction);
      this.dragOver = this.gridsterItem.renderer.listen(this.gridster.el, 'dragover', GridsterDraggable.dragOverE);
    });
    this.dragend = this.gridsterItem.renderer.listen('document', 'dragend', this.dragStopFunction);
    this.cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', this.dragStopFunction);
    this.gridsterItem.renderer.addClass(this.gridsterItem.el, 'gridster-item-moving');
    setTimeout(() => {
      this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'display', 'none');
    });
    this.margin = this.gridster.$options.margin;
    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    this.left = this.gridsterItem.left - this.margin;
    this.top = this.gridsterItem.top - this.margin;
    this.width = this.gridsterItem.width;
    this.height = this.gridsterItem.height;
    this.diffLeft = e.clientX + this.offsetLeft - this.margin - this.left;
    this.diffTop = e.clientY + this.offsetTop - this.margin - this.top;
    this.gridster.movingItem = this.gridsterItem.$item;
    this.gridster.previewStyle(true);
    this.push = new GridsterPush(this.gridsterItem);
    this.swap = new GridsterSwap(this.gridsterItem);
    this.gridster.dragInProgress = true;
    this.gridster.updateGrid();
    this.path.push({x: this.gridsterItem.item.x || 0, y: this.gridsterItem.item.y || 0});
  }

  dragMove(e: any): void {
    if (e.clientX === 0 && e.clientY === 0) {
      return;
    }

    this.offsetLeft = this.gridster.el.scrollLeft - this.gridster.el.offsetLeft;
    this.offsetTop = this.gridster.el.scrollTop - this.gridster.el.offsetTop;
    scroll(this.gridster, this.left, this.top, this.width, this.height, e, this.lastMouse,
      this.calculateItemPositionFromMousePosition.bind(this));

    this.calculateItemPositionFromMousePosition(e);
  }

  calculateItemPositionFromMousePosition(e: any): void {
    this.left = e.clientX + this.offsetLeft - this.diffLeft;
    this.top = e.clientY + this.offsetTop - this.diffTop;
    this.calculateItemPosition();
    this.lastMouse.clientX = e.clientX;
    this.lastMouse.clientY = e.clientY;
    this.zone.run(() => {
      this.gridster.updateGrid();
    });
  }

  dragStop(e: any): void {
    e.preventDefault();
    cancelScroll();
    this.cancelOnBlur();
    this.drag();
    this.dragOver();
    this.dragend();
    this.gridsterItem.renderer.removeClass(this.gridsterItem.el, 'gridster-item-moving');
    this.gridster.dragInProgress = false;
    this.gridster.updateGrid();
    this.path = [];
    if (this.gridster.options.draggable && this.gridster.options.draggable.stop) {
      Promise.resolve(this.gridster.options.draggable.stop(this.gridsterItem.item, this.gridsterItem, e))
        .then(this.makeDrag.bind(this), this.cancelDrag.bind(this));
    } else {
      this.makeDrag();
    }
    setTimeout(() => {
      if (this.gridster) {
        this.gridster.movingItem = null;
        this.gridster.previewStyle(true);
      }
    });
  }

  cancelDrag() {
    this.gridsterItem.$item.x = this.gridsterItem.item.x || 0;
    this.gridsterItem.$item.y = this.gridsterItem.item.y || 0;
    this.gridsterItem.setSize();
    this.push.restoreItems();
    this.swap.restoreSwapItem();
    this.push.destroy();
    delete this.push;
    this.swap.destroy();
    delete this.swap;
  }

  makeDrag() {
    if (this.gridster.$options.draggable.dropOverItems && this.gridster.options.draggable
      && this.gridster.options.draggable.dropOverItemsCallback
      && this.collision !== true && this.collision !== false && this.collision.$item) {
      this.gridster.options.draggable.dropOverItemsCallback(this.gridsterItem.item, this.collision.item, this.gridster);
    }
    delete this.collision;
    this.gridsterItem.setSize();
    this.gridsterItem.checkItemChanges(this.gridsterItem.$item, this.gridsterItem.item);
    this.push.setPushedItems();
    this.swap.setSwapItem();
    this.push.destroy();
    delete this.push;
    this.swap.destroy();
    delete this.swap;
  }

  calculateItemPosition() {
    this.gridster.movingItem = this.gridsterItem.$item;
    this.positionX = this.gridster.pixelsToPositionX(this.left, Math.round);
    this.positionY = this.gridster.pixelsToPositionY(this.top, Math.round);
    this.positionXBackup = this.gridsterItem.$item.x;
    this.positionYBackup = this.gridsterItem.$item.y;
    this.gridsterItem.$item.x = this.positionX;
    if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
      this.gridsterItem.$item.x = this.positionXBackup;
    }
    this.gridsterItem.$item.y = this.positionY;
    if (this.gridster.checkGridCollision(this.gridsterItem.$item)) {
      this.gridsterItem.$item.y = this.positionYBackup;
    }
    // const transform = 'translate(' + this.left + 'px, ' + this.top + 'px)';
    // this.gridsterItem.renderer.setStyle(this.gridsterItem.el, 'transform', transform);

    if (this.positionXBackup !== this.gridsterItem.$item.x || this.positionYBackup !== this.gridsterItem.$item.y) {
      const lastPosition = this.path[this.path.length - 1];
      let direction = '';
      if (lastPosition.x < this.gridsterItem.$item.x) {
        direction = this.push.fromWest;
      } else if (lastPosition.x > this.gridsterItem.$item.x) {
        direction = this.push.fromEast;
      } else if (lastPosition.y < this.gridsterItem.$item.y) {
        direction = this.push.fromNorth;
      } else if (lastPosition.y > this.gridsterItem.$item.y) {
        direction = this.push.fromSouth;
      }
      this.push.pushItems(direction, this.gridster.$options.disablePushOnDrag);
      this.swap.swapItems();
      this.collision = this.gridster.checkCollision(this.gridsterItem.$item);
      if (this.collision) {
        this.gridsterItem.$item.x = this.positionXBackup;
        this.gridsterItem.$item.y = this.positionYBackup;
        if (this.gridster.$options.draggable.dropOverItems && this.collision !== true && this.collision.$item) {
          this.gridster.movingItem = null;
        }
      } else {
        this.path.push({x: this.gridsterItem.$item.x, y: this.gridsterItem.$item.y});
      }
      this.push.checkPushBack();
    }
    this.gridster.previewStyle(true);
  }

  toggle() {
    const enableDrag = this.gridsterItem.canBeDragged();
    if (!this.enabled && enableDrag) {
      this.enabled = !this.enabled;
      this.dragStartFunction = this.dragStartDelay.bind(this);
      this.dragstart = this.gridsterItem.renderer.listen(this.gridsterItem.el, 'dragstart', this.dragStartFunction);
      this.gridsterItem.renderer.setAttribute(this.gridsterItem.el, 'draggable', 'true');
    } else if (this.enabled && !enableDrag) {
      this.enabled = !this.enabled;
      this.dragstart();
      this.gridsterItem.renderer.removeAttribute(this.gridsterItem.el, 'draggable');
    }
  }

  dragStartDelay(e: any): void {
    if (e.target.hasAttribute('class') && e.target.getAttribute('class').split(' ').indexOf('gridster-item-resizable-handler') > -1) {
      return;
    }
    if (GridsterUtils.checkContentClassForEvent(this.gridster, e)) {
      return;
    }
    if (!this.gridster.$options.draggable.delayStart) {
      this.dragStart(e);
      return;
    }
    const timeout = setTimeout(() => {
      this.dragStart(e);
      cancelDrag();
    }, this.gridster.$options.draggable.delayStart);
    const cancelMouse = this.gridsterItem.renderer.listen('document', 'dragend', cancelDrag);
    const cancelOnBlur = this.gridsterItem.renderer.listen('window', 'blur', cancelDrag);

    function cancelDrag() {
      clearTimeout(timeout);
      cancelOnBlur();
      cancelMouse();
    }
  }
}
