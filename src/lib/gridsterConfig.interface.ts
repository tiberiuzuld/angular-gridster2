export type GridType = 'fit' | 'scrollVertical' | 'scrollHorizontal' | 'fixed';

export interface GridsterConfig {
  gridType?: GridType;
  fixedColWidth?: number;
  fixedRowHeight?: number;
  compactUp?: boolean;
  compactLeft?: boolean;
  mobileBreakpoint?: number;
  minCols?: number;
  maxCols?: number;
  minRows?: number;
  maxRows?: number;
  defaultItemCols?: number;
  defaultItemRows?: number;
  maxItemCols?: number;
  maxItemRows?: number;
  minItemCols?: number;
  minItemRows?: number;
  margin?: number;
  outerMargin?: boolean;
  scrollSensitivity?: number;
  scrollSpeed?: number;
  itemChangeCallback?: Function;
  itemResizeCallback?: Function;
  optionsChanged?: Function;
  draggable?: Draggable;
  resizable?: Resizable;
  swap?: boolean;
}

export interface Draggable {
  enabled?: boolean;
  stop?: Function;
}

export interface Resizable extends Draggable {
  handles?: {
    s: boolean,
    e: boolean,
    n: boolean,
    w: boolean,
    se: boolean,
    ne: boolean,
    sw: boolean,
    nw: boolean
  };
}
