import { GridsterItemComponent } from './gridsterItem.component';

export type GridsterItem = {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  initCallback?: (item: GridsterItem, itemComponent: GridsterItemComponent) => void;
  dragEnabled?: boolean;
  resizeEnabled?: boolean;
  resizableHandles?: {
    s?: boolean;
    e?: boolean;
    n?: boolean;
    w?: boolean;
    se?: boolean;
    ne?: boolean;
    sw?: boolean;
    nw?: boolean;
  };
  compactEnabled?: boolean;
  itemAspectRatio?: number;
  maxItemRows?: number;
  minItemRows?: number;
  maxItemCols?: number;
  minItemCols?: number;
  minItemArea?: number;
  maxItemArea?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};
