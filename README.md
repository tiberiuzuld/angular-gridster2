
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
  
    ngOnInit() {
      this.options = {
        gridType: 'fit',
        compactUp: true,
        compactLeft: true,
        itemChangeCallback: this.itemChange.bind(this),
        margin: 10,
        outerMargin: true,
        draggable: {
          enabled: true,
          stop: this.eventStop.bind(this)
        },
        resizable: {
          enabled: true,
          stop: this.eventStop.bind(this)
        },
        swap: true
      };
  
      this.dashboard = [
        {cols: 2, rows: 1, y: 0, x: 0},
        {cols: 2, rows: 2, y: 0, x: 2},
        {cols: 1, rows: 1, y: 0, x: 4},
        {cols: 1, rows: 1, y: 0, x: 5},
        {cols: undefined, rows: undefined, y: 1, x: 0}, // items without cols & rows will receive the defaults from grid options
        {cols: 1, rows: 1, y: undefined, x: undefined}, // items without position will be auto-positioned if possible
        {cols: 2, rows: 2, y: 1, x: 5, minItemRows: 2, minItemCols: 2}, // set min rows & cols a item can be resize overrides grid option
        {cols: 2, rows: 2, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2}, // set max rows & cols a item can be resize overrides grid option
        {cols: 2, rows: 1, y: 2, x: 2, dragEnabled: true, resizeEnabled: true}, // override the grid option
        {cols: 1, rows: 1, y: 2, x: 4, dragEnabled: false, resizeEnabled: false}, // so you can/not always drag or resize
        {cols: 1, rows: 1, y: 3, x: 4, initCallback: this.itemInit.bind(this)} // callback to be called when item is initialized
      ];
    }
    // if you make changes to the options after initialization let the gridster know
    changedOptions() {
      this.options.optionsChanged();
    }
    
    eventStop(item, scope) {
      console.info('eventStop', item, scope);
    }
  
    itemChange(item, scope) {
      console.info('itemChanged', item, scope);
    }
  
    itemInit(item) {
      console.info('itemInitialized', item);
    }
```

Default Options:
```typescript
import {GridsterConfig} from './gridsterConfig.interface';
const GridsterConfigService: GridsterConfig = {
  gridType: 'fit', // 'fit' will fit the items in the container without scroll;
  // 'scrollVertical' will fit on width and height of the items will be the same as the width
  // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
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
  itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem, scope
  draggable: {
    enabled: false, // enable/disable draggable items
    stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
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
    stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
  },
  swap: true // allow items to switch position if drop on top of another
};
```


##### angular-gridster2 inspired by [angular-gridster](https://github.com/ManifestWebDesign/angular-gridster) 
### License
 The MIT License
 
 Copyright (c) 2017 Tiberiu Zuld
