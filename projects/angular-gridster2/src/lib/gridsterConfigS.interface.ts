import { GridsterComponentInterface } from './gridster.interface';
import {
  compactTypes,
  dirTypes,
  displayGrids,
  gridTypes
} from './gridsterConfig.interface';
import {
  GridsterItem,
  GridsterItemComponentInterface
} from './gridsterItem.interface';

export interface GridsterConfigS {
  gridType: gridTypes;
  scale?: number;
  fixedColWidth: number;
  fixedRowHeight: number;
  keepFixedHeightInMobile: boolean;
  keepFixedWidthInMobile: boolean;
  setGridSize: boolean;
  compactType: compactTypes;
  mobileBreakpoint: number;
  useBodyForBreakpoint: boolean;
  allowMultiLayer: boolean;
  defaultLayerIndex: number;
  maxLayerIndex: number;
  baseLayerIndex: number;
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
  addEmptyRowsCount: number;
  rowHeightRatio: number;
  margin: number;
  outerMargin: boolean;
  outerMarginTop: number | null;
  outerMarginRight: number | null;
  outerMarginBottom: number | null;
  outerMarginLeft: number | null;
  useTransformPositioning: boolean;
  scrollSensitivity: number;
  scrollSpeed: number;
  draggable: Draggable;
  resizable: Resizable;
  swap: boolean;
  swapWhileDragging: boolean;
  pushItems: boolean;
  disablePushOnDrag: boolean;
  disablePushOnResize: boolean;
  disableAutoPositionOnConflict: boolean;
  pushDirections: PushDirections;
  pushResizeItems: boolean;
  displayGrid: displayGrids;
  disableWindowResize: boolean;
  disableWarnings: boolean;
  scrollToNewItems: boolean;
  disableScrollHorizontal?: boolean;
  disableScrollVertical?: boolean;
  enableBoundaryControl?: boolean;
  enableEmptyCellClick: boolean;
  enableEmptyCellContextMenu: boolean;
  enableEmptyCellDrop: boolean;
  enableEmptyCellDrag: boolean;
  enableOccupiedCellDrop: boolean;
  emptyCellDragMaxCols: number;
  emptyCellDragMaxRows: number;
  ignoreMarginInRow: boolean;
  dirType: dirTypes;
  api: {
    resize: () => void;
    optionsChanged: () => void;
    getNextPossiblePosition: (newItem: GridsterItem) => boolean;
    getFirstPossiblePosition: (item: GridsterItem) => GridsterItem;
    getLastPossiblePosition: (item: GridsterItem) => GridsterItem;
    getItemComponent: (
      item: GridsterItem
    ) => GridsterItemComponentInterface | undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface DragBase {
  enabled: boolean;
  delayStart: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface Draggable extends DragBase {
  ignoreContentClass: string;
  ignoreContent: boolean;
  dragHandleClass: string;
  dropOverItems: boolean;
  dropOverItemsCallback: (
    source: GridsterItem,
    target: GridsterItem,
    grid?: GridsterComponentInterface
  ) => void;
}

export interface Resizable extends DragBase {
  handles: {
    s: boolean;
    e: boolean;
    n: boolean;
    w: boolean;
    se: boolean;
    ne: boolean;
    sw: boolean;
    nw: boolean;
  };
}

export interface PushDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}
