import {
  CompactType,
  DirTypes,
  DisplayGrid,
  GridsterConfig,
  GridType
} from './gridsterConfig.interface';

export const GridsterConfigService: GridsterConfig = {
  gridType: GridType.Fit, // 'fit' will fit the items in the container without scroll;
  scale: 1, // scale param to zoom in/zoom out
  // 'scrollVertical' will fit on width and height of the items will be the same as the width
  // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
  // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
  // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
  // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
  fixedColWidth: 250, // fixed col width for gridType: 'fixed'
  fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
  keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
  keepFixedWidthInMobile: false, // keep the width from fixed gridType in mobile layout
  setGridSize: false, // sets grid size depending on content
  compactType: CompactType.None, // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
  mobileBreakpoint: 640, // if the screen is not wider that this, remove the grid layout and stack the items
  useBodyForBreakpoint: false, // whether to use the body width to determine the mobile breakpoint. Uses the element width when false.
  allowMultiLayer: false,
  defaultLayerIndex: 0,
  maxLayerIndex: 2,
  baseLayerIndex: 1,
  minCols: 1, // minimum amount of columns in the grid
  maxCols: 100, // maximum amount of columns in the grid
  minRows: 1, // minimum amount of rows in the grid
  maxRows: 100, // maximum amount of rows in the grid
  defaultItemCols: 1, // default width of an item in columns
  defaultItemRows: 1, // default height of an item in rows
  maxItemCols: 50, // max item number of cols
  maxItemRows: 50, // max item number of rows
  minItemCols: 1, // min item number of columns
  minItemRows: 1, // min item number of rows
  minItemArea: 1, // min item area: cols * rows
  maxItemArea: 2500, // max item area: cols * rows
  addEmptyRowsCount: 0, // add a number of extra empty rows at the end
  rowHeightRatio: 1, // row height ratio from column width
  margin: 10, // margin between grid items
  outerMargin: true, // if margins will apply to the sides of the container
  outerMarginTop: null, // override outer margin for grid
  outerMarginRight: null, // override outer margin for grid
  outerMarginBottom: null, // override outer margin for grid
  outerMarginLeft: null, // override outer margin for grid
  useTransformPositioning: true, // toggle between transform or top/left positioning of items
  scrollSensitivity: 10, // margin of the dashboard where to start scrolling
  scrollSpeed: 20, // how much to scroll each mouse move when in the scrollSensitivity zone
  initCallback: undefined, // callback to call after grid has initialized. Arguments: gridsterComponent
  destroyCallback: undefined, // callback to call after grid has destroyed. Arguments: gridsterComponent
  gridSizeChangedCallback: undefined, // callback to call after grid has changed size. Arguments: gridsterComponent
  itemChangeCallback: undefined, // callback to call for each item when is changes x, y, rows, cols.
  // Arguments: gridsterItem, gridsterItemComponent
  itemResizeCallback: undefined, // callback to call for each item when width/height changes.
  // Arguments: gridsterItem, gridsterItemComponent
  itemInitCallback: undefined, // callback to call for each item when is initialized.
  // Arguments: gridsterItem, gridsterItemComponent
  itemRemovedCallback: undefined, // callback to call for each item when is initialized.
  // Arguments: gridsterItem, gridsterItemComponent
  itemValidateCallback: undefined, // callback to call to validate item position/size. Return true if valid.
  // Arguments: gridsterItem
  enableEmptyCellClick: false, // enable empty cell click events
  enableEmptyCellContextMenu: false, // enable empty cell context menu (right click) events
  enableEmptyCellDrop: false, // enable empty cell drop events
  enableEmptyCellDrag: false, // enable empty cell drag events
  enableOccupiedCellDrop: false, // enable occupied cell drop events
  emptyCellClickCallback: undefined, // empty cell click callback
  emptyCellContextMenuCallback: undefined, // empty cell context menu (right click) callback
  emptyCellDropCallback: undefined, // empty cell drag drop callback. HTML5 Drag & Drop
  emptyCellDragCallback: undefined, // empty cell drag and create item like excel cell selection
  emptyCellDragMaxCols: 50, // limit empty cell drag max cols
  emptyCellDragMaxRows: 50, // limit empty cell drag max rows
  // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
  ignoreMarginInRow: false, // ignore the gap between rows for items which span multiple rows (see #162, #224)
  draggable: {
    delayStart: 0, // milliseconds to delay the start of drag, useful for touch interaction
    enabled: false, // enable/disable draggable items
    ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
    ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
    dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
    stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
    start: undefined, // callback when dragging an item starts.
    // Arguments: item, gridsterItem, event
    dropOverItems: false, // enable drop items on top other item
    dropOverItemsCallback: undefined // callback on drop over another item
    // Arguments: source, target, gridComponent
  },
  resizable: {
    delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
    enabled: false, // enable/disable resizable items
    handles: {
      s: true,
      e: true,
      n: true,
      w: true,
      se: true,
      ne: true,
      sw: true,
      nw: true
    }, // resizable edges of an item
    stop: undefined, // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
    start: undefined // callback when resizing an item starts.
    // Arguments: item, gridsterItem, event
  },
  swap: true, // allow items to switch position if drop on top of another
  swapWhileDragging: false, // allow items to switch position while dragging
  pushItems: false, // push items when resizing and dragging
  disablePushOnDrag: false, // disable push on drag
  disablePushOnResize: false, // disable push on resize
  pushDirections: { north: true, east: true, south: true, west: true }, // control the directions items are pushed
  pushResizeItems: false, // on resize of item will shrink adjacent items
  displayGrid: DisplayGrid.OnDragAndResize, // display background grid of rows and columns
  disableWindowResize: false, // disable the window on resize listener. This will stop grid to recalculate on window resize.
  disableWarnings: false, // disable console log warnings about misplacement of grid items
  scrollToNewItems: false, // scroll to new items placed in a scrollable view
  disableScrollHorizontal: false, // disable horizontal scrolling
  disableScrollVertical: false, // disable vertical scrolling
  enableBoundaryControl: false, // enable boundary control while dragging items
  disableAutoPositionOnConflict: false, // disable auto-position of items on conflict state,
  dirType: DirTypes.LTR // page direction, rtl=right to left ltr= left to right, if you use rtl language set dirType to rtl
};
