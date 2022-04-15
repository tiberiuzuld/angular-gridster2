import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';

import { GridsterDraggable } from './gridsterDraggable.service';
import { GridsterResizable } from './gridsterResizable.service';
import { GridsterUtils } from './gridsterUtils.service';
import {
  GridsterItem,
  GridsterItemComponentInterface
} from './gridsterItem.interface';
import { GridsterComponent } from './gridster.component';

@Component({
  selector: 'gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridsterItemComponent
  implements OnInit, OnDestroy, OnChanges, GridsterItemComponentInterface
{
  @Input() item: GridsterItem;
  @Output() itemInit = new EventEmitter<{
    item: GridsterItem;
    itemComponent: GridsterItemComponentInterface;
  }>();
  @Output() itemChange = new EventEmitter<{
    item: GridsterItem;
    itemComponent: GridsterItemComponentInterface;
  }>();
  @Output() itemResize = new EventEmitter<{
    item: GridsterItem;
    itemComponent: GridsterItemComponentInterface;
  }>();
  $item: GridsterItem;
  el: HTMLElement;
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

  constructor(
    @Inject(ElementRef) el: ElementRef,
    gridster: GridsterComponent,
    @Inject(Renderer2) public renderer: Renderer2,
    @Inject(NgZone) private zone: NgZone
  ) {
    this.el = el.nativeElement;
    this.$item = {
      cols: -1,
      rows: -1,
      x: -1,
      y: -1
    };
    this.gridster = gridster;
    this.drag = new GridsterDraggable(this, gridster, this.zone);
    this.resize = new GridsterResizable(this, gridster, this.zone);
  }

  ngOnInit(): void {
    this.gridster.addItem(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.updateOptions();

      if (!this.init) {
        this.gridster.calculateLayout$.next();
      }
    }
    if (changes.item && changes.item.previousValue) {
      this.setSize();
    }
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
      minItemArea: undefined
    });
  }

  ngOnDestroy(): void {
    this.gridster.removeItem(this);
    this.drag.destroy();
    this.resize.destroy();
    this.gridster = this.drag = this.resize = null!;
  }

  setSize(): void {
    this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
    this.gridster.gridRenderer.updateItem(this.el, this.$item, this.renderer);
    this.updateItemSize();
  }

  updateItemSize(): void {
    const top = this.$item.y * this.gridster.curRowHeight;
    const left = this.$item.x * this.gridster.curColWidth;
    const width =
      this.$item.cols * this.gridster.curColWidth -
      this.gridster.$options.margin;
    const height =
      this.$item.rows * this.gridster.curRowHeight -
      this.gridster.$options.margin;

    this.top = top;
    this.left = left;

    if (!this.init && width > 0 && height > 0) {
      this.init = true;
      if (this.item.initCallback) {
        this.item.initCallback(this.item, this);
      }
      if (this.gridster.options.itemInitCallback) {
        this.gridster.options.itemInitCallback(this.item, this);
      }
      this.itemInit.next({ item: this.item, itemComponent: this });
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
      this.itemResize.next({ item: this.item, itemComponent: this });
    }
  }

  itemChanged(): void {
    if (this.gridster.options.itemChangeCallback) {
      this.gridster.options.itemChangeCallback(this.item, this);
    }
    this.itemChange.next({ item: this.item, itemComponent: this });
  }

  checkItemChanges(newValue: GridsterItem, oldValue: GridsterItem): void {
    if (
      newValue.rows === oldValue.rows &&
      newValue.cols === oldValue.cols &&
      newValue.x === oldValue.x &&
      newValue.y === oldValue.y
    ) {
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
      this.gridster.calculateLayout$.next();
      this.itemChanged();
    }
  }

  canBeDragged(): boolean {
    const gridDragEnabled = this.gridster.$options.draggable.enabled;
    const itemDragEnabled =
      this.$item.dragEnabled === undefined
        ? gridDragEnabled
        : this.$item.dragEnabled;
    return !this.gridster.mobile && gridDragEnabled && itemDragEnabled;
  }

  canBeResized(): boolean {
    const gridResizable = this.gridster.$options.resizable.enabled;
    const itemResizable =
      this.$item.resizeEnabled === undefined
        ? gridResizable
        : this.$item.resizeEnabled;
    return !this.gridster.mobile && gridResizable && itemResizable;
  }

  bringToFront(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    const topIndex = this.gridster.$options.maxLayerIndex;
    if (layerIndex < topIndex) {
      const targetIndex = offset ? layerIndex + offset : topIndex;
      this.item.layerIndex = this.$item.layerIndex =
        targetIndex > topIndex ? topIndex : targetIndex;
    }
  }

  sendToBack(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    if (layerIndex > 0) {
      const targetIndex = offset ? layerIndex - offset : 0;
      this.item.layerIndex = this.$item.layerIndex =
        targetIndex < 0 ? 0 : targetIndex;
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
