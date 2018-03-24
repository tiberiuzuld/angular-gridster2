import {compactTypes, displayGrids, gridTypes} from './gridsterConfig.interface';
import {GridsterItem} from './gridsterItem.interface';

export interface GridsterConfigS {
  gridType: gridTypes;
  fixedColWidth: number;
  fixedRowHeight: number;
  keepFixedHeightInMobile: boolean;
  keepFixedWidthInMobile: boolean;
  compactType: compactTypes;
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
  outerMarginTop: number | null;
  outerMarginRight: number | null;
  outerMarginBottom: number | null;
  outerMarginLeft: number | null;
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
  displayGrid: displayGrids;
  disableWindowResize: boolean;
  disableWarnings: boolean;
  scrollToNewItems: boolean;
  enableEmptyCellClick: boolean;
  enableEmptyCellContextMenu: boolean;
  enableEmptyCellDrop: boolean;
  enableEmptyCellDrag: boolean;
  emptyCellDragMaxCols: number;
  emptyCellDragMaxRows: number;
  ignoreMarginInRow: boolean;
  api: {
    resize: () => void,
    optionsChanged: () => void,
    getNextPossiblePosition: (newItem: GridsterItem) => boolean,
    getFirstPossiblePosition: (item: GridsterItem) => GridsterItem,
    getLastPossiblePosition: (item: GridsterItem) => GridsterItem,
  };

  [propName: string]: any;
}

export interface DragBase {
  enabled: boolean;
  delayStart: number;

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

export interface PushDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}
