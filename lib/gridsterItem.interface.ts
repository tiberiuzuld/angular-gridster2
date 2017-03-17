import {GridsterResizable} from './gridsterResizable.service';
import {GridsterDraggable} from './gridsterDraggable.service';
export interface GridsterItem {
  x?: number;
  y?: number;
  rows?: number;
  cols?: number;
  initCallback?: Function;
  setSize?: Function;
  checkItemChanges?: Function;
  itemChanged?: Function;
  drag?: GridsterDraggable;
  resize?: GridsterResizable;
}
