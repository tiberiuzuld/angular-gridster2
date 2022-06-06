import { GridsterComponentInterface } from './gridster.interface';
import {
  GridsterItem,
  GridsterItemComponentInterface
} from './gridsterItem.interface';

export type gridTypes =
  | 'fit'
  | 'scrollVertical'
  | 'scrollHorizontal'
  | 'fixed'
  | 'verticalFixed'
  | 'horizontalFixed';
export type displayGrids = 'always' | 'onDrag&Resize' | 'none';
export type compactTypes =
  | 'none'
  | 'compactUp'
  | 'compactLeft'
  | 'compactUp&Left'
  | 'compactLeft&Up'
  | 'compactRight'
  | 'compactUp&Right'
  | 'compactRight&Up'
  | 'compactDown'
  | 'compactDown&Left'
  | 'compactLeft&Down'
  | 'compactDown&Right'
  | 'compactRight&Down';

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
  CompactLeftAndUp = 'compactLeft&Up',
  CompactRight = 'compactRight',
  CompactUpAndRight = 'compactUp&Right',
  CompactRightAndUp = 'compactRight&Up',
  CompactDown = 'compactDown',
  CompactDownAndLeft = 'compactDown&Left',
  CompactLeftAndDown = 'compactLeft&Down',
  CompactDownAndRight = 'compactDown&Right',
  CompactRightAndDown = 'compactRight&Down'
}

export enum DirTypes {
  LTR = 'ltr',
  RTL = 'rtl'
}

export type dirTypes = 'ltr' | 'rtl';

export interface GridsterConfig {
  gridType?: gridTypes;
  scale?: number;
  fixedColWidth?: number;
  fixedRowHeight?: number;
  keepFixedHeightInMobile?: boolean;
  keepFixedWidthInMobile?: boolean;
  setGridSize?: boolean;
  compactType?: compactTypes;
  mobileBreakpoint?: number;
  allowMultiLayer?: boolean;
  defaultLayerIndex?: number;
  maxLayerIndex?: number;
  baseLayerIndex?: number;
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
  addEmptyRowsCount?: number;
  rowHeightRatio?: number;
  margin?: number;
  outerMargin?: boolean;
  outerMarginTop?: number | null;
  outerMarginRight?: number | null;
  outerMarginBottom?: number | null;
  outerMarginLeft?: number | null;
  useTransformPositioning?: boolean;
  scrollSensitivity?: number | null;
  scrollSpeed?: number;
  initCallback?: (gridster: GridsterComponentInterface) => void;
  destroyCallback?: (gridster: GridsterComponentInterface) => void;
  gridSizeChangedCallback?: (gridster: GridsterComponentInterface) => void;
  itemChangeCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  itemResizeCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  itemInitCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  itemRemovedCallback?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ) => void;
  itemValidateCallback?: (item: GridsterItem) => boolean;
  draggable?: Draggable;
  resizable?: Resizable;
  swap?: boolean;
  swapWhileDragging?: boolean;
  pushItems?: boolean;
  disablePushOnDrag?: boolean;
  disablePushOnResize?: boolean;
  disableAutoPositionOnConflict?: boolean;
  pushDirections?: PushDirections;
  pushResizeItems?: boolean;
  displayGrid?: displayGrids;
  disableWindowResize?: boolean;
  disableWarnings?: boolean;
  scrollToNewItems?: boolean;
  disableScrollHorizontal?: boolean;
  disableScrollVertical?: boolean;
  enableBoundaryControl?: boolean;
  enableEmptyCellClick?: boolean;
  enableEmptyCellContextMenu?: boolean;
  enableEmptyCellDrop?: boolean;
  enableEmptyCellDrag?: boolean;
  enableOccupiedCellDrop?: boolean;
  emptyCellClickCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellContextMenuCallback?: (
    event: MouseEvent,
    item: GridsterItem
  ) => void;
  emptyCellDropCallback?: (event: DragEvent, item: GridsterItem) => void;
  emptyCellDragCallback?: (event: MouseEvent, item: GridsterItem) => void;
  emptyCellDragMaxCols?: number;
  emptyCellDragMaxRows?: number;
  ignoreMarginInRow?: boolean;
  dirType?: dirTypes;
  api?: {
    resize?: () => void;
    optionsChanged?: () => void;
    getNextPossiblePosition?: (newItem: GridsterItem) => boolean;
    getFirstPossiblePosition?: (item: GridsterItem) => GridsterItem;
    getLastPossiblePosition?: (item: GridsterItem) => GridsterItem;
    getItemComponent?: (
      item: GridsterItem
    ) => GridsterItemComponentInterface | undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export interface DragBase {
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ) => Promise<any> | void;
  start?: (
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
    event: MouseEvent
  ) => void;
  delayStart?: number;
}

export interface Draggable extends DragBase {
  ignoreContentClass?: string;
  ignoreContent?: boolean;
  dragHandleClass?: string;
  dropOverItems?: boolean;
  dropOverItemsCallback?: (
    source: GridsterItem,
    target: GridsterItem,
    grid?: GridsterComponentInterface
  ) => void;
}

export interface Resizable extends DragBase {
  handles?: {
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
