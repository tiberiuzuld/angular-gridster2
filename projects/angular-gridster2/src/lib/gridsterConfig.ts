import { Gridster } from './gridster';
import { GridsterItem } from './gridsterItem';
import { GridsterItemConfig, ResizableHandles } from './gridsterItemConfig';

export type gridTypes = 'fit' | 'scrollVertical' | 'scrollHorizontal' | 'fixed' | 'verticalFixed' | 'horizontalFixed';
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
  | 'compactRight&Down'
  | 'compactGrid';

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
  CompactRightAndDown = 'compactRight&Down',
  CompactGrid = 'compactGrid'
}

export enum DirTypes {
  LTR = 'ltr',
  RTL = 'rtl'
}

export type dirTypes = 'ltr' | 'rtl';

export type GridsterApi = {
  calculateLayout: () => void;
  resize: () => void;
  getNextPossiblePosition: (newItem: GridsterItemConfig, startingFrom?: { y?: number; x?: number }) => void;
  getFirstPossiblePosition: (item: GridsterItemConfig) => GridsterItemConfig;
  getLastPossiblePosition: (item: GridsterItemConfig) => GridsterItemConfig;
  getItemComponent: (item: GridsterItemConfig) => GridsterItem | undefined;
};

export type GridsterConfig = {
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
  itemAspectRatio?: number | null;
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
  scrollSensitivity?: number;
  scrollSpeed?: number;
  initCallback?: (gridster: Gridster, gridsterApi: GridsterApi) => void;
  destroyCallback?: (gridster: Gridster) => void;
  gridSizeChangedCallback?: (gridster: Gridster) => void;
  itemChangeCallback?: (item: GridsterItemConfig, itemComponent: GridsterItem) => void;
  itemResizeCallback?: (item: GridsterItemConfig, itemComponent: GridsterItem) => void;
  itemInitCallback?: (item: GridsterItemConfig, itemComponent: GridsterItem) => void;
  itemRemovedCallback?: (item: GridsterItemConfig, itemComponent: GridsterItem) => void;
  itemValidateCallback?: (item: GridsterItemConfig) => boolean;
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
  emptyCellClickCallback?: (event: MouseEvent, item: GridsterItemConfig) => void;
  emptyCellContextMenuCallback?: (event: MouseEvent, item: GridsterItemConfig) => void;
  emptyCellDropCallback?: (event: DragEvent, item: GridsterItemConfig) => void;
  emptyCellDragCallback?: (event: MouseEvent, item: GridsterItemConfig) => void;
  emptyCellDragMaxCols?: number;
  emptyCellDragMaxRows?: number;
  ignoreMarginInRow?: boolean;
  dirType?: dirTypes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

export type DragBase = {
  enabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stop?: (item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent) => Promise<any> | void;
  start?: (item: GridsterItemConfig, itemComponent: GridsterItem, event: MouseEvent) => void;
  delayStart?: number;
};

export type Draggable = DragBase & {
  ignoreContentClass?: string;
  ignoreContent?: boolean;
  dragHandleClass?: string;
  dropOverItems?: boolean;
  dropOverItemsCallback?: (source: GridsterItemConfig, target: GridsterItemConfig, grid?: Gridster) => void;
};

export type Resizable = DragBase & {
  handles?: ResizableHandles;
};

export type PushDirections = {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
};

export type GridsterConfigStrict = Required<GridsterConfig> & {
  draggable: Required<Draggable>;
  resizable: Required<Resizable>;
};
