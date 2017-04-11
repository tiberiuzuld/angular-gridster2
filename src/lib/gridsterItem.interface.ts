import {GridsterResizable} from './gridsterResizable.service';
import {GridsterDraggable} from './gridsterDraggable.service';
export interface GridsterItem {
  x?: number;
  y?: number;
  rows?: number;
  cols?: number;
  initCallback?: Function;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  setSize?: Function;
  checkItemChanges?: Function;
  itemChanged?: Function;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  drag?: GridsterDraggable;
  resize?: GridsterResizable;
  [propName: string]: any;
}
