import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  Inject,
  HostBinding
} from '@angular/core';

import {GridsterItem} from './gridsterItem.interface';
import {GridsterDraggable} from './gridsterDraggable.service';
import {GridsterResizable} from './gridsterResizable.service';
import {GridsterUtils} from './gridsterUtils.service';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponent} from './gridster.component';

@Component({
  selector: 'gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridsterItemComponent implements OnInit, OnDestroy, GridsterItemComponentInterface {
  @Input() item: GridsterItem;
  $item: GridsterItem;
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

  @HostBinding('style.z-index')
  get zIndex(): number {
    return this.getLayerIndex() + this.gridster.$options.baseLayerIndex;
  }

  constructor(@Inject(ElementRef) el: ElementRef,  gridster: GridsterComponent, @Inject(Renderer2) public renderer: Renderer2, @Inject(NgZone) private zone: NgZone) {
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
      layerIndex: undefined,
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
    this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
    this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
    this.updateItemSize();
  }

  updateItemSize() {
    const top = this.$item.y * this.gridster.curRowHeight;
    const left = this.$item.x * this.gridster.curColWidth;
    const width = this.$item.cols * this.gridster.curColWidth - this.gridster.$options.margin;
    const height = this.$item.rows * this.gridster.curRowHeight - this.gridster.$options.margin;

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
      this.width = width;
      this.height = height;
      if (this.gridster.options.itemResizeCallback) {
        this.gridster.options.itemResizeCallback(this.item, this);
      }
    }
    this.top = top;
    this.left = left;
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
      this.setSize();
    } else {
      this.item.cols = this.$item.cols;
      this.item.rows = this.$item.rows;
      this.item.x = this.$item.x;
      this.item.y = this.$item.y;
      this.gridster.calculateLayoutDebounce();
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

  bringToFront(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    const topIndex = this.gridster.$options.maxLayerIndex;
    if (layerIndex < topIndex) {
      const targetIndex = offset ? layerIndex + offset : topIndex;
      this.item.layerIndex = this.$item.layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
    }
  }
  sendToBack(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    if (layerIndex > 0) {
      const targetIndex = offset ? layerIndex - offset : 0;
      this.item.layerIndex = this.$item.layerIndex = targetIndex < 0 ? 0 : targetIndex;
    }
  }

  private getLayerIndex(): number {
    if (this.item.layerIndex !== undefined) {
      return this.item.layerIndex;
    }
    if (this.gridster.$options.defaultLayerIndex !== undefined) {
      return this.gridster.$options.defaultLayerIndex;
    }
    return 0;
  }

}
