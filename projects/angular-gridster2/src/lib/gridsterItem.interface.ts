import { GridsterDraggable } from './gridsterDraggable.service';
import { Renderer2 } from '@angular/core';
import { GridsterResizable } from './gridsterResizable.service';
import { GridsterComponentInterface } from './gridster.interface';

export abstract class GridsterItemComponentInterface {
  item: GridsterItem;
  $item: GridsterItem;
  top: number;
  left: number;
  width: number;
  height: number;
  drag: GridsterDraggable;
  resize: GridsterResizable;
  notPlaced: boolean;
  updateOptions: () => void;
  itemChanged: () => void;
  setSize: () => void;
  checkItemChanges: (newValue: GridsterItem, oldValue: GridsterItem) => void;
  canBeDragged: () => boolean;
  canBeResized: () => boolean;
  bringToFront: (offset: number) => void;
  sendToBack: (v: number) => void;
  el: HTMLElement;
  gridster: GridsterComponentInterface;
  renderer: Renderer2;
}

export interface GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  initCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  compactEnabled?: boolean;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}
