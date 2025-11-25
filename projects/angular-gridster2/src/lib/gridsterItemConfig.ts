import { GridsterItem } from './gridsterItem';

export type GridsterItemConfig = {
  x: number;
  y: number;
  rows: number;
  cols: number;
  layerIndex?: number;
  initCallback?: (item: GridsterItemConfig, itemComponent: GridsterItem) => void;
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
