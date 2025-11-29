import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  Signal,
  untracked,
  ViewEncapsulation
} from '@angular/core';

import { Gridster } from './gridster';
import { GridsterDraggable } from './gridsterDraggable';
import type { GridsterItemConfig, ResizableHandles } from './gridsterItemConfig';
import { GridsterResizable } from './gridsterResizable';
import { GridsterUtils } from './gridsterUtils';

@Component({
  selector: 'gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.z-index]': `zIndex()`
  }
})
export class GridsterItem implements OnInit, OnDestroy {
  item = input.required<GridsterItemConfig>();
  itemInit = output<{
    item: GridsterItemConfig;
    itemComponent: GridsterItem;
  }>();
  itemChange = output<{
    item: GridsterItemConfig;
    itemComponent: GridsterItem;
  }>();
  itemResize = output<{
    item: GridsterItemConfig;
    itemComponent: GridsterItem;
  }>();

  readonly cdRef = inject(ChangeDetectorRef);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly gridster = inject(Gridster);
  readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);

  $item: Signal<GridsterItemConfig> = computed<GridsterItemConfig>(() => {
    return GridsterUtils.merge({}, this.item(), {
      cols: undefined,
      rows: undefined,
      x: undefined,
      y: undefined,
      layerIndex: undefined,
      dragEnabled: undefined,
      resizeEnabled: undefined,
      compactEnabled: undefined,
      itemAspectRatio: undefined,
      maxItemRows: undefined,
      minItemRows: undefined,
      maxItemCols: undefined,
      minItemCols: undefined,
      maxItemArea: undefined,
      minItemArea: undefined,
      resizableHandles: {
        s: undefined,
        e: undefined,
        n: undefined,
        w: undefined,
        se: undefined,
        ne: undefined,
        sw: undefined,
        nw: undefined
      }
    });
  });
  top: number;
  left: number;
  width: number;
  height: number;
  drag: GridsterDraggable = new GridsterDraggable(this, this.gridster, this.zone, this.cdRef);
  resize: GridsterResizable = new GridsterResizable(this, this.gridster, this.zone);
  notPlaced: boolean;
  init: boolean;

  zIndex(): number {
    return this.getLayerIndex() + this.gridster.$options().baseLayerIndex;
  }

  constructor() {
    effect(() => {
      this.$item();
      if (this.init) {
        untracked(() => this.setSize());
      } else {
        this.gridster.calculateLayout$.next();
      }
    });
  }

  ngOnInit(): void {
    this.gridster.addItem(this);
  }

  ngOnDestroy(): void {
    this.gridster.removeItem(this);
    this.drag.destroy();
    this.resize.destroy();
    this.drag = this.resize = null!;
  }

  setSize(): void {
    this.renderer.setStyle(this.el, 'display', this.notPlaced ? '' : 'block');
    this.gridster.gridRenderer.updateItem(this.el, this.$item(), this.renderer);
    this.updateItemSize();
  }

  updateItemSize(): void {
    const options = this.gridster.options();
    const $options = this.gridster.$options();
    const $item = this.$item();
    const top = $item.y * this.gridster.curRowHeight;
    const left = $item.x * this.gridster.curColWidth;
    const width = $item.cols * this.gridster.curColWidth - $options.margin;
    const height = $item.rows * this.gridster.curRowHeight - $options.margin;

    this.top = top;
    this.left = left;

    const item = this.item();
    if (!this.init && width > 0 && height > 0) {
      this.init = true;
      if (item.initCallback) {
        item.initCallback(item, this);
      }
      if (options.itemInitCallback) {
        options.itemInitCallback(item, this);
      }
      this.itemInit.emit({ item, itemComponent: this });
      if ($options.scrollToNewItems) {
        this.el.scrollIntoView({
          block: 'end',
          inline: 'nearest',
          behavior: 'smooth'
        });
      }
    }
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      if (options.itemResizeCallback) {
        options.itemResizeCallback(item, this);
      }
      this.itemResize.emit({ item, itemComponent: this });
    }
  }

  itemChanged(): void {
    const options = this.gridster.options();
    const item = this.item();
    if (options.itemChangeCallback) {
      options.itemChangeCallback(item, this);
    }
    this.itemChange.emit({ item, itemComponent: this });
  }

  checkItemChanges(newValue: GridsterItemConfig, oldValue: GridsterItemConfig): void {
    if (newValue.rows === oldValue.rows && newValue.cols === oldValue.cols && newValue.x === oldValue.x && newValue.y === oldValue.y) {
      return;
    }
    const $item = this.$item();
    if (this.gridster.checkCollision($item)) {
      $item.x = oldValue.x || 0;
      $item.y = oldValue.y || 0;
      $item.cols = oldValue.cols || 1;
      $item.rows = oldValue.rows || 1;
      this.setSize();
    } else {
      const item = this.item();
      item.cols = $item.cols;
      item.rows = $item.rows;
      item.x = $item.x;
      item.y = $item.y;
      this.gridster.calculateLayout$.next();
      this.itemChanged();
    }
  }

  canBeDragged(): boolean {
    const gridDragEnabled = this.gridster.$options().draggable.enabled;
    const $item = this.$item();
    const itemDragEnabled = $item.dragEnabled === undefined ? gridDragEnabled : $item.dragEnabled;
    return !this.gridster.mobile && gridDragEnabled && itemDragEnabled;
  }

  canBeResized(): boolean {
    const gridResizable = this.gridster.$options().resizable.enabled;
    const $item = this.$item();
    const itemResizable = $item.resizeEnabled === undefined ? gridResizable : $item.resizeEnabled;
    return !this.gridster.mobile && gridResizable && itemResizable;
  }

  getResizableHandles(): ResizableHandles {
    const gridResizableHandles = this.gridster.$options().resizable.handles;
    const itemResizableHandles = this.$item().resizableHandles;
    // use grid settings if no settings are provided for the item.
    if (itemResizableHandles === undefined) {
      return gridResizableHandles;
    }
    // else merge the settings
    return {
      ...gridResizableHandles,
      ...itemResizableHandles
    };
  }

  bringToFront(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    const topIndex = this.gridster.$options().maxLayerIndex;
    if (layerIndex < topIndex) {
      const targetIndex = offset ? layerIndex + offset : topIndex;
      this.item().layerIndex = this.$item().layerIndex = targetIndex > topIndex ? topIndex : targetIndex;
    }
  }

  sendToBack(offset: number): void {
    if (offset && offset <= 0) {
      return;
    }
    const layerIndex = this.getLayerIndex();
    if (layerIndex > 0) {
      const targetIndex = offset ? layerIndex - offset : 0;
      this.item().layerIndex = this.$item().layerIndex = targetIndex < 0 ? 0 : targetIndex;
    }
  }

  private getLayerIndex(): number {
    const item = this.item();
    if (item.layerIndex !== undefined) {
      return item.layerIndex;
    }
    if (this.gridster.$options().defaultLayerIndex !== undefined) {
      return this.gridster.$options().defaultLayerIndex;
    }
    return 0;
  }

  protected readonly JSON = JSON;
}
