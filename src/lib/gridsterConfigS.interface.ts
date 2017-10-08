import {compactType, displayGrid, GridType} from './gridsterConfig.interface';

export interface GridsterConfigS {
  gridType: GridType;
  fixedColWidth: number;
  fixedRowHeight: number;
  keepFixedHeightInMobile: boolean;
  keepFixedWidthInMobile: boolean;
  compactType: compactType;
  mobileBreakpoint: number;
  minCols: number;
  maxCols: number;
  minRows: number;
  maxRows: number;
  defaultItemCols: number;
  defaultItemRows: number;
  maxItemCols: number;
  maxItemRows: number;
  minItemCols: number;
  minItemRows: number;
  minItemArea: number;
  maxItemArea: number;
  margin: number;
  outerMargin: boolean;
  scrollSensitivity: number;
  scrollSpeed: number;
  draggable: Draggable;
  resizable: Resizable;
  swap: boolean;
  pushItems: boolean;
  disablePushOnDrag: boolean;
  disablePushOnResize: boolean;
  pushDirections: PushDirections;
  pushResizeItems: boolean;
  displayGrid: displayGrid;
  disableWindowResize: boolean;
  enableEmptyCellClick: boolean;
  enableEmptyCellContextMenu: boolean;
  enableEmptyCellDrop: boolean;
  enableEmptyCellDrag: boolean;
  emptyCellDragMaxCols: number;
  emptyCellDragMaxRows: number;
  api: {
    resize: Function,
    optionsChanged: Function,
    getNextPossiblePosition: Function,
  };

  [propName: string]: any;
}

export interface Draggable extends DragBase {
  ignoreContentClass: string;
  ignoreContent: boolean;
  dragHandleClass: string;
}

export interface Resizable extends DragBase {
  handles: {
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

export interface DragBase {
  enabled: boolean;
  delayStart: number;
  [propName: string]: any;
}

export interface PushDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}
