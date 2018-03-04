import {Component, ElementRef, Host, Input, NgZone, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';

import {GridsterItem} from './gridsterItem.interface';
import {GridsterComponent} from './gridster.component';
import {GridsterDraggable} from './gridsterDraggable.service';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemS} from './gridsterItemS.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';

@Component({
  selector: 'gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridsterItemComponent implements OnInit, OnDestroy, GridsterItemComponentInterface {
  @Input() item: GridsterItem;
  $item: GridsterItemS;
  el: any;
  gridster: GridsterComponent;
  top: number;
  left: number;
  width: number;
  height: number;
  drag: GridsterDraggable;
  resize: GridsterResizable;
  notPlaced: boolean;
  init: boolean;

  constructor(el: ElementRef, @Host() gridster: GridsterComponent, public renderer: Renderer2, private zone: NgZone) {
    this.el = el.nativeElement;
    this.$item = {
      cols: -1,
      rows: -1,
      x: -1,
      y: -1,
    };
    this.gridster = gridster;
    this.drag = new GridsterDraggable(this, gridster, this.zone);
    this.resize = new GridsterResizable(this, gridster, this.zone);
  }

  ngOnInit(): void {
    this.updateOptions();
    this.gridster.addItem(this);
  }

  updateOptions(): void {
    this.$item = GridsterUtils.merge(this.$item, this.item, {
      cols: undefined,
      rows: undefined,
      x: undefined,
      y: undefined,
      dragEnabled: undefined,
      resizeEnabled: undefined,
      compactEnabled: undefined,
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined,
      maxItemArea: undefined,
      minItemArea: undefined,
    });
  }

  ngOnDestroy(): void {
    this.gridster.removeItem(this);
    delete this.gridster;
    this.drag.destroy();
    delete this.drag;
    this.resize.destroy();
    delete this.resize;
  }

  setSize(): void {
    this.renderer.setStyle(this.el, 'display', this.notPlaced ? null : 'block');
    if (this.gridster.mobile) {
      this.renderer.setStyle(this.el, 'grid-column-start', null);
      this.renderer.setStyle(this.el, 'grid-column-end', null);
      this.renderer.setStyle(this.el, 'grid-row-start', null);
      this.renderer.setStyle(this.el, 'grid-row-end', null);
    } else {
      this.renderer.setStyle(this.el, 'grid-column-start', (this.$item.x + 1));
      this.renderer.setStyle(this.el, 'grid-column-end', ((this.$item.x + 1) + this.$item.cols));
      this.renderer.setStyle(this.el, 'grid-row-start', (this.$item.y + 1));
      this.renderer.setStyle(this.el, 'grid-row-end', ((this.$item.y + 1) + this.$item.rows));
    }
    const height = this.el.offsetHeight;
    const width = this.el.offsetWidth;

    if (!this.init && width > 0 && height > 0) {
      this.init = true;
      if (this.item.initCallback) {
        this.item.initCallback(this.item, this);
      }
      if (this.gridster.options.itemInitCallback) {
        this.gridster.options.itemInitCallback(this.item, this);
      }
      if (this.gridster.$options.scrollToNewItems) {
        this.el.scrollIntoView(false);
      }
    }
    if (width !== this.width || height !== this.height) {
      if (this.gridster.options.itemResizeCallback) {
        this.gridster.options.itemResizeCallback(this.item, this);
      }
    }

    this.top = this.el.offsetTop;
    this.left = this.el.offsetLeft;
    this.width = width;
    this.height = height;
  }

  itemChanged(): void {
    if (this.gridster.options.itemChangeCallback) {
      this.gridster.options.itemChangeCallback(this.item, this);
    }
  }

  checkItemChanges(newValue: GridsterItem, oldValue: GridsterItem): void {
    if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
      return;
    }
    if (this.gridster.checkCollision(this.$item)) {
      this.$item.x = oldValue.x || 0;
      this.$item.y = oldValue.y || 0;
      this.$item.cols = oldValue.cols || 1;
      this.$item.rows = oldValue.rows || 1;
    } else {
      this.item.cols = this.$item.cols;
      this.item.rows = this.$item.rows;
      this.item.x = this.$item.x;
      this.item.y = this.$item.y;
      this.gridster.calculateLayout();
      this.itemChanged();
    }
  }

  canBeDragged(): boolean {
    return !this.gridster.mobile &&
      (this.$item.dragEnabled === undefined ? this.gridster.$options.draggable.enabled : this.$item.dragEnabled);
  }

  canBeResized(): boolean {
    return !this.gridster.mobile &&
      (this.$item.resizeEnabled === undefined ? this.gridster.$options.resizable.enabled : this.$item.resizeEnabled);
  }

}
