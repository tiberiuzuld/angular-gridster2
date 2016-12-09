angular-gridster2
==============
 
 
## Description
 
angular-gridster2 inspired by [angular-gridster](https://github.com/ManifestWebDesign/angular-gridster) 
 
#### [Demo](http://tiberiuzuld.github.io/angular-gridster2)
 
#### Install with Bower
```bash
  bower install angular-gridster2 --save
```
#### Install with npm
```bash
  npm install angular-gridster2 --save
```

Then import the following in your HTML:

```html
  <link rel="stylesheet" href="bower_components/angular-gridster2/dist/gridster.css"/>
  <script src="bower_components/lodash/lodash.js"></script>
  <script src="bower_components/javascript-detect-element-resize/detect-element-resize.js"></script>
  <script src="bower_components/angular-gridster2/dist/gridster.js"></script>
```

Include 'angular-gridster2' as a dependency of your module like this:
```JavaScript
  var module = angular.module("app", ["angular-gridster2"]);
```

## Usage

Default usage:

```html
<div gridster="vm.options">
  <div gridster-item="item" ng-repeat="item in vm.dashboard"></div>
</div>
```
Expects a scope setup(options object is optional):
```JavaScript
var vm = this;

vm.options = {
   gridType: 'fit',
   itemChangeCallback: itemChange,
   margin: 10,
   outerMargin: true,
   draggable: {
     enabled: true,
     stop: eventStop
   },
   resizable: {
     enabled: true,
     stop: eventStop
   }
 };

vm.dashboard = [
  {cols: 2, rows: 1, y: 0, x: 0},
  {cols: 2, rows: 2, y: 0, x: 2},
  {cols: 1, rows: 1, y: 0, x: 4},
  {cols: 1, rows: 1, y: 0, x: 5},
  {cols: 2, rows: 1, y: 1, x: 0},
  {cols: 1, rows: 1, y: 1, x: 4},
  {cols: 1, rows: 2, y: 1, x: 5},
  {cols: 1, rows: 3, y: 2, x: 0},
  {cols: 2, rows: 1, y: 2, x: 1},
  {cols: 1, rows: 1, y: 2, x: 3},
  {cols: 1, rows: 1, y: 3, x: 4, initCallback: function(item){}}
];
```

Optional option ```initCallback``` for items after initialization.   
All item options are optional. If any property is missing gridster will use the default options for rows, cols and   
for x,y will auto position item where it fits

## Configuration

#### Via Scope
Simply pass your desired options to the gridster directive

```JavaScript
$scope.options = {
   gridType: 'fit', // 'fit' will fit the items in the container without scroll;
   // 'scrollVertical' will fit on width and height of the items will be the same as the width
   // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
   mobileBreakpoint: 640, // if the screen is not wider than this, remove the grid layout and stack the items
   minCols: 1,// minimum amount of columns in the grid
   maxCols: 100,// maximum amount of columns in the grid
   minRows: 1,// minimum amount of rows in the grid
   maxRows: 100,// maximum amount of rows in the grid
   defaultItemCols: 1, // default width of an item in columns
   defaultItemRows: 1, // default height of an item in rows
   minItemCols: 1, // min item number of columns
   minItemRows: 1, // min item number of rows
   margin: 10, //margin between grid items
   outerMargin: true, //if margins will apply to the sides of the container
   scrollSensitivity: 10, //margin of the dashboard where to start scrolling
   scrollSpeed: 10, //how much to scroll each mouse move when in the scrollSensitivity zone
   itemChangeCallback: undefined, //callback to call for each item when is changes x, y, rows, cols. Arguments:gridsterItem, scope
   draggable: {
     enabled: false, // enable/disable draggable items
     stop: undefined // callback when dragging an item stops. Arguments: gridsterItem, scope
   },
   resizable: {
     enabled: false, // enable/disable resizable items
     handles: ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'], // resizable edges of an item
     stop: undefined // callback when resizing an item stops. Arguments: gridsterItem, scope
   },
   swap: true
 };
```

#### Via Constant
You can also override the default configuration by modifying the ```gridsterConfig``` constant

```js
angular.module('app').run(['gridsterConfig', function(gridsterConfig) {
	 gridsterConfig.gridType = 'fit';
}]);
```

### Gridster Item Events

broadcasts ```'gridster-item-change'``` if item changes x ,y , cols, rows  
broadcasts ```'gridster-item-resize'``` if item changes pixels height or width

### Contributing

#### Install dependencies
```bash
 npm install
 bower install
```

Please respect the formatting in .editorconfig and .eslintrc

#### Gulp task
```bash
 gulp serve
```

### License
 The MIT License
 
 Copyright (c) 2016 Tiberiu Zuld
