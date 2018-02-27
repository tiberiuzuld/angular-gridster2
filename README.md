angular-gridster2
==============
[![npm version](https://badge.fury.io/js/angular-gridster2.svg)](https://badge.fury.io/js/angular-gridster2)
[![dependencies Status](https://david-dm.org/tiberiuzuld/angular-gridster2/status.svg)](https://david-dm.org/tiberiuzuld/angular-gridster2)
[![devDependencies Status](https://david-dm.org/tiberiuzuld/angular-gridster2/dev-status.svg)](https://david-dm.org/tiberiuzuld/angular-gridster2?type=dev)
[![downloads](https://img.shields.io/npm/dm/angular-gridster2.svg)](https://www.npmjs.com/package/angular-gridster2)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/tiberiuzuld)

### Angular implementation of angular-gridster [Demo](http://tiberiuzuld.github.io/angular-gridster2/angular)

### Requires Angular 6.x
### For other Angular versions check the other branches.

## Install

``npm install angular-gridster2 --save``

Should work out of the box with webpack, respectively angular-cli.

```javascript
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  imports: [ GridsterModule ],
  ...
})
```
## Browser support
  What Angular supports [here](https://github.com/angular/angular)
## How to use

```html
<gridster [options]="options">
  <gridster-item [item]="item" *ngFor="let item of dashboard">
    <!-- your content here -->
  </gridster-item>
</gridster>
```

Initialize a simple dashboard:
```typescript
   import { GridsterConfig, GridsterItem }  from 'angular-gridster2';
   options: GridsterConfig;
   dashboard: Array<GridsterItem>;

   static itemChange(item, itemComponent) {
     console.info('itemChanged', item, itemComponent);
   }
 
   static itemResize(item, itemComponent) {
     console.info('itemResized', item, itemComponent);
   }
 
   ngOnInit() {
     this.options = {
       itemChangeCallback: AppComponent.itemChange,
       itemResizeCallback: AppComponent.itemResize,
     };
 
     this.dashboard = [
       {cols: 2, rows: 1, y: 0, x: 0},
       {cols: 2, rows: 2, y: 0, x: 2}
     ];
   }
 
   changedOptions() {
     this.options.api.optionsChanged();
   }
 
   removeItem(item) {
     this.dashboard.splice(this.dashboard.indexOf(item), 1);
   }
 
   addItem() {
     this.dashboard.push({});
   }
```

##### Note: The gridster will take all the available space from the parent. It will not size depending on content. The parent of the component needs to have a size.

##### Default Grid Options:
```typescript
import { GridsterConfig } from 'angular-gridster2';

export const GridsterConfigService: GridsterConfig = {
  gridType: 'fit', // 'fit' will fit the items in the container without scroll;
  // 'scrollVertical' will fit on width and height of the items will be the same as the width
  // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
  // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
  // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
  // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
  fixedColWidth: 250, // fixed col width for gridType: 'fixed'
  fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
  keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
  keepFixedWidthInMobile: false, // keep the width from fixed gridType in mobile layout
  compactType: 'none', // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
  mobileBreakpoint: 640, // if the screen is not wider that this, remove the grid layout and stack the items
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
  margin: 10,  // margin between grid items
  outerMargin: true,  // if margins will apply to the sides of the container
  outerMarginTop: null, // override outer margin for grid
  outerMarginRight: null, // override outer margin for grid
  outerMarginBottom: null, // override outer margin for grid
  outerMarginLeft: null, // override outer margin for grid
  scrollSensitivity: 10,  // margin of the dashboard where to start scrolling
  scrollSpeed: 20,  // how much to scroll each mouse move when in the scrollSensitivity zone
  initCallback: undefined, // callback to call after grid has initialized. Arguments: gridsterComponent
  destroyCallback: undefined, // callback to call after grid has destroyed. Arguments: gridsterComponent
  itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols.
  // Arguments: gridsterItem, gridsterItemComponent
  itemResizeCallback: undefined,  // callback to call for each item when width/height changes.
  // Arguments: gridsterItem, gridsterItemComponent
  itemInitCallback: undefined,  // callback to call for each item when is initialized and has size > 0.
  // Arguments: gridsterItem, gridsterItemComponent
  itemRemovedCallback: undefined,  // callback to call for each item when is removed.
    // Arguments: gridsterItem, gridsterItemComponent
  enableEmptyCellClick: false, // enable empty cell click events
  enableEmptyCellContextMenu: false, // enable empty cell context menu (right click) events
  enableEmptyCellDrop: false, // enable empty cell drop events
  enableEmptyCellDrag: false, // enable empty cell drag events
  emptyCellClickCallback: undefined, // empty cell click callback
  emptyCellContextMenuCallback: undefined, // empty cell context menu (right click) callback
  emptyCellDropCallback: undefined, // empty cell drag drop callback. HTML5 Drag & Drop
  emptyCellDragCallback: undefined, // empty cell drag and create item like excel cell selection
  // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
  emptyCellDragMaxCols: 50, // limit empty cell drag max cols
  emptyCellDragMaxRows: 50, // limit empty cell drag max rows
  // only for gridType: `fixed` , `verticalFixed`, `horizontalFixed`
  draggable: {
    delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
    enabled: false, // enable/disable draggable items
    ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
    ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
    dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
    stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
    start: undefined // callback when dragging an item starts.
    // Arguments: item, gridsterItem, event
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
  pushItems: false, // push items when resizing and dragging
  disablePushOnDrag: false, // disable push on drag
  disablePushOnResize: false, // disable push on resize
  pushDirections: {north: true, east: true, south: true, west: true}, // control the directions items are pushed
  pushResizeItems: false, // on resize of item will shrink adjacent items
  displayGrid: 'onDrag&Resize', // display background grid of rows and columns. Options: 'always' | 'onDrag&Resize' | 'none'
  disableWindowResize: false, // disable the window on resize listener. This will stop grid to recalculate on window resize.
  disableWarnings: false, // disable console log warnings about misplacement of grid items
  scrollToNewItems: false // scroll to new items placed in a scrollable view
};
```

##### Gridster options api
```typescript
    this.options.api.resize(); // call if size of container changes. Grid will auto resize on window resize.
    this.options.api.optionsChanged(); // call on change of options after initialization
    this.options.api.getNextPossiblePosition(item: GridsterItem); // call to get a viable position for item. Returns true if found
    this.options.api.getFirstPossiblePosition(item: GridsterItem); // call to get the first viable position for an item. Returns a copy of the item with the future position
    this.options.api.getLastPossiblePosition(item: GridsterItem); // call to get a viable position for item. Returns a copy of the item with the future position

// if you want to push items from code use the GridsterPush service
import {GridsterItemComponent, GridsterPush, GridsterPushResize, GridsterSwap} from 'gridster'

myMethod(gridsterItemComponent: GridsterItemComponent) {
    const push = new GridsterPush(gridsterItemComponent); // init the service
    gridsterItemComponent.$item.rows += 1; // move/resize your item
    if (push.pushItems(push.fromNorth)) { // push items from a direction
      push.checkPushBack(); // check for items can restore to original position
      push.setPushedItems(); // save the items pushed
      gridsterItemComponent.setSize(true);
      gridsterItemComponent.checkItemChanges(gridsterItemComponent.$item, gridsterItemComponent.item);
    } else {
      gridsterItemComponent.$item.rows -= 1;
      push.restoreItems(); // restore to initial state the pushed items
    }
    push.destroy(); // destroy push instance
  // similar for GridsterPushResize and GridsterSwap
}
```

##### Gridster item options:
```typescript
export interface GridsterItem {
  x?: number; // x position if missing will auto position
  y?: number; // y position if missing will auto position
  rows?: number; // number of rows if missing will use grid option defaultItemRows
  cols?: number; // number of columns if missing will use grid option defaultItemCols
  initCallback?: Function; // initialization callback and has size > 0. Argument: GridsterItem, GridsterItemComponent
  dragEnabled?: boolean; // override grid option draggable.enabled
  resizeEnabled?: boolean; // override grid option resizable.enabled
  compactEnabled?: boolean; // disable compact
  maxItemRows?: number; // override grid option maxItemRows
  minItemRows?: number; // override grid option minItemRows
  maxItemCols?: number; // override grid option maxItemCols
  minItemCols?: number; // override grid option minItemCols
  minItemArea?: number; //  override grid option minItemArea
  maxItemArea?: number; //  override grid option maxItemArea
}
```

### Load dynamic components inside the `gridster-item`

You can load dynamic components in Angular4+ with the help of [`ng-dynamic-component` library](https://www.npmjs.com/package/ng-dynamic-component) 

### Having iFrame in widgets content
iFrames can interfere with drag/resize of widgets. For a workaround please read [this issue #233](https://github.com/tiberiuzuld/angular-gridster2/issues/233)

### Interact with content without dragging

Option 1 (without text selection):
```html
<gridster-item>
   <div (mousedown)="$event.stopPropagation()" (touchstart)="$event.stopPropagation()">
     Some content to click without dragging the widget
   </div>
   <div class="item-buttons">
     <button md-icon-button md-raised-button class="drag-handler">
         <md-icon>open_with</md-icon>
     </button>
     <button md-icon-button md-raised-button class="remove-button" (click)="removeItem($event, item)"
             (touchstart)="removeItem($event, item)" mdTooltip="Remove">
       <md-icon>clear</md-icon>
     </button>
   </div>
</gridster-item>
```

Option 2 (with text selection):
```html
<gridster-item>
  <div class="gridster-item-content">
      Some content to select and click without dragging the widget
  </div>
  <div class="item-buttons">
    <button md-icon-button md-raised-button class="drag-handler">
      <md-icon>open_with</md-icon>
    </button>
    <button md-icon-button md-raised-button class="remove-button" (click)="removeItem($event, item)"
            (touchstart)="removeItem($event, item)" mdTooltip="Remove">
      <md-icon>clear</md-icon>
    </button>
  </div>
</gridster-item>
```

##### angular-gridster2 inspired by [angular-gridster](https://github.com/ManifestWebDesign/angular-gridster) 
### License
 The MIT License
 
 Copyright (c) 2018 Tiberiu Zuld
