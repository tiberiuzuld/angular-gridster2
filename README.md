
angular-gridster2
==============
### Angular2 implementation of angular-gridster [Demo](http://tiberiuzuld.github.io/angular-gridster2/angular)

### Angularjs 1.x library is [here](https://github.com/tiberiuzuld/angular-gridster2/tree/1.x)

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

Default Options:
```typescript
import {GridsterConfig} from './gridsterConfig.interface';
const GridsterConfigService: GridsterConfig = {
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
  itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem
  itemResizeCallback: undefined,  // callback to call for each item when width/height changes. Arguments:gridsterItem
  draggable: {
    enabled: false, // enable/disable draggable items
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
  swap: true // allow items to switch position if drop on top of another
};
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

##### angular-gridster2 inspired by [angular-gridster](https://github.com/ManifestWebDesign/angular-gridster) 
### License
 The MIT License
 
 Copyright (c) 2017 Tiberiu Zuld
