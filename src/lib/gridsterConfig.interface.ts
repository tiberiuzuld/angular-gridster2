import {GridsterItem} from './gridsterItem.interface';
import {GridsterItemComponentInterface} from './gridsterItemComponent.interface';
import {GridsterComponentInterface} from './gridster.interface';

export type gridTypes = 'fit' | 'scrollVertical' | 'scrollHorizontal' | 'fixed' | 'verticalFixed' | 'horizontalFixed';
export type displayGrids = 'always' | 'onDrag&Resize' | 'none';
export type compactTypes = 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up';

export enum GridType {
  Fit = 'fit',
  ScrollVertical = 'scrollVertical',
  ScrollHorizontal = 'scrollHorizontal',
  Fixed = 'fixed',
  VerticalFixed = 'verticalFixed',
  HorizontalFixed = 'horizontalFixed'
}

export enum DisplayGrid {
  Always = 'always',
  OnDragAndResize = 'onDrag&Resize',
  None = 'none'
}

export enum CompactType {
  None = 'none',
  CompactUp = 'compactUp',
  CompactLeft = 'compactLeft',
  CompactUpAndLeft = 'compactUp&Left',
  CompactLeftAndUp = 'compactLeft&Up'
}

export interface GridsterConfig {
  gridType?: gridTypes;
  fixedColWidth?: number;
  fixedRowHeight?: number;
  keepFixedHeightInMobile?: boolean;
  keepFixedWidthInMobile?: boolean;
  compactType?: compactTypes;
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
  minItemArea?: number;
  maxItemArea?: number;
  margin?: number;
  outerMargin?: boolean;
  outerMarginTop?: number | null;
  outerMarginRight?: number | null;
  outerMarginBottom?: number | null;
  outerMarginLeft?: number | null;
  scrollSensitivity?: number | null;
  scrollSpeed?: number;
  initCallback?: (gridster: GridsterComponentInterface) => void;
  destroyCallback?: (gridster: GridsterComponentInterface) => void;
  itemChangeCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemResizeCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemInitCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  itemRemovedCallback?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  draggable?: Draggable;
  resizable?: Resizable;
  swap?: boolean;
  pushItems?: boolean;
  disablePushOnDrag?: boolean;
  disablePushOnResize?: boolean;
  pushDirections?: PushDirections;
  pushResizeItems?: boolean;
  displayGrid?: displayGrids;
  disableWindowResize?: boolean;
  disableWarnings?: boolean;
  scrollToNewItems?: boolean;
  enableEmptyCellClick?: boolean;
  enableEmptyCellContextMenu?: boolean;
  enableEmptyCellDrop?: boolean;
  enableEmptyCellDrag?: boolean;
  emptyCellClickCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellContextMenuCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDropCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDragCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDragMaxCols?: number;
  emptyCellDragMaxRows?: number;
  ignoreMarginInRow?: boolean;
  api?: {
    resize?: () => void,
    optionsChanged?: () => void,
    getNextPossiblePosition?: (newItem: GridsterItem) => boolean,
    getFirstPossiblePosition?: (item: GridsterItem) => GridsterItem,
    getLastPossiblePosition?: (item: GridsterItem) => GridsterItem,
  };

  [propName: string]: any;
}

export interface DragBase {
  enabled?: boolean;
  stop?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) => Promise<any> | void;
  start?: (item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) => void;
  delayStart?: number;
}

export interface Draggable extends DragBase {
  ignoreContentClass?: string;
  ignoreContent?: boolean;
  dragHandleClass?: string;
}

export interface Resizable extends DragBase {
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

export interface PushDirections {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}
