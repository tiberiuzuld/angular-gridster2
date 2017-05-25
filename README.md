angular-gridster2
==============
[![npm version](https://badge.fury.io/js/angular-gridster2.svg)](https://badge.fury.io/js/angular-gridster2)
[![dependencies Status](https://david-dm.org/tiberiuzuld/angular-gridster2/status.svg)](https://david-dm.org/tiberiuzuld/angular-gridster2)
[![devDependencies Status](https://david-dm.org/tiberiuzuld/angular-gridster2/dev-status.svg)](https://david-dm.org/tiberiuzuld/angular-gridster2?type=dev)
[![downloads](https://img.shields.io/npm/dm/angular-gridster2.svg)](https://www.npmjs.com/package/angular-gridster2)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=AARLN6N6WY85E&lc=RO&item_name=Angular%2dgridster2&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted)

### Angular implementation of angular-gridster [Demo](http://tiberiuzuld.github.io/angular-gridster2/angular)

### Angular 4.x library is [master branch](https://github.com/tiberiuzuld/angular-gridster2/tree/master) 
### Angular 2.x library is [2.4.x branch](https://github.com/tiberiuzuld/angular-gridster2/tree/2.4.x)  
### AngularJS 1.x library is [1.x branch](https://github.com/tiberiuzuld/angular-gridster2/tree/1.x)

## Install

``npm install angular-gridster2 --save``

Should work out of the box with webpack, respectively angular-cli.

```javascript
import {GridsterModule} from 'angular-gridster2';

@NgModule({
  imports: [GridsterModule],
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

Initialize the demo dashboard
```typescript
   options: GridsterConfig;
   dashboard: Array<Object>;
 
   static eventStop(item, scope) {
     console.info('eventStop', item, scope);
   }
 
   static itemChange(item, scope) {
     console.info('itemChanged', item, scope);
   }
 
   static itemResize(item, scope) {
     console.info('itemResized', item, scope);
   }
 
   static itemInit(item) {
     console.info('itemInitialized', item);
   }
 
   ngOnInit() {
     this.options = {
       gridType: 'fit',
       compactUp: false,
       compactLeft: false,
       itemChangeCallback: AppComponent.itemChange,
       itemResizeCallback: AppComponent.itemResize,
       margin: 10,
       outerMargin: true,
       maxItemCols: 50,
       minItemCols: 1,
       maxItemRows: 50,
       minItemRows: 1,
       defaultItemCols: 1,
       defaultItemRows: 1,
       fixedColWidth: 250,
       fixedRowHeight: 250,
       draggable: {
         enabled: true,
         stop: AppComponent.eventStop
       },
       resizable: {
         enabled: true,
         stop: AppComponent.eventStop
       },
       swap: false
     };
 
     this.dashboard = [
       {cols: 2, rows: 1, y: 0, x: 0},
       {cols: 2, rows: 2, y: 0, x: 2},
       {cols: 1, rows: 1, y: 0, x: 4},
       {cols: 1, rows: 1, y: 0, x: 5},
       {cols: undefined, rows: undefined, y: 1, x: 0},
       {cols: 1, rows: 1, y: undefined, x: undefined},
       {cols: 2, rows: 2, y: 1, x: 5, minItemRows: 2, minItemCols: 2, label: 'Min rows & cols = 2'},
       {cols: 2, rows: 2, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2, label: 'Max rows & cols = 2'},
       {cols: 2, rows: 1, y: 2, x: 2, dragEnabled: true, resizeEnabled: true, label: 'Drag&Resize Enabled'},
       {cols: 1, rows: 1, y: 2, x: 4, dragEnabled: false, resizeEnabled: false, label: 'Drag&Resize Disabled'},
       {cols: 1, rows: 1, y: 0, x: 6, initCallback: AppComponent.itemInit}
     ];
   }
 
   changedOptions() {
     this.options.optionsChanged();
   }
 
   removeItem(item) {
     this.dashboard.splice(this.dashboard.indexOf(item), 1);
   };
 
   addItem() {
     this.dashboard.push({});
   };
```

##### Default Grid Options:
```typescript
import {GridsterConfig} from './gridsterConfig.interface';

export const GridsterConfigService: GridsterConfig = {
  gridType: 'fit', // 'fit' will fit the items in the container without scroll;
  // 'scrollVertical' will fit on width and height of the items will be the same as the width
  // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
  // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
  fixedColWidth: 250, // fixed col width for gridType: 'fixed'
  fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
  compactUp: false, // compact items up if there is room
  compactLeft: false, // compact items left if there is room
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
  margin: 10,  // margin between grid items
  outerMargin: true,  // if margins will apply to the sides of the container
  scrollSensitivity: 10,  // margin of the dashboard where to start scrolling
  scrollSpeed: 20,  // how much to scroll each mouse move when in the scrollSensitivity zone
  itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols. Arguments: gridsterItem
  itemResizeCallback: undefined,  // callback to call for each item when width/height changes. Arguments: gridsterItem
  draggable: {
    enabled: false, // enable/disable draggable items
    ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
    stop: undefined // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
    // Arguments: item, gridsterItem, event
  },
  resizable: {
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
    stop: undefined // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
    // Arguments: item, gridsterItem, event
  },
  swap: true, // allow items to switch position if drop on top of another
  pushItems: false, // push items when resizing and dragging
  displayGrid: 'onDrag&Resize' // display background grid of rows and columns
};
```

##### Gridster item options:
```typescript
export interface GridsterItem {
  x?: number; // x position if missing will auto position
  y?: number; // y position if missing will auto position
  rows?: number; // number of rows if missing will use grid option defaultItemRows
  cols?: number; // number of columns if missing will use grid option defaultItemCols
  initCallback?: Function; // initialization callback
  dragEnabled?: boolean; // override grid option draggable.enabled
  resizeEnabled?: boolean; // override grid option resizable.enabled
  maxItemRows?: number; // override grid option maxItemRows
  minItemRows?: number; // override grid option minItemRows
  maxItemCols?: number; // override grid option maxItemCols
  minItemCols?: number; // override grid option minItemCols
}
```

### Events 

##### Gridster Item
```typescript
  @Output() itemChange: EventEmitter<GridsterItem> = new EventEmitter();
  @Output() itemResize: EventEmitter<GridsterItem> = new EventEmitter();
  ....
  this.itemChange.emit(this.state.item); // triggered when a item cols,rows, x ,y changed
  this.itemResize.emit(this.state.item); // triggered when a item width/height changed
```
Note: When a item changes cols/rows both events get triggered


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
 
 Copyright (c) 2017 Tiberiu Zuld
